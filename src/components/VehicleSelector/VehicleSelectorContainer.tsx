"use client";

import { useState, useEffect, FormEvent } from "react";
import StepIndicator from "./StepIndicator";
import VehicleResult from "./VehicleResult";
import SelectionSummaryCard from "./SelectionSummaryCard";

// Seçim adımlarını tanımla
const STEPS = [
	"yıl",
	"marka",
	"model",
	"versiyon",
	"gövde tipi",
	"yakıt tipi",
	"vites tipi",
	"renk",
	"kilometre",
	"kaza durumu",
	"onay" // Onay adımı ekledik
];

// Seçim parametreleri için tip tanımı
export interface SelectionParams {
	brandId?: number;
	modelId?: number;
	versionId?: number;
	bodyTypeId?: number;
	fuelTypeId?: number;
	transmissionTypeId?: number;
	year?: number;
	kilometer?: number; // minKm ve maxKm yerine tek bir kilometre değeri
	colorId?: number;
	accidentStatus?: string;
	accidentAmount?: number;
}

// Genel option tipi - hiyerarşideki tüm seçenek türleri için
interface Option {
	id?: number;
	name?: string;
	year?: number;
	kilometer?: number; // minKm ve maxKm yerine tek bir kilometre değeri
	status?: string;
	[key: string]: any; // Ek alanlar için
}

