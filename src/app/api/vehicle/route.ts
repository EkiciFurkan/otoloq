// src/app/api/vehicle/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const step = searchParams.get("step");

		// Bağımsız sorgu parametresi - renk vb. için
		const independentQuery = searchParams.get("independentQuery");

		// Eğer renk için bağımsız bir sorgu istendiyse
		if (independentQuery === "colors") {
			// Doğrudan tüm renkleri getir
			const colors = await prisma.color.findMany({
				orderBy: { name: "asc" }
			});

			return NextResponse.json({
				type: "colors",
				data: colors
			});
		}

		// Normal hiyerarşi sorgusu için diğer parametreleri al
		const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
		const brandId = searchParams.get("brandId") ? parseInt(searchParams.get("brandId")!) : undefined;
		const modelId = searchParams.get("modelId") ? parseInt(searchParams.get("modelId")!) : undefined;
		const versionId = searchParams.get("versionId") ? parseInt(searchParams.get("versionId")!) : undefined;
		const bodyTypeId = searchParams.get("bodyTypeId") ? parseInt(searchParams.get("bodyTypeId")!) : undefined;
		const fuelTypeId = searchParams.get("fuelTypeId") ? parseInt(searchParams.get("fuelTypeId")!) : undefined;
		const transmissionTypeId = searchParams.get("transmissionTypeId") ? parseInt(searchParams.get("transmissionTypeId")!) : undefined;
		const colorId = searchParams.get("colorId") ? parseInt(searchParams.get("colorId")!) : undefined;
		const kilometer = searchParams.get("kilometer") ? parseInt(searchParams.get("kilometer")!) : undefined;
		const accidentStatus = searchParams.get("accidentStatus");
		const accidentAmount = searchParams.get("accidentAmount") ? parseFloat(searchParams.get("accidentAmount")!) : undefined;

		// Adım değerine göre sorguları ayarla
		switch (step) {
			case "yıl":
				// Yıl için sorgu - kullanılabilir yılları getir
				// Bu mevcut gerçek verilere dayalı olabilir veya hardcoded bir liste
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
				// Renk adımı - hiyerarşiden bağımsız olarak tüm renkleri getir
				const colors = await prisma.color.findMany({
					orderBy: { name: "asc" }
				});

				return NextResponse.json({
					type: "colors",
					data: colors
				});

			// Kilometre ve kaza durumu için ayrı formlar kullanılacağından API sorgusu gerekmez

			default:
				// Tüm seçimler tamamlandıysa araçları getir
				if (
					year && brandId && modelId && versionId && bodyTypeId &&
					fuelTypeId && transmissionTypeId && colorId &&
					kilometer !== undefined && accidentStatus
				) {
					// Sorgu koşullarını hazırla
					const accidentCondition: any = {
						status: accidentStatus,
						colorMileage: {
							colorId,
							mileage: {
								// Kilometre değeri ile aralık sorgusu (yaklaşık +/- %20 tolerans ile)
								minKm: { lte: Math.round(kilometer * 1.2) }, // %20 daha yüksek
								maxKm: { gte: Math.round(kilometer * 0.8) }, // %20 daha düşük
								vehicleYear: {
									year,
									transmissionTypeFuel: {
										transmissionTypeId,
										fuelBody: {
											fuelTypeId,
											bodyVersion: {
												bodyTypeId,
												versionId
											}
										}
									}
								}
							}
						}
					};

					// Kaza durumu "Exists" ve hasar tutarı belirtilmişse
					if (accidentStatus === "Exists" && accidentAmount !== undefined) {
						accidentCondition.amount = accidentAmount;
					}

					const vehicles = await prisma.vehicle.findMany({
						where: {
							accidentRecord: accidentCondition
						},
						include: {
							accidentRecord: {
								include: {
									colorMileage: {
										include: {
											color: true,
											mileage: {
												include: {
													vehicleYear: {
														include: {
															transmissionTypeFuel: {
																include: {
																	transmissionType: true,
																	fuelBody: {
																		include: {
																			fuelType: true,
																			bodyVersion: {
																				include: {
																					bodyType: true,
																					version: {
																						include: {
																							model: {
																								include: {
																									brand: true
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						},
						orderBy: { price: "asc" }
					});

					return NextResponse.json({
						type: "vehicles",
						data: vehicles
					});
				}

				return NextResponse.json({
					type: "error",
					message: "Geçersiz adım veya eksik parametreler"
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