// src/api/routes/years.ts
import { prisma } from "../client";

export const yearApi = {
	getByVehicleType: async (vehicleTypeId: number) => {
		try {
			return await prisma.year.findMany({
				where: { vehicleTypeId }
			});
		} catch (error) {
			console.error(`${vehicleTypeId} ID'li vasıta tipine ait yıllar alınırken hata oluştu:`, error);
			throw error;
		}
	},

	findByVehicleTypeId: async (vehicleTypeId: number) => {
		try {
			// Prisma ile vehicleTypeId'ye göre yılları getir
			const years = await prisma.year.findMany({
				where: { vehicleTypeId: vehicleTypeId },
				orderBy: { year: 'desc' } // Yılları büyükten küçüğe sıralayabiliriz
			});
			return years;
		} catch (error) {
			console.error(`${vehicleTypeId} ID'li vasıta tipi için yıllar alınırken hata oluştu:`, error);
			throw error; // Hatayı Route Handler'a ilet
		}
	}
};