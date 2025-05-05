// src/api/routes/transmissionTypes.ts
import { prisma } from "../client";

export const transmissionTypeApi = {
	getAll: async () => {
		try {
			return await prisma.transmissionType.findMany();
		} catch (error) {
			console.error("Vites tipleri alınırken hata oluştu:", error);
			throw error;
		}
	}
};