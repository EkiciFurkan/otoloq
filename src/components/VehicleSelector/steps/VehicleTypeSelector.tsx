import React, { useEffect, useState } from "react";
import { useStepperContext } from "../StepperContext";

import "../styles/StepperContainer.css";

interface VehicleType {
	id: number;
	name: string;
}

export function VehicleTypeSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchVehicleTypes = async () => {
			try {
				setLoading(true);
				// Doğrudan sunucu tarafındaki API route'a istek at
				const response = await fetch('/api/vehicleTypes'); // Oluşturduğumuz API route'un URL'si

				if (!response.ok) {
					// HTTP hata kodlarını kontrol et
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json(); // JSON yanıtını parse et
				setVehicleTypes(data);
				setError(null); // Başarılı olursa hatayı temizle
			} catch (err: any) { // Hata tipini any olarak belirledim, dilerseniz daha spesifik yapabilirsiniz
				console.error("Veri çekilirken hata oluştu:", err);
				// Kullanıcıya gösterilecek hatayı ayarla
				setError("Vasıta tipleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
			} finally {
				setLoading(false); // Yükleniyor durumunu sonlandır
			}
		};

		fetchVehicleTypes();
	}, []); // useEffect sadece component mount edildiğinde çalışacak

	const handleSelect = (vehicleType: VehicleType) => {
		updateSelection("vehicleType", vehicleType);
	};

	// İkon class'ını belirleyen yardımcı fonksiyon (değişmedi)
	const getIconClass = (name: string): string => {
		const lowerName = name.toLowerCase();
		if (lowerName.includes("otomobil") || lowerName.includes("araba")) {
			return "fa-car";
		} else if (lowerName.includes("motosiklet") || lowerName.includes("motor")) {
			return "fa-motorcycle";
		} else if (lowerName.includes("traktör")) {
			return "fa-tractor";
		} else {
			// Varsayılan ikon
			return "fa-car";
		}
	};

	if (loading) {
		return <div className="message">Yükleniyor...</div>;
	}

	if (error) {
		return <div className="message error">{error}</div>;
	}

	return (
		<div className="selector-container">
			{vehicleTypes.map((vehicleType) => (
				<div
					key={vehicleType.id}
					className={`selector-item ${selections.vehicleType?.id === vehicleType.id ? "selected" : ""}`}
					onClick={() => handleSelect(vehicleType)}
				>
					<div className="selector-content">
						<i className={`fas ${getIconClass(vehicleType.name)} selector-icon`}></i>
						<div className="selector-title">{vehicleType.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}