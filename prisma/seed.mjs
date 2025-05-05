// seed.mjs
import { PrismaClient, OfferStatus, DamageRecordStatus } from '@prisma/client';
import { fakerTR as faker } from '@faker-js/faker'; // faker kütüphanesini ekliyoruz

const prisma = new PrismaClient();

// Daha güvenli bir silme sırası
async function clearDatabase() {
	console.log('Veritabanı temizleniyor...');
	try {
		// İlişki sırasının tersine göre silme işlemi (Önce en bağımlı olanlar)
		await prisma.offer.deleteMany();
		console.log('Teklifler silindi.');
		await prisma.fuelType.deleteMany();
		console.log('Yakıt tipleri silindi.');
		await prisma.bodyType.deleteMany();
		console.log('Gövde tipleri silindi.');
		await prisma.subModel.deleteMany();
		console.log('Alt modeller silindi.');
		await prisma.model.deleteMany();
		console.log('Modeller silindi.');
		await prisma.year.deleteMany();
		console.log('Yıllar silindi.');
		await prisma.contact.deleteMany();
		console.log('İletişim kişileri silindi.');
		await prisma.color.deleteMany();
		console.log('Renkler silindi.');
		await prisma.transmissionType.deleteMany();
		console.log('Vites tipleri silindi.');
		await prisma.brand.deleteMany();
		console.log('Markalar silindi.');
		await prisma.vehicleType.deleteMany(); // En son VehicleType silinebilir
		console.log('Vasıta tipleri silindi.');
		console.log('Veritabanı başarıyla temizlendi.');
	} catch (error) {
		console.error('Veritabanı temizlenirken hata oluştu:', error);
		// Hata durumunda detaylı loglama veya rethrow yapılabilir.
		throw error; // Hatayı yukarı taşı
	}
}


