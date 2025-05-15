// src/app/api/offers/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/app/api/client";
import { OfferStatus } from "@prisma/client";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id, 10);

		if (isNaN(id)) {
			return NextResponse.json({
				success: false,
				message: "Geçersiz ID formatı"
			}, { status: 400 });
		}

		const body = await request.json();

		// Güncelleme verileri
		const updateData: any = {};

		// Status güncellemesi
		if (body.status && Object.values(OfferStatus).includes(body.status as OfferStatus)) {
			updateData.status = body.status;
		}

		// Teklif miktarı güncellemesi
		if (body.offerAmount !== undefined) {
			updateData.offerAmount = body.offerAmount === "" ? null : parseFloat(body.offerAmount);
		}

		// Admin notları güncellemesi
		if (body.adminNotes !== undefined) {
			updateData.adminNotes = body.adminNotes;
		}

		// Güncelleme yapmaya değer bir alan var mı?
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json({
				success: false,
				message: "Güncellenecek veri bulunamadı"
			}, { status: 400 });
		}

		// Teklifi güncelle
		const updatedOffer = await prisma.offer.update({
			where: { id },
			data: updateData,
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

		return NextResponse.json({
			success: true,
			message: "Teklif başarıyla güncellendi",
			data: updatedOffer
		}, { status: 200 });

	} catch (error: any) {
		console.error("Teklif güncellenirken hata oluştu:", error);

		return NextResponse.json({
			success: false,
			message: "Teklif güncellenirken bir hata oluştu",
			error: error.message
		}, { status: 500 });
	}
}