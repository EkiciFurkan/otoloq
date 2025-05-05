// src/api/routes/bodyTypes.ts
import { prisma } from "../client";

export const bodyTypeApi = {
	getBySubModel: async (subModelId: number) => {
		try {
			return await prisma.bodyType.findMany({
				where: { subModelId }
			});
		} catch (error) {
			console.error(`${subModelId} ID'li alt modele ait kasa tipleri alınırken hata oluştu:`, error);
			throw error;
		}
	}
};