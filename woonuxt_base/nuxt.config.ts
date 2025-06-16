import { createResolver } from '@nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  compatibilityDate: '2024-07-09',
  future: {
    compatibilityVersion: 4,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  css: ['./assets/scss/main.scss', './assets/scss/fonts.scss'],

  app: {
    head: {
      htmlAttrs: { lang: 'hu' },
      // link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'default' },
  },

  devtools: { enabled: true },

  experimental: {
    sharedPrerenderData: true,
    buildCache: true,
    defaults: {
      nuxtLink: {
        prefetch: true,
        prefetchOn: { visibility: false },
      },
    },
  },

  plugins: [resolve('./app/plugins/init.ts')],

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  components: [{ path: resolve('./app/components'), pathPrefix: false }],

  modules: [
    'woonuxt-settings',
    'nuxt-graphql-client',
    '@nuxt/icon',
    'nuxt-phosphor-icons',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxt/eslint'
  ],

  'graphql-client': {
    clients: {
      default: {
        host: process.env.GQL_HOST || 'http://localhost:4000/graphql',
        corsOptions: { mode: 'cors', credentials: 'include' },
      },
    },
  },

  alias: {
    '#constants': resolve('./app/constants'),
    '#woo': '../.nuxt/gql/default',
  },

  hooks: {
    'pages:extend'(pages) {
      const addPage = (name: string, path: string, file: string) => {
        pages.push({ name, path, file: resolve(`./app/pages/${file}`) });
      };

      addPage('product-page-pager', '/products/page/:pageNumber', 'products.vue');
      addPage('product-category-page', '/product-category/:categorySlug', 'product-category/[slug].vue');
      addPage('product-category-page-pager', '/product-category/:categorySlug/page/:pageNumber', 'product-category/[slug].vue');
      addPage('order-received', '/checkout/order-received/:orderId', 'order-summary.vue');
      addPage('order-summary', '/order-summary/:orderId', 'order-summary.vue');
    },
  },

  nitro: {
    routeRules: {
      '/': { prerender: true },
      '/products/**': { swr: 3600 },
      '/checkout/order-received/**': { ssr: false },
      '/order-summary/**': { ssr: false },
    },
  },

  // Multilingual support
  i18n: {
    locales: [{ code: 'hu_HU', file: 'hu-HU.json', name: 'Magyar HU' }],
    langDir: 'locales',
    defaultLocale: 'hu_HU',
    strategy: 'no_prefix',
  },
});
