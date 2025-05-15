// src/app/api/offers/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { offerApi } from "../routes/offers";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Veri doğrulama
		if (!body.vehicleTypeId || !body.yearId || !body.brandId || !body.modelId ||
			!body.subModelId || !body.bodyTypeId || !body.fuelTypeId ||
			!body.transmissionTypeId || !body.colorId) {
			return NextResponse.json({
				success: false,
				message: "Tüm araç bilgileri gereklidir"
			}, { status: 400 });
		}

		if (!body.mileage || body.mileage < 0) {
			return NextResponse.json({
				success: false,
				message: "Geçerli bir kilometre değeri girilmelidir"
			}, { status: 400 });
		}

		if (!body.damageRecord) {
			return NextResponse.json({
				success: false,
				message: "Tramer kaydı bilgisi gereklidir"
			}, { status: 400 });
		}

		if (body.damageRecord === "EXISTS" && !body.damageAmount) {
			return NextResponse.json({
				success: false,
				message: "Hasar kaydı varsa hasar miktarı girilmelidir"
			}, { status: 400 });
		}

		if (!body.contact || !body.contact.fullName || !body.contact.phone) {
			return NextResponse.json({
				success: false,
				message: "İletişim bilgileri eksik"
			}, { status: 400 });
		}

		// offerApi servisini kullanarak teklif oluştur
		const result = await offerApi.createWithContact(body);

		return NextResponse.json({
			success: true,
			message: "Teklif başarıyla kaydedildi",
			data: { id: result.offer.id }
		}, { status: 201 });

	} catch (error: any) {
		console.error("Teklif kaydedilirken hata oluştu:", error);

		return NextResponse.json({
			success: false,
			message: "Teklif kaydedilirken bir hata oluştu",
			error: error.message
		}, { status: 500 });
	}
}

export async function GET() {
	try {
		const offers = await offerApi.getAllOffers();

		return NextResponse.json({
			success: true,
			data: offers
		}, { status: 200 });
	} catch (error: any) {
		console.error("Teklifler listelenirken hata oluştu:", error);

		return NextResponse.json({
			success: false,
			message: "Teklifler listelenirken bir hata oluştu",
			error: error.message
		}, { status: 500 });
	}
}