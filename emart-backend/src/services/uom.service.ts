import HttpException from "../models/http-exception.model";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const identifyUnit = async (productId: number, unitType: string) => {
    const validType: string[] = ['piece', 'bora', 'kg', 'carton']

    if (!productId) throw new HttpException(400, "Product id is not defined")
    if (!unitType) throw new HttpException(400, "Unit type is not defined")
    if (!validType.includes(unitType.toLowerCase())) throw new HttpException(400, "Invalid unit type")

    const checkProduct = await prisma.products.findUnique({
        where: {
            id: productId
        }
    })
    if (!checkProduct) throw new HttpException(404, "Product not found")

    const selectedFields = {
        id: true,
        [unitType.toLowerCase()]: true,
    };

    const result = await prisma.uOM.findUnique({
        where: { productId },
        select: selectedFields,
    });
    if(!result) throw new HttpException(404, 'Unit not recognized')
    return result
}