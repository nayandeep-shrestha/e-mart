import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import HttpException from "../models/http-exception.model";
import { imageUploadToFirebase } from "../utils/firebaseUpload";
import { bucket } from "../firebase";
import {
  BannerProductQueryResponse,
  BannerProductResponse,
} from "../models/banner.model";
import { bannerMapper, mapBanner } from "../mappers/banner.mapper";

// create Product + Category Banner
export const createBanner = async (
  name: string,
  userId: number,
  image: Express.Multer.File[],
  userRole: string,
  productId?: number[],
  categoryId?: number[],
): Promise<BannerProductResponse> => {

  if (userRole === 'admin' || userRole == 'staff') {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } }
    })
    if (checkUser?.manager?.roles.title !== "super admin") throw new HttpException(401, 'Unauthorized access')
  }

  if (!name) {
    throw new HttpException(400, "Name is required");
  }

  const checkUser = await prisma.users.findUnique({
    where: { id: userId },
  });
  if (!checkUser) throw new HttpException(404, "User not found");

  const imageLinks = await imageUploadToFirebase(image, "banners");
  const createData: BannerProductQueryResponse = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const bannerData = await tx.banners.create({
        data: {
          name,
          imageLink: imageLinks[0],
          userId,
        },
      });

      if (!bannerData) throw new HttpException(404, "Banner can't be created");

      await tx.productBanner.createMany({
        data: productId!.map((item) => {
          return {
            bannerId: bannerData.id,
            productId: item,
          };
        }),
      });
      await tx.categoryBanner.createMany({
        data: categoryId!.map((item) => {
          return {
            bannerId: bannerData.id,
            categoryId: item,
          };
        }),
      });
      return bannerData;
    }
  );
  return bannerMapper(createData);
};

//delete Product + Category Banner
export const deleteBanner = async (
  bannerId: number,
  userId: number,
  userRole: string
): Promise<BannerProductResponse> => {

  if (userRole === 'admin' || userRole == 'staff') {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } }
    })
    if (checkUser?.manager?.roles.title !== "super admin") throw new HttpException(401, 'Unauthorized access')
  }

  if (!bannerId) throw new HttpException(400, "Banner id can't be blank");
  const checkBanner = await prisma.banners.findUnique({
    where: {
      id: bannerId,
    },
  });
  if (!checkBanner)
    throw new HttpException(404, "Banner to be deleted not found");
  const deletedBanner: BannerProductQueryResponse = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const imageLink = checkBanner.imageLink?.split("appspot.com/").pop();

      await tx.productBanner.deleteMany({
        where: {
          bannerId: checkBanner.id,
        },
      });
      await tx.categoryBanner.deleteMany({
        where: {
          bannerId: checkBanner.id,
        },
      });

      const deleteBanner = await tx.banners.delete({
        where: {
          id: bannerId,
        },
      });
      if (!deleteBanner) throw new HttpException(404, "Data deletion failed");
      if (typeof imageLink === "string") {
        await bucket.file(imageLink).delete();
      }
      return deleteBanner;
    }
  );
  return bannerMapper(deletedBanner);
};

// get All Banner Data
export const getAllBanner = async () => {
  const banners: BannerProductQueryResponse[] = await prisma.banners.findMany({
    include: {
      product_banner: {
        select: {
          product: {
            select: {
              id: true,
            },
          },
        },
      },
      category_banner: {
        select: {
          category: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!banners || banners.length === 0) {
    throw new HttpException(404, "No banners found");
  }
  return banners;
};

export const addBanner = async (
  userId: number,
  userRole: string,
  bannerName: string,
) => {
  if (userRole === 'admin' || userRole == 'staff') {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } }
    })
    if (checkUser?.manager?.roles.title !== "super admin") throw new HttpException(401, 'Unauthorized access')
  }

  if (!bannerName) {
    throw new HttpException(400, "Name is required");
  }

  const checkUser = await prisma.users.findUnique({
    where: { id: userId },
  });
  if (!checkUser) throw new HttpException(404, "User not found");
  const bannerData = await prisma.banners.create({
    data: {
      name: bannerName,
      userId,
    },
  });
  return bannerMapper(bannerData);
}