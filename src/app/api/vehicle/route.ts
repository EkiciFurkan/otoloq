// src/app/api/vehicle/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const step = searchParams.get("step");

		// Bağımsız sorgu parametresi - renk vb. için
		const independentQuery = searchParams.get("independentQuery");

		// Eğer renk için bağımsız bir sorgu istendiyse (adım 7)
		if (independentQuery === "colors" && step === "renk") {
			// Doğrudan tüm renkleri getir
			const colors = await prisma.color.findMany({
				orderBy: { name: "asc" }
			});

			return NextResponse.json({
				type: "colors",
				data: colors
			});
		}

		const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
		const brandId = searchParams.get("brandId") ? parseInt(searchParams.get("brandId")!) : undefined;
		const modelId = searchParams.get("modelId") ? parseInt(searchParams.get("modelId")!) : undefined;
		const versionId = searchParams.get("versionId") ? parseInt(searchParams.get("versionId")!) : undefined;
		const bodyTypeId = searchParams.get("bodyTypeId") ? parseInt(searchParams.get("bodyTypeId")!) : undefined;
		const fuelTypeId = searchParams.get("fuelTypeId") ? parseInt(searchParams.get("fuelTypeId")!) : undefined;
		const transmissionTypeId = searchParams.get("transmissionTypeId") ? parseInt(searchParams.get("transmissionTypeId")!) : undefined;

		switch (step) {
			case "yıl":
				const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024]; // Örnek veri
				return NextResponse.json({
					type: "years",
					data: years.map(year => ({ year }))
				});

			case "marka":
				// Marka listesi
				const brands = await prisma.brand.findMany({
					orderBy: { name: "asc" }
				});
				return NextResponse.json({
					type: "brands",
					data: brands
				});

			case "model":
				// Belirli bir markaya ait modeller
				if (!brandId) {
					return NextResponse.json({
						type: "error",
						message: "Marka seçimi yapılmadı"
					});
				}

				const models = await prisma.model.findMany({
					where: { brandId },
					orderBy: { name: "asc" }
				});
				return NextResponse.json({
					type: "models",
					data: models
				});

			case "versiyon":
				// Belirli bir modele ait versiyonlar
				if (!modelId) {
					return NextResponse.json({
						type: "error",
						message: "Model seçimi yapılmadı"
					});
				}

				const versions = await prisma.version.findMany({
					where: { modelId },
					orderBy: { name: "asc" }
				});
				return NextResponse.json({
					type: "versions",
					data: versions
				});

			case "gövde tipi":
				// Belirli bir versiyona ait gövde tipleri
				if (!versionId) {
					return NextResponse.json({
						type: "error",
						message: "Versiyon seçimi yapılmadı"
					});
				}

				const bodyTypes = await prisma.bodyType.findMany({
					where: {
						versions: {
							some: {
								versionId
							}
						}
					},
					orderBy: { name: "asc" }
				});
				return NextResponse.json({
					type: "bodyTypes",
					data: bodyTypes
				});

			case "yakıt tipi":
				// Belirli bir gövde tipine ait yakıt tipleri
				if (!bodyTypeId || !versionId) {
					return NextResponse.json({
						type: "error",
						message: "Gövde tipi seçimi yapılmadı"
					});
				}

				const bodyVersion = await prisma.bodyTypeVersion.findFirst({
					where: {
						bodyTypeId,
						versionId
					}
				});

				if (!bodyVersion) {
					return NextResponse.json({
						type: "error",
						message: "Geçersiz gövde tipi"
					});
				}

				const fuelTypes = await prisma.fuelType.findMany({
					where: {
						bodyTypes: {
							some: {
								bodyVersionId: bodyVersion.id
							}
						}
					},
					orderBy: { name: "asc" }
				});
				return NextResponse.json({
					type: "fuelTypes",
					data: fuelTypes
				});

			case "vites tipi":
				// Belirli bir yakıt tipine ait vites tipleri
				if (!fuelTypeId || !bodyTypeId || !versionId) {
					return NextResponse.json({
						type: "error",
						message: "Yakıt tipi seçimi yapılmadı"
					});
				}

				const bodyVersion2 = await prisma.bodyTypeVersion.findFirst({
					where: {
						bodyTypeId,
						versionId
					}
				});

				if (!bodyVersion2) {
					return NextResponse.json({
						type: "error",
						message: "Geçersiz gövde tipi"
					});
				}

				const fuelBody = await prisma.fuelTypeBody.findFirst({
					where: {
						bodyVersionId: bodyVersion2.id,
						fuelTypeId
					}
				});

				if (!fuelBody) {
					return NextResponse.json({
						type: "error",
						message: "Geçersiz yakıt tipi"
					});
				}

				const transmissionTypes = await prisma.transmissionType.findMany({
					where: {
						fuelTypes: {
							some: {
								fuelBodyId: fuelBody.id
							}
						}
					},
					orderBy: { name: "asc" }
				});
				return NextResponse.json({
					type: "transmissionTypes",
					data: transmissionTypes
				});

			case "renk":
				// Renk adımı - Bu case artık bağımsız sorgu ile yukarıda işleniyor.
				// Eğer buraya düşerse, bağımsız sorgu parametresi eksik demektir.
				return NextResponse.json({
					type: "error",
					message: "Renk sorgusu için bağımsız parametre eksik"
				});


			// Kilometre, kaza durumu, iletişim bilgileri ve onay adımları bu API route'u tarafından
			// sadece GET isteğiyle seçenek sunmak için kullanılmaz.
			// Teklif oluşturma (POST) yeni bir route'ta işlenecek.

			default:
				return NextResponse.json({
					type: "error",
					message: "Geçersiz adım"
				});
		}
	} catch (error) {
		console.error("API hatası:", error);
		return NextResponse.json(
			{
				type: "error",
				message: "Bir hata oluştu"
			},
			{ status: 500 }
		);
	}
}

