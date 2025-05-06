import React, { useEffect, useState } from "react";
import { useStepperContext, ColorOption } from "../StepperContext";

import "../styles/StepperContainer.css";

export function ColorSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [colors, setColors] = useState<ColorOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setColors([]);
		setLoading(true);
		setError(null);

		// Colors şema tablosunda herhangi bir ilişki yoktur, doğrudan hepsini çekiyoruz
		const fetchColors = async () => {
			try {
				const response = await fetch("/api/colors");

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setColors(data);
				setError(null);
			} catch (err: any) {
				console.error("Renkler çekilirken hata oluştu:", err);
				setError("Renkler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setColors([]);
			} finally {
				setLoading(false);
			}
		};

		// Eğer önceki adımlar tamamlanmışsa renkleri getir
		if (selections.vehicleType && selections.year && selections.brand &&
			selections.model && selections.subModel && selections.bodyType &&
			selections.fuelType && selections.transmissionType) {
			fetchColors();
		} else {
			setLoading(false);
		}

	}, [selections.transmissionType]);

	const handleSelect = (color: ColorOption) => {
		updateSelection("color", color);
	};

	if (!selections.vehicleType || !selections.year || !selections.brand ||
		!selections.model || !selections.subModel || !selections.bodyType ||
		!selections.fuelType || !selections.transmissionType) {
		if (!loading) {
			return <div className="message">Lütfen önce vasıta tipi, yıl, marka, model, alt model, gövde tipi, yakıt tipi ve vites tipi seçin.</div>;
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
			{colors.map((color) => (
				<div
					key={color.id}
					className={`selector-item ${selections.color?.id === color.id ? "selected" : ""}`}
					onClick={() => handleSelect(color)}
				>
					<div className="selector-content">
						<div className="selector-title">{color.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}