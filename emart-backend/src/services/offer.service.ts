import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import HttpException from "../models/http-exception.model";
import { OfferCreatePayload, Offers } from "../models/offers.model";
import { imageUploadToFirebase } from "../utils/firebaseUpload";
import { offerListMapper, offerMapper } from "../mappers/offer.mapper";

export const createOffer = async (
  offerData: OfferCreatePayload,
  imageList: Express.Multer.File[],
  userId: number,
  userRole: string
) => {

  let managerId: number | null = null;
  const checkUser = await prisma.users.findUnique({
    where: { id: userId },
    include: { roles: true, manager: { include: { roles: true } } },
  });

  if (userRole === "admin" || userRole == "staff") {
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
    managerId = checkUser.managerId;
  }

  const { name } = offerData;
  if (!name) throw new HttpException(400, "Offer name can't be blank");

  const imageUrls = await imageUploadToFirebase(imageList, "offers");
  const offerCreated: Offers = await prisma.offers.create({
    data: {
      name,
      image: imageUrls[0],
      usersId: typeof  managerId === "number"  ? managerId : userId,
    },
  });

  return offerMapper(offerCreated);
};

export const deleteOffer = async (
  offerId: number,
  userId: number,
  userRole: string
) => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  if (!offerId) throw new HttpException(400, "Offer id not provided");
  const checkOffer = await prisma.offers.findUnique({
    where: {
      id: offerId,
    },
  });
  if (!checkOffer) throw new HttpException(404, "Offer not found");

  const deletedOffer: Offers = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      await tx.offers_Products.deleteMany({
        where: {
          offerId,
        },
      });
      return await tx.offers.delete({
        where: {
          id: offerId,
        },
      });
    }
  );

  return offerMapper(deletedOffer);
};

export const handleOfferProduct = async (
  offerIds: number[],
  productId: number,
  userId: number,
  userRole: string
) => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  if (!offerIds) throw new HttpException(400, "Offer ids are not defined");
  if (offerIds.length > 0) {
    const checkProduct = await prisma.products.findUnique({
      where: {
        id: productId,
      },
    });
    if (!checkProduct)
      throw new HttpException(404, "Product to be updated not found");

    const existingOffers = await prisma.offers_Products.findMany({
      where: {
        productId: productId,
      },
      select: {
        offerId: true,
      },
    });
    const existingOfferIds = existingOffers.map((op) => op.offerId);

    // Determine changes
    const offersToAdd = offerIds.filter((id) => !existingOfferIds.includes(id));
    const offersToRemove = existingOfferIds.filter(
      (id) => !offerIds.includes(id)
    );

    //update the offers_product relation
    for (const offerId of offersToAdd) {
      await prisma.offers_Products.create({
        data: {
          productId: productId,
          offerId: offerId,
        },
      });
    }

    // Remove old associations
    for (const offerId of offersToRemove) {
      await prisma.offers_Products.deleteMany({
        where: {
          productId: productId,
          offerId: offerId,
        },
      });
    }

    const addedOffers = await prisma.offers_Products.findMany({
      where: {
        productId,
      },
      select: {
        offers: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return addedOffers;
  }

  await prisma.offers_Products.deleteMany({
    where: {
      productId,
    },
  });
  return true;
};

export const getOffers = async (userId: number, userRole: string) => {
  if (userRole === "admin" || userRole == "staff") {
    const checkUser = await prisma.users.findUnique({
      where: { id: userId },
      include: { manager: { include: { roles: true } } },
    });
    if (checkUser?.manager?.roles.title !== "super admin")
      throw new HttpException(401, "Unauthorized access");
  }

  const offersList: Offers[] = await prisma.offers.findMany();
  if (offersList.length <= 0) throw new HttpException(404, "No offers found");
  return offerListMapper(offersList);
};
