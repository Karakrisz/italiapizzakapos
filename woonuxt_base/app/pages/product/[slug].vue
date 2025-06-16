<script lang="ts" setup>
import { StockStatusEnum, ProductTypesEnum, type AddToCartInput } from '#woo';

const route = useRoute();
const { storeSettings } = useAppConfig();
const { arraysEqual, formatArray, checkForVariationTypeOfAny } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();
const { t } = useI18n();
const slug = route.params.slug as string;

const { data } = await useAsyncGql('getProduct', { slug });
if (!data.value?.product) {
  throw showError({ statusCode: 404, statusMessage: t('messages.shop.productNotFound') });
}

const product = ref<Product>(data?.value?.product);
const quantity = ref<number>(1);
const activeVariation = ref<Variation | null>(null);
const variation = ref<VariationAttribute[]>([]);
const indexOfTypeAny = computed<number[]>(() => checkForVariationTypeOfAny(product.value));
const attrValues = ref();
const isSimpleProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.SIMPLE);
const isVariableProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.VARIABLE);
const isExternalProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.EXTERNAL);
const additionalPrice = ref(0);
const wapfValues = ref<Record<string, any>>({});

const type = computed(() => activeVariation.value || product.value);
const totalCustomPrice = computed(() => {
  const basePrice = type.value?.salePrice ?
    parseFloat(type.value.salePrice) :
    parseFloat(type.value.regularPrice || '0');
  return basePrice + additionalPrice.value;
});

const selectProductInput = computed<any>(() => {
  // Get the WAPF config to access labels
  const wapfConfig = JSON.parse(product.value?.metaData?.[1]?.value || '{}');

  // Create a map of field labels and choices
  const fieldData = wapfConfig.fields?.reduce((acc: any, field: any) => {
    acc[field.id] = {
      label: field.label,
      choices: field.options.choices.reduce((choiceAcc: any, choice: any) => {
        choiceAcc[choice.slug] = {
          label: choice.label,
          pricing_type: choice.pricing_type,
          pricing_amount: choice.pricing_amount
        };
        return choiceAcc;
      }, {})
    };
    return acc;
  }, {});

  return {
    productId: type.value?.databaseId,
    quantity: quantity.value,
    extraData: JSON.stringify({
      wapf_field_groups: [{
        id: product.value?.metaData?.[1]?.key,
        fields: wapfValues.value,
        field_data: fieldData // Include the field data
      }],
      additional_price: additionalPrice.value,
      total_custom_price: totalCustomPrice.value
    })
  };
}) as ComputedRef<AddToCartInput>;

