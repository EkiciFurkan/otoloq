// src/components/VehicleSelector/steps/YearSelector.tsx
import React, { useEffect, useState } from "react";
// useStepperContext, YearOption ve VehicleTypeOption'ı import ettik
import { useStepperContext, YearOption } from "../StepperContext";

import "../styles/StepperContainer.css";

// Burada tanımlı olan interface kaldırıldı, StepperContext'ten gelen kullanılacak


export function YearSelector() {
	const { selections, updateSelection } = useStepperContext();
	// useState tipi YearOption[] olarak güncellendi
	const [years, setYears] = useState<YearOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		// selections.vehicleType null ise fetch yapma
		if (!selections.vehicleType) {
			setYears([]);
			setLoading(false);
			return;
		}

		const fetchYears = async (vehicleTypeId: number) => {
			setYears([]);

			try {
				const response = await fetch(`/api/years?vehicleTypeId=${vehicleTypeId}`);

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				// API'den gelen veri YearOption[] yapısına uygun olmalı (id, year alanları olmalı)
				// Eğer API'den vehicleTypeId gibi ek alanlar geliyorsa,
				// useState<YearOption[]> tipi sadece id ve year alanlarını kullanacaktır, bu sorun yaratmaz.
				setYears(data);
				setError(null);
			} catch (err: any) {
				console.error("Yıllar çekilirken hata oluştu:", err);
				setError("Yıllar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setYears([]);
			} finally {
				setLoading(false);
			}
		};

		// selections.vehicleType null değilse fetch yap
		// VehicleTypeOption interface'i sayesinde selections.vehicleType'ın id özelliği olduğunu biliyoruz
		fetchYears(selections.vehicleType.id);

	}, [selections.vehicleType]);

	// handleSelect parametre tipi YearOption olarak güncellendi
	const handleSelect = (year: YearOption) => {
		updateSelection("year", year);
	};

	// Vasıta tipi seçilmemişse mesaj göster
	if (!selections.vehicleType) {
		if (!loading) {
			return <div className="message">Lütfen önce bir vasıta tipi seçin.</div>;
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