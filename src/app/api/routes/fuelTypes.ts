import { prisma } from "../client";

interface FuelType {
	id: number;
	name: string;
}

export const fuelTypeApi = {
	getByBodyType: async (bodyTypeId: number): Promise<FuelType[]> => {
		try {
			return await prisma.fuelType.findMany({
				where: { bodyTypeId }
			});
		} catch (error) {
			console.error(`${bodyTypeId} ID'li gövde tipine ait yakıt tipleri alınırken hata oluştu:`, error);
			throw error;
		}
	},

	findByBodyTypeId: async (bodyTypeId: number): Promise<FuelType[]> => {
		try {
			const fuelTypes = await prisma.fuelType.findMany({
				where: {
					bodyTypeId: bodyTypeId,
				},
				select: {
					id: true,
					name: true,
				},
				orderBy: { name: "asc" }
			});
			return fuelTypes;
		} catch (error) {
			console.error(`Gövde Tipi ID ${bodyTypeId} için yakıt tipleri alınırken hata oluştu:`, error);
			throw error;
		}
	}
};