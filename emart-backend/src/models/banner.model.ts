export interface Banner {
  id: number;
  name: string;
  imageLink: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  product_banner?: ProductBanner[];
  category_banner?:CategoryBanner[];
}

export interface ProductBanner {
  product:{id: number};
}
export interface CategoryBanner {
  category:{id: number};
}

export type BannerCreateProductPayload = Pick<
  Banner,
  "name" |'imageLink' 
>;
export type BannerProductResponse = Banner;
export type BannerProductQueryResponse = Banner;