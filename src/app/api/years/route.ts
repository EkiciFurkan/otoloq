import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server'; 

import { yearApi } from '../routes/years';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const vehicleTypeIdString = searchParams.get('vehicleTypeId');

		if (!vehicleTypeIdString) {
			return NextResponse.json(
				{ message: 'vehicleTypeId sorgu parametresi eksik.' },
				{ status: 400 } // Bad Request
			);
		}

		const vehicleTypeId = parseInt(vehicleTypeIdString, 10);

		if (isNaN(vehicleTypeId)) {
			return NextResponse.json(
				{ message: 'vehicleTypeId geçerli bir sayı değil.' },
				{ status: 400 } // Bad Request
			);
		}

		const years = await yearApi.findByVehicleTypeId(vehicleTypeId);

		return NextResponse.json(years, { status: 200 });

	} catch (error) {
		console.error("Route Handler /api/years - Yıllar alınırken hata oluştu:", error);
		return NextResponse.json(
			{ message: 'Yıllar yüklenirken bir hata oluştu.' },
			{ status: 500 }
		);
	}
}