import React, { useEffect, useState } from "react";
import { useStepperContext, ModelOption } from "../StepperContext";

import "../styles/StepperContainer.css";

export function ModelSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [models, setModels] = useState<ModelOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setModels([]);
		setLoading(true);
		setError(null);

		if (!selections.vehicleType || !selections.year || !selections.brand) {
			setLoading(false);
			return;
		}

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

		fetchModels(selections.vehicleType.id, selections.year.id, selections.brand.id);

	}, [selections.vehicleType, selections.year, selections.brand]);

	const handleSelect = (model: ModelOption) => {
		updateSelection("model", model);
	};

	if (!selections.vehicleType || !selections.year || !selections.brand) {
		if (!loading) {
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