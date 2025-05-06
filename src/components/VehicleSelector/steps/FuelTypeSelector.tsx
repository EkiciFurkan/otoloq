import React, { useEffect, useState } from "react";
import { useStepperContext, FuelTypeOption } from "../StepperContext";

import "../styles/StepperContainer.css";

export function FuelTypeSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [fuelTypes, setFuelTypes] = useState<FuelTypeOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setFuelTypes([]);
		setLoading(true);
		setError(null);

		if (!selections.vehicleType || !selections.year || !selections.brand ||
			!selections.model || !selections.subModel || !selections.bodyType) {
			setLoading(false);
			return;
		}

		const fetchFuelTypes = async (bodyTypeId: number) => {
			try {
				const response = await fetch(`/api/fuelTypes?bodyTypeId=${bodyTypeId}`);

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setFuelTypes(data);
				setError(null);
			} catch (err: any) {
				console.error("Yakıt tipleri çekilirken hata oluştu:", err);
				setError("Yakıt tipleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setFuelTypes([]);
			} finally {
				setLoading(false);
			}
		};

		fetchFuelTypes(selections.bodyType.id);

	}, [selections.bodyType]);

	const handleSelect = (fuelType: FuelTypeOption) => {
		updateSelection("fuelType", fuelType);
	};

	if (!selections.vehicleType || !selections.year || !selections.brand ||
		!selections.model || !selections.subModel || !selections.bodyType) {
		if (!loading) {
			return <div className="message">Lütfen önce vasıta tipi, yıl, marka, model, alt model ve gövde tipi seçin.</div>;
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
			{fuelTypes.map((fuelType) => (
				<div
					key={fuelType.id}
					className={`selector-item ${selections.fuelType?.id === fuelType.id ? "selected" : ""}`}
					onClick={() => handleSelect(fuelType)}
				>
					<div className="selector-content">
						<div className="selector-title">{fuelType.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}