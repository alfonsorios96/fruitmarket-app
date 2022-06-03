import {TRANSFER_FRUIT, SET_STORES} from '../constants';

export function transferFruit(storeFrom, storeTo, fruit, quantity) {
    return {
        type: TRANSFER_FRUIT,
        payload: {
            from: storeFrom,
            to: storeTo,
            fruit: fruit,
            quantity: quantity
        }
    }
}

export function setStores(stores) {
    return {
        type: SET_STORES,
        payload: {
            stores
        }
    }
}