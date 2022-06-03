import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/filter_reducer";
import {
    LOAD_PRODUCTS,
    SET_GRIDVIEW,
    SET_LISTVIEW,
    UPDATE_SORT,
    SORT_PRODUCTS,
    UPDATE_FILTERS,
    FILTER_PRODUCTS,
    CLEAR_FILTERS,
} from "../actions";
import { useProductsContext } from "./products_context";

const initialState = {
    // array thats always changing depending on user
    filtered_products: [],
    // if we need to go back to defaults
    all_products: [],
    grid_view: true,
    // default sort value MUST match one of the OPTIONs of the select list!
    sort: "price-lowest",
    filters: {
        text: "",
        company: "all",
        category: "all",
        color: "all",
        min_price: 0,
        // we set these by mapping over the products , so the maxPrice is actual highest price item
        max_price: 0,
        price: 0,
        shipping: false,
    },
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
    // we get products from products context, but we need a FUNCTION / USEEFFECT to load them into initialState
    const { products } = useProductsContext();
    const [state, dispatch] = useReducer(reducer, initialState);

    // when products mount we dispatch an action!
    useEffect(() => {
        dispatch({ type: LOAD_PRODUCTS, payload: products });
        // products are initially empty, so we need to trigger this when application loads product
    }, [products]);

    // useEffect that runs every time we change state value AND products, since they're initially non existant!
    useEffect(() => {
        //when filters change -> last dependancy in deps array
        dispatch({ type: FILTER_PRODUCTS });
        dispatch({ type: SORT_PRODUCTS });
    }, [products, state.sort, state.filters]);

    const setGridView = () => {
        dispatch({ type: SET_GRIDVIEW });
    };

    const setListView = () => {
        dispatch({ type: SET_LISTVIEW });
    };

    const updateSort = (e) => {
        // for demonstration
        // const name = e.target.name;
        const value = e.target.value;
        dispatch({ type: UPDATE_SORT, payload: value });
    };

    const updateFilters = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        // we cannot access value property  of a button so we'll handle it like this
        if (name === "category") {
            value = e.target.textContent;
        }
        // approach for colors
        if (name === "color") {
            value = e.target.dataset.color;
        }
        // we get everything as string from inputs
        if (name === "price") {
            value = Number.parseInt(value);
        }
        if (name === "shipping") {
            value = e.target.checked;
        }

        dispatch({ type: UPDATE_FILTERS, payload: { name, value } });
    };

    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS });
    };

    return (
        <FilterContext.Provider
            value={{
                ...state,
                setGridView,
                setListView,
                updateSort,
                updateFilters,
                clearFilters,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};
// make sure use
export const useFilterContext = () => {
    return useContext(FilterContext);
};
