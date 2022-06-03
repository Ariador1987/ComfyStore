export const formatPrice = (number) => {
    // we'll use number format
    const newNumber = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        // we still need to take in consideration that the price is cents so we need to divide by 100
    }).format(number / 100);
    return newNumber;
};

export const getUniqueValues = (data, type) => {
    let unique = data.map((item) => item[type]);
    if (type === "colors") {
        unique = unique.flat();
    }
    return ["all", ...new Set(unique)];
    // const allColors = data.flatMap((item) => item.colors);
    // console.log(allColors);
};
