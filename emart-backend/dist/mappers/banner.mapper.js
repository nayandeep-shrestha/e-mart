"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBanner = exports.bannerMapper = void 0;
const bannerMapper = (banner) => ({
    id: banner.id,
    name: banner.name,
    userId: banner.userId,
    imageLink: banner.imageLink,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
});
exports.bannerMapper = bannerMapper;
// export Map Banner
const mapBanner = (bannerList) => {
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
exports.mapBanner = mapBanner;
