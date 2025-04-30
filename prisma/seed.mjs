import {PrismaClient} from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Veritabanı seed işlemi başlıyor...");

	// Veritabanını temizleyelim (isteğe bağlı)
	await clearDatabase();

	// Marka verileri
	const brands = [
		{ name: "Toyota" },
		{ name: "Honda" },
		{ name: "BMW" },
		{ name: "Mercedes" },
		{ name: "Audi" },
		{ name: "Volkswagen" },
		{ name: "Ford" },
		{ name: "Hyundai" }
	];

	console.log("📝 Markalar ekleniyor...");
	for (const brand of brands) {
		await prisma.brand.create({
			data: brand
		});
	}

	// Toyota modelleri
	const toyotaModels = [
		{ name: "Corolla", brandName: "Toyota" },
		{ name: "Yaris", brandName: "Toyota" },
		{ name: "Camry", brandName: "Toyota" },
		{ name: "RAV4", brandName: "Toyota" }
	];

	// Honda modelleri
	const hondaModels = [
		{ name: "Civic", brandName: "Honda" },
		{ name: "Accord", brandName: "Honda" },
		{ name: "CR-V", brandName: "Honda" }
	];

	// BMW modelleri
	const bmwModels = [
		{ name: "3 Serisi", brandName: "BMW" },
		{ name: "5 Serisi", brandName: "BMW" },
		{ name: "X5", brandName: "BMW" }
	];

	console.log("📝 Modeller ekleniyor...");
	const allModels = [...toyotaModels, ...hondaModels, ...bmwModels];
	for (const model of allModels) {
		const brand = await prisma.brand.findFirst({
			where: { name: model.brandName }
		});

		if (brand) {
			await prisma.model.create({
				data: {
					name: model.name,
					brandId: brand.id
				}
			});
		}
	}

	// Versiyon verileri
	const versions = [
		{ name: "1.6", modelName: "Corolla" },
		{ name: "1.8", modelName: "Corolla" },
		{ name: "2.0", modelName: "Corolla" },
		{ name: "1.5", modelName: "Civic" },
		{ name: "1.6", modelName: "Civic" },
		{ name: "2.0", modelName: "3 Serisi" },
		{ name: "2.5", modelName: "3 Serisi" }
	];

	console.log("📝 Versiyonlar ekleniyor...");
	for (const version of versions) {
		const model = await prisma.model.findFirst({
			where: { name: version.modelName }
		});

		if (model) {
			await prisma.version.create({
				data: {
					name: version.name,
					modelId: model.id
				}
			});
		}
	}

	// Gövde tipleri
	const bodyTypes = [
		{ name: "Sedan" },
		{ name: "Hatchback" },
		{ name: "SUV" },
		{ name: "Coupe" },
		{ name: "Station Wagon" }
	];

	console.log("📝 Gövde tipleri ekleniyor...");
	for (const bodyType of bodyTypes) {
		await prisma.bodyType.create({
			data: bodyType
		});
	}

	// BodyTypeVersion ilişkileri
	const bodyTypeVersions = [
		{ versionName: "1.6", modelName: "Corolla", bodyTypeName: "Sedan" },
		{ versionName: "1.8", modelName: "Corolla", bodyTypeName: "Sedan" },
		{ versionName: "1.5", modelName: "Civic", bodyTypeName: "Hatchback" },
		{ versionName: "1.6", modelName: "Civic", bodyTypeName: "Sedan" },
		{ versionName: "2.0", modelName: "3 Serisi", bodyTypeName: "Sedan" },
		{ versionName: "2.0", modelName: "3 Serisi", bodyTypeName: "Coupe" }
	];

	console.log("📝 Versiyon-Gövde tipi ilişkileri ekleniyor...");
	for (const btv of bodyTypeVersions) {
		const model = await prisma.model.findFirst({
			where: { name: btv.modelName }
		});

		if (model) {
			const version = await prisma.version.findFirst({
				where: {
					name: btv.versionName,
					modelId: model.id
				}
			});

			const bodyType = await prisma.bodyType.findFirst({
				where: { name: btv.bodyTypeName }
			});

			if (version && bodyType) {
				await prisma.bodyTypeVersion.create({
					data: {
						versionId: version.id,
						bodyTypeId: bodyType.id
					}
				});
			}
		}
	}

	// Yakıt tipleri
	const fuelTypes = [
		{ name: "Benzin" },
		{ name: "Dizel" },
		{ name: "Hibrit" },
		{ name: "Elektrik" },
		{ name: "LPG" }
	];

	console.log("📝 Yakıt tipleri ekleniyor...");
	for (const fuelType of fuelTypes) {
		await prisma.fuelType.create({
			data: fuelType
		});
	}

	// FuelTypeBody ilişkileri
	console.log("📝 Gövde-Yakıt ilişkileri ekleniyor...");
	const bodyTypeVersionRecords = await prisma.bodyTypeVersion.findMany({
		include: {
			version: {
				include: {
					model: true
				}
			},
			bodyType: true
		}
	});

	// Her bodyTypeVersion için bazı yakıt tipleri ekleyelim
	for (const btv of bodyTypeVersionRecords) {
		// Sedan ve Hatchback için Benzin ve Dizel
		if (btv.bodyType.name === "Sedan" || btv.bodyType.name === "Hatchback") {
			const benzin = await prisma.fuelType.findFirst({
				where: { name: "Benzin" }
			});

			const dizel = await prisma.fuelType.findFirst({
				where: { name: "Dizel" }
			});

			if (benzin) {
				await prisma.fuelTypeBody.create({
					data: {
						bodyVersionId: btv.id,
						fuelTypeId: benzin.id
					}
				});
			}

			if (dizel) {
				await prisma.fuelTypeBody.create({
					data: {
						bodyVersionId: btv.id,
						fuelTypeId: dizel.id
					}
				});
			}
		}

		// Hibrit sadece bazı modellere ekleyelim
		if (["Corolla", "Civic"].includes(btv.version.model.name)) {
			const hibrit = await prisma.fuelType.findFirst({
				where: { name: "Hibrit" }
			});

			if (hibrit) {
				await prisma.fuelTypeBody.create({
					data: {
						bodyVersionId: btv.id,
						fuelTypeId: hibrit.id
					}
				});
			}
		}
	}

	// Vites tipleri
	const transmissionTypes = [
		{ name: "Manuel" },
		{ name: "Otomatik" },
		{ name: "Yarı Otomatik" },
		{ name: "CVT" }
	];

	console.log("📝 Vites tipleri ekleniyor...");
	for (const transmissionType of transmissionTypes) {
		await prisma.transmissionType.create({
			data: transmissionType
		});
	}

	// TransmissionTypeFuel ilişkileri
	console.log("📝 Yakıt-Vites ilişkileri ekleniyor...");
	const fuelTypeBodies = await prisma.fuelTypeBody.findMany({
		include: {
			fuelType: true
		}
	});

	// Her FuelTypeBody için bazı vites tipleri ekleyelim
	for (const ftb of fuelTypeBodies) {
		// Benzin için Manuel ve Otomatik
		if (ftb.fuelType.name === "Benzin") {
			const manuel = await prisma.transmissionType.findFirst({
				where: { name: "Manuel" }
			});

			const otomatik = await prisma.transmissionType.findFirst({
				where: { name: "Otomatik" }
			});

			if (manuel) {
				await prisma.transmissionTypeFuel.create({
					data: {
						fuelBodyId: ftb.id,
						transmissionTypeId: manuel.id
					}
				});
			}

			if (otomatik) {
				await prisma.transmissionTypeFuel.create({
					data: {
						fuelBodyId: ftb.id,
						transmissionTypeId: otomatik.id
					}
				});
			}
		}

		// Dizel için Manuel ve Yarı Otomatik
		if (ftb.fuelType.name === "Dizel") {
			const manuel = await prisma.transmissionType.findFirst({
				where: { name: "Manuel" }
			});

			const yariOtomatik = await prisma.transmissionType.findFirst({
				where: { name: "Yarı Otomatik" }
			});

			if (manuel) {
				await prisma.transmissionTypeFuel.create({
					data: {
						fuelBodyId: ftb.id,
						transmissionTypeId: manuel.id
					}
				});
			}

			if (yariOtomatik) {
				await prisma.transmissionTypeFuel.create({
					data: {
						fuelBodyId: ftb.id,
						transmissionTypeId: yariOtomatik.id
					}
				});
			}
		}

		// Hibrit için CVT ve Otomatik
		if (ftb.fuelType.name === "Hibrit") {
			const cvt = await prisma.transmissionType.findFirst({
				where: { name: "CVT" }
			});

			const otomatik = await prisma.transmissionType.findFirst({
				where: { name: "Otomatik" }
			});

			if (cvt) {
				await prisma.transmissionTypeFuel.create({
					data: {
						fuelBodyId: ftb.id,
						transmissionTypeId: cvt.id
					}
				});
			}

			if (otomatik) {
				await prisma.transmissionTypeFuel.create({
					data: {
						fuelBodyId: ftb.id,
						transmissionTypeId: otomatik.id
					}
				});
			}
		}
	}

	// Araç yılları
	console.log("📝 Araç yılları ekleniyor...");
	const currentYear = new Date().getFullYear();
	const transmissionTypeFuels = await prisma.transmissionTypeFuel.findMany();

	for (const ttf of transmissionTypeFuels) {
		// Son 5 yıl için veri oluşturalım
		for (let year = currentYear; year > currentYear - 5; year--) {
			await prisma.vehicleYear.create({
				data: {
					year,
					transmissionTypeFuelId: ttf.id
				}
			});
		}
	}

	// Kilometre aralıkları
	const mileageRanges = [
		{ minKm: 0, maxKm: 10000 },
		{ minKm: 10001, maxKm: 30000 },
		{ minKm: 30001, maxKm: 60000 },
		{ minKm: 60001, maxKm: 100000 },
		{ minKm: 100001, maxKm: 150000 }
	];

	console.log("📝 Kilometre aralıkları ekleniyor...");
	const vehicleYears = await prisma.vehicleYear.findMany();

	for (const vy of vehicleYears) {
		for (const range of mileageRanges) {
			await prisma.mileage.create({
				data: {
					minKm: range.minKm,
					maxKm: range.maxKm,
					vehicleYearId: vy.id
				}
			});
		}
	}

	// Renkler
	const colors = [
		{ name: "Siyah" },
		{ name: "Beyaz" },
		{ name: "Gri" },
		{ name: "Kırmızı" },
		{ name: "Mavi" },
		{ name: "Yeşil" }
	];

	console.log("📝 Renkler ekleniyor...");
	for (const color of colors) {
		await prisma.color.create({
			data: color
		});
	}

	// ColorMileage ilişkileri
	console.log("📝 Renk-Kilometre ilişkileri ekleniyor...");
	// Performans için sınırlı sayıda mileage
	const limitedMileages = await prisma.mileage.findMany({
		take: 50
	});

	const allColors = await prisma.color.findMany();

	for (const mileage of limitedMileages) {
		// Her kilometre aralığı için 3 popüler renk ekleyelim
		const popularColors = allColors.slice(0, 3); // Siyah, Beyaz, Gri

		for (const color of popularColors) {
			await prisma.colorMileage.create({
				data: {
					mileageId: mileage.id,
					colorId: color.id
				}
			});
		}

		// Bazı kilometre aralıkları için diğer renkleri de ekleyelim
		if (Math.random() > 0.5) {
			const otherColors = allColors.slice(3); // Kırmızı, Mavi, Yeşil
			const randomColor = otherColors[Math.floor(Math.random() * otherColors.length)];

			await prisma.colorMileage.create({
				data: {
					mileageId: mileage.id,
					colorId: randomColor.id
				}
			});
		}
	}

	// Kaza kayıtları
	console.log("📝 Kaza kayıtları ekleniyor...");
	const colorMileages = await prisma.colorMileage.findMany();

	for (const cm of colorMileages) {
		// %70 oranında kazasız, %30 oranında kazalı araç
		const hasAccident = Math.random() > 0.7;

		await prisma.accidentRecord.create({
			data: {
				status: hasAccident ? "Exists" : "None",
				amount: hasAccident ? Math.floor(Math.random() * 15000) + 5000 : null,
				colorMileageId: cm.id
			}
		});
	}

	// Araçlar
	console.log("📝 Araçlar ekleniyor...");
	const accidentRecords = await prisma.accidentRecord.findMany();

	// Sadece bir kısmı için araç oluşturalım (performans için)
	const limitedAccidentRecords = accidentRecords.slice(0, 200);

	for (const ar of limitedAccidentRecords) {
		// Araç fiyatını belirleyelim
		// Yeni ve hasar görmemiş araçlar daha pahalı olacak
		const colorMileage = await prisma.colorMileage.findUnique({
			where: { id: ar.colorMileageId },
			include: {
				mileage: {
					include: {
						vehicleYear: true
					}
				}
			}
		});

		let basePrice = 250000; // Baz fiyat

		if (colorMileage) {
			// Yıl etkisi: Her geçen yıl için %10 değer kaybı
			const currentYear = new Date().getFullYear();
			const yearDiff = currentYear - colorMileage.mileage.vehicleYear.year;
			basePrice -= basePrice * (yearDiff * 0.1);

			// Kilometre etkisi
			const kmFactor = colorMileage.mileage.minKm / 100000;
			basePrice -= basePrice * kmFactor * 0.2;

			// Kaza kaydı etkisi
			if (ar.status === "Exists") {
				const accidentFactor = (ar.amount || 0) / 10000;
				basePrice -= basePrice * accidentFactor * 0.1;
			}
		}

		// Minimum 50000 TL olsun
		const price = Math.max(50000, Math.round(basePrice / 1000) * 1000);

		// Açıklama oluştur
		const descriptions = [
			"Çok temiz, bakımlı araç",
			"İlk sahibinden satılık",
			"Servis bakımlı, masrafsız",
			"Değişensiz, tramer kaydı yok",
			"Aile aracı, içi dışı temiz"
		];

		const description = descriptions[Math.floor(Math.random() * descriptions.length)];

		// Araç listingStatus'unu belirle
		const statuses = ["Active", "Sold", "Pending"];
		const listingStatus = statuses[Math.floor(Math.random() * statuses.length)];

		await prisma.vehicle.create({
			data: {
				price,
				description,
				listingStatus,
				accidentRecordId: ar.id
			}
		});
	}

	console.log("✅ Seed işlemi başarıyla tamamlandı!");
}

// Veritabanını temizleme fonksiyonu (isteğe bağlı)
async function clearDatabase() {
	console.log("🗑️ Veritabanı temizleniyor...");

	// İlişkiler nedeniyle silme sırası önemli
	await prisma.vehicle.deleteMany({});
	await prisma.accidentRecord.deleteMany({});
	await prisma.colorMileage.deleteMany({});
	await prisma.color.deleteMany({});
	await prisma.mileage.deleteMany({});
	await prisma.vehicleYear.deleteMany({});
	await prisma.transmissionTypeFuel.deleteMany({});
	await prisma.transmissionType.deleteMany({});
	await prisma.fuelTypeBody.deleteMany({});
	await prisma.fuelType.deleteMany({});
	await prisma.bodyTypeVersion.deleteMany({});
	await prisma.bodyType.deleteMany({});
	await prisma.version.deleteMany({});
	await prisma.model.deleteMany({});
	await prisma.brand.deleteMany({});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("Seed işlemi sırasında hata oluştu:", e);
		await prisma.$disconnect();
		process.exit(1);
	});