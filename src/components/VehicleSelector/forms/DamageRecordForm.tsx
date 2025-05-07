import React, { useState, useEffect } from "react";
import { useStepperContext } from "../StepperContext";

import "../styles/StepperContainer.css";

export function DamageRecordForm() {
	const { selections, updateSelection } = useStepperContext();
	const [damageRecord, setDamageRecord] = useState<string>(
		selections.damageRecord || "NONE"
	);
	const [damageAmount, setDamageAmount] = useState<string>(
		selections.damageAmount ? selections.damageAmount.toString() : ""
	);
	const [error, setError] = useState<string | null>(null);

	const handleDamageRecordChange = (value: string) => {
		setDamageRecord(value);
		updateSelection("damageRecord", value as "NONE" | "EXISTS");

		// Eğer "NONE" seçilirse, hasar miktarını sıfırla
		if (value === "NONE") {
			setDamageAmount("");
			updateSelection("damageAmount", null);
		}
	};

	const handleDamageAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// Sadece sayısal değerler ve nokta/virgül karakterlerine izin ver (ondalık sayılar için)
		if (value === "" || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
			setDamageAmount(value);
			setError(null);

			if (value.trim() !== "") {
				// Virgülü noktaya çevir (ondalık sayılar için)
				const formattedAmount = value.replace(",", ".");
				const damageValue = parseFloat(formattedAmount);

				if (!isNaN(damageValue) && damageValue >= 0) {
					updateSelection("damageAmount", damageValue);
				}
			}
		}
	};

	// Form geçerliliğini kontrol eden fonksiyon
	const validateDamageRecord = (): boolean => {
		// Eğer hasar kaydı var ise, hasar miktarını kontrol et
		if (damageRecord === "EXISTS") {
			if (!damageAmount.trim()) {
				setError("Lütfen hasar miktarını girin.");
				return false;
			}

			// Virgülü noktaya çevir (ondalık sayılar için)
			const formattedAmount = damageAmount.replace(",", ".");
			const damageValue = parseFloat(formattedAmount);

			if (isNaN(damageValue)) {
				setError("Geçerli bir hasar miktarı girin.");
				return false;
			}

			if (damageValue < 0) {
				setError("Hasar miktarı 0'dan küçük olamaz.");
				return false;
			}
		}

		setError(null);
		return true;
	};

	// Context'e güncel durumu kaydet
	useEffect(() => {
		updateSelection("damageRecord", damageRecord as "NONE" | "EXISTS");
	}, [damageRecord]);

	if (!selections.vehicleType || !selections.year || !selections.brand ||
		!selections.model || !selections.subModel || !selections.bodyType ||
		!selections.fuelType || !selections.transmissionType ||
		!selections.color || !selections.mileage) {
		return <div className="message">Lütfen önce tüm araç özelliklerini seçin.</div>;
	}

	return (
		<div className="form-container" id="damageRecordForm">
			<div className="form-group">
				<label className="form-label">Tramer Kaydı</label>
				<div className="radio-group">
					<div
						className={`radio-option ${damageRecord === "NONE" ? "selected" : ""}`}
						onClick={() => handleDamageRecordChange("NONE")}
					>
						<div className="radio-button">
							<div className={`radio-inner ${damageRecord === "NONE" ? "active" : ""}`}></div>
						</div>
						<div className="radio-label">Hasar Kaydı Yok</div>
					</div>

					<div
						className={`radio-option ${damageRecord === "EXISTS" ? "selected" : ""}`}
						onClick={() => handleDamageRecordChange("EXISTS")}
					>
						<div className="radio-button">
							<div className={`radio-inner ${damageRecord === "EXISTS" ? "active" : ""}`}></div>
						</div>
						<div className="radio-label">Hasar Kaydı Var</div>
					</div>
				</div>
			</div>

			{damageRecord === "EXISTS" && (
				<div className="form-group">
					<label htmlFor="damageAmount" className="form-label">Hasar Miktarı (TL)</label>
					<input
						type="text"
						id="damageAmount"
						className="form-input"
						value={damageAmount}
						onChange={handleDamageAmountChange}
						placeholder="Hasar miktarını girin (örn: 5000)"
					/>
					{error && <div className="form-error">{error}</div>}
				</div>
			)}
		</div>
	);
}