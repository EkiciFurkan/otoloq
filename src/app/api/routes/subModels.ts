// src/api/routes/subModels.ts
import { prisma } from "../client";

export const subModelApi = {
	getByModel: async (modelId: number) => {
		try {
			return await prisma.subModel.findMany({
				where: { modelId }
			});
		} catch (error) {
			console.error(`${modelId} ID'li modele ait alt modeller alınırken hata oluştu:`, error);
			throw error;
		}
	}
};