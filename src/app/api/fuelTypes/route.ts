// app/api/fueltypes/route.ts

import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

import { fuelTypeApi } from "../routes/fuelTypes";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const bodyTypeIdString = searchParams.get("bodyTypeId");

		if (!bodyTypeIdString) {
			return NextResponse.json(
				{ message: "bodyTypeId sorgu parametresi eksik." },
				{ status: 400 } // Bad Request
			);
		}

		const bodyTypeId = parseInt(bodyTypeIdString, 10);

		if (isNaN(bodyTypeId)) {
			return NextResponse.json(
				{ message: "bodyTypeId geçerli bir sayı değil." },
				{ status: 400 } // Bad Request
			);
		}

		const fuelTypes = await fuelTypeApi.findByBodyTypeId(bodyTypeId);

		return NextResponse.json(fuelTypes, { status: 200 });
	} catch (error) {
		console.error("Route Handler /api/fueltypes - Yakıt tipleri alınırken hata oluştu:", error);
		return NextResponse.json(
			{ message: "Yakıt tipleri yüklenirken bir hata oluştu." },
			{ status: 500 }
		);
	}
}