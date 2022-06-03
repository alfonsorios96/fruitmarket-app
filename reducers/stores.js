import {TRANSFER_FRUIT, SET_STORES} from '../constants';

const initialState = [];

const updateStores = (stores, from, to, fruit, quantity) => {
    return stores.map(store => {
        if (store._id === from) {
            store.fruits = [
                ...store.fruits.map(_fruit => {
                    if (_fruit._id === fruit) {
                        _fruit.stock = _fruit.stock - Number(quantity)
                    }
                    return _fruit;
                })
            ];
        }
        if (store._id === to) {
            store.fruits = [
                ...store.fruits.map(_fruit => {
                    if (_fruit._id === fruit) {
                        _fruit.stock = _fruit.stock + Number(quantity)
                    }
                    return _fruit;
                })
            ];
        }
        return store;
    });
};

const storeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STORES:
            return [...action.payload.stores];
        case TRANSFER_FRUIT:
            return [
                ...updateStores(state, action.payload.from, action.payload.to, action.payload.fruit, action.payload.quantity)
            ];
        default:
            return state;
    }
}
export default storeReducer;
