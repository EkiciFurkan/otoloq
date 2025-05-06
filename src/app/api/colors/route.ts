// app/api/colors/route.ts

import { NextResponse } from "next/server";

import { colorApi } from "@/app/api/routes/colors";

export async function GET(){
	try {
		const colors = await colorApi.getAll();
		return NextResponse.json(colors, { status: 200 });
	} catch (error) {
		console.error("Route Handler /api/colors - Renkler alınırken hata oluştu:", error);
		return NextResponse.json(
			{ message: "Renkler yüklenirken bir hata oluştu." },
			{ status: 500 }
		);
	}
}