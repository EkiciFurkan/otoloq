import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { selections, displayValues } = body;

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
				displayValues: JSON.stringify(displayValues),
				status: "PENDING",
				userId: "anonymous", 
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