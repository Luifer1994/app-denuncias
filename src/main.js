import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import axios from "axios";

//createStore.dispatch('getUser')
// Create a new store instance.
const store = createStore({
  state() {
    return {
      user: null,
    };
  },
  mutations: {
    userLogin(state, user) {
      state.user = user;
    },
    RESET_USER(state) {
      state.user = null;
    },
  },
  actions: {
    async logout({ commit }) {
      let response;
      const urlApi = process.env.VUE_APP_URL_API;
      const token = localStorage.getItem("token");
      try {
        response = await axios.get(urlApi + "logout", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.res && localStorage.getItem("token")) {
          localStorage.removeItem("token");
          commit("RESET_USER");
        }
      } catch (ex) {
        // Handle error
        console.log(ex);
      }
    },
  },
  plugins: [new VuexPersistence().plugin],
});
createApp(App)
  .use(router)
  .use(store)
  .mount("#app");
