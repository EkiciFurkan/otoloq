// src/api/routes/colors.ts
import { prisma } from "../client";

export const colorApi = {
	getAll: async () => {
		try {
			return await prisma.color.findMany();
		} catch (error) {
			console.error("Renkler alınırken hata oluştu:", error);
			throw error;
		}
	}
};