// seed.mjs

import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

// Yardımcı fonksiyonlar
function getRandomElement(arr) {
	if (!arr || arr.length === 0) return undefined;
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr, min, max) {
	if (!arr) return [];
	const count = Math.floor(Math.random() * (max - min + 1)) + min;
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

async function main() {
	console.log("🌱 Veritabanı seed işlemi başlıyor...");

	await clearDatabase();

	// --- Ana Veri Kategorileri ---
	console.log("📝 Ana veri kategorileri ekleniyor...");
	const brandsData = [ { name: "Toyota" }, { name: "Honda" }, { name: "BMW" }, { name: "Mercedes-Benz" }, { name: "Audi" }, { name: "Volkswagen" }, { name: "Ford" }, { name: "Hyundai" }, { name: "Kia" }, { name: "Nissan" }, { name: "Renault" }, { name: "Peugeot" }, { name: "Fiat" }, { name: "Skoda" }, { name: "Opel" } ];
	await prisma.brand.createMany({ data: brandsData });
	const brands = await prisma.brand.findMany();
	const brandMap = new Map(brands.map(b => [b.name, b.id]));
	console.log(`✅ ${brands.length} Marka eklendi.`);

	const bodyTypesData = [ { name: "Sedan" }, { name: "Hatchback" }, { name: "SUV" }, { name: "Coupe" }, { name: "Station Wagon" }, { name: "Cabrio" }, { name: "Pick-up" }, { name: "MPV" }, { name: "Roadster" } ];
	await prisma.bodyType.createMany({ data: bodyTypesData });
	const bodyTypes = await prisma.bodyType.findMany();
	const bodyTypeMap = new Map(bodyTypes.map(bt => [bt.name, bt.id]));
	console.log(`✅ ${bodyTypes.length} Gövde tipi eklendi.`);

	const fuelTypesData = [ { name: "Benzin" }, { name: "Dizel" }, { name: "Hibrit" }, { name: "Elektrik" }, { name: "LPG" }, { name: "Benzin+LPG" } ];
	await prisma.fuelType.createMany({ data: fuelTypesData });
	const fuelTypes = await prisma.fuelType.findMany();
	const fuelTypeMap = new Map(fuelTypes.map(ft => [ft.name, ft.id]));
	console.log(`✅ ${fuelTypes.length} Yakıt tipi eklendi.`);

	const transmissionTypesData = [ { name: "Manuel" }, { name: "Otomatik" }, { name: "Yarı Otomatik" }, { name: "CVT" }, { name: "DSG" }, { name: "Tiptronic" } ];
	await prisma.transmissionType.createMany({ data: transmissionTypesData });
	const transmissionTypes = await prisma.transmissionType.findMany();
	const transmissionTypeMap = new Map(transmissionTypes.map(tt => [tt.name, tt.id]));
	console.log(`✅ ${transmissionTypes.length} Vites tipi eklendi.`);

	const colorsData = [ { name: "Siyah" }, { name: "Beyaz" }, { name: "Gri" }, { name: "Kırmızı" }, { name: "Mavi" }, { name: "Yeşil" }, { name: "Sarı" }, { name: "Turuncu" }, { name: "Kahverengi" }, { name: "Gümüş" }, { name: "Lacivert" }, { name: "Bordo" } ];
	await prisma.color.createMany({ data: colorsData });
	const colors = await prisma.color.findMany();
	console.log(`✅ ${colors.length} Renk eklendi.`);

	// --- İlişkisel Veri Oluşturma ---

	// Modeller
	console.log("📝 Modeller ekleniyor...");
	const modelsData = [ { name: "Corolla", brandName: "Toyota" }, { name: "Yaris", brandName: "Toyota" }, { name: "Camry", brandName: "Toyota" }, { name: "RAV4", brandName: "Toyota" }, { name: "C-HR", brandName: "Toyota" }, { name: "Civic", brandName: "Honda" }, { name: "Accord", brandName: "Honda" }, { name: "CR-V", brandName: "Honda" }, { name: "Jazz", brandName: "Honda" }, { name: "3 Serisi", brandName: "BMW" }, { name: "5 Serisi", brandName: "BMW" }, { name: "X3", brandName: "BMW" }, { name: "X5", brandName: "BMW" }, { name: "1 Serisi", brandName: "BMW" }, { name: "C Serisi", brandName: "Mercedes-Benz" }, { name: "E Serisi", brandName: "Mercedes-Benz" }, { name: "GLC", brandName: "Mercedes-Benz" }, { name: "A Serisi", brandName: "Mercedes-Benz" }, { name: "A3", brandName: "Audi" }, { name: "A4", brandName: "Audi" }, { name: "Q5", brandName: "Audi" }, { name: "A6", brandName: "Audi" }, { name: "Golf", brandName: "Volkswagen" }, { name: "Passat", brandName: "Volkswagen" }, { name: "Tiguan", brandName: "Volkswagen" }, { name: "Polo", brandName: "Volkswagen" }, { name: "Focus", brandName: "Ford" }, { name: "Fiesta", brandName: "Ford" }, { name: "Kuga", brandName: "Ford" }, { name: "Mondeo", brandName: "Ford" }, { name: "i20", brandName: "Hyundai" }, { name: "i30", brandName: "Hyundai" }, { name: "Tucson", brandName: "Hyundai" }, { name: "Elantra", brandName: "Hyundai" }, { name: "Sportage", brandName: "Kia" }, { name: "Ceed", brandName: "Kia" }, { name: "Rio", brandName: "Kia" }, { name: "Stonic", brandName: "Kia" }, { name: "Clio", brandName: "Renault" }, { name: "Megane", brandName: "Renault" }, { name: "Captur", brandName: "Renault" }, { name: "Kadjar", brandName: "Renault" }, { name: "208", brandName: "Peugeot" }, { name: "308", brandName: "Peugeot" }, { name: "3008", brandName: "Peugeot" }, { name: "508", brandName: "Peugeot" }, { name: "Egea", brandName: "Fiat" }, { name: "500", brandName: "Fiat" }, { name: "Doblo", brandName: "Fiat" }, { name: "Fiorino", brandName: "Fiat" }, { name: "Octavia", brandName: "Skoda" }, { name: "Superb", brandName: "Skoda" }, { name: "Kodiaq", brandName: "Skoda" }, { name: "Fabia", brandName: "Skoda" }, { name: "Astra", brandName: "Opel" }, { name: "Corsa", brandName: "Opel" }, { name: "Insignia", brandName: "Opel" }, { name: "Crossland", brandName: "Opel" }, ];
	const modelInsertData = modelsData.map(m => ({ name: m.name, brandId: brandMap.get(m.brandName) })).filter(m => m.brandId !== undefined);
	await prisma.model.createMany({ data: modelInsertData, skipDuplicates: true });
	const models = await prisma.model.findMany({ include: { brand: true } }); // Include brand here too
	const modelMap = new Map(models.map(m => [`${m.brandId}-${m.name}`, m]));
	console.log(`✅ ${models.length} model eklendi.`);

	// Versiyonlar
	console.log("📝 Versiyonlar ekleniyor...");
	const versionsData = [ { name: "1.6 Vision", modelName: "Corolla", brandName: "Toyota" }, { name: "1.5 Dream", modelName: "Corolla", brandName: "Toyota" }, { name: "1.8 Hybrid Dream", modelName: "Corolla", brandName: "Toyota" }, { name: "1.5 Flame X-Pack", modelName: "Corolla", brandName: "Toyota" }, { name: "1.5 VTEC Turbo Elegance", modelName: "Civic", brandName: "Honda" }, { name: "1.6 i-DTEC Elegance", modelName: "Civic", brandName: "Honda" }, { name: "1.5 VTEC Turbo Executive+", modelName: "Civic", brandName: "Honda" }, { name: "320i Sedan M Sport", modelName: "3 Serisi", brandName: "BMW" }, { name: "318i Sedan Sport Line", modelName: "3 Serisi", brandName: "BMW" }, { name: "320d xDrive Sedan Luxury Line", modelName: "3 Serisi", brandName: "BMW" }, { name: "C 200 4MATIC AMG", modelName: "C Serisi", brandName: "Mercedes-Benz" }, { name: "C 180 Avantgarde", modelName: "C Serisi", brandName: "Mercedes-Benz" }, { name: "1.0 TSI Life", modelName: "Golf", brandName: "Volkswagen" }, { name: "1.5 eTSI R-Line", modelName: "Golf", brandName: "Volkswagen" }, { name: "1.0 TSI Impression", modelName: "Golf", brandName: "Volkswagen" }, { name: "1.5 Ti-VCT TrendX", modelName: "Focus", brandName: "Ford" }, { name: "1.0 EcoBoost Titanium", modelName: "Focus", brandName: "Ford" }, { name: "1.5 EcoBlue ST-Line", modelName: "Focus", brandName: "Ford" }, { name: "1.4 Fire Easy", modelName: "Egea", brandName: "Fiat" }, { name: "1.3 Multijet Urban", modelName: "Egea", brandName: "Fiat" }, { name: "1.6 Multijet Lounge", modelName: "Egea", brandName: "Fiat" }, { name: "1.0 TCe Joy", modelName: "Clio", brandName: "Renault" }, { name: "1.0 TCe Touch", modelName: "Clio", brandName: "Renault" }, { name: "1.3 TCe Icon", modelName: "Clio", brandName: "Renault" }, { name: "1.3 TCe Joy", modelName: "Megane", brandName: "Renault" }, { name: "1.5 Blue dCi Touch", modelName: "Megane", brandName: "Renault" }, { name: "1.3 TCe Icon", modelName: "Megane", brandName: "Renault" }, { name: "1.4 MPI Jump", modelName: "i20", brandName: "Hyundai" }, { name: "1.0 T-GDI Style", modelName: "i20", brandName: "Hyundai" }, { name: "1.4 MPI Elite", modelName: "i20", brandName: "Hyundai" }, ];
	const versionInsertData = [];
	for (const v of versionsData) {
		const brandId = brandMap.get(v.brandName);
		if (!brandId) continue;
		const model = modelMap.get(`${brandId}-${v.modelName}`);
		if (model) {
			versionInsertData.push({ name: v.name, modelId: model.id });
		} else {
			console.warn(`⚠️ Model bulunamadı: ${v.brandName} - ${v.modelName}`);
		}
	}
	await prisma.version.createMany({ data: versionInsertData, skipDuplicates: true });
	const versions = await prisma.version.findMany({ include: { model: { include: { brand: true } } } }); // Include model and brand
	console.log(`✅ ${versions.length} versiyon eklendi.`);

	// BodyTypeVersion ilişkileri
	console.log("📝 Versiyon-Gövde tipi ilişkileri ekleniyor...");
	const bodyTypeVersionInsertData = [];
	for (const version of versions) {
		// Ensure version.model exists before accessing name
		if (!version.model) {
			console.warn(`⚠️ Version ID ${version.id} için model bilgisi eksik, atlanıyor.`);
			continue;
		}
		const modelName = version.model.name.toLowerCase();
		let possibleBodyTypeIds = [];
		// --- Body type assignment logic (same as before) ---
		if (modelName.includes("corolla") || modelName.includes("civic") || modelName.includes("megane") || modelName.includes("egea") || modelName.includes("focus") || modelName.includes("astra") || modelName.includes("octavia") || modelName.includes("3 serisi") || modelName.includes("c serisi") || modelName.includes("a4") || modelName.includes("passat") || modelName.includes("mondeo") || modelName.includes("elantra") || modelName.includes("insignia") || modelName.includes("superb") || modelName.includes("508") || modelName.includes("5 serisi") || modelName.includes("a6") || modelName.includes("e serisi")) { possibleBodyTypeIds.push(bodyTypeMap.get("Sedan")); if (Math.random() > 0.3) possibleBodyTypeIds.push(bodyTypeMap.get("Station Wagon")); }
		if (modelName.includes("golf") || modelName.includes("clio") || modelName.includes("polo") || modelName.includes("fiesta") || modelName.includes("corsa") || modelName.includes("fabia") || modelName.includes("i20") || modelName.includes("rio") || modelName.includes("208") || modelName.includes("a3") || modelName.includes("1 serisi") || modelName.includes("a serisi") || modelName.includes("ceed") || modelName.includes("308") || modelName.includes("yaris")) { possibleBodyTypeIds.push(bodyTypeMap.get("Hatchback")); }
		if (modelName.includes("rav4") || modelName.includes("cr-v") || modelName.includes("tiguan") || modelName.includes("kuga") || modelName.includes("tucson") || modelName.includes("sportage") || modelName.includes("captur") || modelName.includes("kadjar") || modelName.includes("3008") || modelName.includes("kodiaq") || modelName.includes("crossland") || modelName.includes("q5") || modelName.includes("x3") || modelName.includes("glc") || modelName.includes("c-hr") || modelName.includes("x5") || modelName.includes("stonic")) { possibleBodyTypeIds.push(bodyTypeMap.get("SUV")); }
		if (modelName.includes("doblo") || modelName.includes("fiorino")) { possibleBodyTypeIds.push(bodyTypeMap.get("MPV")); }
		if (modelName.includes("500")) { possibleBodyTypeIds.push(bodyTypeMap.get("Hatchback")); if (Math.random() > 0.5) possibleBodyTypeIds.push(bodyTypeMap.get("Cabrio")); }
		if (modelName.includes("3 serisi") || modelName.includes("c serisi")) { if (Math.random() > 0.8) possibleBodyTypeIds.push(bodyTypeMap.get("Coupe")); if (Math.random() > 0.9) possibleBodyTypeIds.push(bodyTypeMap.get("Cabrio")); }
		// --- End Body type assignment ---
		if (possibleBodyTypeIds.length === 0) {
			const randomBodyType = getRandomElement(bodyTypes);
			if (randomBodyType) possibleBodyTypeIds.push(randomBodyType.id);
		}
		possibleBodyTypeIds = [...new Set(possibleBodyTypeIds.filter(id => id !== undefined))];
		for (const bodyTypeId of possibleBodyTypeIds) {
			if(bodyTypeId) { // Ensure bodyTypeId is valid
				bodyTypeVersionInsertData.push({ versionId: version.id, bodyTypeId: bodyTypeId });
			} else {
				console.warn(`⚠️ Geçersiz bodyTypeId atlanıyor (Version ID: ${version.id})`);
			}
		}
	}
	await prisma.bodyTypeVersion.createMany({ data: bodyTypeVersionInsertData, skipDuplicates: true });
	const bodyTypeVersions = await prisma.bodyTypeVersion.findMany({
		include: { version: { include: { model: true } }, bodyType: true }, // Include necessary relations
	});
	console.log(`✅ ${bodyTypeVersions.length} Versiyon-Gövde Tipi ilişkisi eklendi.`);

	// FuelTypeBody ilişkileri
	console.log("📝 Gövde-Yakıt ilişkileri ekleniyor...");
	const fuelTypeBodyInsertData = [];
	for (const btv of bodyTypeVersions) {
		// Check if necessary relations exist
		if (!btv || !btv.version || !btv.bodyType || !btv.version.model ) {
			console.warn(`⚠️ BodyTypeVersion ID ${btv?.id} için eksik ilişki verisi, FuelTypeBody oluşturma atlanıyor.`);
			continue;
		}
		let possibleFuelTypeIds = [];
		const versionLower = btv.version.name.toLowerCase();
		const bodyTypeLower = btv.bodyType.name.toLowerCase();
		const modelNameLower = btv.version.model.name.toLowerCase();
		// --- Fuel type assignment logic (same as before) ---
		possibleFuelTypeIds.push(fuelTypeMap.get("Benzin"));
		if (bodyTypeLower !== 'coupe' && bodyTypeLower !== 'cabrio' && bodyTypeLower !== 'roadster' && !versionLower.includes('tsi') && !versionLower.includes('tce') && !versionLower.includes('ecoboost') && !versionLower.includes('vtec') && Math.random() > 0.2) { possibleFuelTypeIds.push(fuelTypeMap.get("Dizel")); }
		if (Math.random() > 0.6) { possibleFuelTypeIds.push(fuelTypeMap.get("Benzin+LPG")); }
		if (versionLower.includes('hybrid') || versionLower.includes('etsi')) { possibleFuelTypeIds.push(fuelTypeMap.get("Hibrit")); possibleFuelTypeIds = possibleFuelTypeIds.filter(id => id !== fuelTypeMap.get("Dizel")); }
		if (versionLower.includes('electric') || versionLower.includes('ev') || modelNameLower.includes('zoe') || modelNameLower.includes('kona electric')) { possibleFuelTypeIds = [fuelTypeMap.get("Elektrik")]; }
		if (versionLower.includes('dci') || versionLower.includes('multijet') || versionLower.includes('ecoblue') || versionLower.includes('cdi') || versionLower.includes('dtec') || versionLower.includes('tdi') || versionLower.includes('20d') || versionLower.includes('bluehdi')) { possibleFuelTypeIds.push(fuelTypeMap.get("Dizel")); possibleFuelTypeIds = possibleFuelTypeIds.filter(id => id !== fuelTypeMap.get("Benzin+LPG")); }
		// --- End Fuel type assignment ---
		possibleFuelTypeIds = [...new Set(possibleFuelTypeIds.filter(id => id !== undefined))];
		for (const fuelTypeId of possibleFuelTypeIds) {
			if(fuelTypeId){ // Ensure fuelTypeId is valid
				fuelTypeBodyInsertData.push({ bodyVersionId: btv.id, fuelTypeId });
			} else {
				console.warn(`⚠️ Geçersiz fuelTypeId atlanıyor (BodyTypeVersion ID: ${btv.id})`);
			}
		}
	}
	await prisma.fuelTypeBody.createMany({ data: fuelTypeBodyInsertData, skipDuplicates: true });
	// *** THIS IS THE CRITICAL QUERY *** Ensure it's exactly like this
	const fuelTypeBodies = await prisma.fuelTypeBody.findMany({
		include: {
			fuelType: true,         // Include FuelType
			bodyVersion: {         // Include BodyTypeVersion
				include: {
					bodyType: true, // Include BodyType from BodyTypeVersion
					version: {       // Include Version from BodyTypeVersion
						include: {
							model: {       // Include Model from Version
								include: {
									brand: true  // <<<--- Include Brand from Model
								}
							}
						}
					}
				}
			}
		}
	});
	console.log(`✅ ${fuelTypeBodies.length} Gövde-Yakıt ilişkisi eklendi.`);
	if (fuelTypeBodies.length === 0 && fuelTypeBodyInsertData.length > 0) {
		console.warn("⚠️ Uyarı: FuelTypeBody kayıtları eklendi ancak sorgu boş döndü. İlişki veya sorgu hatası olabilir.");
	}


	// TransmissionTypeFuel ilişkileri
	console.log("📝 Yakıt-Vites ilişkileri ekleniyor...");
	const transmissionTypeFuelInsertData = [];
	for (const ftb of fuelTypeBodies) {

		// --- DEBUGGING START (Kept from previous step) ---
		if (!ftb) { console.error("❌ DEBUG: Mevcut 'ftb' objesi tanımsız."); continue; }
		if (!ftb.bodyVersion) { console.error(`❌ DEBUG: 'ftb.bodyVersion' tanımsız. (ftb ID: ${ftb.id})`); continue; }
		// Add check for bodyType within bodyVersion
		if (!ftb.bodyVersion.bodyType) { console.error(`❌ DEBUG: 'ftb.bodyVersion.bodyType' tanımsız. (ftb ID: ${ftb.id}, bodyVersion ID: ${ftb.bodyVersion.id})`); continue; }
		if (!ftb.bodyVersion.version) { console.error(`❌ DEBUG: 'ftb.bodyVersion.version' tanımsız. (ftb ID: ${ftb.id}, bodyVersion ID: ${ftb.bodyVersion.id})`); continue; }
		if (!ftb.bodyVersion.version.model) { console.error(`❌ DEBUG: 'ftb.bodyVersion.version.model' tanımsız. (ftb ID: ${ftb.id}, version ID: ${ftb.bodyVersion.version.id})`); continue; }
		if (!ftb.bodyVersion.version.model.brand) {
			console.error(`❌ DEBUG: 'ftb.bodyVersion.version.model.brand' tanımsız. (ftb ID: ${ftb.id}, model ID: ${ftb.bodyVersion.version.model.id})`);
			try { console.log("Problematic ftb object structure:", JSON.stringify(ftb, null, 2)); }
			catch (stringifyError) { console.error("DEBUG: ftb objesi JSON.stringify ile loglanamadı."); }
			continue;
		}
		// Check if name exists on the brand object
		if (typeof ftb.bodyVersion.version.model.brand.name === 'undefined') {
			console.error(`❌ DEBUG: 'ftb.bodyVersion.version.model.brand.name' tanımsız! (brand ID: ${ftb.bodyVersion.version.model.brand.id})`);
			continue;
		}
		// Check fuelType name
		if(!ftb.fuelType || typeof ftb.fuelType.name === 'undefined'){
			console.error(`❌ DEBUG: 'ftb.fuelType.name' tanımsız! (ftb ID: ${ftb.id})`);
			continue;
		}
		// Check version name
		if(typeof ftb.bodyVersion.version.name === 'undefined'){
			console.error(`❌ DEBUG: 'ftb.bodyVersion.version.name' tanımsız! (version ID: ${ftb.bodyVersion.version.id})`);
			continue;
		}
		// --- DEBUGGING END ---


		let possibleTransmissionIds = [];
		const fuelTypeLower = ftb.fuelType.name.toLowerCase(); // Should be safe now
		const versionLower = ftb.bodyVersion.version.name.toLowerCase(); // Should be safe now

		// --- More Robust Access for brandNameLower (Line ~223 original intent) ---
		let brandNameLower = ''; // Default value
		const brand = ftb.bodyVersion.version.model.brand; // We know brand exists from checks
		// Ensure brand.name is accessible and a string before using toLowerCase()
		if (brand && typeof brand.name === 'string') {
			brandNameLower = brand.name.toLowerCase();
		} else {
			// Log if something unexpected happened despite earlier checks
			console.warn(`⚠️ WARN: brand.name erişiminde sorun! ftb ID: ${ftb.id}, Brand: ${JSON.stringify(brand)}`);
			// Assign a default or skip if critical
			brandNameLower = 'unknown_brand'; // Assign a default to avoid downstream errors
			// continue; // Or skip this record entirely if brand name is essential
		}
		// --- End Robust Access ---


		// --- Transmission assignment logic (same as before) ---
		if (fuelTypeLower === 'benzin' || fuelTypeLower === 'dizel' || fuelTypeLower === 'benzin+lpg') { possibleTransmissionIds.push(transmissionTypeMap.get("Manuel")); if (Math.random() > 0.3) possibleTransmissionIds.push(transmissionTypeMap.get("Otomatik")); if (Math.random() > 0.7 && fuelTypeLower === 'dizel') possibleTransmissionIds.push(transmissionTypeMap.get("Yarı Otomatik")); if ((brandNameLower.includes('volkswagen') || brandNameLower.includes('audi') || brandNameLower.includes('skoda') || brandNameLower.includes('seat')) && (versionLower.includes('tsi') || versionLower.includes('tfsi') || Math.random() > 0.7)) possibleTransmissionIds.push(transmissionTypeMap.get("DSG")); if ((brandNameLower.includes('bmw') || brandNameLower.includes('mercedes') || brandNameLower.includes('audi')) && Math.random() > 0.7) possibleTransmissionIds.push(transmissionTypeMap.get("Tiptronic")); }
		if (fuelTypeLower === 'hibrit') { possibleTransmissionIds.push(transmissionTypeMap.get("Otomatik")); if (Math.random() > 0.4 || brandNameLower.includes("toyota")) possibleTransmissionIds.push(transmissionTypeMap.get("CVT")); }
		if (fuelTypeLower === 'elektrik') { possibleTransmissionIds.push(transmissionTypeMap.get("Otomatik")); }
		if (versionLower.includes('otomatik') || versionLower.includes('auto') || versionLower.includes('dsg') || versionLower.includes('cvt') || versionLower.includes('edc') || versionLower.includes('eat')) { possibleTransmissionIds.push(transmissionTypeMap.get("Otomatik")); if (versionLower.includes('dsg')) possibleTransmissionIds.push(transmissionTypeMap.get("DSG")); if (versionLower.includes('cvt')) possibleTransmissionIds.push(transmissionTypeMap.get("CVT")); if (possibleTransmissionIds.length > 1 && Math.random() > 0.2) { possibleTransmissionIds = possibleTransmissionIds.filter(id => id !== transmissionTypeMap.get("Manuel")); } }
		// --- End Transmission assignment ---
		possibleTransmissionIds = [...new Set(possibleTransmissionIds.filter(id => id !== undefined))];
		if (possibleTransmissionIds.length === 0) {
			const randomTransmission = getRandomElement(transmissionTypes);
			if (randomTransmission) possibleTransmissionIds.push(randomTransmission.id);
		}
		for (const transmissionTypeId of possibleTransmissionIds) {
			if(transmissionTypeId){ // Ensure transmissionTypeId is valid
				transmissionTypeFuelInsertData.push({ fuelBodyId: ftb.id, transmissionTypeId });
			} else {
				console.warn(`⚠️ Geçersiz transmissionTypeId atlanıyor (FuelTypeBody ID: ${ftb.id})`);
			}
		}
	}
	await prisma.transmissionTypeFuel.createMany({ data: transmissionTypeFuelInsertData, skipDuplicates: true });
	// Include necessary data for VehicleYear creation
	const transmissionTypeFuels = await prisma.transmissionTypeFuel.findMany({
		include: {
			transmissionType: true, // Potentially useful later
			// Include the chain again if needed by VehicleYear/Mileage logic, otherwise keep lean
			// fuelBody: { include: { bodyVersion: { include: { version: { include: { model: { include: { brand: true } } } } } } } }
		}
	});
	console.log(`✅ ${transmissionTypeFuels.length} Yakıt-Vites ilişkisi eklendi.`);


	// Araç yılları
	console.log("📝 Araç yılları ekleniyor...");
	const currentYear = new Date().getFullYear();
	const vehicleYearInsertData = [];
	const startYear = currentYear - 15;
	if (transmissionTypeFuels.length > 0) {
		for (const ttf of transmissionTypeFuels) {
			const numYears = Math.floor(Math.random() * 8) + 5;
			for (let i = 0; i < numYears; i++) {
				const year = currentYear - Math.floor(Math.random() * (currentYear - startYear + 1));
				vehicleYearInsertData.push({ year, transmissionTypeFuelId: ttf.id });
			}
		}
	} else {
		console.warn("⚠️ Hiç TransmissionTypeFuel bulunamadı, Araç Yılları oluşturulamıyor.");
	}
	const uniqueVehicleYears = Array.from(new Map(vehicleYearInsertData.map(item => [`${item.transmissionTypeFuelId}-${item.year}`, item])).values());
	if (uniqueVehicleYears.length > 0) {
		await prisma.vehicleYear.createMany({ data: uniqueVehicleYears, skipDuplicates: true });
	}
	const vehicleYears = await prisma.vehicleYear.findMany();
	console.log(`✅ ${vehicleYears.length} Araç yılı eklendi.`);


	// Kilometre aralıkları
	console.log("📝 Kilometre aralıkları ekleniyor...");
	const mileageRanges = [ { minKm: 0, maxKm: 5000 }, { minKm: 5001, maxKm: 15000 }, { minKm: 15001, maxKm: 30000 }, { minKm: 30001, maxKm: 50000 }, { minKm: 50001, maxKm: 75000 }, { minKm: 75001, maxKm: 100000 }, { minKm: 100001, maxKm: 130000 }, { minKm: 130001, maxKm: 160000 }, { minKm: 160001, maxKm: 200000 }, { minKm: 200001, maxKm: 250000 }, { minKm: 250001, maxKm: 300000 }, { minKm: 300001, maxKm: 400000 } ];
	const mileageInsertData = [];
	if (vehicleYears.length > 0) {
		for (const vy of vehicleYears) {
			const age = currentYear - vy.year;
			let relevantRanges = mileageRanges;
			if (age <= 1) relevantRanges = mileageRanges.slice(0, 4);
			else if (age <= 3) relevantRanges = mileageRanges.slice(0, 7);
			else if (age <= 7) relevantRanges = mileageRanges.slice(2, 10);
			else relevantRanges = mileageRanges.slice(5);
			const selectedRanges = getRandomSubset(relevantRanges, 3, 5);
			for (const range of selectedRanges) {
				mileageInsertData.push({ minKm: range.minKm, maxKm: range.maxKm, vehicleYearId: vy.id });
			}
		}
	} else {
		console.warn("⚠️ Hiç VehicleYear bulunamadı, Kilometre Aralıkları oluşturulamıyor.");
	}
	const uniqueMileages = Array.from(new Map(mileageInsertData.map(item => [`${item.vehicleYearId}-${item.minKm}-${item.maxKm}`, item])).values());
	if (uniqueMileages.length > 0) {
		await prisma.mileage.createMany({ data: uniqueMileages, skipDuplicates: true });
	}
	const mileages = await prisma.mileage.findMany();
	console.log(`✅ ${mileages.length} Kilometre kaydı eklendi.`);


	// ColorMileage ilişkileri
	console.log("📝 Renk-Kilometre ilişkileri ekleniyor...");
	const colorMileageInsertData = [];
	if (mileages.length > 0) {
		for (const mileage of mileages) {
			const numberOfColors = Math.floor(Math.random() * 4) + 2;
			const selectedColors = getRandomSubset(colors, numberOfColors, numberOfColors);
			for (const color of selectedColors) {
				if(color && color.id){ // Ensure color is valid
					colorMileageInsertData.push({ mileageId: mileage.id, colorId: color.id });
				} else {
					console.warn(`⚠️ Geçersiz renk objesi atlanıyor (Mileage ID: ${mileage.id})`);
				}
			}
		}
	} else {
		console.warn("⚠️ Hiç Mileage bulunamadı, Renk-Kilometre ilişkileri oluşturulamıyor.");
	}
	const uniqueColorMileages = Array.from(new Map(colorMileageInsertData.map(item => [`${item.mileageId}-${item.colorId}`, item])).values());
	if(uniqueColorMileages.length > 0) {
		await prisma.colorMileage.createMany({ data: uniqueColorMileages, skipDuplicates: true });
	}
	const colorMileages = await prisma.colorMileage.findMany();
	console.log(`✅ ${colorMileages.length} Renk-Kilometre ilişkisi eklendi.`);


	// Kaza kayıtları
	console.log("📝 Kaza kayıtları ekleniyor...");
	const accidentRecordInsertData = [];
	if (colorMileages.length > 0) {
		for (const cm of colorMileages) {
			const hasAccident = Math.random() > 0.65;
			let amount = null;
			if (hasAccident) {
				amount = Math.floor(Math.random() * 49001) + 1000;
				amount = Math.round(amount / 100) * 100;
			}
			accidentRecordInsertData.push({ status: hasAccident ? "Exists" : "None", amount: amount, colorMileageId: cm.id });
		}
		await prisma.accidentRecord.createMany({ data: accidentRecordInsertData });
	} else {
		console.warn("⚠️ Hiç ColorMileage bulunamadı, Kaza Kayıtları oluşturulamıyor.");
	}
	const accidentRecords = await prisma.accidentRecord.findMany();
	console.log(`✅ ${accidentRecords.length} Kaza kaydı eklendi.`);


	// Araçlar
	console.log("📝 Araçlar ekleniyor...");
	const vehicleInsertData = [];
	const descriptions = [ "Çok temiz, sigara içilmemiş.", "Bakımları zamanında yetkili serviste yapıldı.", "İlk sahibinden, garaj arabası.", "Muayenesi yeni yapıldı.", "Masrafsız, dosta gider.", "Değişensiz, boyasız.", "Sadece tamponda lokal boya var.", "Aile aracı olarak kullanıldı.", "İçi dışı pırıl pırıl.", "Tramer kaydı sadece 1500 TL.", "Lastikleri yeni.", "Yakıt cimrisi.", "Performansı yüksek.", "Full+Full donanım." ];
	const listingStatuses = ["Active", "Active", "Active", "Active", "Sold", "Pending", "Cancelled"];

	if (accidentRecords.length > 0) {
		// İlişkili verileri toplu çekelim
		const detailedAccidentRecords = await prisma.accidentRecord.findMany({
			// take: 5000, // Limit if needed
			include: { // Include the full chain needed for pricing and description
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
		});
		console.log(`📝 ${detailedAccidentRecords.length} adet detaylı kaza kaydı üzerinden Araçlar oluşturuluyor...`);

		for (const ar of detailedAccidentRecords) {
			const cm = ar.colorMileage;
			// Robust check for the entire data chain needed
			if (!ar || !cm?.mileage?.vehicleYear?.transmissionTypeFuel?.fuelBody?.bodyVersion?.version?.model?.brand?.name || !cm?.mileage?.vehicleYear?.transmissionTypeFuel?.fuelBody?.bodyVersion?.bodyType?.name || !cm?.mileage?.vehicleYear?.transmissionTypeFuel?.fuelBody?.fuelType?.name || !cm?.mileage?.vehicleYear?.transmissionTypeFuel?.transmissionType?.name) {
				console.warn(`❗️ Araç oluşturma için eksik veri zinciri. AccidentRecord ID: ${ar?.id}, ColorMileage ID: ${cm?.id}. Atlanıyor.`);
				continue;
			}

			// Data extraction (should be safe now due to the check above)
			const brandName = cm.mileage.vehicleYear.transmissionTypeFuel.fuelBody.bodyVersion.version.model.brand.name;
			const modelName = cm.mileage.vehicleYear.transmissionTypeFuel.fuelBody.bodyVersion.version.model.name;
			const year = cm.mileage.vehicleYear.year;
			const mileageKm = cm.mileage.minKm + Math.floor(Math.random() * (cm.mileage.maxKm - cm.mileage.minKm + 1));
			const bodyType = cm.mileage.vehicleYear.transmissionTypeFuel.fuelBody.bodyVersion.bodyType.name;
			const fuelType = cm.mileage.vehicleYear.transmissionTypeFuel.fuelBody.fuelType.name;
			const transmissionType = cm.mileage.vehicleYear.transmissionTypeFuel.transmissionType.name;


			// --- Fiyat Hesaplama (Aynı mantık) ---
			let basePrice = 300000;
			if (["BMW", "Mercedes-Benz", "Audi"].includes(brandName)) basePrice *= 1.8; else if (["Volkswagen", "Honda"].includes(brandName)) basePrice *= 1.3; else if (["Toyota", "Skoda"].includes(brandName)) basePrice *= 1.1; else if (["Fiat", "Renault", "Hyundai", "Kia", "Peugeot", "Opel"].includes(brandName)) basePrice *= 0.9;
			const age = Math.max(0, currentYear - year);
			basePrice *= Math.pow(0.92, age);
			basePrice *= Math.pow(0.985, mileageKm / 10000);
			if (bodyType === 'SUV') basePrice *= 1.15; else if (bodyType === 'Coupe' || bodyType === 'Cabrio') basePrice *= 1.1; else if (bodyType === 'Station Wagon' || bodyType === 'MPV') basePrice *= 0.95;
			if (fuelType === 'Hibrit') basePrice *= 1.1; else if (fuelType === 'Elektrik') basePrice *= 1.2; else if (fuelType === 'Dizel') basePrice *= 1.05; else if (fuelType === 'LPG' || fuelType === 'Benzin+LPG') basePrice *= 0.98;
			if (!['Manuel'].includes(transmissionType)) basePrice *= 1.08; if (['DSG', 'CVT', 'Tiptronic'].includes(transmissionType)) basePrice *= 1.03;
			if (ar.status === "Exists" && ar.amount) { const priceRatio = basePrice > 0 ? ar.amount / basePrice : 1; const accidentFactor = Math.min(0.5, priceRatio); basePrice *= (1 - accidentFactor * 0.8); }
			basePrice *= (1 + (Math.random() - 0.5) * 0.1);
			const finalPrice = Math.max(75000, Math.round(basePrice / 1000) * 1000);
			// --- End Fiyat Hesaplama ---

			const description = `${year} ${brandName} ${modelName} - ${getRandomElement(descriptions)}`;
			const listingStatus = getRandomElement(listingStatuses);

			vehicleInsertData.push({ price: finalPrice, description: description, listingStatus: listingStatus, accidentRecordId: ar.id, });
		}
	} else {
		console.warn("⚠️ Hiç AccidentRecord bulunamadı, Araçlar oluşturulamıyor.");
	}

	let createdVehicleCount = 0;
	if (vehicleInsertData.length > 0) {
		console.log(`📝 ${vehicleInsertData.length} araç verisi ekleniyor...`);
		// Insert vehicles one by one with error handling
		for (const data of vehicleInsertData) {
			try {
				await prisma.vehicle.create({ data });
				createdVehicleCount++;
			} catch (error) {
				console.error(`❌ Araç eklenirken hata (AccidentRecordId: ${data.accidentRecordId}):`, error.message);
			}
		}
	}

	console.log(`✅ ${createdVehicleCount} Araç başarıyla eklendi.`);
	if(vehicleInsertData.length > 0) {
		console.log(`⚠️ ${vehicleInsertData.length - createdVehicleCount} araç eklenirken hata oluştu.`);
	}

	console.log("✅ Seed işlemi başarıyla tamamlandı!");
}

async function clearDatabase() {
	console.log("🗑️ Veritabanı temizleniyor (Önce bağımlı tablolar)...");
	// Delete order is critical due to relations
	await prisma.vehicleOffer.deleteMany({});
	await prisma.vehicle.deleteMany({});
	await prisma.accidentRecord.deleteMany({});
	await prisma.colorMileage.deleteMany({});
	await prisma.mileage.deleteMany({});
	await prisma.vehicleYear.deleteMany({});
	await prisma.transmissionTypeFuel.deleteMany({});
	await prisma.fuelTypeBody.deleteMany({});
	await prisma.bodyTypeVersion.deleteMany({});
	// Delete main types after dependent join tables
	await prisma.color.deleteMany({});
	await prisma.transmissionType.deleteMany({});
	await prisma.fuelType.deleteMany({});
	await prisma.bodyType.deleteMany({});
	await prisma.version.deleteMany({});
	await prisma.model.deleteMany({});
	await prisma.brand.deleteMany({});
	console.log("🗑️ Veritabanı temizlendi.");
}

// main fonksiyonunu çağır ve promise'i handle et
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("💥 Seed işlemi sırasında kritik hata oluştu:", e); // Changed emoji for critical error
		await prisma.$disconnect();
		process.exit(1);
	});