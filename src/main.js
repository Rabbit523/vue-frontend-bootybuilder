import Vue from "vue";
import App from "./App";

// BootstrapVue add
import BootstrapVue from "bootstrap-vue";
// Router & Store add
import router from "./router";
import store from "./store";
// Multi Language Add
import en from "./locales/en.json";
import VueI18n from "vue-i18n";
import {
  defaultLocale,
  localeOptions,
  firebaseConfig
} from "./constants/config";
// Notification Component Add
import Notifications from "./components/Common/Notification";
// Breadcrumb Component Add
import Breadcrumb from "./components/Common/Breadcrumb";
// RefreshButton Component Add
import RefreshButton from "./components/Common/RefreshButton";
// Colxx Component Add
import Colxx from "./components/Common/Colxx";
// Perfect Scrollbar Add
import vuePerfectScrollbar from "vue-perfect-scrollbar";
import contentmenu from "v-contextmenu";
import VueLineClamp from "vue-line-clamp";
import VueScrollTo from "vue-scrollto";
import firebase from "firebase/app";
import "firebase/auth";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { ThemeColors } from "./utils";
const colors = ThemeColors();

Vue.use(BootstrapVue);
Vue.use(require('vue-moment'));
Vue.use(VueI18n);
const messages = { en: en };
const locale =
  localStorage.getItem("currentLanguage") &&
  localeOptions.filter(x => x.id === localStorage.getItem("currentLanguage"))
    .length > 0
    ? localStorage.getItem("currentLanguage")
    : defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: "en",
  messages
});
Vue.use(Notifications);
Vue.use(require("vue-shortkey"));
Vue.use(contentmenu);
Vue.use(VueScrollTo);
Vue.use(VueLineClamp, {
  importCss: true
});

const sweetAlertOptions = {
  confirmButtonColor: colors.themeColor1,
  cancelButtonColor: colors.themeColor2
};

Vue.use(VueSweetalert2, sweetAlertOptions);

Vue.component("piaf-breadcrumb", Breadcrumb);
Vue.component("b-refresh-button", RefreshButton);
Vue.component("b-colxx", Colxx);
Vue.component("vue-perfect-scrollbar", vuePerfectScrollbar);

firebase.initializeApp(firebaseConfig);
Vue.config.productionTip = false;

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
