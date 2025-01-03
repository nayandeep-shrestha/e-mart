import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import {
  Category,
  CategoryCreatePayload,
  CategoryResponse,
  CategoryQueryResponse,
} from "../models/category.model";
import HttpException from "../models/http-exception.model";
import { categoryListMapper, categoryMapper } from "../mappers/category.mapper";

export const createCategory = async (
  categoryData: CategoryCreatePayload,
  userId: number,
  userRole: string
): Promise<CategoryResponse> => {

  if (userRole === 'admin') {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } }
    })
    if (checkUser?.manager?.roles.title !== "super admin") throw new HttpException(401, 'Unauthorized access')
  }

  const { name, status } = categoryData;
  if (!name) throw new HttpException(400, "Category name can't be blank");
  if (!status) throw new HttpException(400, "Category status can't be blank");

  const createdCategory: CategoryQueryResponse = await prisma.categories.create(
    {
      data: {
        name,
        status,
      },
    }
  );

  if (!createdCategory)
    throw new HttpException(400, "Category creation failed");
  return categoryMapper(createdCategory);
};

export const deleteCategoryById = async (
  categoryId: number,
  userId: number,
  userRole: string
): Promise<CategoryResponse> => {

  if (userRole === 'admin') {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } }
    })
    if (checkUser?.manager?.roles.title !== "super admin") throw new HttpException(401, 'Unauthorized access')
  }

  const categoryCheck = await prisma.categories.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!categoryCheck) throw new HttpException(404, "Category to be deleted not found");

  const deletedCategory: CategoryQueryResponse = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      await tx.categoryBanner.deleteMany({
        where: {
          categoryId,
        },
      });

      await tx.categories_Products.deleteMany({
        where: { categoryId },
      });

      return await tx.categories.delete({
        where: { id: categoryId },
      });
    }
  );
  return categoryMapper(deletedCategory);
};

export const getAllCategory = async (): Promise<CategoryResponse[]> => {
  const categories = await prisma.categories.findMany();
  if (!categories) throw new HttpException(404, "Categories not found");
  return categoryListMapper(categories);
};

export const updateCategory = async (
  categoryData: CategoryCreatePayload,
  categoryId: number,
  userId: number,
  userRole: string,
): Promise<CategoryResponse> => {

  if (userRole === 'admin') {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } }
    })
    if (checkUser?.manager?.roles.title !== "super admin") throw new HttpException(401, 'Unauthorized access')
  }

  const categoryCheck = await prisma.categories.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!categoryCheck)
    throw new HttpException(404, "Category to be updated not found");

  const { name, status } = categoryData;
  if (!name) throw new HttpException(400, "Category name can't be blank");
  if (!status) throw new HttpException(400, "Category status can't be blank");

  const updatedCategory: CategoryQueryResponse = await prisma.categories.update(
    {
      where: {
        id: categoryId,
      },
      data: {
        name,
        status,
      },
    }
  );

  if (!updatedCategory)
    throw new HttpException(400, "Category creation failed");
  return categoryMapper(updatedCategory);
};
