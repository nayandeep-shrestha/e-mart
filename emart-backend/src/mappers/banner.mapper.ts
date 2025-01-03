import {
  BannerProductQueryResponse,
  BannerProductResponse,
} from "../models/banner.model";

export const bannerMapper = (
  banner: BannerProductQueryResponse
): BannerProductResponse => ({
  id: banner.id,
  name: banner.name,
  userId: banner.userId,
  imageLink: banner.imageLink,
  createdAt: banner.createdAt,
  updatedAt: banner.updatedAt,

});

// export Map Banner
export const mapBanner = (
  bannerList: BannerProductQueryResponse[]
): BannerProductResponse[] => {
  if (!bannerList) {
    console.error("Banner list is undefined or null");
    return [];
  }
  return bannerList.map((item) => ({
    id: item.id,
    name: item.name,
    userId: item.userId,
    imageLink: item.imageLink,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    product_banner: item.product_banner
      ? item.product_banner.map((banner) => ({
          product: banner.product,
        }))
      : [],
    category_banner: item.category_banner
      ? item.category_banner.map((banner) => ({
          category: banner.category,
        }))
      : [],
  }));
};
