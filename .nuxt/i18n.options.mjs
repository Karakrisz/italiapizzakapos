
// @ts-nocheck
import locale__Applications_XAMPP_xamppfiles_htdocs_italiapizzakapos_woonuxt_base_app_locales_hu_HU_json from "../woonuxt_base/app/locales/hu-HU.json";


export const localeCodes =  [
  "hu_HU"
]

export const localeLoaders = {
  "hu_HU": [{ key: "../woonuxt_base/app/locales/hu-HU.json", load: () => Promise.resolve(locale__Applications_XAMPP_xamppfiles_htdocs_italiapizzakapos_woonuxt_base_app_locales_hu_HU_json), cache: true }]
}

export const vueI18nConfigs = [
  
]

export const nuxtI18nOptions = {
  "experimental": {
    "localeDetector": "",
    "switchLocalePathLinkSSR": false,
    "autoImportTranslationFunctions": false
  },
  "bundle": {
    "compositionOnly": true,
    "runtimeOnly": false,
    "fullInstall": true,
    "dropMessageCompiler": false
  },
  "compilation": {
    "jit": true,
    "strictMessage": true,
    "escapeHtml": false
  },
  "customBlocks": {
    "defaultSFCLang": "json",
    "globalSFCScope": false
  },
  "vueI18n": "",
  "locales": [
    {
      "code": "hu_HU",
      "name": "Magyar HU",
      "files": [
        "/Applications/XAMPP/xamppfiles/htdocs/italiapizzakapos/woonuxt_base/app/locales/hu-HU.json"
      ]
    }
  ],
  "defaultLocale": "hu_HU",
  "defaultDirection": "ltr",
  "routesNameSeparator": "___",
  "trailingSlash": false,
  "defaultLocaleRouteNameSuffix": "default",
  "strategy": "no_prefix",
  "lazy": false,
  "langDir": "locales",
  "detectBrowserLanguage": {
    "alwaysRedirect": false,
    "cookieCrossOrigin": false,
    "cookieDomain": null,
    "cookieKey": "i18n_redirected",
    "cookieSecure": false,
    "fallbackLocale": "",
    "redirectOn": "root",
    "useCookie": true
  },
  "differentDomains": false,
  "baseUrl": "",
  "dynamicRouteParams": false,
  "customRoutes": "page",
  "pages": {},
  "skipSettingLocaleOnNavigate": false,
  "types": "composition",
  "debug": false,
  "parallelPlugin": false,
  "multiDomainLocales": false,
  "i18nModules": []
}

export const normalizedLocales = [
  {
    "code": "hu_HU",
    "name": "Magyar HU",
    "files": [
      {
        "path": "/Applications/XAMPP/xamppfiles/htdocs/italiapizzakapos/woonuxt_base/app/locales/hu-HU.json"
      }
    ]
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = false

export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18n"
export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
