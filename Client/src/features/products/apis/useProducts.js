import useFetchQuery from "../../../hooks/useFetchQuery";

export const useNewArrival=()=>{
    return useFetchQuery("/products?sort=newest&limit=5", ["products", "new_arrivals"], {
        selectData: (data) => data.docs,
    })
}

export const useGetProducts=(filters = {})=>{
    const {
        search = "",
        minPrice = "",
        maxPrice = "",
        sort = "",
        page = "",
        limit = "",
        category = "",
        available = "",
    } = filters;

    return useFetchQuery(
        `/products?sort=${sort}&limit=${limit}&maxPrice=${maxPrice}&minPrice=${minPrice}&search=${search}&page=${page}&category=${category}&available=${available}`,
        ["products", filters]
    )
}

export const useGetSindgleProduct=(id)=>{
    return useFetchQuery(`/products/${id}`, ["products", id])
}

export const useSuggestProduct=(category,productId)=>{
return useFetchQuery(`/products?category=${category}&limit=5`, ["products", "suggested",category], {
        enabled:!!category,
        selectData: (data) => {
            const products = data?.docs || [];
            const filteredProduct = products.filter((product) => product._id !== productId);
            return { docs: filteredProduct.slice(0, 4) };
        },
    })
}
