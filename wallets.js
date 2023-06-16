import {
    WALLET_LIST, WALLET_UPDATE,
    DEPOSIT_LIST, DEPOSIT_STORE, DEPOSIT_UPDATE,
    FIAT_DEPOSIT_LIST, FIAT_WITHDRAWAL_LIST,
    WITHDRAWAL_LIST, WITHDRAWAL_STORE, WITHDRAWAL_UPDATE
} from "@/Store/Mutations/Wallet";

import Vue from "vue";

const state = {
    items: [],
    deposits: [],
    withdrawals: [],
    fiatDeposits: [],
    fiatWithdrawals: []
};

const getters = {
    getWallets: (state) => {
        return state.items;
    },
    getWallet: (state) => (symbol) => {
        return state.items.find((wallet) => {
            return wallet.symbol === symbol;
        });
    },
    getDeposits: (state) => {
        return state.deposits;
    },
    getFiatDeposits: (state) => {
        return state.fiatDeposits;
    },
    getWithdrawals: (state) => {
        return state.withdrawals;
    },
    getFiatWithdrawals: (state) => {
        return state.withdrawals;
    },
};

const mutations = {
    [WALLET_LIST](state, {wallets}) {
        state.items = wallets;
    },
    [WALLET_UPDATE](state, {wallet}) {
        const index = state.items.findIndex(item => item.id === wallet.id)
        Vue.set(state.items, index, wallet);
    },
    [DEPOSIT_LIST](state, {deposits}) {
        state.deposits = deposits;
    },
    [FIAT_DEPOSIT_LIST](state, {deposits}) {
        state.fiatDeposits = deposits;
    },
    [DEPOSIT_STORE](state, {deposit}) {
        state.deposits.unshift(deposit)
    },
    [DEPOSIT_UPDATE](state, {deposit}) {
        const index = state.deposits.findIndex(item => item.id === deposit.id)
        Vue.set(state.deposits, index, deposit);
    },
    [WITHDRAWAL_LIST](state, {withdrawals}) {
        state.withdrawals = withdrawals;
    },
    [FIAT_WITHDRAWAL_LIST](state, {withdrawals}) {
        state.withdrawals = withdrawals;
    },
    [WITHDRAWAL_STORE](state, {withdrawal}) {
        state.withdrawals.unshift(withdrawal)
    },
    [WITHDRAWAL_UPDATE](state, {withdrawal}) {
        const index = state.withdrawals.findIndex(item => item.id === withdrawal.id)
        Vue.set(state.withdrawals, index, withdrawal);
    }
};

const actions = {
    fetchWallets({ state, commit }) {
        axios.get(route('wallets.index')).then(response => {
            commit(WALLET_LIST, {
                wallets: response.data.data
            });
        })
    },
    fetchDeposits({ state, commit }) {
        axios.get(route('wallets.api.deposits', {
            type: 'coin'
        })).then(response => {
            commit(DEPOSIT_LIST, {
                deposits: response.data.data
            });
        }).catch(error => {

        });
    },
    fetchFiatDeposits({ state, commit }) {
        axios.get(route('wallets.api.deposits.fiat')).then(response => {
            commit(FIAT_DEPOSIT_LIST, {
                deposits: response.data.data
            });
        }).catch(error => {

        });
    },
    fetchWithdrawals({ state, commit }) {
        axios.get(route('wallets.api.withdrawals', {
            type: 'coin'
        })).then(response => {
            commit(WITHDRAWAL_LIST, {
                withdrawals: response.data.data
            });
        }).catch(error => {

        });
    },
    fetchFiatWithdrawals({ state, commit }) {
        axios.get(route('wallets.api.withdrawals.fiat')).then(response => {
            commit(FIAT_WITHDRAWAL_LIST, {
                withdrawals: response.data.data
            });
        }).catch(error => {

        });
    },
    updateWallet({ state, commit }, payload) {
        commit(WALLET_UPDATE, payload);
    },
    storeDeposit({ state, commit }, payload) {
        commit(DEPOSIT_STORE, {
            deposit: payload.deposit
        });
    },
    updateDeposit({ state, commit}, payload) {
        commit(DEPOSIT_UPDATE, {
            deposit: payload.deposit
        });
    },
    storeWithdrawal({ state, commit }, payload) {
        commit(WITHDRAWAL_STORE, {
            withdrawal: payload.withdrawal
        });
    },
    updateWithdrawal({ state, commit}, payload) {
        commit(WITHDRAWAL_UPDATE, {
            withdrawal: payload.withdrawal
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
