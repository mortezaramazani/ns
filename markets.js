import Vue from 'vue'

import {MARKET_LIST, MARKET_TRADE_LIST, MARKET_UPDATE, MARKET_TRADE_STORE} from "@/Store/Mutations/Market";

const state = {
    loading: false,
    items: [],
    orders: [],
    trades: []
};

const getters = {
    getMarkets: (state) => {
        return state.items;
    },
    getMarket: (state) => (name) => {
        return state.items.find((market) => {
            return market.name === name;
        });
    },
    getMarketTrades: (state) => (market) => {
        return state.trades[market];
    },
};

const mutations = {
    [MARKET_LIST](state, {markets}) {
        state.items = markets;
    },
    [MARKET_UPDATE](state, {market}) {
        const index = state.items.findIndex(item => item.name === market.name)
        Vue.set(state.items, index, market);
    },
    [MARKET_TRADE_LIST](state, {trades, market}) {
        Vue.set(state.trades, market, trades);
    },
    [MARKET_TRADE_STORE](state, {trade, market}) {
        state.trades[market].push(trade);
    },
};

const actions = {
    fetchMarkets({ state, commit }) {
        axios.get(route('markets.api.ticker')).then(res => {
            commit(MARKET_LIST, {
                markets: res.data.data
            });
        })
    },
    updateMarket({ state, commit }, payload) {
        commit(MARKET_UPDATE, payload);
    },
    updateMarketTrade({ state, commit }, payload) {
        commit(MARKET_TRADE_STORE, {
            trade: payload.trade,
            market: payload.market.name
        });
    },
    fetchMarketTrades({ state, commit }, { market }) {
        axios.get(route('markets.api.trades'), {
            params: {
                'market' : market,
            }
        }).then(res => {
            commit(MARKET_TRADE_LIST, {
                trades: res.data.data,
                market: market,
            });
        })
    },
};

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
}
