// src/components/VehicleSelector/steps/YearSelector.tsx

import React, { useEffect, useState } from "react";
import { useStepperContext } from "../StepperContext";
import "../styles/StepperContainer.css";

interface YearOption {
	id: number;
	year: number;
	vehicleTypeId: number; // API'den gelecek veri bu yapıda olmalı
}

export function YearSelector() {
	// updateSelection fonksiyonu hook'tan geliyor, stabil olması beklenir
	const { selections, updateSelection } = useStepperContext();
	const [years, setYears] = useState<YearOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Vasıta tipi değiştiğinde veya component mount olduğunda
		// loading state'ini ayarla ve önceki hataları temizle
		setLoading(true);
		setError(null); // Önceki hataları temizle

		// Önemli: Burada setYears([]) ve updateSelection("year", undefined) çağrılarını kaldırdık
		// setYears([]) çağrısını isteğe bağlı olarak, fetch başlamadan hemen önce ekleyebilirsiniz
		// ancak updateSelection("year", undefined) kesinlikle burada olmamalı.

		if (!selections.vehicleType) {
			setYears([]); // Vasıta tipi seçilmemişse listeyi boşalt
			setLoading(false); // Yükleniyor durumunu kapat
			// updateSelection("year", undefined) çağrısı burada da olmamalı
			return; // Vasıta tipi seçilmediyse daha fazla ilerleme
		}

		const fetchYears = async (vehicleTypeId: number) => {
			// Fetch başlamadan önce state'i sıfırlamak iyi bir pratik olabilir
			setYears([]); // Yeni fetch başlamadan mevcut yılları temizle
			// updateSelection("year", undefined); // Seçili yılı temizlemek başka bir yerde yapılmalı

			try {
				const response = await fetch(`/api/years?vehicleTypeId=${vehicleTypeId}`);

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setYears(data);
				setError(null);
			} catch (err: any) {
				console.error("Yıllar çekilirken hata oluştu:", err);
				setError("Yıllar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setYears([]); // Hata durumunda yılları boşalt
			} finally {
				setLoading(false);
			}
		};

		// Vasıta tipi seçildiyse veriyi çek
		fetchYears(selections.vehicleType.id);

		// Bağımlılık listesinden updateSelection'ı çıkardık
	}, [selections.vehicleType]); // useEffect sadece selections.vehicleType değiştiğinde çalışacak

	const handleSelect = (year: YearOption) => {
		updateSelection("year", year);
	};

	if (!selections.vehicleType) {
		// Vasıta tipi seçilmemişse ve yüklenmiyor durumu bittiyse mesaj göster
		if (!loading) {
			return <div className="message">Lütfen önce bir vasıta tipi seçin.</div>;
		}
		// Vasıta tipi seçilmemiş ama hala loading=true ise (olmamalı ama kontrol)
		return null; // Ya da boş bir şey dön
	}


	if (loading) {
		return <div className="message">Yükleniyor...</div>;
	}

	if (error) {
		return <div className="message error">{error}</div>;
	}

	// Eğer vasıta tipi seçili, yükleme bitti ve hata yoksa listeyi göster
	// API'den boş dizi gelirse de burası çalışır ve boş liste gösterilir
	return (
		<div className="selector-container">
			{years.map((year) => (
				<div
					key={year.id}
					className={`selector-item ${selections.year?.id === year.id ? "selected" : ""}`}
					onClick={() => handleSelect(year)}
				>
					<div className="selector-content">
						<div className="selector-title">{year.year}</div>
					</div>
				</div>
			))}
		</div>
	);
}