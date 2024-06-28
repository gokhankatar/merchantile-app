import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist';

const vueLocal = new VuexPersistence({
    storage: window.localStorage
});

const store = createStore({
    state() {
        return {
            userInfo: {},
            fullName: ''
        }
    },
    getters: {
        getFullName(state) {
            return state.fullName.split(" ")[0][0] + state.fullName.split(" ")[1][0];
            // for example "Gokhan Katar = GK"
        },
        getUserInfo(state) {
            return state.userInfo;
        },
        getUserId(state) {
            return state.userInfo?.localId;
        }
    },
    mutations: {
        setFullName(state, payload) {
            state.fullName = payload
        },
        setUserInfo(state, payload) {
            state.userInfo = payload
        }
    },
    actions: {

    },
    plugins: [vueLocal.plugin]
});

export default store;

