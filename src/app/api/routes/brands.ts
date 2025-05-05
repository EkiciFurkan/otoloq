// src/api/routes/brands.ts
import { prisma } from "../client";

interface Brand {
	id: number;
	name: string;
	// API'den dönen Brand objesinde Year veya VehicleType bilgisi olmaz
	// Çünkü Brand modeli artık onlara doğrudan bağlı değil.
}

export const brandApi = {
	findByVehicleTypeAndYear: async (vehicleTypeId: number, year: number): Promise<Brand[]> => {
		try {
			// Sorgu Mantığı:
			// 1. Brand (Marka) modelinden başla.
			// 2. Bu markanın ilişkili Modellerine (models) bak.
			// 3. Modellerden herhangi biri (some) aşağıdaki kriterlere uyuyorsa markayı seç:
			//    a. Modelin vehicleTypeId alanı, istenen vehicleTypeId ile eşleşiyor mu?
			//    b. Modelin ilişkili olduğu Yıl (year ilişkisi), istenen yıl değeri (year alanı) ile eşleşiyor mu?

			const brands = await prisma.brand.findMany({
				where: {
					models: { // Brand modelindeki 'models' ilişkisine bak (bir marka birçok modele sahip olabilir)
						some: { // İlişkili modellerden en az biri şu şartlara uymalı:
							// Modelin vehicleTypeId alanı, verilen vehicleTypeId ile eşleşmeli
							vehicleTypeId: vehicleTypeId,
							// Modelin 'year' ilişkisine bak (bir model bir yıla bağlıdır)
							year: {
								// İlişkili Yıl modelinin 'year' alanı, verilen yıl değeri ile eşleşmeli
								year: year // Year modelinde 'year' adında Int tipi bir alan olduğunu varsayar
							}
						}
					}
				},
				// Sorgu sonucundan sadece Marka'nın id ve name alanlarını seç
				select: {
					id: true,
					name: true,
				},
				// Farklı modeller aynı markaya ait olabileceğinden, yinelenen markaları önlemek için distinct kullan
				distinct: ['id'],
				// Markaları alfabetik olarak sırala (isteğe bağlı)
				orderBy: { name: 'asc' }
			});

			return brands;

		} catch (error) {
			// Hata oluşursa logla ve tekrar fırlat (Route Handler yakalayacaktır)
			console.error(`Brands for vehicle type ${vehicleTypeId} and year ${year} alınırken hata oluştu:`, error);
			throw error;
		}
	}
};