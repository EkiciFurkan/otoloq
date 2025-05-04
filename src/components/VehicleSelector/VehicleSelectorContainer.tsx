// src/app/components/VehicleSelectorContainer.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import StepIndicator from "./StepIndicator";
import SelectionSummaryCard from "./SelectionSummaryCard";

// Add new steps for contact information
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
	"iletişim bilgileri", // New step for contact info
	"onay"
];

// Seçim parametreleri için tip tanımı - Add contact fields
export interface SelectionParams {
	brandId?: number;
	modelId?: number;
	versionId?: number;
	bodyTypeId?: number;
	fuelTypeId?: number;
	transmissionTypeId?: number;
	year?: number;
	kilometer?: number;
	colorId?: number;
	accidentStatus?: string;
	accidentAmount?: number;
	fullName?: string; // Added contact field
	email?: string; // Added contact field
	phoneNumber?: string; // Added contact field
}

// Genel option tipi - hiyerarşideki tüm seçenek türleri için
interface Option {
	id?: number;
	name?: string;
	year?: number;
	kilometer?: number;
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

	// Seçim sonucu (varsa) - Bu componentte sonuç gösterilmeyecek, sadece teklif oluşturulacak.
	// const [result, setResult] = useState<any[] | null>(null); // Removed as per the new flow focus

	// Input değerleri için state'ler
	const [kilometerInput, setKilometerInput] = useState<string>("");
	const [accidentStatusInput, setAccidentStatusInput] = useState<string>("None");
	const [accidentAmountInput, setAccidentAmountInput] = useState<string>("");
	const [fullNameInput, setFullNameInput] = useState<string>(""); // Added contact input state
	const [emailInput, setEmailInput] = useState<string>(""); // Added contact input state
	const [phoneNumberInput, setPhoneNumberInput] = useState<string>(""); // Added contact input state


