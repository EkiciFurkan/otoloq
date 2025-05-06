import React, { useEffect, useState } from "react";
import { useStepperContext, TransmissionTypeOption } from "../StepperContext";

import "../styles/StepperContainer.css";

export function TransmissionTypeSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [transmissionTypes, setTransmissionTypes] = useState<TransmissionTypeOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setTransmissionTypes([]);
		setLoading(true);
		setError(null);

		// TransmissionType şema tablosunda herhangi bir ilişki yoktur, doğrudan hepsini çekiyoruz
		const fetchTransmissionTypes = async () => {
			try {
				const response = await fetch("/api/transmissionTypes");

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setTransmissionTypes(data);
				setError(null);
			} catch (err: any) {
				console.error("Vites tipleri çekilirken hata oluştu:", err);
				setError("Vites tipleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setTransmissionTypes([]);
			} finally {
				setLoading(false);
			}
		};

		// Eğer önceki adımlar tamamlanmışsa vites tiplerini getir
		if (selections.vehicleType && selections.year && selections.brand &&
			selections.model && selections.subModel && selections.bodyType && selections.fuelType) {
			fetchTransmissionTypes();
		} else {
			setLoading(false);
		}

	}, [selections.fuelType]);

	const handleSelect = (transmissionType: TransmissionTypeOption) => {
		updateSelection("transmissionType", transmissionType);
	};

	if (!selections.vehicleType || !selections.year || !selections.brand ||
		!selections.model || !selections.subModel || !selections.bodyType || !selections.fuelType) {
		if (!loading) {
			return <div className="message">Lütfen önce vasıta tipi, yıl, marka, model, alt model, gövde tipi ve yakıt tipi seçin.</div>;
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
			{transmissionTypes.map((transmissionType) => (
				<div
					key={transmissionType.id}
					className={`selector-item ${selections.transmissionType?.id === transmissionType.id ? "selected" : ""}`}
					onClick={() => handleSelect(transmissionType)}
				>
					<div className="selector-content">
						<div className="selector-title">{transmissionType.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}