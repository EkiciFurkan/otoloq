// app/api/models/route.ts

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

import { modelApi } from '../routes/models';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const vehicleTypeIdString = searchParams.get('vehicleTypeId');
		const yearIdString = searchParams.get('yearId');
		const brandIdString = searchParams.get('brandId');


		if (!vehicleTypeIdString || !yearIdString || !brandIdString) {
			return NextResponse.json(
				{ message: 'vehicleTypeId, yearId ve/veya brandId sorgu parametreleri eksik.' },
				{ status: 400 } // Bad Request
			);
		}

		const vehicleTypeId = parseInt(vehicleTypeIdString, 10);
		const yearId = parseInt(yearIdString, 10);
		const brandId = parseInt(brandIdString, 10);


		if (isNaN(vehicleTypeId) || isNaN(yearId) || isNaN(brandId)) {
			return NextResponse.json(
				{ message: 'vehicleTypeId, yearId ve/veya brandId geçerli bir sayı değil.' },
				{ status: 400 } // Bad Request
			);
		}

		const models = await modelApi.findByVehicleTypeAndYearAndBrand(vehicleTypeId, yearId, brandId);

		return NextResponse.json(models, { status: 200 });

	} catch (error) {
		console.error("Route Handler /api/models - Modeller alınırken hata oluştu:", error);
		return NextResponse.json(
			{ message: 'Modeller yüklenirken bir hata oluştu.' },
			{ status: 500 }
		);
	}
}