import { UOM } from "@prisma/client";
import { Category } from "./category.model";
import { Details } from "./detail.model";
import { Images } from "./image.model";
import { Stocks } from "./stock.model";
import { Store } from "./store.model";
import { Offers } from "./offers.model";

export interface Products {
  id: number;
  categoryId: number[];
  categoryName: string[];
  images: string[];
  name: string;
  description: string | null;
  quantity?: number;
  path: string[];
  product_id: number;
  price: number
  code: string,
  tags: string | null;
  piece: number | null;
  bora: number | null;
  carton: number | null;
  kg: number |null
  category: Category[];
  stocks: Stocks;
  stores?: Store,
  details: Details;
  uom: UOM;
  offers: Offers[];
  offerDetail: Pick<Offers, 'id' | 'name' | 'image'>[]
}

export type ProductCreatePayload = Omit<Products, "category" | "categoryName" | "stocks" | "images" | "details" | 'path' | 'productId' | 'stores' | 'uom'>;

export type ProductResponse = Pick<Products, 'id' | "name" | "description" | "quantity" | "path" | "categoryName" | 'price' | 'bora' | 'tags' | 'code' | 'piece' | 'carton' | 'kg' | 'offerDetail'>;

export type ProductQueryResponse = Pick<Products, 'id' | "stocks" | "images" | "details" | "category" | 'uom' | 'offers'>;

export type ProductDeleteQuery = Pick<ProductQueryResponse,  "details" | "uom">;
export type ProductDeleteResponse = Pick<ProductResponse, 'name' | 'description' | 'price' | 'bora' | 'tags' | 'code' | 'piece' | 'carton' | 'kg' >

 