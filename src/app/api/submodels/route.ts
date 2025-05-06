
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

import { subModelApi } from "../routes/subModels";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const modelIdString = searchParams.get("modelId");

		if (!modelIdString) {
			return NextResponse.json(
				{ message: "modelId sorgu parametresi eksik." },
				{ status: 400 } // Bad Request
			);
		}

		const modelId = parseInt(modelIdString, 10);

		if (isNaN(modelId)) {
			return NextResponse.json(
				{ message: "modelId geçerli bir sayı değil." },
				{ status: 400 } // Bad Request
			);
		}

		const subModels = await subModelApi.findByModelId(modelId);

		return NextResponse.json(subModels, { status: 200 });
	} catch (error) {
		console.error("Route Handler /api/submodels - Alt modeller alınırken hata oluştu:", error);
		return NextResponse.json(
			{ message: "Alt modeller yüklenirken bir hata oluştu." },
			{ status: 500 }
		);
	}
}