// app/api/brands/route.ts

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Sunucu tarafındaki API mantığınızı import edin
// Dosya yolunu app/api/brands/route.ts'den '../../../api/routes/brands.ts'e ulaşacak şekilde ayarlayın
import { brandApi } from '../routes/brands';

export async function GET(request: NextRequest) {
	try {
		// Sorgu parametrelerinden vehicleTypeId ve year'ı al
		const searchParams = request.nextUrl.searchParams;
		const vehicleTypeIdString = searchParams.get('vehicleTypeId');
		const yearString = searchParams.get('year'); // Client'tan yıl değerini (örn: 2024) bekliyoruz


		// Parametrelerin gelip gelmediğini ve geçerli sayıya çevrilebilir olup olmadığını kontrol et
		if (!vehicleTypeIdString || !yearString) {
			return NextResponse.json(
				{ message: 'vehicleTypeId ve/veya year sorgu parametreleri eksik.' },
				{ status: 400 } // Bad Request
			);
		}

		const vehicleTypeId = parseInt(vehicleTypeIdString, 10);
		const year = parseInt(yearString, 10);

		if (isNaN(vehicleTypeId) || isNaN(year)) {
			return NextResponse.json(
				{ message: 'vehicleTypeId ve/veya year geçerli bir sayı değil.' },
				{ status: 400 } // Bad Request
			);
		}

		// Sunucu tarafındaki brandApi'nin findByVehicleTypeAndYear fonksiyonunu çağır
		// Bu fonksiyon, yıl değerini ve vasıta tipi ID'sini kullanarak ilgili markaları getirmeli.
		const brands = await brandApi.findByVehicleTypeAndYear(vehicleTypeId, year);

		// Başarılı yanıtı dön
		return NextResponse.json(brands, { status: 200 });

	} catch (error) {
		console.error("Route Handler /api/brands - Markalar alınırken hata oluştu:", error);
		// Hata durumunda 500 Internal Server Error dön
		return NextResponse.json(
			{ message: 'Markalar yüklenirken bir hata oluştu.' },
			{ status: 500 }
		);
	}
}