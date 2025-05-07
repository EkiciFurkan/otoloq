// src/app/api/routes/offers.ts
import { prisma } from "../client";
import type { Prisma } from "@prisma/client";
import { OfferStatus, DamageRecordStatus } from "@prisma/client";

interface ContactInput {
	fullName: string;
	phone: string;
	email?: string | null;
}

interface OfferInput {
	vehicleTypeId: number;
	yearId: number;
	brandId: number;
	modelId: number;
	subModelId: number;
	bodyTypeId: number;
	fuelTypeId: number;
	transmissionTypeId: number;
	colorId: number;
	mileage: number;
	damageRecord: string;
	damageAmount?: number | null;
	contact: ContactInput;
	notes?: string | null;
	images?: string[];
}

export const offerApi = {
	// Mevcut create metodu burada kalabilir
	create: async (data: Prisma.OfferCreateInput) => {
		try {
			return await prisma.offer.create({
				data
			});
		} catch (error) {
			console.error("Teklif oluşturulurken hata oluştu:", error);
			throw error;
		}
	},

	// Yeni metod: OfferInput nesnesinden bir teklif oluşturur ve ilişkili iletişim bilgisini de kaydeder
	createWithContact: async (input: OfferInput) => {
		try {
			// İletişim bilgilerini kaydet
			const contact = await prisma.contact.create({
				data: {
					fullName: input.contact.fullName,
					phone: input.contact.phone,
					email: input.contact.email || null
				}
			});

			// Teklif bilgilerini kaydet
			const offer = await prisma.offer.create({
				data: {
					vehicleTypeId: input.vehicleTypeId,
					yearId: input.yearId,
					brandId: input.brandId,
					modelId: input.modelId,
					subModelId: input.subModelId,
					bodyTypeId: input.bodyTypeId,
					fuelTypeId: input.fuelTypeId,
					transmissionTypeId: input.transmissionTypeId,
					colorId: input.colorId,
					mileage: input.mileage,
					damageRecord: input.damageRecord as DamageRecordStatus,
					damageAmount: input.damageAmount || null,
					contactId: contact.id,
					notes: input.notes || null,
					images: input.images || [],
					status: "PENDING" as OfferStatus
				}
			});

			return {
				offer,
				contact
			};
		} catch (error) {
			console.error("Teklif ve iletişim bilgileri oluşturulurken hata oluştu:", error);
			throw error;
		}
	},

	// İsteğe bağlı: Belirli bir ID'ye sahip teklifi getiren metod
	getById: async (id: number) => {
		try {
			return await prisma.offer.findUnique({
				where: { id },
				include: {
					vehicleType: true,
					year: true,
					brand: true,
					model: true,
					subModel: true,
					bodyType: true,
					fuelType: true,
					transmissionType: true,
					color: true,
					contact: true
				}
			});
		} catch (error) {
			console.error(`${id} ID'li teklif alınırken hata oluştu:`, error);
			throw error;
		}
	}
};