import React, { useEffect, useState } from "react";
import { useStepperContext, BrandOption } from "../StepperContext";
import "../styles/StepperContainer.css";


export function BrandSelector() {
	const { selections, updateSelection } = useStepperContext();
	const [brands, setBrands] = useState<BrandOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setBrands([]);
		setLoading(true);
		setError(null);

		if (!selections.vehicleType || !selections.year) {
			setLoading(false);
			return;
		}

		const fetchBrands = async (vehicleTypeId: number, year: number) => {
			try {
				const response = await fetch(`/api/brands?vehicleTypeId=${vehicleTypeId}&year=${year}`);

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const data = await response.json();
				setBrands(data);
				setError(null);
			} catch (err: any) {
				console.error("Markalar çekilirken hata oluştu:", err);
				setError("Markalar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setBrands([]);
			} finally {
				setLoading(false);
			}
		};

		fetchBrands(selections.vehicleType.id, selections.year.year);

	}, [selections.vehicleType, selections.year]);

	const handleSelect = (brand: BrandOption) => {
		updateSelection("brand", brand);
	};

	if (!selections.vehicleType || !selections.year) {
		if (!loading) { // Yükleniyor değilse mesajı göster
			return <div className="message">Lütfen önce vasıta tipi ve yıl seçin.</div>;
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
			{brands.map((brand) => (
				<div
					key={brand.id}
					className={`selector-item ${selections.brand?.id === brand.id ? "selected" : ""}`}
					onClick={() => handleSelect(brand)}
				>
					<div className="selector-content">
						<div className="selector-title">{brand.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}