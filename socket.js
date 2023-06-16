// Import Socket Mutations
import {SET_SOCKET} from "@/Store/Mutations/Common/socket";

// Initial socket state
const state = { socket: null };

// Socket Store Actions
const actions = {
    async setSocket({state, commit}, payload) {
        commit(SET_SOCKET, payload);
    }
};

// Socket Getters
const getters = {
    getSocket: (state) => {
        return state.socket;
    }
};

// Socket Store Mutations
const mutations = {
    [SET_SOCKET](state, {socket}) {
        state.socket = socket;
    },
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
}