async function seedData() {
	console.log('Veri ekleme başlatılıyor...');

	// --- 1. Temel Kategorileri Oluşturma ---
	console.log('Temel kategoriler oluşturuluyor...');

	const vehicleTypeData = [
		{ name: 'Araba' },
		{ name: 'Motosiklet' },
		{ name: 'Kamyon' },
		{ name: 'Ticari Vasıta' }, // Yeni eklenen vasıta tipi
	];
	const vehicleTypes = await prisma.vehicleType.createMany({ data: vehicleTypeData, skipDuplicates: true });
	console.log(`Oluşturulan vasıta tipleri: ${vehicleTypes.count}`);

	const brandData = [
		{ name: 'BMW' },
		{ name: 'Audi' },
		{ name: 'Mercedes' },
		{ name: 'Honda' },
		{ name: 'Ford' },
		{ name: 'Volvo' },
		{ name: 'Volkswagen' }, // Yeni marka
		{ name: 'Toyota' },     // Yeni marka
		{ name: 'Peugeot' },    // Yeni marka
		{ name: 'Fiat' },       // Yeni marka
		{ name: 'Renault' },    // Yeni marka
		{ name: 'Nissan' },     // Yeni marka
	];
	const brands = await prisma.brand.createMany({ data: brandData, skipDuplicates: true });
	console.log(`Oluşturulan markalar: ${brands.count}`);

	const transmissionTypeData = [
		{ name: 'Manuel' },
		{ name: 'Otomatik' },
		{ name: 'Yarı Otomatik' },
		{ name: 'CVT' }, // Yeni vites tipi
	];
	const transmissionTypes = await prisma.transmissionType.createMany({ data: transmissionTypeData, skipDuplicates: true });
	console.log(`Oluşturulan vites tipleri: ${transmissionTypes.count}`);

	const colorData = [
		{ name: 'Siyah' },
		{ name: 'Beyaz' },
		{ name: 'Kırmızı' },
		{ name: 'Mavi' },
		{ name: 'Gri' },
		{ name: 'Gümüş' },
		{ name: 'Lacivert' },   // Yeni renk
		{ name: 'Metalik Gri' }, // Yeni renk
		{ name: 'Kahverengi' }, // Yeni renk
		{ name: 'Yeşil' },      // Yeni renk
	];
	const colors = await prisma.color.createMany({ data: colorData, skipDuplicates: true });
	console.log(`Oluşturulan renkler: ${colors.count}`);

	const contactData = Array.from({ length: 20 }).map(() => ({ // Faker ile 20 rastgele kişi
		fullName: faker.person.fullName(),
		phone: faker.phone.number('5##-###-####'),
		email: faker.datatype.boolean() ? faker.internet.email() : null, // Bazılarının emaili olmasın
	}));
	const contacts = await prisma.contact.createMany({ data: contactData, skipDuplicates: true });
	console.log(`Oluşturulan iletişim kişileri: ${contacts.count}`);


	// Oluşturulan temel verileri al (ID'ler gerekecek)
	const createdVehicleTypes = await prisma.vehicleType.findMany();
	const createdBrands = await prisma.brand.findMany();
	const createdTransmissionTypes = await prisma.transmissionType.findMany();
	const createdColors = await prisma.color.findMany();
	const createdContacts = await prisma.contact.findMany();

	const carType = createdVehicleTypes.find(vt => vt.name === 'Araba');
	const motoType = createdVehicleTypes.find(vt => vt.name === 'Motosiklet');
	const truckType = createdVehicleTypes.find(vt => vt.name === 'Kamyon');
	const commercialType = createdVehicleTypes.find(vt => vt.name === 'Ticari Vasıta'); // Yeni tip

	// --- 2. Yılları Vasıta Tiplerine Bağlayarak Oluşturma ---
	console.log('Yıllar oluşturuluyor...');
	const yearsToCreate = [];
	if (carType) {
		yearsToCreate.push(...Array.from({ length: 25 }, (_, i) => 2000 + i).map(y => ({ year: y, vehicleTypeId: carType.id }))); // Arabalar için 2000-2024
	}
	if (commercialType) {
		yearsToCreate.push(...Array.from({ length: 20 }, (_, i) => 2005 + i).map(y => ({ year: y, vehicleTypeId: commercialType.id }))); // Ticari için 2005-2024
	}
	if (motoType) {
		yearsToCreate.push(...Array.from({ length: 15 }, (_, i) => 2010 + i).map(y => ({ year: y, vehicleTypeId: motoType.id }))); // Motosiklet için 2010-2024
	}
	if (truckType) {
		yearsToCreate.push(...Array.from({ length: 10 }, (_, i) => 2015 + i).map(y => ({ year: y, vehicleTypeId: truckType.id }))); // Kamyon için 2015-2024
	}

	await prisma.year.createMany({ data: yearsToCreate, skipDuplicates: true });
	const years = await prisma.year.findMany(); // Oluşturulan tüm yılları al
	console.log(`Oluşturulan toplam yıl sayısı: ${years.length}`);

	// --- 3. Modelleri Marka, Yıl ve Vasıta Tipine Bağlayarak Oluşturma ---
	console.log('Modeller oluşturuluyor...');
	const modelsToCreate = [];

	// Veri yapısı: { brandName, vehicleTypeName, modelName, years (opsiyonel, yoksa tüm uygun yıllar kullanılır) }
	const modelDefinitions = [
		// BMW (Araba)
		{ brandName: 'BMW', vehicleTypeName: 'Araba', modelName: '3 Serisi' },
		{ brandName: 'BMW', vehicleTypeName: 'Araba', modelName: '5 Serisi' },
		{ brandName: 'BMW', vehicleTypeName: 'Araba', modelName: 'X5' }, // Yeni Model
		{ brandName: 'BMW', vehicleTypeName: 'Araba', modelName: '1 Serisi' }, // Yeni Model

		// Audi (Araba)
		{ brandName: 'Audi', vehicleTypeName: 'Araba', modelName: 'A4' },
		{ brandName: 'Audi', vehicleTypeName: 'Araba', modelName: 'A6' }, // Yeni Model
		{ brandName: 'Audi', vehicleTypeName: 'Araba', modelName: 'Q7' }, // Yeni Model

		// Mercedes (Araba)
		{ brandName: 'Mercedes', vehicleTypeName: 'Araba', modelName: 'C Serisi' }, // Yeni Marka/Model
		{ brandName: 'Mercedes', vehicleTypeName: 'Araba', modelName: 'E Serisi' }, // Yeni Marka/Model
		{ brandName: 'Mercedes', vehicleTypeName: 'Araba', modelName: 'GLC' },    // Yeni Marka/Model

		// Volkswagen (Araba)
		{ brandName: 'Volkswagen', vehicleTypeName: 'Araba', modelName: 'Golf' },   // Yeni Marka/Model
		{ brandName: 'Volkswagen', vehicleTypeName: 'Araba', modelName: 'Passat' }, // Yeni Marka/Model
		{ brandName: 'Volkswagen', vehicleTypeName: 'Araba', modelName: 'Tiguan' }, // Yeni Marka/Model

		// Toyota (Araba)
		{ brandName: 'Toyota', vehicleTypeName: 'Araba', modelName: 'Corolla' }, // Yeni Marka/Model
		{ brandName: 'Toyota', vehicleTypeName: 'Araba', modelName: 'RAV4' },  // Yeni Marka/Model

		// Peugeot (Araba)
		{ brandName: 'Peugeot', vehicleTypeName: 'Araba', modelName: '308' }, // Yeni Marka/Model
		{ brandName: 'Peugeot', vehicleTypeName: 'Araba', modelName: '5008' },// Yeni Marka/Model

		// Fiat (Araba & Ticari)
		{ brandName: 'Fiat', vehicleTypeName: 'Araba', modelName: 'Egea' },    // Yeni Marka/Model
		{ brandName: 'Fiat', vehicleTypeName: 'Ticari Vasıta', modelName: 'Doblo' }, // Yeni Ticari Model

		// Renault (Araba & Ticari)
		{ brandName: 'Renault', vehicleTypeName: 'Araba', modelName: 'Clio' },   // Yeni Marka/Model
		{ brandName: 'Renault', vehicleTypeName: 'Ticari Vasıta', modelName: 'Kangoo' }, // Yeni Ticari Model

		// Honda (Motosiklet)
		{ brandName: 'Honda', vehicleTypeName: 'Motosiklet', modelName: 'CBR650R' },
		{ brandName: 'Honda', vehicleTypeName: 'Motosiklet', modelName: 'NC750X' }, // Yeni Motosiklet

		// Ford (Kamyon)
		{ brandName: 'Ford', vehicleTypeName: 'Kamyon', modelName: 'F-150' },
		{ brandName: 'Ford', vehicleTypeName: 'Ticari Vasıta', modelName: 'Transit' }, // Yeni Ticari Model
	];

	for (const def of modelDefinitions) {
		const brand = createdBrands.find(b => b.name === def.brandName);
		const vehicleType = createdVehicleTypes.find(vt => vt.name === def.vehicleTypeName);

		if (brand && vehicleType) {
			const suitableYears = years.filter(y => y.vehicleTypeId === vehicleType.id);

			if (suitableYears.length > 0) {
				for (const year of suitableYears) {
					modelsToCreate.push({
						name: def.modelName,
						brandId: brand.id,
						yearId: year.id,
						vehicleTypeId: vehicleType.id,
					});
				}
			} else {
				console.warn(`Uygun yıl bulunamadı: Marka ${def.brandName}, Vasıta Tip ${def.vehicleTypeName}`);
			}
		} else {
			console.warn(`Marka veya Vasıta Tipi bulunamadı: Marka ${def.brandName}, Vasıta Tip ${def.vehicleTypeName}`);
		}
	}

	// createMany kullanmak yerine, tek tek oluşturup döndürülen nesneleri topluyoruz
	// createMany model oluşturup döndürmediği için ilişkilendirme zorlaşır
	const models = [];
	for(const modelData of modelsToCreate) {
		try {
			const createdModel = await prisma.model.create({ data: modelData });
			models.push(createdModel);
		} catch (error) {
			if (error.code === 'P2002') { // Unique constraint violation
				// console.log(`Model zaten mevcut, atlanıyor: ${modelData.name} (${modelData.yearId})`); // Çok fazla log olabilir
			} else {
				console.error(`Model oluşturulurken hata:`, modelData, error);
			}
		}
	}
	console.log(`Oluşturulan model sayısı: ${models.length}`);


	// --- 4. Alt Modelleri Modellere Bağlayarak Oluşturma ---
	console.log('Alt modeller oluşturuluyor...');
	const subModelsToCreate = [];

	// Veri yapısı: { modelName, subModelNames: [] }
	const subModelDefinitions = [
		{ modelName: '1 Serisi', subModelNames: ['118i', '116d'] },
		{ modelName: '3 Serisi', subModelNames: ['320i', '330e', '318d', 'M Sport'] },
		{ modelName: '5 Serisi', subModelNames: ['520d', '530i', '530e', 'Luxury Line'] },
		{ modelName: 'X5', subModelNames: ['xDrive40i', 'xDrive30d', 'M50i'] },
		{ modelName: 'A4', subModelNames: ['A4 Sedan', 'A4 Avant', 'S Line'] },
		{ modelName: 'A6', subModelNames: ['A6 Sedan', 'A6 Avant'] },
		{ modelName: 'Q7', subModelNames: ['45 TDI', '50 TFSI'] },
		{ modelName: 'C Serisi', subModelNames: ['C200', 'C220d', 'AMG Paket'] },
		{ modelName: 'E Serisi', subModelNames: ['E200', 'E220d'] },
		{ modelName: 'GLC', subModelNames: ['GLC 250', 'GLC 300d'] },
		{ modelName: 'Golf', subModelNames: ['1.0 TSI', '1.5 TSI', '2.0 TDI', 'R-Line'] },
		{ modelName: 'Passat', subModelNames: ['1.4 TSI', '1.6 TDI', '2.0 TSI'] },
		{ modelName: 'Tiguan', subModelNames: ['1.4 TSI', '2.0 TDI'] },
		{ modelName: 'Corolla', subModelNames: ['1.6 Benzin', '1.8 Hibrit', 'Dream', 'Flame'] },
		{ modelName: 'RAV4', subModelNames: ['2.0 Benzin', '2.5 Hibrit'] },
		{ modelName: '308', subModelNames: ['1.2 PureTech', '1.5 BlueHDi'] },
		{ modelName: '5008', subModelNames: ['1.6 PureTech', '2.0 BlueHDi'] },
		{ modelName: 'Egea', subModelNames: ['1.4 Fire', '1.3 MultiJet', '1.6 MultiJet', 'Urban', 'Lounge'] },
		{ modelName: 'Doblo', subModelNames: ['1.3 MultiJet', '1.6 MultiJet'] },
		{ modelName: 'Clio', subModelNames: ['1.0 SCe', '1.0 TCe', '1.5 Blue dCi'] },
		{ modelName: 'Kangoo', subModelNames: ['1.5 Blue dCi', 'Expression'] },
		{ modelName: 'CBR650R', subModelNames: ['Standart'] }, // Motosiklet alt model
		{ modelName: 'NC750X', subModelNames: ['DCT', 'Manuel'] }, // Motosiklet alt model
		{ modelName: 'F-150', subModelNames: ['Crew Cab', 'SuperCab', 'Raptor'] }, // Kamyon alt model
		{ modelName: 'Transit', subModelNames: ['Connect', 'Custom', 'Büyük Kasa'] }, // Ticari Vasıta alt model
	];

	for (const model of models) {
		const definition = subModelDefinitions.find(def => def.modelName === model.name);
		if (definition) {
			for (const subModelName of definition.subModelNames) {
				subModelsToCreate.push({ name: subModelName, modelId: model.id });
			}
		}
	}
	const subModelsResult = await prisma.subModel.createMany({ data: subModelsToCreate, skipDuplicates: true });
	const subModels = await prisma.subModel.findMany(); // Oluşturulan tüm alt modelleri al
	console.log(`Oluşturulan toplam alt model sayısı: ${subModelsResult.count}`);


	// --- 5. Gövde Tiplerini Alt Modellere Bağlayarak Oluşturma ---
	console.log('Gövde tipleri oluşturuluyor...');
	const bodyTypesToCreate = [];

	// Veri yapısı: { subModelNames: [], bodyTypeNames: [] } veya { modelNames: [], bodyTypeNames: [] }
	// Alt model bazında eşleşme daha spesifik olabilir
	const bodyTypeDefinitions = [
		{ subModelNames: ['A4 Sedan', 'A6 Sedan', 'C200', 'E200', 'Golf', 'Passat', 'Corolla', '308', 'Egea', 'Clio'], bodyTypeNames: ['Sedan'] },
		{ subModelNames: ['A4 Avant', 'A6 Avant', '3 Serisi', '5 Serisi'], bodyTypeNames: ['Station Wagon', 'Touring'] }, // BMW'ye özel Touring de ekleyelim
		{ subModelNames: ['X5', 'Q7', 'GLC', 'Tiguan', 'RAV4', '5008'], bodyTypeNames: ['SUV'] },
		{ subModelNames: ['Golf', '308', 'Clio', '1 Serisi', 'Egea'], bodyTypeNames: ['Hatchback'] }, // Hatchback ekle
		{ subModelNames: ['1 Serisi', '3 Serisi'], bodyTypeNames: ['Coupe'] }, // Coupe ekle (tüm alt modellere değil, modele bağlamak daha mantıklı olabilir ama şema alt modele bağlıyor)
		{ subModelNames: ['CBR650R', 'NC750X'], bodyTypeNames: ['Spor', 'Naked'] }, // Motosiklet tipleri
		{ subModelNames: ['F-150'], bodyTypeNames: ['Pickup'] }, // Kamyon tipi
		{ subModelNames: ['Doblo', 'Kangoo', 'Transit'], bodyTypeNames: ['Panelvan', 'Minivan', 'Kamyonet'] }, // Ticari tipler
	];

	for (const subModel of subModels) {
		const definition = bodyTypeDefinitions.find(def => def.subModelNames.includes(subModel.name) || def.subModelNames.includes(models.find(m => m.id === subModel.modelId)?.name || '')); // Alt modele veya model adına göre ara
		if (definition) {
			for (const bodyTypeName of definition.bodyTypeNames) {
				// Aynı alt modele aynı bodyType'ı eklememek için kontrol yapalım (createMany skipDuplicates var ama emin olmak için)
				bodyTypesToCreate.push({ name: bodyTypeName, subModelId: subModel.id });
			}
		}
		// Generic Body Types for models not explicitly defined above (e.g., base trims)
		// Bu kısım, yukarıdaki tanımlara girmeyen submodellere genel body type ekleyebilir
		const model = models.find(m => m.id === subModel.modelId);
		const vehicleType = createdVehicleTypes.find(vt => vt.id === model?.vehicleTypeId);
		if (vehicleType?.name === 'Araba' && !definition) {
			bodyTypesToCreate.push({ name: 'Sedan', subModelId: subModel.id }); // Varsayılan olarak Sedan ekle
		} else if (vehicleType?.name === 'Motosiklet' && !definition) {
			bodyTypesToCreate.push({ name: 'Diğer Motosiklet', subModelId: subModel.id });
		} else if (vehicleType?.name === 'Kamyon' && !definition) {
			bodyTypesToCreate.push({ name: 'Diğer Kamyon', subModelId: subModel.id });
		}
		else if (vehicleType?.name === 'Ticari Vasıta' && !definition) {
			bodyTypesToCreate.push({ name: 'Diğer Ticari', subModelId: subModel.id });
		}
	}
	const bodyTypesResult = await prisma.bodyType.createMany({
		data: bodyTypesToCreate,
		skipDuplicates: true, // Birden fazla eşleşme olursa veya manuel eklenenler çakışırsa
	});
	const bodyTypes = await prisma.bodyType.findMany(); // Oluşturulan tüm gövde tiplerini al
	console.log(`Oluşturulan toplam gövde tipi sayısı: ${bodyTypesResult.count}`);


	// --- 6. Yakıt Tiplerini Gövde Tiplerine Bağlayarak Oluşturma ---
	console.log('Yakıt tipleri oluşturuluyor...');
	const fuelTypesToCreate = [];

	// Veri yapısı: { bodyTypeNames: [], fuelTypeNames: [] } veya { modelNames: [], fuelTypeNames: [] }
	const fuelTypeDefinitions = [
		{ bodyTypeNames: ['Sedan', 'Station Wagon', 'Touring', 'SUV', 'Hatchback', 'Coupe', 'Pickup', 'Panelvan', 'Minivan', 'Kamyonet'], fuelTypeNames: ['Benzin', 'Dizel', 'Hibrit', 'LPG'] }, // Genel yakıt tipleri
		{ bodyTypeNames: ['Sedan', 'SUV', 'Hatchback'], fuelTypeNames: ['Elektrik'] }, // Bazı tiplere Elektrik ekle
		{ bodyTypeNames: ['Spor', 'Naked', 'Diğer Motosiklet'], fuelTypeNames: ['Benzin'] }, // Motosiklet
	];

	for (const bodyType of bodyTypes) {
		const definition = fuelTypeDefinitions.find(def => def.bodyTypeNames.includes(bodyType.name));
		if (definition) {
			for (const fuelTypeName of definition.fuelTypeNames) {
				fuelTypesToCreate.push({ name: fuelTypeName, bodyTypeId: bodyType.id });
			}
		} else {
			// Tanımlanmayan gövde tiplerine varsayılan yakıt tipi ekle
			fuelTypesToCreate.push({ name: 'Benzin', bodyTypeId: bodyType.id });
		}
	}

	const fuelTypesResult = await prisma.fuelType.createMany({
		data: fuelTypesToCreate,
		skipDuplicates: true,
	});
	const fuelTypes = await prisma.fuelType.findMany({ // Oluşturulan tüm yakıt tiplerini ilişkileriyle al
		include: {
			bodyType: {
				include: {
					subModel: {
						include: {
							model: {
								include: {
									brand: true,
									year: true,
									vehicleType: true,
								}
							}
						}
					}
				}
			}
		}
	});
	console.log(`Oluşturulan toplam yakıt tipi sayısı: ${fuelTypesResult.count}`);


	// --- 7. Teklifleri Oluşturma ---
	console.log('Teklifler oluşturuluyor...');

	// Rastgele seçim için yardımcı fonksiyon
	const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

	const numberOfOffersToCreate = 200; // Oluşturulacak teklif sayısını artır

	for (let i = 0; i < numberOfOffersToCreate; i++) {
		try {
			// Teklif için bir zinciri en derin seviyeden (FuelType) başlayarak seç
			const randomFuelTypeWithChain = getRandomItem(fuelTypes);

			if (!randomFuelTypeWithChain || !randomFuelTypeWithChain.bodyType || !randomFuelTypeWithChain.bodyType.subModel || !randomFuelTypeWithChain.bodyType.subModel.model || !randomFuelTypeWithChain.bodyType.subModel.model.brand || !randomFuelTypeWithChain.bodyType.subModel.model.year || !randomFuelTypeWithChain.bodyType.subModel.model.vehicleType) {
				console.warn(`Teklif için geçerli bir zincir oluşturulamadı (FuelType ile başlamadı veya ilişkiler eksik), Teklif ${i + 1} atlanıyor.`);
				continue;
			}

			const fuelType = randomFuelTypeWithChain;
			const bodyType = fuelType.bodyType;
			const subModel = bodyType.subModel;
			const model = subModel.model;
			const brand = model.brand;
			const year = model.year; // Model zaten yıla bağlı
			const vehicleType = model.vehicleType; // Model zaten vasıta tipine bağlı

			const randomTransmission = getRandomItem(createdTransmissionTypes);
			const randomColor = getRandomItem(createdColors);
			const randomContact = getRandomItem(createdContacts);

			const statuses = Object.values(OfferStatus);
			const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

			const damageStatuses = Object.values(DamageRecordStatus);
			const randomDamageStatus = getRandomItem(damageStatuses);
			const damageAmount = randomDamageStatus === DamageRecordStatus.EXISTS ? parseFloat(faker.finance.amount(500, 100000, 2)) : null; // Daha geniş hasar aralığı

			const mileage = faker.number.int({ min: 1000, max: 500000 }); // Daha geniş kilometre aralığı

			// Teklif tutarını aracın yaşına, kilometresine ve hasarına göre kabaca belirleme
			let basePrice = 100000; // Başlangıç değeri
			if (vehicleType.name === 'Motosiklet') basePrice = 50000;
			if (vehicleType.name === 'Kamyon') basePrice = 300000;
			if (vehicleType.name === 'Ticari Vasıta') basePrice = 150000;

			// Marka/Modele göre baz fiyatı artır/azalt
			if (brand.name === 'BMW' || brand.name === 'Audi' || brand.name === 'Mercedes') basePrice *= 1.5;
			if (brand.name === 'Fiat' || brand.name === 'Renault') basePrice *= 0.8;

			// Yıla göre fiyat düşüşü (daha eski ise düşer)
			const currentYear = new Date().getFullYear();
			const age = currentYear - year.year;
			basePrice *= (1 - age * 0.03); // Her yıl için %3 değer kaybı varsayalım

			// Kilometreye göre fiyat düşüşü
			basePrice *= (1 - mileage / 500000 * 0.4); // 500k km'de %40 değer kaybı varsayalım

			// Hasar miktarına göre düşüş
			if (damageAmount !== null) {
				basePrice -= damageAmount * 0.8; // Hasarın %80'i kadar düşüş
			}

			// Fiyatın negatif olmaması ve minimum bir değerin altına düşmemesi
			basePrice = Math.max(basePrice, 5000); // Minimum 5000 TL olsun

			// Duruma göre teklif tutarı atama
			let offerAmount = null;
			if (randomStatus === OfferStatus.OFFERED || randomStatus === OfferStatus.ACCEPTED || randomStatus === OfferStatus.COMPLETED) {
				offerAmount = parseFloat(faker.finance.amount(basePrice * 0.8, basePrice * 1.1, 2)); // Hesaplanan fiyatın %80 - %110'u arası teklif
			}


			await prisma.offer.create({
				data: {
					vehicleTypeId: vehicleType.id,
					yearId: year.id,
					brandId: brand.id,
					modelId: model.id,
					subModelId: subModel.id,
					bodyTypeId: bodyType.id,
					fuelTypeId: fuelType.id,
					transmissionTypeId: randomTransmission.id,
					colorId: randomColor.id,
					mileage: mileage,
					damageRecord: randomDamageStatus,
					damageAmount: damageAmount,
					contactId: randomContact.id,
					notes: faker.lorem.sentence(), // Faker ile rastgele not
					images: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }).map(() => faker.image.urlPicsumPhotos({ width: 640, height: 480 })), // Faker ile rastgele resim URL'leri
					status: randomStatus,
					adminNotes: randomStatus !== OfferStatus.PENDING ? faker.lorem.sentence() : null, // Teklif bekliyorsa admin notu olmasın
					offerAmount: offerAmount,
					// createdAt ve updatedAt Prisma tarafından otomatik yönetilir
				},
			});
		} catch (error) {
			console.error(`Teklif oluşturulurken hata (Teklif ${i + 1}): ${error.message}`);
			// Çok sık hata alıyorsanız buraya breakpoint koyup hatanın kaynağını araştırabilirsiniz.
			// Örneğin, belirli bir ID'nin bulunamaması gibi.
		}
	}
	console.log(`Oluşturulması denenen teklif sayısı: ${numberOfOffersToCreate}`);
	const createdOffers = await prisma.offer.count();
	console.log(`Başarıyla oluşturulan teklif sayısı: ${createdOffers}`);


	console.log('Veri ekleme tamamlandı.');
}

async function main() {
	await clearDatabase();
	await seedData();
}

main()
	.catch((e) => {
		console.error('Çalışma sırasında hata oluştu:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		console.log('Prisma client bağlantısı kapatıldı.');
	});