// app/api/models/route.ts

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Sunucu tarafındaki API mantığınızı import edin
// Dosya yolunu app/api/models/route.ts'den '../../../api/routes/models.ts'e ulaşacak şekilde ayarlayın
import { modelApi } from '../routes/models'; // modelApi'nizde findByVehicleTypeAndYearAndBrand fonksiyonu olduğunu varsayıyoruz

export async function GET(request: NextRequest) {
	try {
		// Sorgu parametrelerinden vehicleTypeId, yearId ve brandId'yi al
		const searchParams = request.nextUrl.searchParams;
		const vehicleTypeIdString = searchParams.get('vehicleTypeId');
		const yearIdString = searchParams.get('yearId');
		const brandIdString = searchParams.get('brandId');


		// Parametrelerin gelip gelmediğini ve geçerli sayıya çevrilebilir olup olmadığını kontrol et
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

		// Sunucu tarafındaki modelApi'nin filtreleme fonksiyonunu çağır
		// Bu fonksiyonun vehicleTypeId, yearId ve brandId'ye göre modelleri getirdiğini varsayıyoruz
		const models = await modelApi.findByVehicleTypeAndYearAndBrand(vehicleTypeId, yearId, brandId);

		// Başarılı yanıtı dön
		return NextResponse.json(models, { status: 200 });

	} catch (error) {
		console.error("Route Handler /api/models - Modeller alınırken hata oluştu:", error);
		// Hata durumunda 500 Internal Server Error dön
		return NextResponse.json(
			{ message: 'Modeller yüklenirken bir hata oluştu.' },
			{ status: 500 }
		);
	}
}