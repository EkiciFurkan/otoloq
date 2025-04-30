// src/app/api/vehicle/offer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { selections, displayValues } = body;

		// Teklifi veritabanına kaydet
		// Not: Bu örnek implementasyon, gerçek proje ihtiyaçlarına göre düzenlenmelidir
		// Gerçek implementasyonda önce kullanıcı bilgileri, iletişim detayları da alınabilir

		// Örnek bir teklif oluşturma
		const offer = await prisma.vehicleOffer.create({
			data: {
				year: selections.year,
				brandId: selections.brandId,
				modelId: selections.modelId,
				versionId: selections.versionId,
				bodyTypeId: selections.bodyTypeId,
				fuelTypeId: selections.fuelTypeId,
				transmissionTypeId: selections.transmissionTypeId,
				colorId: selections.colorId,
				kilometer: selections.kilometer,
				accidentStatus: selections.accidentStatus,
				accidentAmount: selections.accidentAmount,
				// Opsiyonel olarak görünen değerleri JSON olarak saklayabiliriz
				displayValues: JSON.stringify(displayValues),
				// Varsayılan durumu "Beklemede" olarak ayarla
				status: "PENDING",
				// Kullanıcı bilgileri (gerçek uygulamada kullanıcı kimliği buraya eklenecek)
				userId: "anonymous", // veya auth.currentUser?.id
				// Timestamp olarak şu anki zamanı kullan
				createdAt: new Date(),
			},
		});

		return NextResponse.json({
			success: true,
			message: "Teklif başarıyla oluşturuldu",
			offerId: offer.id
		});
	} catch (error) {
		console.error("Teklif oluşturma hatası:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Teklif oluşturulurken bir hata oluştu"
			},
			{ status: 500 }
		);
	}
}