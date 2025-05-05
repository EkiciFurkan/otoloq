// src/api/routes/offers.ts
import { prisma } from "../client";
import type { Prisma } from "@prisma/client";

export const offerApi = {
	create: async (data: Prisma.OfferCreateInput) => {
		try {
			return await prisma.offer.create({
				data
			});
		} catch (error) {
			console.error("Teklif oluşturulurken hata oluştu:", error);
			throw error;
		}
	}
};