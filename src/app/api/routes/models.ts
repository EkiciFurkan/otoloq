// src/api/routes/models.ts
import { prisma } from "../client";

interface Model {
	id: number;
	name: string;
	// Model modelinde brandId, yearId, vehicleTypeId alanları olsa da,
	// bu API'nin dönüş tipinde bunları döndürmek zorunlu değildir.
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
			// Prisma sorgusu: Model tablosunu doğrudan brandId, yearId ve vehicleTypeId alanlarına göre filtrele
			const models = await prisma.model.findMany({
				where: {
					vehicleTypeId: vehicleTypeId, // vehicleTypeId alanına göre filtrele
					yearId: yearId,               // yearId alanına göre filtrele
					brandId: brandId,             // brandId alanına göre filtrele
				},
				// Sadece id ve name alanlarını seç
				select: {
					id: true,
					name: true,
				},
				// Model isimlerini alfabetik olarak sırala (isteğe bağlı)
				orderBy: { name: 'asc' }
			});
			return models;
		} catch (error) {
			console.error(`Models for vehicle type ${vehicleTypeId}, year ID ${yearId}, and brand ID ${brandId} alınırken hata oluştu:`, error);
			throw error; // Hatayı Route Handler'a ilet
		}
	}
};