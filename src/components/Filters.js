import React from "react";
import styled from "styled-components";
import { useFilterContext } from "../context/filter_context";
import { getUniqueValues, formatPrice } from "../utils/helpers";
import { FaCheck } from "react-icons/fa";

const Filters = () => {
    // we need to set up filters as controlled inputs
    const {
        filters: {
            text,
            category,
            company,
            color,
            min_price,
            price,
            max_price,
            shipping,
        },
        clearFilters,
        updateFilters,
        all_products,
    } = useFilterContext();

    // we're looking for data we're passing in, second is the string value by which we get unique values - helper method.
    const categories = getUniqueValues(all_products, "category");
    const companies = getUniqueValues(all_products, "company");
    const colors = getUniqueValues(all_products, "colors");

    return (
        <Wrapper>
            <div className="content">
                <form onSubmit={(e) => e.preventDefault()}>
                    {/* search input */}
                    <div className="form-control">
                        {/* name values have to be exactly same as we have in the state */}
                        <input
                            type="text"
                            name="text"
                            placeholder="search"
                            className="search-input"
                            value={text}
                            onChange={(e) => updateFilters(e)}
                        />
                    </div>
                    <div className="form-control">
                        <h5>category</h5>
                        <div>
                            {categories.map((cat, index) => {
                                return (
                                    <button
                                        onClick={(e) => updateFilters(e)}
                                        name="category"
                                        type="button"
                                        className={`${
                                            category === cat.toLowerCase()
                                                ? "active"
                                                : null
                                        }`}
                                        key={index}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="form-control">
                        <h5>company</h5>
                        <select
                            name="company"
                            value={company}
                            onChange={(e) => updateFilters(e)}
                        >
                            {companies.map((comp, index) => {
                                return (
                                    <option key={index} value={comp}>
                                        {comp}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-control">
                        <h5>colors</h5>
                        <div className="colors">
                            {colors.map((clr, index) => {
                                if (clr === "all") {
                                    return (
                                        <button
                                            key={index}
                                            name="color"
                                            onClick={(e) => updateFilters(e)}
                                            data-color="all"
                                            className={`${
                                                color === "all"
                                                    ? "all-btn active"
                                                    : "all-btn"
                                            }`}
                                        >
                                            All
                                        </button>
                                    );
                                }

                                return (
                                    // we have to check is it the main color
                                    <button
                                        key={index}
                                        name="color"
                                        style={{ background: clr }}
                                        className={`${
                                            clr === color
                                                ? "color-btn active"
                                                : "color-btn"
                                        }`}
                                        data-color={clr}
                                        onClick={(e) => updateFilters(e)}
                                    >
                                        {color === clr ? <FaCheck /> : null}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="form-control">
                            <h5>price</h5>
                            <p className="price">{formatPrice(price)}</p>
                            <input
                                type="range"
                                name="price"
                                onChange={(e) => updateFilters(e)}
                                // ne zaboravi da iz inputa uvijek cijenu dobijamo kao string
                                value={price}
                                min={min_price}
                                max={max_price}
                            />
                        </div>
                        <div className="form-control shipping">
                            <label htmlFor="shipping">Free shipping</label>
                            <input
                                // from checkbox we canno't get the value so we have to do some magic in the function
                                type="checkbox"
                                name="shipping"
                                id="shipping"
                                onChange={(e) => updateFilters(e)}
                                checked={shipping}
                            />
                        </div>
                    </div>
                </form>
                <button
                    type="button"
                    className="clear-btn"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .form-control {
        margin-bottom: 1.25rem;
        h5 {
            margin-bottom: 0.5rem;
        }
    }
    .search-input {
        padding: 0.5rem;
        background: var(--clr-grey-10);
        border-radius: var(--radius);
        border-color: transparent;
        letter-spacing: var(--spacing);
    }
    .search-input::placeholder {
        text-transform: capitalize;
    }

    button {
        display: block;
        margin: 0.25em 0;
        padding: 0.25rem 0;
        text-transform: capitalize;
        background: transparent;
        border: none;
        border-bottom: 1px solid transparent;
        letter-spacing: var(--spacing);
        color: var(--clr-grey-5);
        cursor: pointer;
    }
    .active {
        border-color: var(--clr-grey-5);
    }
    .company {
        background: var(--clr-grey-10);
        border-radius: var(--radius);
        border-color: transparent;
        padding: 0.25rem;
    }
    .colors {
        display: flex;
        align-items: center;
    }
    .color-btn {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: #222;
        margin-right: 0.5rem;
        border: none;
        cursor: pointer;
        opacity: 0.5;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
            font-size: 0.5rem;
            color: var(--clr-white);
        }
    }
    .all-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.5rem;
        opacity: 0.5;
    }
    .active {
        opacity: 1;
    }
    .all-btn .active {
        text-decoration: underline;
    }
    .price {
        margin-bottom: 0.25rem;
    }
    .shipping {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        text-transform: capitalize;
        column-gap: 0.5rem;
        font-size: 1rem;
    }
    .clear-btn {
        background: var(--clr-red-dark);
        color: var(--clr-white);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius);
    }
    @media (min-width: 768px) {
        .content {
            position: sticky;
            top: 1rem;
        }
    }
`;

export default Filters;
