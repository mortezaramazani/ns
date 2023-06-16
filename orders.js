import Vue from 'vue'
import {
    ORDERBOOK_INIT,
    OPEN_ORDER_LIST,
    ORDER_STORE,
    ORDER_CANCEL,
    ORDER_UPDATE,
    ORDER_PUSH_MY_ORDER
} from "@/Store/Mutations/Order";

import {math_formatter} from "@/Functions/Math";

const state = {
    asks: [],
    bids: [],
    openOrders: [],
    myOrders: []
};

const getters = {
    getOrderbook: (state) => (market, type) => {

        if(type == "bids") {
            return state.bids[market];
        }

        return state.asks[market];
    },
    getOpenOrders: (state) => (market) => {
        return state.openOrders && state.openOrders[market];
    }
};

const mutations = {
    [ORDERBOOK_INIT](state, {bids, asks, market}) {
        if(bids) {
            Vue.set(state.bids, market, bids);
        }
        if(asks) {
            Vue.set(state.asks, market, asks);
        }
    },
    [OPEN_ORDER_LIST](state, {orders, market}) {
        Vue.set(state.openOrders, market, orders);
    },
    [ORDER_STORE](state, {order, market}) {

        // Skip if quantity is 0
        if(order.quantity == 0) return;

        // Store order in market orderbook
        let orders = order.side == "buy" ? state.bids[market] : state.asks[market];

        let findOrder = orders.map(function(x) {return x.price; }).indexOf(order.price.toString());

        if(findOrder > -1) {

            let initialQuantity = orders[findOrder].quantity;

            Vue.delete(orders, findOrder);

            orders.push({
                price: order.price,
                quantity: parseFloat(initialQuantity) + parseFloat(order.quantity),
            })

        } else {
            orders.push({
                price: order.price,
                quantity: order.quantity,
            })
        }
    },
    [ORDER_UPDATE](state, {order, market, getters}) {

        // update order from orderbook

        let orders = order.side == "buy" ? state.bids[market] : state.asks[market];

        let findOrder = orders.map(function(x) {return x.price; }).indexOf(order.price.toString());

        if(findOrder > -1) {

            let initialQuantity = orders[findOrder].quantity;

            Vue.delete(orders, findOrder);

            let updatedQuantity = parseFloat(initialQuantity) - parseFloat(order.updated_quantity);

            if(updatedQuantity > 0) {
                orders.push({
                    price: order.price,
                    quantity: updatedQuantity,
                })
            } else {
                Vue.delete(orders, findOrder);
            }
        }

        // update from open orders

        let openOrders = state.openOrders[market];

        if(getters.getUser && openOrders) {
            let findUpdatedOrder = openOrders.map(function (x) {
                return x.id;
            }).indexOf(order.id);

            if (findUpdatedOrder > -1) {
                if (order.quantity > 0) {
                    Vue.set(openOrders, findUpdatedOrder, order);
                } else {
                    Vue.delete(openOrders, findUpdatedOrder);
                }
            }
        }
    },
    [ORDER_CANCEL](state, {order, market}) {

        // remove from orderbook

        let orders = order.side == "buy" ? state.bids[market] : state.asks[market];

        let findOrder = orders.map(function(x) {return x.price; }).indexOf(order.price.toString());

        if(findOrder > -1) {

            let initialQuantity = orders[findOrder].quantity;

            Vue.delete(orders, findOrder);

            let updatedQuantity = parseFloat(initialQuantity) - parseFloat(order.quantity);

            if(updatedQuantity > 0) {
                orders.push({
                    price: order.price,
                    quantity: updatedQuantity,
                })
            }
        }

        // remove from open orders
        let openOrders = state.openOrders[market];

        if(openOrders) {
            let findCancelledOrder = openOrders.map(function (x) {
                return x.id;
            }).indexOf(order.id);

            if (findCancelledOrder > -1) {
                Vue.delete(openOrders, findCancelledOrder);
            }
        }
    },
    [ORDER_PUSH_MY_ORDER](state, {uuid, market}) {
        state.myOrders[market].push(uuid);
    }
};

const actions = {
    fetchOrders({ state, commit }, { market }) {
        axios.get(route('markets.api.orderbook'), {
            params: {
                'market' : market,
            }
        }).then(res => {

            let orderbook = res.data;

            commit(ORDERBOOK_INIT, {
                bids: orderbook.bids,
                asks: orderbook.asks,
                market: market
            });
        })
    },
    fetchOpenOrders({ state, commit }, { market }) {
        axios.get(route('orders.api.open'), {
            params: {
                'market' : market,
            }
        }).then(res => {
            commit(OPEN_ORDER_LIST, {
                orders: res.data.data,
                market: market,
            });
        })
    },
    updateOrderbook({ state, commit, getters }, { order, type, market }) {

        let mutation;

        if(type == "store")
            mutation = ORDER_STORE;
        if(type == "update")
            mutation = ORDER_UPDATE;
        if(type == "cancel")
            mutation = ORDER_CANCEL;

        commit(mutation, {
            order: order,
            market: market,
            getters: getters
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
