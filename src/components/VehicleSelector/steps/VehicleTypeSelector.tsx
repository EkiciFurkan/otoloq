import React, { useEffect, useState } from "react";
import { useStepperContext, VehicleTypeOption } from "../StepperContext"; 

import "../styles/StepperContainer.css";

export function VehicleTypeSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchVehicleTypes = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/vehicleTypes');

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setVehicleTypes(data);
				setError(null);
			} catch (err: any) {
				console.error("Veri çekilirken hata oluştu:", err);
				setError("Vasıta tipleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
			} finally {
				setLoading(false);
			}
		};

		fetchVehicleTypes();
	}, []);

	const handleSelect = (vehicleType: VehicleTypeOption) => {
		updateSelection("vehicleType", vehicleType);
	};

	const getIconClass = (name: string): string => {
		const lowerName = name.toLowerCase();
		if (lowerName.includes("otomobil") || lowerName.includes("araba")) {
			return "fa-car";
		} else if (lowerName.includes("motosiklet") || lowerName.includes("motor")) {
			return "fa-motorcycle";
		} else if (lowerName.includes("traktör")) {
			return "fa-tractor";
		} else {
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