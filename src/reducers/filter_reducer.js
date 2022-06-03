import {
    LOAD_PRODUCTS,
    SET_LISTVIEW,
    SET_GRIDVIEW,
    UPDATE_SORT,
    SORT_PRODUCTS,
    UPDATE_FILTERS,
    FILTER_PRODUCTS,
    CLEAR_FILTERS,
} from "../actions";
import products_reducer from "./products_reducer";

const filter_reducer = (state, action) => {
    switch (action.type) {
        case LOAD_PRODUCTS: {
            // this step came later, we need to set maxPrice of the product here upon products load
            // our range slider will start maxPrice and price being same, the maximum price of a single item.
            const priceItemsArr = action.payload.map((prod) => prod.price);
            const maxPrice = Math.max(...priceItemsArr);
            // big gotcha here , we need to 1) copy the products 2) filtered_products MUST point to different point in memory, so copy again
            return {
                ...state,
                all_products: [...action.payload],
                filtered_products: [...action.payload],
                // first copy old values
                filters: {
                    ...state.filters,
                    max_price: maxPrice,
                    price: maxPrice,
                },
            };
        }

        case UPDATE_SORT: {
            return { ...state, sort: action.payload };
        }

        case SORT_PRODUCTS: {
            // we have 4 possible options here
            const { sort, filtered_products } = state;
            // temp product arr changing depending on sort
            // we set it up this way as a failsafe, if there's some wierd arrow we still return something.
            let tempProducts = [...filtered_products];
            if (sort === "price-lowest") {
                tempProducts.sort((a, b) => a.price - b.price);
            }
            if (sort === "price-highest") {
                tempProducts.sort((a, b) => b.price - a.price);
            }
            if (sort === "name-a") {
                //// TEST 3 RAZLIČITE MOGUČNOSTI
                // tempProducts.sort((a, b) =>
                //     a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 tribam imat i 0 scenario ovdje
                // );
                // tempProducts.sort(
                //     (a, b) =>
                //         (a.name.toLowerCase() > b.name.toLowerCase()) -
                //         (a.name.toLowerCase() < b.name.toLowerCase())
                // );
                tempProducts.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            }
            if (sort === "name-z") {
                tempProducts.sort((a, b) => {
                    return b.name.localeCompare(a.name);
                });
            }

            return { ...state, filtered_products: tempProducts };
        }

        case SET_GRIDVIEW: {
            return { ...state, grid_view: true };
        }

        case SET_LISTVIEW:
            return { ...state, grid_view: false };

        case UPDATE_FILTERS: {
            // destruct values from payload
            const { name, value } = action.payload;
            // dont forget to destructure filters so we don't lose other values => then set-up dynamic properties using bracket notation
            return { ...state, filters: { ...state.filters, [name]: value } };
        }

        case CLEAR_FILTERS: {
            return {
                ...state,
                filters: {
                    // CAREFUL HERE , these two we dont want to change minPrice and maxPrice
                    ...state.filters,
                    text: "",
                    company: "all",
                    category: "all",
                    color: "all",
                    price: state.filters.max_price,
                    shipping: false,
                },
            };
        }

        case FILTER_PRODUCTS: {
            // we need to have two values, one array holding values of filtered products, second having all products
            const { all_products } = state;
            // avoiding nested destructuring
            const { text, category, company, color, price, shipping } =
                state.filters;
            // BEFORE we filter anything, fresh copy of all products
            let tempProducts = [...all_products];

            //// filtering!
            // text
            if (text !== "") {
                tempProducts = tempProducts.filter((product) =>
                    product.name.toLowerCase().startsWith(text)
                );
            }
            // category - this takes in scenario if text is already filtered, this is fine
            if (category !== "all") {
                tempProducts = tempProducts.filter(
                    (product) => product.category === category
                );
            }
            // company
            if (company !== "all") {
                tempProducts = tempProducts.filter(
                    (product) => product.company === company
                );
            }
            // colors - colors are an array
            if (color !== "all") {
                tempProducts = tempProducts.filter((product) =>
                    product.colors.find((col) => col === color)
                );
            }
            // shipping
            if (shipping) {
                tempProducts = tempProducts.filter(
                    (product) => product.shipping === true
                );
            }

            // price - we check it for all products
            tempProducts = tempProducts.filter(
                (product) => product.price <= price
            );

            return { ...state, filtered_products: tempProducts };
        }

        default:
            throw new Error(`No Matching "${action.type}" - action type`);
    }
};

export default filter_reducer;
