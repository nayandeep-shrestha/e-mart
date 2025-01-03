import { ProductDeleteQuery, ProductQueryResponse, ProductResponse, ProductDeleteResponse } from "../models/product.model";

export const productMapper = (product: ProductQueryResponse): ProductResponse => ({
  id: product.id,
  name: product.details.name,
  description: product.details.description,
  quantity: product.stocks.quantity,
  price: product.details.price,
  code: product.details.code,
  tags: product.details.tags,
  piece: product.uom.piece,
  bora: product.uom.bora,
  carton: product.uom.carton,
  kg: product.uom.kg,
  path: product.images,
  categoryName: product.category.map(item=> item.name),
  offerDetail: product.offers.map(({ createdAt, updatedAt, usersId, ...rest }) => rest)
});

export const productDeleteMapper = (product: ProductDeleteQuery) : ProductDeleteResponse =>({
  name: product.details.name,
  description: product.details.description,
  price: product.details.price,
  code: product.details.code,
  tags: product.details.tags,
  piece: product.uom.piece,
  bora: product.uom.bora,
  carton: product.uom.carton,
  kg: product.uom.kg,
})