const mergeLiveStockStatus = (payload: Product): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value?.stockStatus;

  payload.variations?.nodes?.forEach((variation: Variation, index: number) => {
    if (product.value?.variations?.nodes[index]) {
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};

onMounted(async () => {
  try {
    const { product } = await GqlGetStockStatus({ slug });
    if (product) mergeLiveStockStatus(product as Product);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0].message;
    if (errorMessage) console.error(errorMessage);
  }
});

const updateSelectedVariations = (variations: VariationAttribute[]): void => {
  if (!product.value.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  const clonedVariations = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.value.variations?.nodes.filter((variation: any) => {
    // If there is any variation of type ANY set the value to ''
    if (variation.attributes) {
      // Set the value of the variation of type ANY to ''
      indexOfTypeAny.value.forEach((index) => (clonedVariations[index].value = ''));

      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(clonedVariations));
    }
  });

  if (getActiveVariation[0]) activeVariation.value = getActiveVariation[0];
  selectProductInput.value.variationId = activeVariation.value?.databaseId ?? null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};

const handleWAPFFieldChange = (values: Record<string, any>) => {
  wapfValues.value = values;
};

const handleWAPFPriceChange = (price: number) => {
  additionalPrice.value = price;
};

const stockStatus = computed(() => {
  if (isVariableProduct.value) return activeVariation.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  return type.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});

const disabledAddToCart = computed(() => {
  if (isSimpleProduct.value) return !type.value || stockStatus.value === StockStatusEnum.OUT_OF_STOCK || isUpdatingCart.value;
  return !type.value || stockStatus.value === StockStatusEnum.OUT_OF_STOCK || !activeVariation.value || isUpdatingCart.value;
});
</script>

<template>
  <main class="container relative py-6 xl:max-w-7xl">
    <div v-if="product">
      <SEOHead :info="product" />
      <Breadcrumb v-if="storeSettings.showBreadcrumbOnSingleProduct" :product class="mb-6" />

      <div class="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-24">
        <!-- Product Image Gallery -->
        <ProductImageGallery v-if="product.image" class="relative flex-1" :main-image="product.image"
          :gallery="product.galleryImages!" :node="type" :active-variation="activeVariation || {}" />
        <NuxtImg v-else class="relative flex-1 skeleton" src="/images/placeholder.jpg"
          :alt="product?.name || 'Product'" />

        <!-- Product Details -->
        <div class="lg:max-w-md xl:max-w-lg md:py-2 w-full">
          <!-- Product Header -->
          <div class="flex justify-between mb-4">
            <div class="flex-1">
              <h1 class="flex flex-wrap items-center gap-2 mb-2 text-2xl font-semibold">
                {{ type.name }}
                <LazyWPAdminLink :link="`/wp-admin/post.php?post=${product.databaseId}&action=edit`">
                  Edit
                </LazyWPAdminLink>
              </h1>
              <StarRating v-if="storeSettings.showReviews" :rating="product.averageRating || 0"
                :count="product.reviewCount || 0" />
            </div>
            <ProductPrice class="text-xl" :regular-price="totalCustomPrice.toString() + ' Ft'"
              :sale-price="type.salePrice" />
          </div>

          <!-- Product Meta -->
          <div class="grid gap-2 my-8 text-sm empty:hidden">
            <div v-if="!isExternalProduct" class="flex items-center gap-2">
              <span class="text-stone-400">{{ $t('messages.shop.availability') }}: </span>
              <StockStatus :stock-status="stockStatus" @updated="mergeLiveStockStatus" />
            </div>
            <div v-if="storeSettings.showSKU && product.sku" class="flex items-center gap-2">
              <span class="text-stone-400">{{ $t('messages.shop.sku') }}: </span>
              <span>{{ product.sku || 'N/A' }}</span>
            </div>
          </div>

          <!-- Product Description -->
          <div class="mb-8 font-light prose" v-html="product.shortDescription || product.description" />

          <!-- Add to Cart Form -->
          <form @submit.prevent="addToCart(selectProductInput)">
            <!-- WAPF Fields -->
            <WAPFFields v-if="product?.metaData?.[1]?.value" :metadata="product.metaData[1].value" class="mb-8"
              @field-change="handleWAPFFieldChange" @price-change="handleWAPFPriceChange" />

            <!-- Product Variations -->
            <AttributeSelections v-if="isVariableProduct && product.attributes && product.variations" class="mt-4 mb-8"
              :attributes="product.attributes.nodes" :default-attributes="product.defaultAttributes"
              :variations="product.variations.nodes" @attrs-changed="updateSelectedVariations" />

            <ProductPrice class="text-xl" :regular-price="totalCustomPrice.toString() + ' Ft'"
              :sale-price="type.salePrice" />

            <!-- Add to Cart Section -->
            <div v-if="isVariableProduct || isSimpleProduct"
              class="fixed bottom-0 left-0 z-10 flex items-center w-full gap-4 p-4 mt-12 bg-white md:static md:bg-transparent bg-opacity-90 md:p-0">
              <input v-model="quantity" type="number" min="1" aria-label="Quantity"
                class="bg-white border rounded-lg flex text-left p-2.5 w-20 gap-4 items-center justify-center focus:outline-none d-none">
              <AddToCartButton class="flex-1 w-full md:max-w-xs" :disabled="disabledAddToCart"
                :class="{ loading: isUpdatingCart }" />
            </div>

            <!-- External Product Link -->
            <a v-if="isExternalProduct && product.externalUrl" :href="product.externalUrl" target="_blank"
              class="rounded-lg flex font-bold bg-stone-800 text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none">
              {{ product?.buttonText || 'View product' }}
            </a>
          </form>

          <hr class="my-8">

          <!-- Product Categories -->
          <div v-if="storeSettings.showProductCategoriesOnSingleProduct && product.productCategories">
            <div class="grid gap-2 my-8 text-sm">
              <div class="flex items-center gap-2">
                <span class="text-stone-400">{{ $t('messages.shop.category', 2) }}:</span>
                <div class="product-categories">
                  <NuxtLink v-for="category in product.productCategories.nodes" :key="category.slug"
                    :to="`/product-category/${decodeURIComponent(category.slug)}`" class="hover:text-Primary"
                    :title="category.name">
                    {{ category.name }}<span class="comma">, </span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Actions -->
          <div class="flex flex-wrap gap-4">
            <WishlistButton :product="product" />
            <ShareButton :product="product" />
          </div>
        </div>
      </div>

      <!-- Product Tabs -->
      <div v-if="product.description || product.reviews" class="my-32">
        <ProductTabs :product="product" />
      </div>

      <!-- Related Products -->
      <div v-if="product.related && storeSettings.showRelatedProducts" class="my-32">
        <div class="mb-4 text-xl font-semibold">
          {{ $t('messages.shop.youMayLike') }}
        </div>
        <ProductRow :products="product.related.nodes" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.product-categories>a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}

.prose {
  max-width: none;
}
</style>

<style scoped>
.product-categories>a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}
</style>
