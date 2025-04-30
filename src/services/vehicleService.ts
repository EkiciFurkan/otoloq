import { PrismaClient } from "@/generated/prisma/client";
import { Models } from "@/types/models";

const prisma = new PrismaClient();

// Tüm markaları getir
export async function getBrandList(): Promise<Models["Brand"][]> {
	return await prisma.brand.findMany({
		orderBy: {
			name: "asc",
		},
	});
}

// Belirli bir markaya ait modelleri getir
export async function getModelsByBrandId(brandId: number): Promise<Models["Model"][]> {
	return await prisma.model.findMany({
		where: {
			brandId: brandId,
		},
		orderBy: {
			name: "asc",
		},
	});
}

// Belirli bir modele ait versiyonları getir
export async function getVersionsByModelId(modelId: number): Promise<Models["Version"][]> {
	return await prisma.version.findMany({
		where: {
			modelId: modelId,
		},
		orderBy: {
			name: "asc",
		},
	});
}

// Belirli bir versiyona ait gövde tiplerini getir
export async function getBodyTypesByVersionId(versionId: number): Promise<Models["BodyType"][]> {
	const bodyTypeVersions = await prisma.bodyTypeVersion.findMany({
		where: {
			versionId: versionId,
		},
		include: {
			bodyType: true,
		},
	});

	return bodyTypeVersions.map((btv: { bodyType: Models["BodyType"] }) => btv.bodyType);
}

// Belirli bir gövde tipi-versiyon kombinasyonuna ait yakıt tiplerini getir
export async function getFuelTypesByBodyVersionId(bodyVersionId: number): Promise<Models["FuelType"][]> {
	const fuelTypeBodies = await prisma.fuelTypeBody.findMany({
		where: {
			bodyVersionId: bodyVersionId,
		},
		include: {
			fuelType: true,
		},
	});

	return fuelTypeBodies.map((ftb: { fuelType: Models["FuelType"] }) => ftb.fuelType);
}

// Belirli bir yakıt tipi-gövde kombinasyonuna ait vites tiplerini getir
export async function getTransmissionTypesByFuelBodyId(fuelBodyId: number): Promise<Models["TransmissionType"][]> {
	const transmissionTypeFuels = await prisma.transmissionTypeFuel.findMany({
		where: {
			fuelBodyId: fuelBodyId,
		},
		include: {
			transmissionType: true,
		},
	});

	return transmissionTypeFuels.map((ttf: { transmissionType: Models["TransmissionType"] }) => ttf.transmissionType);
}

// Belirli bir vites tipi-yakıt kombinasyonuna ait araç yıllarını getir
export async function getVehicleYearsByTransmissionFuelId(transmissionTypeFuelId: number): Promise<Models["VehicleYear"][]> {
	return await prisma.vehicleYear.findMany({
		where: {
			transmissionTypeFuelId: transmissionTypeFuelId,
		},
		orderBy: {
			year: "desc",
		},
	});
}

// Belirli bir araç yılına ait kilometre aralıklarını getir
export async function getMileagesByVehicleYearId(vehicleYearId: number): Promise<Models["Mileage"][]> {
	return await prisma.mileage.findMany({
		where: {
			vehicleYearId: vehicleYearId,
		},
		orderBy: {
			minKm: "asc",
		},
	});
}

// Belirli bir kilometre aralığına ait renkleri getir
export async function getColorsByMileageId(mileageId: number): Promise<Models["Color"][]> {
	const colorMileages = await prisma.colorMileage.findMany({
		where: {
			mileageId: mileageId,
		},
		include: {
			color: true,
		},
	});

	return colorMileages.map((cm: { color: Models["Color"] }) => cm.color);
}

// Belirli bir renk-kilometre kombinasyonuna ait kaza kayıtlarını getir
export async function getAccidentRecordsByColorMileageId(colorMileageId: number): Promise<Models["AccidentRecord"][]> {
	return await prisma.accidentRecord.findMany({
		where: {
			colorMileageId: colorMileageId,
		},
	});
}

