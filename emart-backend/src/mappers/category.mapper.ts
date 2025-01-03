import { Category, CategoryQueryResponse, CategoryResponse } from "../models/category.model";

export const categoryMapper = (category: CategoryQueryResponse ) : CategoryResponse => ({
    id: category.id,
    name: category.name,
    status: category.status,
})

export const categoryListMapper = (category: CategoryQueryResponse[]) :CategoryResponse[] => (
    category.map(item => ({
        id: item.id,
        name: item.name,
        status: item.status,
    }))
)