import { NextResponse } from 'next/server';

import { vehicleTypeApi } from '../routes/vehicleTypes';

export async function GET() {
	try {
		const vehicleTypes = await vehicleTypeApi.getAll();

		return NextResponse.json(vehicleTypes, { status: 200 });

	} catch (error) {
		console.error("Route Handler /api/vehicleTypes - Vasıta tipleri alınırken hata oluştu:", error);
		return NextResponse.json(
			{ message: 'Vasısta tipleri yüklenirken bir hata oluştu.' },
			{ status: 500 }
		);
	}
}
