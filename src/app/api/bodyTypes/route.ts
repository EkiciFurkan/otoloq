import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

import { bodyTypeApi } from "../routes/bodyTypes";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const subModelIdString = searchParams.get("subModelId");

		if (!subModelIdString) {
			return NextResponse.json(
				{ message: "subModelId sorgu parametresi eksik." },
				{ status: 400 } // Bad Request
			);
		}

		const subModelId = parseInt(subModelIdString, 10);

		if (isNaN(subModelId)) {
			return NextResponse.json(
				{ message: "subModelId geçerli bir sayı değil." },
				{ status: 400 } // Bad Request
			);
		}

		const bodyTypes = await bodyTypeApi.findBySubModelId(subModelId);

		return NextResponse.json(bodyTypes, { status: 200 });
	} catch (error) {
		console.error("Route Handler /api/bodytypes - Gövde tipleri alınırken hata oluştu:", error);
		return NextResponse.json(
			{ message: "Gövde tipleri yüklenirken bir hata oluştu." },
			{ status: 500 }
		);
	}
}