import {SET_USER} from "@/Store/Mutations/User";
import {SET_USER_CHANNEL} from "@/Store/Mutations/User";

const state = {
    user: null,
    channel: null,
};

const mutations = {
    [SET_USER](state, {user}) {
        state.user = user;
    },
    [SET_USER_CHANNEL](state, {channel}) {
        state.channel = channel
    },
};

// Current User
const getters = {
    getUser: (state) => {
        return state.user;
    },
    getUserChannel: (state) => {
        return state.channel;
    }
};

const actions = {
    setUser({ state, commit }) {
        let user = window.Vue.$page.props.user;

        commit(SET_USER, {
            user: user
        });
        commit(SET_USER_CHANNEL, {
            channel: 'private-user-' + user.id
        });
    },
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
}
