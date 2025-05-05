import { prisma } from "../client";

export const vehicleTypeApi = {
	getAll: async () => {
		try {
			return await prisma.vehicleType.findMany();
		} catch (error) {
			console.error("Vasıta tipleri alınırken hata oluştu:", error);
			throw error;
		}
	},

	getById: async (id: number) => {
		try {
			return await prisma.vehicleType.findUnique({
				where: { id }
			});
		} catch (error) {
			console.error(`${id} ID'li vasıta tipi alınırken hata oluştu:`, error);
			throw error;
		}
	}
};