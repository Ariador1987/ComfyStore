import {
    ADD_TO_CART,
    CLEAR_CART,
    COUNT_CART_TOTALS,
    REMOVE_CART_ITEM,
    TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const { id, color, amount, product } = action.payload;
            // check is item already in cart
            // we're combining ID and color because we can have the same item in cart, but with different color
            const tempItem = state.cart.find((x) => x.id === id + color);
            // is already in cart
            if (tempItem) {
                // mapping over the cart, checking the id's
                const tempCart = state.cart.map((cartItem) => {
                    if (cartItem.id === id + color) {
                        let newAmount = cartItem.amount + amount;
                        // new amount can't exceed item quantity
                        if (newAmount > cartItem.max) {
                            newAmount = cartItem.max;
                        }
                        return { ...cartItem, amount: newAmount };
                    } else {
                        // if it isn't in the cart, we return it
                        return cartItem;
                    }
                });
                return { ...state, cart: tempCart };
            } else {
                const newItem = {
                    id: id + color,
                    name: product.name,
                    color,
                    amount,
                    image: product.images[0].url,
                    // we dont want the user to be able to select more items then total_items/quantity for the given product has
                    price: product.price,
                    max: product.stock,
                };

                return { ...state, cart: [...state.cart, newItem] };
            }
        }

        case CLEAR_CART: {
            return { ...state, cart: [] };
        }

        case REMOVE_CART_ITEM: {
            const tempCart = state.cart.filter(
                (item) => item.id !== action.payload
            );
            return {
                ...state,
                cart: tempCart,
            };
        }

        case TOGGLE_CART_ITEM_AMOUNT: {
            const { id, value } = action.payload;
            const tempCart = state.cart.map((item) => {
                // careful id and color are already concatenated
                if (item.id === id) {
                    if (value === "inc") {
                        let newAmount = item.amount + 1;
                        if (newAmount > item.max) {
                            newAmount = item.max;
                        }
                        return { ...item, amount: newAmount };
                    }

                    if (value === "dec") {
                        let newAmount = item.amount - 1;
                        if (newAmount < 1) {
                            newAmount = 1;
                        }
                        return { ...item, amount: newAmount };
                    }
                } else {
                    return item;
                }
            });

            return { ...state, cart: tempCart };
        }

        case COUNT_CART_TOTALS: {
            const { total_items, total_amount } = state.cart.reduce(
                (acc, currVal) => {
                    // currVal is cartItem
                    const { amount, price } = currVal;
                    acc.total_items += amount;
                    acc.total_amount += price * amount;
                    return acc;
                },
                { total_items: 0, total_amount: 0 }
            );

            return { ...state, total_items, total_amount };
        }

        default:
            throw new Error(`No Matching "${action.type}" - action type`);
    }
};

export default cart_reducer;
