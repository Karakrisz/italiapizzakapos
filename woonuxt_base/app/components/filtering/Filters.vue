<script setup lang="ts">
import { TaxonomyEnum } from '#woo';
import { ref, onMounted } from 'vue';

// Update interfaces to match GraphQL response structure
interface GraphQLTerm {
  taxonomyName?: string | null;
  name?: string | null;
  slug?: string | null;
  count?: number | null;
}

interface Term {
  taxonomyName: string;
  name: string;
  slug: string;
  count: number;
}

interface WooNuxtFilter {
  slug: string;
  name: string;
  terms?: Term[];
}

const { isFiltersActive } = useFiltering();
const { removeBodyClass } = useHelpers();
const runtimeConfig = useRuntimeConfig();
const { storeSettings } = useAppConfig();

const { hideCategories } = defineProps({ hideCategories: { type: Boolean, default: false } });

const globalProductAttributes = (runtimeConfig?.public?.GLOBAL_PRODUCT_ATTRIBUTES as WooNuxtFilter[]) || [];
const taxonomies = globalProductAttributes.map((attr) => attr?.slug?.toUpperCase().replace('_', '')) as TaxonomyEnum[];

// Create reactive references with proper typing
const terms = ref<Term[]>([]);
const productCategoryTerms = ref<Term[]>([]);
const attributesWithTerms = ref<WooNuxtFilter[]>([]);
const isLoading = ref(true);

// Helper function to transform GraphQL term to our Term type
const transformTerm = (graphqlTerm: GraphQLTerm): Term => ({
  taxonomyName: graphqlTerm.taxonomyName || '',
  name: graphqlTerm.name || '',
  slug: graphqlTerm.slug || '',
  count: graphqlTerm.count || 0
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const { data } = await useAsyncGql('getAllTerms', { 
      taxonomies: [...taxonomies, TaxonomyEnum.PRODUCTCATEGORY] 
    });
    
    // Transform the GraphQL response to our Term type
    const graphqlTerms = data.value?.terms?.nodes as GraphQLTerm[] || [];
    terms.value = graphqlTerms.map(transformTerm);
    
    productCategoryTerms.value = terms.value.filter(
      (term) => term.taxonomyName === 'product_cat'
    );
    
    attributesWithTerms.value = globalProductAttributes.map((attr) => ({
      ...attr,
      terms: terms.value.filter((term) => term.taxonomyName === attr.slug)
    }));
  } catch (error) {
    console.error('Error fetching terms:', error);
  } finally {
    isLoading.value = false;
  }
});

const placeholderCount = 4;
const placeholderItems = Array(placeholderCount).fill(null);
</script>

<template>
  <aside id="filters">
    <OrderByDropdown class="block w-full md:hidden" />
    <div class="relative z-30 grid mb-12 space-y-8 divide-y">
      <PriceFilter />
      
      <!-- Loading State -->
      <template v-if="isLoading">
        <div 
          v-for="(_, index) in placeholderItems" 
          :key="index"
          class="py-6 animate-pulse"
        >
          <div class="flex items-center mb-4">
            <div class="w-24 h-5 bg-gray-200 rounded"></div>
          </div>
          <div class="space-y-3">
            <div 
              v-for="i in 3" 
              :key="i"
              class="flex items-center gap-2"
            >
              <div class="w-4 h-4 bg-gray-200 rounded"></div>
              <div class="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Actual Content -->
      <template v-else>
        <CategoryFilter 
          v-if="!hideCategories" 
          :terms="productCategoryTerms" 
        />
        <div 
          v-for="attribute in attributesWithTerms" 
          :key="attribute.slug"
        >
          <ColorFilter 
            v-if="attribute.slug == 'pa_color' || attribute.slug == 'pa_colour'" 
            :attribute="attribute" 
          />
          <GlobalFilter 
            v-else 
            :attribute="attribute" 
          />
        </div>
        <OnSaleFilter />
        <LazyStarRatingFilter v-if="storeSettings.showReviews" />
        <LazyResetFiltersButton v-if="isFiltersActive" />
      </template>
    </div>
  </aside>
  <div 
    class="fixed inset-0 z-50 hidden bg-black opacity-25 filter-overlay" 
    @click="removeBodyClass('show-filters')"
  ></div>
</template>

<style lang="postcss">
.show-filters .filter-overlay {
  @apply block;
}
.show-filters {
  overflow: hidden;
}

#filters {
  @apply w-[280px];

  & .slider-connect {
    @apply bg-Primary;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  input[type='checkbox'],
  input[type='radio'] {
    @apply bg-white border rounded-lg cursor-pointer font-sans outline-none border-stone-300 w-full p-3 transition-all duration-150 appearance-none hover:border-Primary;

    width: 1em;
    height: 1em;
    position: relative;
    cursor: pointer;
    border-radius: 4px;
    padding: 0;
  }

  input[type='radio'] {
    border-radius: 50%;
  }

  input[type='checkbox']:after,
  input[type='radio']:after {
    content: '';
    display: block;
    opacity: 0;
    transition: all 250ms cubic-bezier(0.65, -0.43, 0.4, 1.71);
  }

  input[type='checkbox']:after {
    width: 5px;
    height: 9px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(0deg) translate(-1px, 1px) scale(0.75);
    position: absolute;
    top: 3px;
    left: 6.5px;
  }

  input[type='radio']:after {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    transform: scale(0);
    position: absolute;
    background: #fff;
    top: 4px;
    left: 4px;
  }

  input[type='checkbox']:checked:after,
  input[type='checkbox'] + label,
  input[type='radio'] + label {
    @apply cursor-pointer text-stone-600 hover:text-Primary;
  }

  input[type='checkbox']:checked + label,
  input[type='radio']:checked + label {
    @apply text-stone-800 hover:text-Dark;
  }

  input[type='checkbox']:checked,
  input[type='radio']:checked {
    @apply bg-Primary border-0;
  }

  input[type='checkbox']:checked:after {
    opacity: 1;
    transform: rotate(45deg) translate(-1px, 1px) scale(1);
  }

  input[type='radio']:checked:after {
    opacity: 1;
    transform: scale(1);
  }
}

.price-input {
  @apply border rounded-xl outline-none leading-tight w-full p-2 transition-all;

  &.active {
    @apply border-stone-400 pl-6;
  }
}

@media (max-width: 768px) {
  #filters {
    @apply bg-white h-full p-8 transform pl-2 transition-all ease-in-out bottom-0 left-4 -translate-x-[110vw] duration-300 overflow-auto fixed;

    box-shadow:
      -100px 0 0 white,
      -200px 0 0 white,
      -300px 0 0 white;
    z-index: 60;
  }

  .show-filters #filters {
    @apply transform-none;
  }
}
</style>