// src/components/VehicleSelector/steps/BrandSelector.tsx

import React, { useEffect, useState } from "react";
import { useStepperContext } from "../StepperContext";
import "../styles/StepperContainer.css";

interface BrandOption {
	id: number;
	name: string;
}

interface YearOption {
	id: number;
	year: number;
	vehicleTypeId: number;
}

export function BrandSelector() {
	// updateSelection hook'tan geliyor, stabil olması beklenir
	const { selections, updateSelection } = useStepperContext();
	const [brands, setBrands] = useState<BrandOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Vasıta tipi veya yıl değiştiğinde veya component mount olduğunda
		// state'leri sıfırla
		setBrands([]); // Önceki markaları temizle
		// updateSelection("brand", undefined); // <-- BU SATIR KALDIRILDI
		setLoading(true);
		setError(null); // Önceki hataları temizle

		// Hem vasıta tipi hem de yıl seçilmediyse, fetch yapma
		if (!selections.vehicleType || !selections.year) {
			setLoading(false); // Yükleniyor durumunu kapat
			// updateSelection("brand", undefined); // <-- BURADA DA OLMAMALI
			return; // Gerekli seçimler yapılmadıysa çık
		}

		// API çağrısı async fonksiyonu
		// Bu fonksiyon vehicleTypeId ve yılın değerini (number) kabul edecek
		const fetchBrands = async (vehicleTypeId: number, year: number) => {
			try {
				const response = await fetch(`/api/brands?vehicleTypeId=${vehicleTypeId}&year=${year}`);

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setBrands(data);
				setError(null);
			} catch (err: any) {
				console.error("Markalar çekilirken hata oluştu:", err);
				setError("Markalar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setBrands([]);
			} finally {
				setLoading(false);
			}
		};

		// Vasıta tipi ve yıl seçildiyse veriyi çek
		fetchBrands(selections.vehicleType.id, selections.year.year);

		// Bağımlılık listesinden updateSelection'ı çıkardık
		// Çünkü çağrılması sonsuz döngüye neden oluyor
	}, [selections.vehicleType, selections.year]); // useEffect sadece selections.vehicleType veya selections.year değiştiğinde çalışacak

	const handleSelect = (brand: BrandOption) => {
		updateSelection("brand", brand);
	};

	if (!selections.vehicleType || !selections.year) {
		if (!loading) {
			return <div className="message">Lütfen önce vasıta tipi ve yıl seçin.</div>;
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
			{brands.map((brand) => (
				<div
					key={brand.id}
					className={`selector-item ${selections.brand?.id === brand.id ? "selected" : ""}`}
					onClick={() => handleSelect(brand)}
				>
					<div className="selector-content">
						<div className="selector-title">{brand.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}