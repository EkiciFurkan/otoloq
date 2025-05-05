// src/api/routes/fuelTypes.ts
import { prisma } from "../client";

export const fuelTypeApi = {
	getByBodyType: async (bodyTypeId: number) => {
		try {
			return await prisma.fuelType.findMany({
				where: { bodyTypeId }
			});
		} catch (error) {
			console.error(`${bodyTypeId} ID'li kasa tipine ait yakıt tipleri alınırken hata oluştu:`, error);
			throw error;
		}
	}
};