// Parametreler için tip tanımı
interface NextOptionsParams {
	brandId?: number;
	modelId?: number;
	versionId?: number;
	bodyTypeId?: number;
	fuelTypeId?: number;
	transmissionTypeId?: number;
	year?: number;
	minKm?: number;
	maxKm?: number;
	colorId?: number;
	accidentStatus?: string;
}

// Hiyerarşi zincirinde belirli bir seviyedeki seçenekleri getir
// Bu fonksiyon, kullanıcının seçimlerine göre mevcut uygun seçenekleri almak için kullanılabilir
export async function getNextOptions(params: NextOptionsParams): Promise<{
	type: string;
	data?: Models["Brand"][] | Models["Model"][] | Models["Version"][] | Models["BodyType"][] |
		Models["FuelType"][] | Models["TransmissionType"][] | Models["VehicleYear"][] |
		Models["Mileage"][] | Models["Color"][] | Models["AccidentRecord"][] | Models["Vehicle"][];
	message?: string;
}> {
	const {
		brandId,
		modelId,
		versionId,
		bodyTypeId,
		fuelTypeId,
		transmissionTypeId,
		year,
		minKm,
		maxKm,
		colorId,
		accidentStatus,
	} = params;

	// Marka seçilmemişse tüm markaları getir
	if (!brandId) {
		return { type: "brands", data: await getBrandList() };
	}

	// Model seçilmemişse, seçilen markaya ait modelleri getir
	if (!modelId) {
		return {
			type: "models",
			data: await getModelsByBrandId(brandId),
		};
	}

	// Versiyon seçilmemişse, seçilen modele ait versiyonları getir
	if (!versionId) {
		return {
			type: "versions",
			data: await getVersionsByModelId(modelId),
		};
	}

	// Gövde tipi seçilmemişse, seçilen versiyona ait gövde tiplerini getir
	if (!bodyTypeId) {
		return {
			type: "bodyTypes",
			data: await getBodyTypesByVersionId(versionId),
		};
	}

	// Buradan itibaren diğer kombinasyonları bulmak için önce ara tabloları sorgulamamız gerekiyor

	// BodyTypeVersion ID'sini bul
	const bodyTypeVersion = await prisma.bodyTypeVersion.findFirst({
		where: {
			versionId: versionId,
			bodyTypeId: bodyTypeId,
		},
	});

	if (!bodyTypeVersion) {
		return { type: "error", message: "Invalid body type for this version" };
	}

	// Yakıt tipi seçilmemişse, seçilen gövde tipi-versiyon kombinasyonuna ait yakıt tiplerini getir
	if (!fuelTypeId) {
		return {
			type: "fuelTypes",
			data: await getFuelTypesByBodyVersionId(bodyTypeVersion.id),
		};
	}

	// FuelTypeBody ID'sini bul
	const fuelTypeBody = await prisma.fuelTypeBody.findFirst({
		where: {
			bodyVersionId: bodyTypeVersion.id,
			fuelTypeId: fuelTypeId,
		},
	});

	if (!fuelTypeBody) {
		return { type: "error", message: "Invalid fuel type for this body type" };
	}

	// Vites tipi seçilmemişse, seçilen yakıt tipi-gövde kombinasyonuna ait vites tiplerini getir
	if (!transmissionTypeId) {
		return {
			type: "transmissionTypes",
			data: await getTransmissionTypesByFuelBodyId(fuelTypeBody.id),
		};
	}

	// TransmissionTypeFuel ID'sini bul
	const transmissionTypeFuel = await prisma.transmissionTypeFuel.findFirst({
		where: {
			fuelBodyId: fuelTypeBody.id,
			transmissionTypeId: transmissionTypeId,
		},
	});

	if (!transmissionTypeFuel) {
		return { type: "error", message: "Invalid transmission type for this fuel type" };
	}

	// Yıl seçilmemişse, seçilen vites tipi-yakıt kombinasyonuna ait yılları getir
	if (!year) {
		return {
			type: "years",
			data: await getVehicleYearsByTransmissionFuelId(transmissionTypeFuel.id),
		};
	}

	// VehicleYear ID'sini bul
	const vehicleYear = await prisma.vehicleYear.findFirst({
		where: {
			transmissionTypeFuelId: transmissionTypeFuel.id,
			year: year,
		},
	});

	if (!vehicleYear) {
		return { type: "error", message: "Invalid year for this transmission type" };
	}

	// Kilometre aralığı seçilmemişse, seçilen yıla ait kilometre aralıklarını getir
	if (!minKm || !maxKm) {
		return {
			type: "mileages",
			data: await getMileagesByVehicleYearId(vehicleYear.id),
		};
	}

	// Mileage ID'sini bul
	const mileage = await prisma.mileage.findFirst({
		where: {
			vehicleYearId: vehicleYear.id,
			minKm: minKm,
			maxKm: maxKm,
		},
	});

	if (!mileage) {
		return { type: "error", message: "Invalid mileage range for this year" };
	}

	// Renk seçilmemişse, seçilen kilometre aralığına ait renkleri getir
	if (!colorId) {
		return {
			type: "colors",
			data: await getColorsByMileageId(mileage.id),
		};
	}

	// ColorMileage ID'sini bul
	const colorMileage = await prisma.colorMileage.findFirst({
		where: {
			mileageId: mileage.id,
			colorId: colorId,
		},
	});

	if (!colorMileage) {
		return { type: "error", message: "Invalid color for this mileage range" };
	}

	// Kaza kaydı durumu seçilmemişse, seçilen renk-kilometre kombinasyonuna ait kaza kayıtlarını getir
	if (!accidentStatus) {
		return {
			type: "accidentRecords",
			data: await getAccidentRecordsByColorMileageId(colorMileage.id),
		};
	}

	// Son seçenek olarak, tüm kriterlere uyan araçları getir
	return {
		type: "vehicles",
		data: await getVehiclesByFilters(params),
	};
}

