"use client"

import React, {useState} from "react";
import { useStepperContext } from "../StepperContext";
import "../styles/StepperContainer.css";

export function VehicleSummaryCard() {
	const { selections, activeStep } = useStepperContext();
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);

	// Özet bilgilerini dizi olarak hazırla
	const summaryItems = [
		{
			label: "Vasıta Tipi",
			value: selections.vehicleType?.name || "-",
			key: "vehicleType",
			step: 0
		},
		{
			label: "Yıl",
			value: selections.year?.year?.toString() || "-",
			key: "year",
			step: 1
		},
		{
			label: "Marka",
			value: selections.brand?.name || "-",
			key: "brand",
			step: 2
		},
		{
			label: "Model",
			value: selections.model?.name || "-",
			key: "model",
			step: 3
		},
		{
			label: "Alt Model",
			value: selections.subModel?.name || "-",
			key: "subModel",
			step: 4
		},
		{
			label: "Gövde Tipi",
			value: selections.bodyType?.name || "-",
			key: "bodyType",
			step: 5
		},
		{
			label: "Yakıt Tipi",
			value: selections.fuelType?.name || "-",
			key: "fuelType",
			step: 6
		},
		{
			label: "Vites Tipi",
			value: selections.transmissionType?.name || "-",
			key: "transmissionType",
			step: 7
		},
		{
			label: "Renk",
			value: selections.color?.name || "-",
			key: "color",
			step: 8
		},
		{
			label: "Kilometre",
			value: selections.mileage ? `${selections.mileage.toLocaleString("tr-TR")} km` : "-",
			key: "mileage",
			step: 9
		},
		{
			label: "Tramer Kaydı",
			value: selections.damageRecord === "NONE"
				? "Hasar Kaydı Yok"
				: selections.damageAmount
					? `Hasar: ${selections.damageAmount.toLocaleString("tr-TR")} TL`
					: "Hasar Kaydı Var",
			key: "damageRecord",
			step: 10
		},
		{
			label: "İletişim",
			value: selections.contact?.fullName || "-",
			key: "contact",
			step: 11
		},
		{
			label: "Notlar",
			value: selections.notes ? "Girildi" : "-",
			key: "notes",
			step: 12
		}
	];

	// En az bir seçim yapılmış mı kontrol et
	const hasAnySelection = selections.vehicleType || selections.year || selections.brand ||
		selections.model || selections.subModel || selections.bodyType ||
		selections.fuelType || selections.transmissionType || selections.color ||
		selections.mileage > 0 || selections.damageRecord;

	// Tüm zorunlu alanlar doldurulmuş mu kontrol et
	const isFormComplete =
		selections.vehicleType &&
		selections.year &&
		selections.brand &&
		selections.model &&
		selections.subModel &&
		selections.bodyType &&
		selections.fuelType &&
		selections.transmissionType &&
		selections.color &&
		selections.mileage > 0 &&
		selections.damageRecord &&
		selections.contact?.fullName &&
		selections.contact?.phone;

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	// Teklif gönderme işlemi
	const handleSubmitOffer = async () => {
		if (!isFormComplete) {
			setSaveError("Lütfen tüm zorunlu alanları doldurun.");
			return;
		}

		setIsSaving(true);
		setSaveSuccess(null);
		setSaveError(null);

		try {
			// Seçimleri teklife dönüştür
			const offerData = {
				vehicleTypeId: selections.vehicleType!.id,
				yearId: selections.year!.id,
				brandId: selections.brand!.id,
				modelId: selections.model!.id,
				subModelId: selections.subModel!.id,
				bodyTypeId: selections.bodyType!.id,
				fuelTypeId: selections.fuelType!.id,
				transmissionTypeId: selections.transmissionType!.id,
				colorId: selections.color!.id,
				mileage: selections.mileage,
				damageRecord: selections.damageRecord,
				damageAmount: selections.damageAmount,
				contact: {
					fullName: selections.contact!.fullName,
					phone: selections.contact!.phone,
					email: selections.contact!.email || null
				},
				notes: selections.notes || null,
				images: selections.images || []
			};

			// API'ye istek gönder
			const response = await fetch("/api/offers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(offerData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Teklif kaydedilemedi");
			}

			const result = await response.json();
			setSaveSuccess(true);

			// Başarılı olduğunda gösterilecek mesaj
			setTimeout(() => {
				setSaveSuccess(null);
			}, 5000);

		} catch (error: any) {
			console.error("Teklif gönderilirken hata oluştu:", error);
			setSaveError(error.message || "Teklif gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
		} finally {
			setIsSaving(false);
		}
	};

	if (!hasAnySelection) {
		return null; // Hiç seçim yapılmamışsa gösterme
	}

	// Aktif seçimler (değeri "-" olmayan seçimler)
	const activeSelections = summaryItems.filter(item => item.value !== "-");

	return (
		<div className={`fixed-summary-bar ${isExpanded ? "expanded" : ""}`}>
			<div className="summary-bar-toggle" onClick={toggleExpand}>
				<span className="toggle-title">Seçimleriniz ({activeSelections.length})</span>
				<span className={`toggle-icon ${isExpanded ? "expanded" : ""}`}>
          {isExpanded ? "▼" : "▲"}
        </span>
			</div>

			<div className="summary-bar-content">
				<div className="summary-bar-grid">
					{summaryItems.map((item) => (
						<div
							key={item.key}
							className={`summary-item ${item.value !== "-" ? "active" : ""} ${activeStep === item.step ? "current" : ""}`}
						>
							<span className="summary-label">{item.label}:</span>
							<span className="summary-value">{item.value}</span>
						</div>
					))}
				</div>

				{isFormComplete && (
					<div className="summary-submit-section">
						<button
							className={`summary-submit-button ${isSaving ? "loading" : ""}`}
							onClick={handleSubmitOffer}
							disabled={isSaving}
						>
							{isSaving ? "Gönderiliyor..." : "Teklif İsteğini Gönder"}
						</button>

						{saveSuccess && (
							<div className="save-message success">
								Teklif isteğiniz başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.
							</div>
						)}

						{saveError && (
							<div className="save-message error">
								{saveError}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}