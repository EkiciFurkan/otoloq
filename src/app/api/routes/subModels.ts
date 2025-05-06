import { prisma } from "../client";

interface SubModel {
	id: number;
	name: string;
}

export const subModelApi = {
	getByModel: async (modelId: number): Promise<SubModel[]> => {
		try {
			return await prisma.subModel.findMany({
				where: { modelId }
			});
		} catch (error) {
			console.error(`${modelId} ID'li modele ait alt modeller alınırken hata oluştu:`, error);
			throw error;
		}
	},

	findByModelId: async (modelId: number): Promise<SubModel[]> => {
		try {
			const subModels = await prisma.subModel.findMany({
				where: {
					modelId: modelId,
				},
				select: {
					id: true,
					name: true,
				},
				orderBy: { name: "asc" }
			});
			return subModels;
		} catch (error) {
			console.error(`Model ID ${modelId} için alt modeller alınırken hata oluştu:`, error);
			throw error;
		}
	}
};