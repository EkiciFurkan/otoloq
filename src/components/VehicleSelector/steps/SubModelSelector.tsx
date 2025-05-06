import React, { useEffect, useState } from "react";
import { useStepperContext, SubModelOption } from "../StepperContext";

import "../styles/StepperContainer.css";

export function SubModelSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [subModels, setSubModels] = useState<SubModelOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setSubModels([]);
		setLoading(true);
		setError(null);

		if (!selections.vehicleType || !selections.year || !selections.brand || !selections.model) {
			setLoading(false);
			return;
		}

		const fetchSubModels = async (modelId: number) => {
			try {
				const response = await fetch(`/api/submodels?modelId=${modelId}`);

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setSubModels(data);
				setError(null);
			} catch (err: any) {
				console.error("Alt modeller çekilirken hata oluştu:", err);
				setError("Alt modeller yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setSubModels([]);
			} finally {
				setLoading(false);
			}
		};

		fetchSubModels(selections.model.id);

	}, [selections.model]);

	const handleSelect = (subModel: SubModelOption) => {
		updateSelection("subModel", subModel);
	};

	if (!selections.vehicleType || !selections.year || !selections.brand || !selections.model) {
		if (!loading) {
			return <div className="message">Lütfen önce vasıta tipi, yıl, marka ve model seçin.</div>;
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
			{subModels.map((subModel) => (
				<div
					key={subModel.id}
					className={`selector-item ${selections.subModel?.id === subModel.id ? "selected" : ""}`}
					onClick={() => handleSelect(subModel)}
				>
					<div className="selector-content">
						<div className="selector-title">{subModel.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}