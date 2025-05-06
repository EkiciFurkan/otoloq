// app/api/transmissiontypes/route.ts
import { NextResponse } from "next/server";

import { transmissionTypeApi } from "../routes/transmissionTypes";

export async function GET() {
	try {
		const transmissionTypes = await transmissionTypeApi.getAll();
		return NextResponse.json(transmissionTypes, { status: 200 });
	} catch (error) {
		console.error("Route Handler /api/transmissiontypes - Vites tipleri alınırken hata oluştu:", error);
		return NextResponse.json(
			{ message: "Vites tipleri yüklenirken bir hata oluştu." },
			{ status: 500 }
		);
	}
}