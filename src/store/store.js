import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist';

const vueLocal = new VuexPersistence({
    storage: window.localStorage
});

const store = createStore({
    state() {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    },
    plugins: [vueLocal.plugin]
});

export default store;

