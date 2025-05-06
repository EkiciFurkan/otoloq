// src/api/routes/models.ts
import { prisma } from "../client";

interface Model {
	id: number;
	name: string;
}

export const modelApi = {
	getByBrand: async (brandId: number) => {
		try {
			return await prisma.model.findMany({
				where: { brandId }
			});
		} catch (error) {
			console.error(`${brandId} ID'li markaya ait modeller alınırken hata oluştu:`, error);
			throw error;
		}
	},
	findByVehicleTypeAndYearAndBrand: async (vehicleTypeId: number, yearId: number, brandId: number): Promise<Model[]> => {
		try {
			const models = await prisma.model.findMany({
				where: {
					vehicleTypeId: vehicleTypeId, 
					yearId: yearId,              
					brandId: brandId,           
				},
				select: {
					id: true,
					name: true,
				},
				orderBy: { name: 'asc' }
			});
			return models;
		} catch (error) {
			console.error(`Models for vehicle type ${vehicleTypeId}, year ID ${yearId}, and brand ID ${brandId} alınırken hata oluştu:`, error);
			throw error;
		}
	}
};