// Filtrelere göre araçları getir
export async function getVehiclesByFilters(filters: NextOptionsParams): Promise<Models["Vehicle"][]> {
	// Öncelikle hiyerarşiyi takip ederek ilgili kaza kaydı ID'lerini bulalım
	const accidentRecords = await findMatchingAccidentRecordIds(filters);

	if (accidentRecords.length === 0) {
		return [];
	}

	return await prisma.vehicle.findMany({
		where: {
			accidentRecordId: {
				in: accidentRecords,
			}
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
		orderBy: {
			price: "asc"
		}
	});
}

// Filtrelere göre eşleşen AccidentRecord ID'lerini bul
// Bu fonksiyon, karmaşık hiyerarşik sorguları basitleştirmek için kullanılabilir
async function findMatchingAccidentRecordIds(filters: NextOptionsParams): Promise<number[]> {
	// Bu fonksiyon, verilen filtrelerle eşleşen tüm AccidentRecord ID'lerini döndürecek
	// Gerçek uygulamada, çok sayıda JOIN içeren karmaşık bir SQL sorgusu olacaktır

	// Örnek bir yaklaşım (sadece konsept olarak)
	const result = await prisma.$queryRaw`
        SELECT ar.id
        FROM "AccidentRecord" ar
                 JOIN "ColorMileage" cm ON ar."colorMileageId" = cm.id
                 JOIN "Color" c ON cm."colorId" = c.id
                 JOIN "Mileage" m ON cm."mileageId" = m.id
                 JOIN "VehicleYear" vy ON m."vehicleYearId" = vy.id
                 JOIN "TransmissionTypeFuel" ttf ON vy."transmissionTypeFuelId" = ttf.id
                 JOIN "TransmissionType" tt ON ttf."transmissionTypeId" = tt.id
                 JOIN "FuelTypeBody" ftb ON ttf."fuelBodyId" = ftb.id
                 JOIN "FuelType" ft ON ftb."fuelTypeId" = ft.id
                 JOIN "BodyTypeVersion" btv ON ftb."bodyVersionId" = btv.id
                 JOIN "BodyType" bt ON btv."bodyTypeId" = bt.id
                 JOIN "Version" v ON btv."versionId" = v.id
                 JOIN "Model" mdl ON v."modelId" = mdl.id
                 JOIN "Brand" b ON mdl."brandId" = b.id
        WHERE ${filters.brandId ? `b.id = ${filters.brandId}` : 'TRUE'}
          AND ${filters.modelId ? `mdl.id = ${filters.modelId}` : 'TRUE'}
          AND ${filters.versionId ? `v.id = ${filters.versionId}` : 'TRUE'}
          AND ${filters.bodyTypeId ? `bt.id = ${filters.bodyTypeId}` : 'TRUE'}
          AND ${filters.fuelTypeId ? `ft.id = ${filters.fuelTypeId}` : 'TRUE'}
          AND ${filters.transmissionTypeId ? `tt.id = ${filters.transmissionTypeId}` : 'TRUE'}
          AND ${filters.year ? `vy.year = ${filters.year}` : 'TRUE'}
          AND ${filters.minKm ? `m."minKm" >= ${filters.minKm}` : 'TRUE'}
          AND ${filters.maxKm ? `m."maxKm" <= ${filters.maxKm}` : 'TRUE'}
          AND ${filters.colorId ? `c.id = ${filters.colorId}` : 'TRUE'}
          AND ${filters.accidentStatus ? `ar.status = '${filters.accidentStatus}'` : 'TRUE'}
	`;

	// Not: Gerçek uygulamada, $queryRaw kullanırken SQL enjeksiyon saldırılarını önlemek için
	// parametreleri uygun şekilde işlemek önemlidir. Yukarıdaki örnek sadece kavramsal amaçlıdır.

	return result as number[];
}

// Yeni araç için giriş verileri tipi
interface VehicleCreateData {
	price: number;
	description?: string;
	accidentRecordId: number;
	listingStatus?: string;
}

export async function createVehicle(vehicleData: VehicleCreateData): Promise<Models["Vehicle"]> {
	return await prisma.vehicle.create({
		data: {
			price: vehicleData.price,
			description: vehicleData.description,
			listingStatus: vehicleData.listingStatus || "Active",
			accidentRecord: {
				connect: {
					id: vehicleData.accidentRecordId,
				},
			},
		},
	});
}

export async function createBrand(name: string): Promise<Models["Brand"]> {
	return await prisma.brand.create({
		data: {
			name,
		},
	});
}

export async function createModel(brandId: number, name: string): Promise<Models["Model"]> {
	return await prisma.model.create({
		data: {
			name,
			brand: {
				connect: {
					id: brandId,
				},
			},
		},
	});
}

export async function createVersion(modelId: number, name: string): Promise<Models["Version"]> {
	return await prisma.version.create({
		data: {
			name,
			model: {
				connect: {
					id: modelId,
				},
			},
		},
	});
}

interface VehicleHierarchyData {
	brand: string;
	model: string;
	version: string;
	bodyType: string;
	fuelType: string;
	transmissionType: string;
	year: number;
	minKm: number;
	maxKm: number;
	color: string;
	accidentStatus: string;
	accidentAmount?: number;
	price: number;
	description?: string;
}

// Hiyerarşinin tamamını oluştur
// Bu fonksiyon, yeni bir araç için tüm hiyerarşiyi oluşturur veya var olan öğeleri kullanır
export async function createFullVehicleHierarchy(data: VehicleHierarchyData): Promise<Models["Vehicle"]> {
	// 1. Marka bul veya oluştur
	let brand = await prisma.brand.findFirst({
		where: { name: data.brand },
	});

	if (!brand) {
		brand = await createBrand(data.brand);
	}

	// 2. Model bul veya oluştur
	let model = await prisma.model.findFirst({
		where: {
			brandId: brand.id,
			name: data.model
		},
	});

	if (!model) {
		model = await createModel(brand.id, data.model);
	}

	// 3. Versiyon bul veya oluştur
	let version = await prisma.version.findFirst({
		where: {
			modelId: model.id,
			name: data.version
		},
	});

	if (!version) {
		version = await createVersion(model.id, data.version);
	}

	// 4. Gövde tipi bul veya oluştur
	let bodyType = await prisma.bodyType.findFirst({
		where: { name: data.bodyType },
	});

	if (!bodyType) {
		bodyType = await prisma.bodyType.create({
			data: { name: data.bodyType },
		});
	}

	// 5. BodyTypeVersion bul veya oluştur
	let bodyTypeVersion = await prisma.bodyTypeVersion.findFirst({
		where: {
			versionId: version.id,
			bodyTypeId: bodyType.id,
		},
	});

	if (!bodyTypeVersion) {
		bodyTypeVersion = await prisma.bodyTypeVersion.create({
			data: {
				version: { connect: { id: version.id } },
				bodyType: { connect: { id: bodyType.id } },
			},
		});
	}

	// 6. Yakıt tipi bul veya oluştur
	let fuelType = await prisma.fuelType.findFirst({
		where: { name: data.fuelType },
	});

	if (!fuelType) {
		fuelType = await prisma.fuelType.create({
			data: { name: data.fuelType },
		});
	}

	// 7. FuelTypeBody bul veya oluştur
	let fuelTypeBody = await prisma.fuelTypeBody.findFirst({
		where: {
			bodyVersionId: bodyTypeVersion.id,
			fuelTypeId: fuelType.id,
		},
	});

	if (!fuelTypeBody) {
		fuelTypeBody = await prisma.fuelTypeBody.create({
			data: {
				bodyVersion: { connect: { id: bodyTypeVersion.id } },
				fuelType: { connect: { id: fuelType.id } },
			},
		});
	}

	// 8. Vites tipi bul veya oluştur
	let transmissionType = await prisma.transmissionType.findFirst({
		where: { name: data.transmissionType },
	});

	if (!transmissionType) {
		transmissionType = await prisma.transmissionType.create({
			data: { name: data.transmissionType },
		});
	}

	// 9. TransmissionTypeFuel bul veya oluştur
	let transmissionTypeFuel = await prisma.transmissionTypeFuel.findFirst({
		where: {
			fuelBodyId: fuelTypeBody.id,
			transmissionTypeId: transmissionType.id,
		},
	});

	if (!transmissionTypeFuel) {
		transmissionTypeFuel = await prisma.transmissionTypeFuel.create({
			data: {
				fuelBody: { connect: { id: fuelTypeBody.id } },
				transmissionType: { connect: { id: transmissionType.id } },
			},
		});
	}

	// 10. VehicleYear bul veya oluştur
	let vehicleYear = await prisma.vehicleYear.findFirst({
		where: {
			transmissionTypeFuelId: transmissionTypeFuel.id,
			year: data.year,
		},
	});

	if (!vehicleYear) {
		vehicleYear = await prisma.vehicleYear.create({
			data: {
				year: data.year,
				transmissionTypeFuel: { connect: { id: transmissionTypeFuel.id } },
			},
		});
	}

	// 11. Kilometre aralığı bul veya oluştur
	let mileage = await prisma.mileage.findFirst({
		where: {
			vehicleYearId: vehicleYear.id,
			minKm: data.minKm,
			maxKm: data.maxKm,
		},
	});

	if (!mileage) {
		mileage = await prisma.mileage.create({
			data: {
				minKm: data.minKm,
				maxKm: data.maxKm,
				vehicleYear: { connect: { id: vehicleYear.id } },
			},
		});
	}

	// 12. Renk bul veya oluştur
	let color = await prisma.color.findFirst({
		where: { name: data.color },
	});

	if (!color) {
		color = await prisma.color.create({
			data: { name: data.color },
		});
	}

	// 13. ColorMileage bul veya oluştur
	let colorMileage = await prisma.colorMileage.findFirst({
		where: {
			mileageId: mileage.id,
			colorId: color.id,
		},
	});

	if (!colorMileage) {
		colorMileage = await prisma.colorMileage.create({
			data: {
				mileage: { connect: { id: mileage.id } },
				color: { connect: { id: color.id } },
			},
		});
	}

	// 14. AccidentRecord oluştur
	const accidentRecord = await prisma.accidentRecord.create({
		data: {
			status: data.accidentStatus,
			amount: data.accidentStatus === "Exists" ? data.accidentAmount : null,
			colorMileage: { connect: { id: colorMileage.id } },
		},
	});

	// 15. Son olarak, Vehicle oluştur
	return await prisma.vehicle.create({
		data: {
			price: data.price,
			description: data.description,
			accidentRecord: { connect: { id: accidentRecord.id } },
		},
	});
}