export function VehicleSelectorContainer() {
	// Mevcut adım durumu
	const [currentStep, setCurrentStep] = useState(0);

	// Kullanıcı seçimleri
	const [selections, setSelections] = useState<SelectionParams>({});

	// Seçilen değerlerin görünen adları (özet kart için)
	const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

	// Mevcut adımda gösterilen seçenekler
	const [options, setOptions] = useState<Option[]>([]);

	// Yükleme durumu
	const [loading, setLoading] = useState(true);

	// API hata mesajı
	const [error, setError] = useState<string | null>(null);

	// Teklif durumu
	const [offerStatus, setOfferStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

	// Seçim sonucu (varsa)
	const [result, setResult] = useState<any[] | null>(null);

	// Input değerleri için state'ler
	const [kilometerInput, setKilometerInput] = useState<string>(""); // Tek kilometre input'u
	const [accidentStatusInput, setAccidentStatusInput] = useState<string>("None");
	const [accidentAmountInput, setAccidentAmountInput] = useState<string>("");

	// Adım değiştikçe ya da seçimler değiştikçe seçenekleri güncelle
	useEffect(() => {
		async function fetchOptions() {
			if (currentStep === STEPS.length - 1) {
				// Onay adımında API çağrısına gerek yok
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams();
				queryParams.append("step", STEPS[currentStep]);

				// Mevcut parametreleri ekle
				if (selections.year) queryParams.append("year", selections.year.toString());
				if (selections.brandId) queryParams.append("brandId", selections.brandId.toString());
				if (selections.modelId) queryParams.append("modelId", selections.modelId.toString());
				if (selections.versionId) queryParams.append("versionId", selections.versionId.toString());
				if (selections.bodyTypeId) queryParams.append("bodyTypeId", selections.bodyTypeId.toString());
				if (selections.fuelTypeId) queryParams.append("fuelTypeId", selections.fuelTypeId.toString());
				if (selections.transmissionTypeId) queryParams.append("transmissionTypeId", selections.transmissionTypeId.toString());

				// Renk, kilometre ve kaza durumu için özel işlem
				if (currentStep === 7) {
					// Renk adımı - hiyerarşiden bağımsız olarak tüm renkleri getir
					queryParams.append("independentQuery", "colors");
				} else if (currentStep === 8) {
					// Kilometre için form gösterilecek, API isteği gerekmez
					setLoading(false);
					return;
				} else if (currentStep === 9) {
					// Kaza durumu için form gösterilecek, API isteği gerekmez
					setLoading(false);
					return;
				} else {
					// Diğer parametreler normal şekilde eklenir
					if (selections.colorId) queryParams.append("colorId", selections.colorId.toString());
					if (selections.kilometer) queryParams.append("kilometer", selections.kilometer.toString());
					if (selections.accidentStatus) queryParams.append("accidentStatus", selections.accidentStatus);
					if (selections.accidentAmount) queryParams.append("accidentAmount", selections.accidentAmount.toString());
				}

				const response = await fetch(`/api/vehicle?${queryParams}`);

				if (!response.ok) {
					throw new Error(`API hatası: ${response.status} ${response.statusText}`);
				}

				const data = await response.json();

				if (data.type === "error") {
					setError(data.message);
					setOptions([]);
				} else {
					setOptions(data.data || []);

					if (data.type === "vehicles") {
						setResult(data.data);
					} else {
						setResult(null);
					}
				}
			} catch (error) {
				console.error("Seçenekler yüklenirken hata oluştu:", error);
				setError("Seçenekler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
				setOptions([]);
			} finally {
				setLoading(false);
			}
		}

		fetchOptions();
	}, [currentStep, selections]);

	// Bir seçenek seçildiğinde
	const handleSelect = (option: Option) => {
		// Mevcut adıma göre seçim parametrelerini güncelle
		const newSelections = { ...selections };
		const newSelectedOptions = { ...selectedOptions };

		switch (currentStep) {
			case 0: // Yıl
				newSelections.year = option.year;
				newSelectedOptions[STEPS[currentStep]] = option.year?.toString() || "";
				break;
			case 1: // Marka
				newSelections.brandId = option.id;
				newSelectedOptions[STEPS[currentStep]] = option.name || "";
				break;
			case 2: // Model
				newSelections.modelId = option.id;
				newSelectedOptions[STEPS[currentStep]] = option.name || "";
				break;
			case 3: // Versiyon
				newSelections.versionId = option.id;
				newSelectedOptions[STEPS[currentStep]] = option.name || "";
				break;
			case 4: // Gövde tipi
				newSelections.bodyTypeId = option.id;
				newSelectedOptions[STEPS[currentStep]] = option.name || "";
				break;
			case 5: // Yakıt tipi
				newSelections.fuelTypeId = option.id;
				newSelectedOptions[STEPS[currentStep]] = option.name || "";
				break;
			case 6: // Vites tipi
				newSelections.transmissionTypeId = option.id;
				newSelectedOptions[STEPS[currentStep]] = option.name || "";
				break;
			case 7: // Renk - Artık hiyerarşiden bağımsız
				newSelections.colorId = option.id;
				newSelectedOptions[STEPS[currentStep]] = option.name || "";
				break;
		}

		setSelections(newSelections);
		setSelectedOptions(newSelectedOptions);
		setCurrentStep(currentStep + 1);
	};

	// Kilometre input formunu gönderme
	const handleKilometerSubmit = (e: FormEvent) => {
		e.preventDefault();

		const kilometer = parseInt(kilometerInput);

		// Validasyon kontrolleri
		if (isNaN(kilometer) || kilometer < 0) {
			setError("Lütfen geçerli bir kilometre değeri girin");
			return;
		}

		// Seçimleri güncelle
		const newSelections = { ...selections, kilometer };
		const newSelectedOptions = { ...selectedOptions };
		newSelectedOptions[STEPS[currentStep]] = `${kilometer} km`;

		setSelections(newSelections);
		setSelectedOptions(newSelectedOptions);
		setCurrentStep(currentStep + 1);
	};

	// Kaza durumu input formunu gönderme
	const handleAccidentStatusSubmit = (e: FormEvent) => {
		e.preventDefault();

		// Seçimleri hazırla
		const newSelections = { ...selections, accidentStatus: accidentStatusInput };
		const newSelectedOptions = { ...selectedOptions };
		newSelectedOptions[STEPS[currentStep]] = accidentStatusInput === "None" ? "Kazasız" : "Kazalı";

		// Eğer kaza durumu "Exists" ise kaza tutarını da ekle
		if (accidentStatusInput === "Exists") {
			const accidentAmount = parseFloat(accidentAmountInput);

			// Validasyon kontrolleri
			if (isNaN(accidentAmount) || accidentAmount <= 0) {
				setError("Lütfen geçerli bir hasar tutarı girin");
				return;
			}

			newSelections.accidentAmount = accidentAmount;
			newSelectedOptions["hasar tutarı"] = `${accidentAmount.toLocaleString("tr-TR")} ₺`;
		} else {
			// Kazasız durumda amount bilgisini kaldır
			delete newSelections.accidentAmount;
			delete newSelectedOptions["hasar tutarı"];
		}

		setSelections(newSelections);
		setSelectedOptions(newSelectedOptions);
		setCurrentStep(currentStep + 1);
	};

	// Teklif oluşturma işlemi
	const handleCreateOffer = async () => {
		// API isteği için veri hazırlama
		setOfferStatus("submitting");
		setError(null);

		try {
			const response = await fetch("/api/vehicle/offer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					selections: selections,
					displayValues: selectedOptions,
				}),
			});

			if (!response.ok) {
				throw new Error(`API hatası: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();

			if (data.success) {
				setOfferStatus("success");
				// Başarılı olduğunda sonraki adıma geç
				setCurrentStep(currentStep + 1);
			} else {
				setOfferStatus("error");
				setError(data.message || "Teklif oluşturulurken bir hata oluştu.");
			}
		} catch (error) {
			console.error("Teklif oluşturulurken hata oluştu:", error);
			setOfferStatus("error");
			setError("Teklif oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
		}
	};

	// Önceki adıma dönme
	const handleBack = () => {
		if (currentStep > 0) {
			// Mevcut adımın seçimini temizle
			const newSelections = { ...selections };
			const newSelectedOptions = { ...selectedOptions };

			switch (currentStep) {
				case 1: // Yıl'a dön
					delete newSelections.year;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					break;
				case 2: // Marka'ya dön
					delete newSelections.brandId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					break;
				case 3: // Model'e dön
					delete newSelections.modelId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					break;
				case 4: // Versiyon'a dön
					delete newSelections.versionId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					break;
				case 5: // Gövde tipine dön
					delete newSelections.bodyTypeId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					break;
				case 6: // Yakıt tipine dön
					delete newSelections.fuelTypeId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					break;
				case 7: // Vites tipine dön
					delete newSelections.transmissionTypeId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					break;
				case 8: // Renk'e dön (Artık hiyerarşiden bağımsız)
					delete newSelections.colorId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					break;
				case 9: // Kilometre'ye dön (Input alanı)
					delete newSelections.kilometer;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					setKilometerInput("");
					break;
				case 10: // Kaza durumuna dön (Input alanı)
					delete newSelections.accidentStatus;
					delete newSelections.accidentAmount;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					delete newSelectedOptions["hasar tutarı"];
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					break;
				case 11: // Onay adımından geri dönme
					// Onay adımından geri dönerken bir şey silmemize gerek yok
					break;
			}

			setSelections(newSelections);
			setSelectedOptions(newSelectedOptions);
			setCurrentStep(currentStep - 1);
		}
	};

	// Araç seçimini sıfırlama
	const handleReset = () => {
		setSelections({});
		setSelectedOptions({});
		setCurrentStep(0);
		setResult(null);
		setKilometerInput("");
		setAccidentStatusInput("None");
		setAccidentAmountInput("");
		setOfferStatus("idle");
	};

	// İşlem tamamlandı mı?
	const isComplete = result !== null && result.length > 0;

	// Seçenek gösterimi için yardımcı fonksiyon
	const getOptionDisplayValue = (option: Option): string => {
		if (option.name) {
			return option.name;
		}
		if (option.kilometer !== undefined) {
			return `${option.kilometer} km`;
		}
		if (option.year !== undefined) {
			return option.year.toString();
		}
		if (option.status) {
			return option.status === "None" ? "Kazasız" : "Kazalı";
		}
		return "";
	};

	// Seçenek için anahtar değeri yardımcı fonksiyon
	const getOptionKey = (option: Option, index: number): string => {
		if (option.id) {
			return option.id.toString();
		}
		if (option.kilometer !== undefined) {
			return `km-${option.kilometer}`;
		}
		if (option.year !== undefined) {
			return option.year.toString();
		}
		if (option.status) {
			return option.status;
		}
		return index.toString();
	};

	// Onay adımını render etme
	const renderConfirmationStep = () => {
		return (
			<div className="space-y-6">
				<div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
					<h3 className="text-xl font-semibold mb-4">Araç Teklifinizi Onaylayın</h3>
					<div className="grid grid-cols-2 gap-4 mb-6">
						{Object.entries(selectedOptions).map(([key, value]) => (
							<div key={key} className="flex justify-between">
								<span className="text-gray-600 capitalize">{key}:</span>
								<span className="font-medium">{value}</span>
							</div>
						))}
					</div>

					<div className="space-y-4 pt-4 border-t border-gray-200">
						<p className="text-gray-600">
							Yukarıdaki bilgileri onaylayarak araç teklifinizi oluşturabilirsiniz.
						</p>
						<div className="flex space-x-4">
							<button
								onClick={handleCreateOffer}
								disabled={offerStatus === "submitting"}
								className={`flex-1 py-2 px-4 ${
									offerStatus === "submitting"
										? "bg-gray-400"
										: "bg-green-500 hover:bg-green-600"
								} text-white rounded-lg transition`}
							>
								{offerStatus === "submitting" ? "İşleniyor..." : "Teklifi Oluştur"}
							</button>
							<button
								onClick={handleBack}
								disabled={offerStatus === "submitting"}
								className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
							>
								Geri Dön
							</button>
						</div>
					</div>

					{error && (
						<div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
							{error}
						</div>
					)}
				</div>
			</div>
		);
	};

	// Teklif başarı mesajını render etme
	const renderOfferSuccess = () => {
		return (
			<div className="p-6 bg-green-50 shadow-md rounded-lg border border-green-200">
				<div className="text-center">
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-green-800 mb-2">Teklif Başarıyla Oluşturuldu!</h3>
					<p className="text-gray-600 mb-6">
						Araç teklifiniz başarıyla oluşturuldu. Kısa süre içinde size geri dönüş yapılacaktır.
					</p>
					<button
						onClick={handleReset}
						className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
					>
						Yeni Teklif Oluştur
					</button>
				</div>
			</div>
		);
	};

	// Mevcut adıma göre farklı içerik gösterme
	const renderStepContent = () => {
		if (loading) {
			return <div className="text-center py-8">Yükleniyor...</div>;
		}

		if (error && currentStep < STEPS.length - 1) {
			return (
				<div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
					{error}
				</div>
			);
		}

		// Onay adımı
		if (currentStep === STEPS.length - 1) {
			if (offerStatus === "success") {
				return renderOfferSuccess();
			}
			return renderConfirmationStep();
		}

		// Kilometre input formu
		if (currentStep === 8) {
			return (
				<form onSubmit={handleKilometerSubmit} className="space-y-4">
					<div>
						<label htmlFor="kilometer" className="block text-sm font-medium text-gray-700 mb-1">
							Kilometre
						</label>
						<input
							type="number"
							id="kilometer"
							value={kilometerInput}
							onChange={(e) => setKilometerInput(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
							placeholder="Örn: 50000"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
					>
						Devam Et
					</button>
				</form>
			);
		}

		// Kaza durumu input formu
		if (currentStep === 9) {
			return (
				<form onSubmit={handleAccidentStatusSubmit} className="space-y-4">
					<div>
						<label htmlFor="accidentStatus" className="block text-sm font-medium text-gray-700 mb-1">
							Kaza Durumu
						</label>
						<select
							id="accidentStatus"
							value={accidentStatusInput}
							onChange={(e) => setAccidentStatusInput(e.target.value)}
							className="w-full p-2 border border-gray-300 rounded-md"
							required
						>
							<option value="None">Kazasız</option>
							<option value="Exists">Kazalı</option>
						</select>
					</div>

					{/* Kaza durumu "Kazalı" ise hasar tutarı giriş alanını göster */}
					{accidentStatusInput === "Exists" && (
						<div>
							<label htmlFor="accidentAmount" className="block text-sm font-medium text-gray-700 mb-1">
								Hasar Tutarı (₺)
							</label>
							<input
								type="number"
								id="accidentAmount"
								value={accidentAmountInput}
								onChange={(e) => setAccidentAmountInput(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded-md"
								placeholder="Örn: 5000"
								required
							/>
						</div>
					)}

					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
					>
						Devam Et
					</button>
				</form>
			);
		}

		// Normal seçenek listesi
		if (options.length === 0) {
			return (
				<div className="text-center py-8 text-gray-500">
					Bu kriterlere uygun seçenek bulunamadı.
				</div>
			);
		}

		return (
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{options.map((option, index) => (
					<button
						key={getOptionKey(option, index)}
						onClick={() => handleSelect(option)}
						className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
					>
						{getOptionDisplayValue(option)}
					</button>
				))}
			</div>
		);
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">Aracınızı Seçin</h1>

			{/* Adım göstergesi */}
			{!isComplete && currentStep <= STEPS.length - 1 && (
				<StepIndicator steps={STEPS} currentStep={currentStep} />
			)}

			{/* Özet kartı - Tamamlanmadığı sürece göster */}
			{!isComplete && currentStep > 0 && currentStep < STEPS.length && (
				<SelectionSummaryCard
					selections={selections}
					selectedOptions={selectedOptions}
					steps={STEPS}
					currentStep={currentStep}
				/>
			)}

			{/* Seçim tamamlandıysa sonuçları göster */}
			{isComplete ? (
				<VehicleResult vehicles={result} onReset={handleReset} />
			) : (
				<div>
					<h2 className="text-lg font-semibold mb-4">
						{STEPS[currentStep] === "onay"
							? "Teklifinizi onaylayın"
							: `${STEPS[currentStep]} seçin`}
					</h2>

					{/* Adıma göre içerik */}
					{renderStepContent()}

					{/* Geri butonu */}
					{currentStep > 0 && currentStep < STEPS.length - 1 && (
						<button
							onClick={handleBack}
							className="mt-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
						>
							Geri
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default VehicleSelectorContainer;