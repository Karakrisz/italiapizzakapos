<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, CreateSourceData, StripeCardElement } from '@stripe/stripe-js';

const { t } = useI18n();
const { query } = useRoute();
const { cart, isUpdatingCart, paymentGateways } = useCart();
const { customer, viewer } = useAuth();
const { orderInput, isProcessingOrder, proccessCheckout } = useCheckout();
const runtimeConfig = useRuntimeConfig();
const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY || null;

const buttonText = ref<string>(isProcessingOrder.value ? t('messages.general.processing') : t('messages.shop.checkoutButton'));
const isCheckoutDisabled = computed<boolean>(() => isProcessingOrder.value || isUpdatingCart.value || !orderInput.value.paymentMethod);

const isInvalidEmail = ref<boolean>(false);
const stripe: Stripe | null = stripeKey ? await loadStripe(stripeKey) : null;
const elements = ref();
const isPaid = ref<boolean>(false);

onBeforeMount(async () => {
  if (query.cancel_order) window.close();
});

const payNow = async () => {
  // Eltároljuk az eredeti email címet
  const originalEmail = customer.value?.billing?.email || '';
  
  // Egyedi email cím generálása vendég rendelésekhez, ha nincs bejelölve a "Felhasználó létrehozása"
  if (!orderInput.value.createAccount && originalEmail) {
    // Egyedi időbélyeg hozzáadása az email címhez
    const timestamp = new Date().getTime();
    
    // Az email formátumot megőrizzük: felhasználónév+timestamp@domain.com
    const [username, domain] = originalEmail.split('@');
    const uniqueEmail = `${username}+guest${timestamp}@${domain}`;
    
    // Elmentjük az eredeti email címet egy metaadatba, hogy kommunikálni tudjunk a vásárlóval
    orderInput.value.metaData.push({ key: 'original_customer_email', value: originalEmail });
    
    // A rendeléshez ezt az egyedi email címet használjuk
    customer.value.billing.email = uniqueEmail;
    
    // Ha van shipping email is, azt is módosítjuk
    if (customer.value.shipping?.email) {
      customer.value.shipping.email = uniqueEmail;
    }
  }
  
  buttonText.value = t('messages.general.processing');

  const { stripePaymentIntent } = await GqlGetStripePaymentIntent();
  const clientSecret = stripePaymentIntent?.clientSecret || '';

  try {
    if (orderInput.value.paymentMethod.id === 'stripe' && stripe && elements.value) {
      const cardElement = elements.value.getElement('card') as StripeCardElement;
      const { setupIntent } = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: cardElement } });
      const { source } = await stripe.createSource(cardElement as CreateSourceData);

      if (source) orderInput.value.metaData.push({ key: '_stripe_source_id', value: source.id });
      if (setupIntent) orderInput.value.metaData.push({ key: '_stripe_intent_id', value: setupIntent.id });

      isPaid.value = setupIntent?.status === 'succeeded' || false;
      orderInput.value.transactionId = source?.created?.toString() || new Date().getTime().toString();
    }
    
    // Rendelés feldolgozása
    await proccessCheckout(isPaid.value);
    
    // Ha sikeres volt a rendelés és vendég módban vagyunk, visszaállítjuk az eredeti email címet (nem feltétlenül szükséges)
    if (!orderInput.value.createAccount && originalEmail) {
      customer.value.billing.email = originalEmail;
      if (customer.value.shipping?.email) {
        customer.value.shipping.email = originalEmail;
      }
    }
  } catch (error) {
    console.error(error);
    buttonText.value = t('messages.shop.placeOrder');
    
    // Hiba esetén visszaállítjuk az eredeti email címet
    if (!orderInput.value.createAccount && originalEmail) {
      customer.value.billing.email = originalEmail;
      if (customer.value.shipping?.email) {
        customer.value.shipping.email = originalEmail;
      }
    }
  }
};

