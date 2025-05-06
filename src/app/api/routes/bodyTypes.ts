import { prisma } from "../client";

interface BodyType {
	id: number;
	name: string;
}

export const bodyTypeApi = {
	getBySubModel: async (subModelId: number): Promise<BodyType[]> => {
		try {
			return await prisma.bodyType.findMany({
				where: { subModelId }
			});
		} catch (error) {
			console.error(`${subModelId} ID'li alt modele ait gövde tipleri alınırken hata oluştu:`, error);
			throw error;
		}
	},

	findBySubModelId: async (subModelId: number): Promise<BodyType[]> => {
		try {
			const bodyTypes = await prisma.bodyType.findMany({
				where: {
					subModelId: subModelId,
				},
				select: {
					id: true,
					name: true,
				},
				orderBy: { name: "asc" }
			});
			return bodyTypes;
		} catch (error) {
			console.error(`Alt Model ID ${subModelId} için gövde tipleri alınırken hata oluştu:`, error);
			throw error;
		}
	}
};