"use client"

import { useState, useEffect } from "react";
import { getNextOptions } from "@/services/vehicleService";
import { Models } from "@/types/models";
import StepIndicator from "@/components/VehicleSelector/StepIndicator";

const STEPS = [
	"marka",
	"model",
	"versiyon",
	"gövde tipi",
	"yakıt tipi",
	"vites tipi",
	"yıl",
	"kilometre",
	"renk",
	"kaza durumu"
];

interface SelectionParams {
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

type OptionType =
	| Models["Brand"]
	| Models["Model"]
	| Models["Version"]
	| Models["BodyType"]
	| Models["FuelType"]
	| Models["TransmissionType"]
	| Models["VehicleYear"]
	| Models["Mileage"]
	| Models["Color"]
	| Models["AccidentRecord"];

export function VehicleSelectorContainer() {
	const [currentStep, setCurrentStep] = useState(0);

	const [selections, setSelections] = useState<SelectionParams>({});

	const [options, setOptions] = useState<OptionType[]>([]);

	const [loading, setLoading] = useState(true);

	const [result, setResult] = useState<Models["Vehicle"][] | null>(null);
	
	const handleReset =  () => {
		setSelections({});
		setCurrentStep(0);
		setResult(null);
	}


	useEffect(() => {
		async function fetchOptions() {
			setLoading(true);
			try {
				const response = await getNextOptions(selections);
				setOptions((response.data || []) as OptionType[]);

				if (response.type === "vehicles") {
					setResult(response.data as Models["Vehicle"][]);
				} else {
					setResult(null);
				}
			} catch (error) {
				console.error("Seçenekler yüklenirken hata oluştu:", error);
				setOptions([]);
			} finally {
				setLoading(false);
			}
		}

		fetchOptions();
	}, [currentStep, selections]);

	const handleSelect = (option: OptionType) => {
		// Mevcut adıma göre seçim parametrelerini güncelle
		const newSelections = { ...selections };

		switch (currentStep) {
			case 0: // Marka
				newSelections.brandId = (option as Models["Brand"]).id;
				break;
			case 1: // Model
				newSelections.modelId = (option as Models["Model"]).id;
				break;
			case 2: // Versiyon
				newSelections.versionId = (option as Models["Version"]).id;
				break;
			case 3: // Gövde tipi
				newSelections.bodyTypeId = (option as Models["BodyType"]).id;
				break;
			case 4: // Yakıt tipi
				newSelections.fuelTypeId = (option as Models["FuelType"]).id;
				break;
			case 5: // Vites tipi
				newSelections.transmissionTypeId = (option as Models["TransmissionType"]).id;
				break;
			case 6: // Yıl
				newSelections.year = (option as Models["VehicleYear"]).year;
				break;
			case 7: // Kilometre
				newSelections.minKm = (option as Models["Mileage"]).minKm;
				newSelections.maxKm = (option as Models["Mileage"]).maxKm;
				break;
			case 8: // Renk
				newSelections.colorId = (option as Models["Color"]).id;
				break;
			case 9: // Kaza durumu
				newSelections.accidentStatus = (option as Models["AccidentRecord"]).status;
				break;
		}

		setSelections(newSelections);
		setCurrentStep(currentStep + 1);
	};

	// Önceki adıma dönme
	const handleBack = () => {
		if (currentStep > 0) {
			// Mevcut adımın seçimini temizle
			const newSelections = { ...selections };

			switch (currentStep) {
				case 1: // Marka'ya dön
					delete newSelections.brandId;
					break;
				case 2: // Model'e dön
					delete newSelections.modelId;
					break;
				case 3: // Versiyon'a dön
					delete newSelections.versionId;
					break;
				case 4: // Gövde tipine dön
					delete newSelections.bodyTypeId;
					break;
				case 5: // Yakıt tipine dön
					delete newSelections.fuelTypeId;
					break;
				case 6: // Vites tipine dön
					delete newSelections.transmissionTypeId;
					break;
				case 7: // Yıl'a dön
					delete newSelections.year;
					break;
				case 8: // Kilometre'ye dön
					delete newSelections.minKm;
					delete newSelections.maxKm;
					break;
				case 9: // Renk'e dön
					delete newSelections.colorId;
					break;
				case 10: // Kaza durumuna dön
					delete newSelections.accidentStatus;
					break;
			}

			setSelections(newSelections);
			setCurrentStep(currentStep - 1);
		}
	};

	// İşlem tamamlandı mı?
	const isComplete = result !== null && result.length > 0;
	

	// Seçenek gösterimi için yardımcı fonksiyon
	const getOptionDisplayValue = (option: OptionType): string => {
		if ('name' in option && option.name) {
			return option.name;
		}
		if ('minKm' in option && 'maxKm' in option) {
			return `${option.minKm} - ${option.maxKm} km`;
		}
		if ('year' in option) {
			return option.year.toString();
		}
		if ('status' in option) {
			return option.status;
		}
		return '';
	};

	// Seçenek için anahtar değeri yardımcı fonksiyon
	const getOptionKey = (option: OptionType): string => {
		if ('id' in option && option.id) {
			return option.id.toString();
		}
		if ('minKm' in option && 'maxKm' in option) {
			return `${option.minKm}-${option.maxKm}`;
		}
		if ('year' in option) {
			return option.year.toString();
		}
		if ('status' in option) {
			return option.status;
		}
		return Math.random().toString();
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6 text-center">Aracınızı Seçin</h1>

			{/* Adım göstergesi burada olacak */}

			{!isComplete && (
				<StepIndicator steps={STEPS} currentStep={currentStep} />
			)}

			{/* Seçim tamamlandıysa sonuçları göster */}
			{isComplete ? (
				<div>
					<h2 className="text-xl font-semibold mb-4">Araç Seçiminiz</h2>
					{/* Sonuç bileşeni burada olacak */}
				</div>
			) : (
				<div>
					<h2 className="text-lg font-semibold mb-4">
						{STEPS[currentStep]} seçin
					</h2>

					{loading ? (
						<div className="text-center py-8">Yükleniyor...</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{/* Seçenek bileşenleri burada olacak */}
							{options.map((option) => (
								<button
									key={getOptionKey(option)}
									onClick={() => handleSelect(option)}
									className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
								>
									{getOptionDisplayValue(option)}
								</button>
							))}
						</div>
					)}

					{/* Geri butonu */}
					{currentStep > 0 && (
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