import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const updateCategoriesProducts = async (categoryIds: number[], productId: number) => {
    const existingCategories = await prisma.categories_Products.findMany({
        where: {
            productId: productId
        },
        select: {
            categoryId: true
        }
    });

    const existingCategoryIds = existingCategories.map(cp => cp.categoryId);
    // Determine changes
    const categoriesToAdd = categoryIds.filter(id => !existingCategoryIds.includes(id));
    const categoriesToRemove = existingCategoryIds.filter(id => !categoryIds.includes(id));

    //update the categories_product relation
    for (const categoryId of categoriesToAdd) {
        await prisma.categories_Products.create({
            data: {
                productId: productId,
                categoryId: categoryId
            }
        });
    }

    // Remove old associations
    for (const categoryId of categoriesToRemove) {
        await prisma.categories_Products.deleteMany({
            where: {
                productId: productId,
                categoryId: categoryId
            }
        });
    }
    return true
}
