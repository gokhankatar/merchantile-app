/*
* @description : a merchantile application where user-interactive frontend and backend work together
* @author : Gokhan Katar
* @github : https://github.com/gokhankatar
* @x : https://twitter.com/gokhan_crypto/
* @instagram :  https://www.instagram.com/katargokhan96/
*/

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
        getName(state) {
            const name = state.fullName;
            if (name) {
                return name;
            } else {
                return 'NA'
            }
        },
        getFullName(state) {
            const fullName = state.fullName;


            if (fullName && fullName.split(" ").length >= 2) {
                // for example "Gokhan Katar = GK"
                return fullName.split(" ")[0][0] + fullName.split(" ")[1][0];
            } else {
                return "NA";
            }
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