// POST isteği için ayrı bir route oluşturulacak (örneğin src/app/api/vehicle/offer/route.ts)
// Bu route, VehicleSelectorContainer component'inden gelen POST isteğini işleyecek.

// src/app/api/vehicle/offer/route.ts (Yeni dosya oluşturulacak)
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function POST(request: NextRequest) {
//     try {
//         const { selections, displayValues } = await request.json();

//         // selections objesi artık tüm bilgileri içeriyor:
//         // year, brandId, modelId, versionId, bodyTypeId, fuelTypeId, transmissionTypeId,
//         // colorId, kilometer, accidentStatus, accidentAmount (varsa), fullName, email, phoneNumber

//         // Basic validation (more detailed validation can be added)
//         if (!selections || !selections.fullName || !selections.email || !selections.phoneNumber || selections.kilometer === undefined || !selections.accidentStatus) {
//             return NextResponse.json({ success: false, message: "Eksik bilgi gönderildi." }, { status: 400 });
//         }

//         // Burada Prisma kullanarak alınan bilgileri veritabanına kaydedebilirsiniz.
//         // Örneğin, yeni bir Offer veya Lead tablosuna kaydedilebilir.

//         // Örnek: Bir Teklif tablosuna kaydetme
//         // const newOffer = await prisma.offer.create({
//         //     data: {
//         //         ...selections, // Tüm seçimleri kaydet
//         //         // İlişkili verileri ID'ler üzerinden bağlayabilirsiniz
//         //         brand: { connect: { id: selections.brandId } },
//         //         model: { connect: { id: selections.modelId } },
//         //         version: { connect: { id: selections.versionId } },
//         //         bodyType: { connect: { id: selections.bodyTypeId } },
//         //         fuelType: { connect: { id: selections.fuelTypeId } },
//         //         transmissionType: { connect: { id: selections.transmissionTypeId } },
//         //         color: { connect: { id: selections.colorId } },
//         //         // accidentAmount, fullName, email, phoneNumber directly
//         //     },
//         // });


//         // Başarılı yanıt dön
//         return NextResponse.json({ success: true, message: "Teklifiniz başarıyla alındı." });

//     } catch (error) {
//         console.error("Teklif POST hatası:", error);
//         return NextResponse.json(
//             { success: false, message: "Teklif oluşturulurken bir hata oluştu." },
//             { status: 500 }
//         );
//     }
// }