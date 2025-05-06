import React, { useEffect, useState } from "react";
import { useStepperContext, BodyTypeOption } from "../StepperContext";

import "../styles/StepperContainer.css";

export function BodyTypeSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [bodyTypes, setBodyTypes] = useState<BodyTypeOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setBodyTypes([]);
		setLoading(true);
		setError(null);

		if (!selections.vehicleType || !selections.year || !selections.brand || !selections.model || !selections.subModel) {
			setLoading(false);
			return;
		}

		const fetchBodyTypes = async (subModelId: number) => {
			try {
				const response = await fetch(`/api/bodyTypes?subModelId=${subModelId}`);

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setBodyTypes(data);
				setError(null);
			} catch (err: any) {
				console.error("Gövde tipleri çekilirken hata oluştu:", err);
				setError("Gövde tipleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setBodyTypes([]);
			} finally {
				setLoading(false);
			}
		};

		fetchBodyTypes(selections.subModel.id);

	}, [selections.subModel]);

	const handleSelect = (bodyType: BodyTypeOption) => {
		updateSelection("bodyType", bodyType);
	};

	if (!selections.vehicleType || !selections.year || !selections.brand || !selections.model || !selections.subModel) {
		if (!loading) {
			return <div className="message">Lütfen önce vasıta tipi, yıl, marka, model ve alt model seçin.</div>;
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
			{bodyTypes.map((bodyType) => (
				<div
					key={bodyType.id}
					className={`selector-item ${selections.bodyType?.id === bodyType.id ? "selected" : ""}`}
					onClick={() => handleSelect(bodyType)}
				>
					<div className="selector-content">
						<div className="selector-title">{bodyType.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}