	// Adım değiştikçe ya da seçimler değiştikçe seçenekleri güncelle
	useEffect(() => {
		async function fetchOptions() {
			// Eğer adım kilometre, kaza durumu, iletişim bilgileri veya onay ise API çağrısı yapma
			if (currentStep === 8 || currentStep === 9 || currentStep === 10 || currentStep === STEPS.length - 1) {
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams();
				queryParams.append("step", STEPS[currentStep]);

				// Mevcut parametreleri ekle (kilometre, kaza durumu, iletişim bilgileri hariç)
				if (selections.year) queryParams.append("year", selections.year.toString());
				if (selections.brandId) queryParams.append("brandId", selections.brandId.toString());
				if (selections.modelId) queryParams.append("modelId", selections.modelId.toString());
				if (selections.versionId) queryParams.append("versionId", selections.versionId.toString());
				if (selections.bodyTypeId) queryParams.append("bodyTypeId", selections.bodyTypeId.toString());
				if (selections.fuelTypeId) queryParams.append("fuelTypeId", selections.fuelTypeId.toString());
				if (selections.transmissionTypeId) queryParams.append("transmissionTypeId", selections.transmissionTypeId.toString());

				// Renk için özel işlem (adım 7)
				if (currentStep === 7) {
					queryParams.append("independentQuery", "colors");
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
					// Bu component artık sonuçları göstermeyecek, sadece teklif oluşturacak
					// if (data.type === "vehicles") {
					//    setResult(data.data);
					// } else {
					//    setResult(null);
					// }
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
			case 7: // Renk
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
		setError(null); // Clear previous errors

		const kilometer = parseInt(kilometerInput);

		// Validasyon kontrolleri
		if (isNaN(kilometer) || kilometer < 0) {
			setError("Lütfen geçerli bir kilometre değeri girin");
			return;
		}

		// Seçimleri güncelle
		const newSelections = { ...selections, kilometer };
		const newSelectedOptions = { ...selectedOptions };
		newSelectedOptions[STEPS[currentStep]] = `${kilometer.toLocaleString("tr-TR")} km`; // Format for display

		setSelections(newSelections);
		setSelectedOptions(newSelectedOptions);
		setCurrentStep(currentStep + 1);
	};

	// Kaza durumu input formunu gönderme
	const handleAccidentStatusSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError(null); // Clear previous errors

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

	// İletişim bilgileri formunu gönderme
	const handleContactSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError(null); // Clear previous errors

		// Basic validation (more robust validation should be done server-side too)
		if (!fullNameInput || !emailInput || !phoneNumberInput) {
			setError("Lütfen tüm iletişim bilgilerini doldurun.");
			return;
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(emailInput)) {
			setError("Lütfen geçerli bir email adresi girin.");
			return;
		}

		// Phone number format validation (simple check)
		const phoneRegex = /^[0-9]{10,}$/; // Basic check for at least 10 digits
		if (!phoneRegex.test(phoneNumberInput)) {
			setError("Lütfen geçerli bir telefon numarası girin (en az 10 rakam).");
			return;
		}


		// Seçimleri güncelle
		const newSelections = {
			...selections,
			fullName: fullNameInput,
			email: emailInput,
			phoneNumber: phoneNumberInput,
		};
		const newSelectedOptions = { ...selectedOptions };
		newSelectedOptions[STEPS[currentStep]] = fullNameInput; // Show name in summary
		newSelectedOptions["E-posta"] = emailInput; // Add email to summary
		newSelectedOptions["Cep Telefonu"] = phoneNumberInput; // Add phone to summary


		setSelections(newSelections);
		setSelectedOptions(newSelectedOptions);
		setCurrentStep(currentStep + 1);
	};


	// Teklif oluşturma işlemi
	const handleCreateOffer = async () => {
		// API isteği için veri hazırlama
		setOfferStatus("submitting");
		setError(null);

		// Ensure all required fields are present before submitting
		if (!selections.year || !selections.brandId || !selections.modelId || !selections.versionId ||
			!selections.bodyTypeId || !selections.fuelTypeId || !selections.transmissionTypeId ||
			!selections.colorId || selections.kilometer === undefined || !selections.accidentStatus ||
			!selections.fullName || !selections.email || !selections.phoneNumber
		) {
			setError("Teklif oluşturmak için tüm bilgilerin eksiksiz doldurulması gerekmektedir.");
			setOfferStatus("error");
			return;
		}

		// If accident status is 'Exists', ensure accident amount is present
		if (selections.accidentStatus === "Exists" && selections.accidentAmount === undefined) {
			setError("Hasar tutarı bilgisi eksik.");
			setOfferStatus("error");
			return;
		}


		try {
			const response = await fetch("/api/vehicle/offer", { // Assuming a new API route for offer submission
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					selections: selections, // Send all selections including contact info
					displayValues: selectedOptions, // Optional: send display values for logging/confirmation
				}),
			});

			if (!response.ok) {
				throw new Error(`API hatası: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();

			if (data.success) {
				setOfferStatus("success");
				// Başarılı olduğunda sonraki adıma geç (Teklif Başarılı ekranı)
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
			// Mevcut adımın seçimini temizle (sadece geri dönülen adımlarınkini)
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
					// Altındaki seçimleri de temizle (model, versiyon, vb.)
					delete newSelections.modelId; delete newSelectedOptions[STEPS[currentStep]]; // model sil
					delete newSelections.versionId; // version sil
					delete newSelections.bodyTypeId; // bodyType sil
					delete newSelections.fuelTypeId; // fuelType sil
					delete newSelections.transmissionTypeId; // transmissionType sil
					delete newSelections.colorId; // color sil
					delete newSelections.kilometer; // kilometer sil
					delete newSelections.accidentStatus; // accidentStatus sil
					delete newSelections.accidentAmount; // accidentAmount sil
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep + 1]]; // versiyon sil
					delete newSelectedOptions[STEPS[currentStep + 2]]; // gövde tipi sil
					delete newSelectedOptions[STEPS[currentStep + 3]]; // yakıt tipi sil
					delete newSelectedOptions[STEPS[currentStep + 4]]; // vites tipi sil
					delete newSelectedOptions[STEPS[currentStep + 5]]; // renk sil
					delete newSelectedOptions[STEPS[currentStep + 6]]; // kilometre sil
					delete newSelectedOptions[STEPS[currentStep + 7]]; // kaza durumu sil
					delete newSelectedOptions["hasar tutarı"]; // hasar tutarı sil
					delete newSelectedOptions[STEPS[currentStep + 8]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setKilometerInput("");
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");

					break;
				case 3: // Model'e dön
					delete newSelections.modelId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					// Altındaki seçimleri de temizle (versiyon, vb.)
					delete newSelections.versionId; // version sil
					delete newSelections.bodyTypeId; // bodyType sil
					delete newSelections.fuelTypeId; // fuelType sil
					delete newSelections.transmissionTypeId; // transmissionType sil
					delete newSelections.colorId; // color sil
					delete newSelections.kilometer; // kilometer sil
					delete newSelections.accidentStatus; // accidentStatus sil
					delete newSelections.accidentAmount; // accidentAmount sil
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep]]; // versiyon sil
					delete newSelectedOptions[STEPS[currentStep + 1]]; // gövde tipi sil
					delete newSelectedOptions[STEPS[currentStep + 2]]; // yakıt tipi sil
					delete newSelectedOptions[STEPS[currentStep + 3]]; // vites tipi sil
					delete newSelectedOptions[STEPS[currentStep + 4]]; // renk sil
					delete newSelectedOptions[STEPS[currentStep + 5]]; // kilometre sil
					delete newSelectedOptions[STEPS[currentStep + 6]]; // kaza durumu sil
					delete newSelectedOptions["hasar tutarı"]; // hasar tutarı sil
					delete newSelectedOptions[STEPS[currentStep + 7]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setKilometerInput("");
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 4: // Versiyon'a dön
					delete newSelections.versionId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					// Altındaki seçimleri de temizle (gövde tipi, vb.)
					delete newSelections.bodyTypeId; // bodyType sil
					delete newSelections.fuelTypeId; // fuelType sil
					delete newSelections.transmissionTypeId; // transmissionType sil
					delete newSelections.colorId; // color sil
					delete newSelections.kilometer; // kilometer sil
					delete newSelections.accidentStatus; // accidentStatus sil
					delete newSelections.accidentAmount; // accidentAmount sil
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep]]; // gövde tipi sil
					delete newSelectedOptions[STEPS[currentStep + 1]]; // yakıt tipi sil
					delete newSelectedOptions[STEPS[currentStep + 2]]; // vites tipi sil
					delete newSelectedOptions[STEPS[currentStep + 3]]; // renk sil
					delete newSelectedOptions[STEPS[currentStep + 4]]; // kilometre sil
					delete newSelectedOptions[STEPS[currentStep + 5]]; // kaza durumu sil
					delete newSelectedOptions["hasar tutarı"]; // hasar tutarı sil
					delete newSelectedOptions[STEPS[currentStep + 6]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setKilometerInput("");
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 5: // Gövde tipine dön
					delete newSelections.bodyTypeId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					// Altındaki seçimleri de temizle (yakıt tipi, vb.)
					delete newSelections.fuelTypeId; // fuelType sil
					delete newSelections.transmissionTypeId; // transmissionType sil
					delete newSelections.colorId; // color sil
					delete newSelections.kilometer; // kilometer sil
					delete newSelections.accidentStatus; // accidentStatus sil
					delete newSelections.accidentAmount; // accidentAmount sil
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep]]; // yakıt tipi sil
					delete newSelectedOptions[STEPS[currentStep + 1]]; // vites tipi sil
					delete newSelectedOptions[STEPS[currentStep + 2]]; // renk sil
					delete newSelectedOptions[STEPS[currentStep + 3]]; // kilometre sil
					delete newSelectedOptions[STEPS[currentStep + 4]]; // kaza durumu sil
					delete newSelectedOptions["hasar tutarı"]; // hasar tutarı sil
					delete newSelectedOptions[STEPS[currentStep + 5]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setKilometerInput("");
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 6: // Yakıt tipine dön
					delete newSelections.fuelTypeId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					delete newSelections.transmissionTypeId; // transmissionType sil
					delete newSelections.colorId; // color sil
					delete newSelections.kilometer; // kilometer sil
					delete newSelections.accidentStatus; // accidentStatus sil
					delete newSelections.accidentAmount; // accidentAmount sil
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep]]; // vites tipi sil
					delete newSelectedOptions[STEPS[currentStep + 1]]; // renk sil
					delete newSelectedOptions[STEPS[currentStep + 2]]; // kilometre sil
					delete newSelectedOptions[STEPS[currentStep + 3]]; // kaza durumu sil
					delete newSelectedOptions["hasar tutarı"]; // hasar tutarı sil
					delete newSelectedOptions[STEPS[currentStep + 4]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setKilometerInput("");
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 7: // Vites tipine dön
					delete newSelections.transmissionTypeId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					// Altındaki seçimleri de temizle (renk, vb.)
					delete newSelections.colorId; // color sil
					delete newSelections.kilometer; // kilometer sil
					delete newSelections.accidentStatus; // accidentStatus sil
					delete newSelections.accidentAmount; // accidentAmount sil
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep]]; // renk sil
					delete newSelectedOptions[STEPS[currentStep + 1]]; // kilometre sil
					delete newSelectedOptions[STEPS[currentStep + 2]]; // kaza durumu sil
					delete newSelectedOptions["hasar tutarı"]; // hasar tutarı sil
					delete newSelectedOptions[STEPS[currentStep + 3]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setKilometerInput("");
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 8: // Renk'e dön
					delete newSelections.colorId;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					// Altındaki seçimleri de temizle (kilometre, vb.)
					delete newSelections.kilometer; // kilometer sil
					delete newSelections.accidentStatus; // accidentStatus sil
					delete newSelections.accidentAmount; // accidentAmount sil
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep]]; // kilometre sil
					delete newSelectedOptions[STEPS[currentStep + 1]]; // kaza durumu sil
					delete newSelectedOptions["hasar tutarı"]; // hasar tutarı sil
					delete newSelectedOptions[STEPS[currentStep + 2]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setKilometerInput("");
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 9: // Kilometre'ye dön (Input alanı)
					delete newSelections.kilometer;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					// Altındaki seçimleri de temizle (kaza durumu, vb.)
					delete newSelections.accidentStatus; // accidentStatus sil
					delete newSelections.accidentAmount; // accidentAmount sil
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep]]; // kaza durumu sil
					delete newSelectedOptions["hasar tutarı"]; // hasar tutarı sil
					delete newSelectedOptions[STEPS[currentStep + 1]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setKilometerInput("");
					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 10: // Kaza durumuna dön (Input alanı)
					delete newSelections.accidentStatus;
					delete newSelections.accidentAmount;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					delete newSelectedOptions["hasar tutarı"];
					// Altındaki seçimleri de temizle (iletişim bilgileri)
					delete newSelections.fullName; // fullName sil
					delete newSelections.email; // email sil
					delete newSelections.phoneNumber; // phoneNumber sil

					delete newSelectedOptions[STEPS[currentStep]]; // iletişim bilgileri sil
					delete newSelectedOptions["E-posta"]; // email summary sil
					delete newSelectedOptions["Cep Telefonu"]; // phone summary sil

					setAccidentStatusInput("None");
					setAccidentAmountInput("");
					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 11: // İletişim bilgilerine dön (Input alanı)
					delete newSelections.fullName;
					delete newSelections.email;
					delete newSelections.phoneNumber;
					delete newSelectedOptions[STEPS[currentStep - 1]];
					delete newSelectedOptions["E-posta"];
					delete newSelectedOptions["Cep Telefonu"];

					setFullNameInput("");
					setEmailInput("");
					setPhoneNumberInput("");
					break;
				case 12: // Onay adımından geri dönme
					// Onay adımından geri dönerken bir şey silmemize gerek yok (Bilgiler zaten dolu)
					break;
			}

			setSelections(newSelections);
			setSelectedOptions(newSelectedOptions);
			setCurrentStep(currentStep - 1);
			setError(null); // Clear error on back
			setOfferStatus("idle"); // Reset offer status on back from confirmation
		}
	};

	// Araç seçimini sıfırlama
	const handleReset = () => {
		setSelections({});
		setSelectedOptions({});
		setCurrentStep(0);
		setKilometerInput("");
		setAccidentStatusInput("None");
		setAccidentAmountInput("");
		setFullNameInput(""); // Reset contact info
		setEmailInput(""); // Reset contact info
		setPhoneNumberInput(""); // Reset contact info
		setOfferStatus("idle");
		setError(null);
	};

	// İşlem tamamlandı mı? (Teklif Başarılı olduğunda tamamlanmış sayılır)
	const isComplete = offerStatus === "success";

	// Seçenek gösterimi için yardımcı fonksiyon
	const getOptionDisplayValue = (option: Option): string => {
		if (option.name) {
			return option.name;
		}
		if (option.kilometer !== undefined) {
			return `${option.kilometer.toLocaleString("tr-TR")} km`;
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

	// İletişim bilgileri adımını render etme
	const renderContactInfoStep = () => {
		return (
			<form onSubmit={handleContactSubmit} className="space-y-4">
				<div>
					<label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
						Adınız Soyadınız
					</label>
					<input
						type="text"
						id="fullName"
						value={fullNameInput}
						onChange={(e) => setFullNameInput(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-md"
						placeholder="Adınız Soyadınız"
						required
					/>
				</div>
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
						E-posta Adresiniz
					</label>
					<input
						type="email"
						id="email"
						value={emailInput}
						onChange={(e) => setEmailInput(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-md"
						placeholder="email@example.com"
						required
					/>
				</div>
				<div>
					<label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
						Cep Telefonu Numaranız
					</label>
					<input
						type="tel" // Use tel for phone number
						id="phoneNumber"
						value={phoneNumberInput}
						onChange={(e) => setPhoneNumberInput(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded-md"
						placeholder="5xx xxx xx xx"
						required
					/>
				</div>
				{error && (
					<div className="p-3 bg-red-100 text-red-700 rounded-lg">
						{error}
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
	};


	// Onay adımını render etme
	const renderConfirmationStep = () => {
		return (
			<div className="space-y-6">
				<div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
					<h3 className="text-xl font-semibold mb-4">Araç Teklifinizi Onaylayın</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> {/* Adjusted grid for potentially more items */}
						{Object.entries(selectedOptions).map(([key, value]) => (
							<div key={key} className="flex justify-between items-center"> {/* Added items-center for alignment */}
								<span className="text-gray-600 capitalize mr-2">{key}:</span> {/* Added mr-2 for spacing */}
								<span className="font-medium text-right">{value}</span> {/* Added text-right for alignment */}
							</div>
						))}
					</div>

					<div className="space-y-4 pt-4 border-t border-gray-200">
						<p className="text-gray-600">
							Yukarıdaki bilgileri onaylayarak araç teklifinizi oluşturabilirsiniz.
						</p>
						<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"> {/* Added responsive flex */}
							<button
								onClick={handleCreateOffer}
								disabled={offerStatus === "submitting"}
								className={`flex-1 py-2 px-4 ${
									offerStatus === "submitting"
										? "bg-gray-400 cursor-not-allowed" // Added cursor-not-allowed
										: "bg-green-500 hover:bg-green-600"
								} text-white rounded-lg transition text-center`}
							>
								{offerStatus === "submitting" ? "İşleniyor..." : "Teklifi Oluştur"}
							</button>
							<button
								onClick={handleBack}
								disabled={offerStatus === "submitting"}
								className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-center" 
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

		// Error message for steps other than confirmation and success
		if (error && currentStep !== STEPS.length - 1 && offerStatus !== "success") {
			return (
				<div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
					{error}
				</div>
			);
		}


		// Teklif başarı adımı
		if (offerStatus === "success") {
			return renderOfferSuccess();
		}

		// Onay adımı
		if (currentStep === STEPS.length - 1) {
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
					{error && (
						<div className="p-3 bg-red-100 text-red-700 rounded-lg">
							{error}
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
					{error && (
						<div className="p-3 bg-red-100 text-red-700 rounded-lg">
							{error}
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

		// İletişim bilgileri input formu (Yeni adım)
		if (currentStep === 10) {
			return renderContactInfoStep();
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
						className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center" // Added text-center
					>
						{getOptionDisplayValue(option)}
					</button>
				))}
			</div>
		);
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">Aracınızı Seçin ve Teklif Alın</h1> {/* Updated title */}

			{/* Adım göstergesi - Sadece tamamlanmadığında ve başarı ekranında değilken göster */}
			{!isComplete && (
				<StepIndicator steps={STEPS} currentStep={currentStep} />
			)}

			{/* Özet kartı - Tamamlanmadığı sürece ve ilk adımda değilken göster */}
			{!isComplete && currentStep > 0 && currentStep < STEPS.length && (
				<SelectionSummaryCard
					selections={selections}
					selectedOptions={selectedOptions}
					steps={STEPS}
					currentStep={currentStep}
				/>
			)}

			{/* Seçim tamamlandıysa (teklif başarılıysa) sonuçları göster */}
			{offerStatus === "success" ? (
				renderOfferSuccess()
			) : (
				<div>
					<h2 className="text-lg font-semibold mb-4">
						{STEPS[currentStep] === "onay"
							? "Teklifinizi onaylayın"
							: STEPS[currentStep] === "iletişim bilgileri"
								? "İletişim Bilgilerinizi Girin"
								: `${STEPS[currentStep]} seçin`}
					</h2>

					{/* Adıma göre içerik */}
					{renderStepContent()}

					{/* Geri butonu - İlk adımda, onay adımında ve başarı adımında gösterme */}
					{currentStep > 0 && currentStep < STEPS.length -1 && (
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