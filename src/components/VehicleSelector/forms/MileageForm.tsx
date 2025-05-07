import React, { useState } from "react";
import { useStepperContext } from "../StepperContext";

import "../styles/StepperContainer.css";

export function MileageForm() {
	const { selections, updateSelection } = useStepperContext();
	const [mileage, setMileage] = useState<string>(
		selections.mileage ? selections.mileage.toString() : ""
	);
	const [error, setError] = useState<string | null>(null);

	const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// Sadece sayısal değerlerin girilmesini sağla
		if (value === "" || /^\d+$/.test(value)) {
			setMileage(value);
			setError(null);

			// Değeri anlık olarak context'e kaydet
			if (value === "") {
				updateSelection("mileage", 0);
			} else {
				updateSelection("mileage", parseInt(value, 10));
			}
		}
	};

	// Form geçerliliğini kontrol eden fonksiyon
	const validateMileage = (): boolean => {
		if (!mileage) {
			setError("Lütfen kilometreyi girin.");
			return false;
		}

		const mileageValue = parseInt(mileage, 10);

		if (isNaN(mileageValue)) {
			setError("Geçerli bir kilometre değeri girin.");
			return false;
		}

		if (mileageValue < 0) {
			setError("Kilometre değeri 0'dan küçük olamaz.");
			return false;
		}

		if (mileageValue > 999999) {
			setError("Kilometre değeri çok yüksek.");
			return false;
		}

		setError(null);
		return true;
	};

	if (!selections.vehicleType || !selections.year || !selections.brand ||
		!selections.model || !selections.subModel || !selections.bodyType ||
		!selections.fuelType || !selections.transmissionType || !selections.color) {
		return <div className="message">Lütfen önce tüm araç özelliklerini seçin.</div>;
	}

	return (
		<div className="form-container">
			<div className="form-group">
				<label htmlFor="mileage" className="form-label">Kilometre</label>
				<input
					type="text"
					id="mileage"
					className="form-input"
					value={mileage}
					onChange={handleMileageChange}
					placeholder="Kilometreyi girin (örn: 45000)"
				/>
				{error && <div className="form-error">{error}</div>}
			</div>
		</div>
	);
}