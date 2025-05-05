// src/components/VehicleSelector/steps/ModelSelector.tsx

import React, { useEffect, useState } from "react";
import { useStepperContext } from "../StepperContext";
import "../styles/StepperContainer.css";

interface ModelOption {
	id: number;
	name: string;
}

export function ModelSelector() {
	// updateSelection hook'tan geliyor, stabil olması beklenir
	const { selections, updateSelection } = useStepperContext();
	const [models, setModels] = useState<ModelOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Seçimler değiştiğinde state'leri sıfırla
		setModels([]); // Önceki modelleri temizle
		// updateSelection("model", undefined); // <-- BU SATIR KALDIRILDI
		setLoading(true);
		setError(null); // Önceki hataları temizle

		// Vasıta tipi, yıl veya marka seçilmediyse, fetch yapma
		if (!selections.vehicleType || !selections.year || !selections.brand) {
			setLoading(false); // Yükleniyor durumunu kapat
			// updateSelection("model", undefined); // <-- BURADA DA OLMAMALI
			return; // Gerekli seçimler yapılmadıysa çık
		}

		// API çağrısı async fonksiyonu
		// Bu fonksiyon vehicleTypeId, yearId ve brandId kabul edecek
		const fetchModels = async (vehicleTypeId: number, yearId: number, brandId: number) => {
			try {
				const response = await fetch(`/api/models?vehicleTypeId=${vehicleTypeId}&yearId=${yearId}&brandId=${brandId}`);

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setModels(data);
				setError(null);
			} catch (err: any) {
				console.error("Modeller çekilirken hata oluştu:", err);
				setError("Modeller yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setModels([]);
			} finally {
				setLoading(false);
			}
		};

		// Vasıta tipi, yıl ve marka seçildiyse veriyi çek
		fetchModels(selections.vehicleType.id, selections.year.id, selections.brand.id);

		// Bağımlılık listesinden updateSelection'ı çıkardık
	}, [selections.vehicleType, selections.year, selections.brand]); // Bağımlılıklar, seçim objelerinden herhangi biri değiştiğinde tetiklenir

	const handleSelect = (model: ModelOption) => {
		updateSelection("model", model);
	};

	// Gerekli seçimlerin yapılmadığı durumu kontrol et
	if (!selections.vehicleType || !selections.year || !selections.brand) {
		if (!loading) { // Eğer loading false ise
			return <div className="message">Lütfen önce vasıta tipi, yıl ve marka seçin.</div>;
		}
		return null;
	}


	if (loading) {
		return <div className="message">Yükleniyor...</div>;
	}

	if (error) {
		return <div className="message error">{error}</div>;
	}

	return (
		<div className="selector-container">
			{models.map((model) => (
				<div
					key={model.id}
					className={`selector-item ${selections.model?.id === model.id ? "selected" : ""}`}
					onClick={() => handleSelect(model)}
				>
					<div className="selector-content">
						<div className="selector-title">{model.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}