const handleStripeElement = (stripeElements: StripeElements): void => {
  elements.value = stripeElements;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const checkEmailOnBlur = (email?: string | null): void => {
  if (email) isInvalidEmail.value = !emailRegex.test(email);
};

const checkEmailOnInput = (email?: string | null): void => {
  if (email && isInvalidEmail.value) isInvalidEmail.value = !emailRegex.test(email);
};

useSeoMeta({
  title: t('messages.shop.checkout'),
});
</script>

<template>
  <div class="flex flex-col min-h-[600px]">
    <template v-if="cart && customer">
      <div v-if="cart.isEmpty" class="flex flex-col items-center justify-center flex-1 mb-12">
        <Icon name="ion:cart-outline" size="156" class="opacity-25 mb-5" />
        <h2 class="text-2xl font-bold mb-2">{{ $t('messages.shop.cartEmpty') }}</h2>
        <span class="text-stone-400 mb-4">{{ $t('messages.shop.addProductsInYourCart') }}</span>
        <NuxtLink
          to="/products"
          class="flex items-center justify-center gap-3 p-2 px-3 mt-4  text-center text-white rounded-lg shadow-md bg-Primary hover:bg-Primary-dark">
          {{ $t('messages.shop.browseOurProducts') }}
        </NuxtLink>
      </div>

      <form v-else class="container flex flex-wrap items-start gap-8 my-16 justify-evenly lg:gap-20" @submit.prevent="payNow">
        <div class="grid w-full max-w-2xl gap-8 checkout-form md:flex-1">
          <!-- Customer details -->
          <div v-if="!viewer && customer.billing">
            <h2 class="w-full mb-2 text-2xl  leading-none">Elérhetőség</h2>
            <p class="mt-1 text-sm text-stone-500">Már van felhasználó fiókja? <a href="/my-account" class="text-Primary text-semibold">Bejelentkezés</a>.</p>
            <div class="w-full mt-4">
              <label for="email">{{ $t('messages.billing.email') }}</label>
              <input
                v-model="customer.billing.email"
                placeholder="nagysandor@gmail.com"
                autocomplete="email"
                type="email"
                name="email"
                :class="{ 'has-error': isInvalidEmail }"
                required
                @blur="checkEmailOnBlur(customer.billing.email)"
                @input="checkEmailOnInput(customer.billing.email)" >
              <Transition name="scale-y" mode="out-in">
                <div v-if="isInvalidEmail" class="mt-1 text-sm text-red-500">Hibás email cím</div>
              </Transition>
            </div>
            <template v-if="orderInput.createAccount">
              <div class="w-full mt-4">
                <label for="username">{{ $t('messages.account.username') }}</label>
                <input v-model="orderInput.username" placeholder="nagysandor" autocomplete="username" type="text" name="username" required >
              </div>
              <div v-if="orderInput.createAccount" class="w-full my-2">
                <label for="email">{{ $t('messages.account.password') }}</label>
                <PasswordInput id="password" v-model="orderInput.password" class="my-2" placeholder="••••••••••" :required="true" />
              </div>
            </template>
            <div v-if="!viewer" class="flex items-center gap-2 my-2">
              <label for="creat-account">Felhasználó létrehozása</label>
              <input id="creat-account" v-model="orderInput.createAccount" type="checkbox" name="creat-account" >
            </div>
          </div>

          <div>
            <h2 class="w-full mb-3 text-2xl ">{{ $t('messages.billing.billingDetails') }}</h2>
            <BillingDetails v-model="customer.billing" />
          </div>

          <label v-if="cart.availableShippingMethods.length > 0" for="shipToDifferentAddress" class="flex items-center gap-2">
            <span>{{ $t('messages.billing.differentAddress') }}</span>
            <input id="shipToDifferentAddress" v-model="orderInput.shipToDifferentAddress" type="checkbox" name="shipToDifferentAddress" >
          </label>

          <Transition name="scale-y" mode="out-in">
            <div v-if="orderInput.shipToDifferentAddress">
              <h2 class="mb-4 text-xl ">{{ $t('messages.general.shippingDetails') }}</h2>
              <ShippingDetails v-model="customer.shipping" />
            </div>
          </Transition>

          <!-- Shipping methods -->
          <div v-if="cart.availableShippingMethods.length">
            <h3 class="mb-4 ">{{ $t('messages.general.shippingSelect') }}</h3>
            <ShippingOptions :options="cart.availableShippingMethods[0].rates" :active-option="cart.chosenShippingMethods[0]" />
          </div>

          <!-- Pay methods -->
          <div v-if="paymentGateways?.nodes.length" class="mt-2 col-span-full">
            <h2 class="mb-4 text-xl ">{{ $t('messages.billing.paymentOptions') }}</h2>
            <PaymentOptions v-model="orderInput.paymentMethod" class="mb-4" :payment-gateways />
            <StripeElement v-if="stripe" v-show="orderInput.paymentMethod.id == 'stripe'" :stripe @update-element="handleStripeElement" />
          </div>

          <!-- Order note -->
          <div>
            <h2 class="mb-4 text-xl ">{{ $t('messages.shop.orderNote') }} ({{ $t('messages.general.optional') }})</h2>
            <textarea
              id="order-note"
              v-model="orderInput.customerNote"
              name="order-note"
              class="w-full min-h-[100px]"
              rows="4"
              :placeholder="$t('messages.shop.orderNotePlaceholder')"/>
          </div>
        </div>

        <OrderSummary>
          <button
            class="flex items-center justify-center w-full gap-3 p-3 mt-4  text-center text-white rounded-lg shadow-md bg-Primary hover:bg-Primary-dark disabled:cursor-not-allowed disabled:bg-stone-400"
            :disabled="isCheckoutDisabled">
            {{ buttonText }}<LoadingIcon v-if="isProcessingOrder" color="#fff" size="18" />
          </button>
        </OrderSummary>
      </form>
    </template>
    <LoadingIcon v-else class="m-auto" />
  </div>
</template>

<style lang="postcss">
.checkout-form input[type='text'],
.checkout-form input[type='email'],
.checkout-form input[type='tel'],
.checkout-form input[type='password'],
.checkout-form textarea,
.checkout-form select,
.checkout-form .StripeElement {
  @apply bg-white border rounded-md outline-none border-stone-300 shadow-sm w-full py-2 px-4;
}

.checkout-form input.has-error,
.checkout-form textarea.has-error {
  @apply border-red-500;
}

.checkout-form label {
  @apply my-1.5 text-xs text-stone-600 uppercase;
}

.checkout-form .StripeElement {
  padding: 1rem 0.75rem;
}
</style>
