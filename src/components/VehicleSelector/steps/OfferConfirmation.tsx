// src/components/VehicleSelector/steps/OfferConfirmation.tsx
import React, { useState } from "react";
import { useStepperContext } from "../StepperContext";
import "../styles/StepperContainer.css";

export function OfferConfirmation() {
	const { selections } = useStepperContext();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitResult, setSubmitResult] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const handleSubmit = async () => {
		// Gerekli tüm alanların dolu olup olmadığını kontrol et
		if (
			!selections.vehicleType ||
			!selections.year ||
			!selections.brand ||
			!selections.model ||
			!selections.subModel ||
			!selections.bodyType ||
			!selections.fuelType ||
			!selections.transmissionType ||
			!selections.color ||
			!selections.mileage ||
			!selections.damageRecord ||
			!selections.contact
		) {
			setSubmitResult({
				success: false,
				message: "Lütfen tüm gerekli alanları doldurun."
			});
			return;
		}

		// Eğer hasar kaydı var ama miktarı girilmediyse
		if (selections.damageRecord === "EXISTS" && !selections.damageAmount) {
			setSubmitResult({
				success: false,
				message: "Hasar kaydı için lütfen hasar miktarını belirtin."
			});
			return;
		}

		setIsSubmitting(true);
		setSubmitResult(null);

		try {
			// API'ye gönderilecek veriyi hazırla
			const offerData = {
				vehicleTypeId: selections.vehicleType.id,
				yearId: selections.year.id,
				brandId: selections.brand.id,
				modelId: selections.model.id,
				subModelId: selections.subModel.id,
				bodyTypeId: selections.bodyType.id,
				fuelTypeId: selections.fuelType.id,
				transmissionTypeId: selections.transmissionType.id,
				colorId: selections.color.id,
				mileage: selections.mileage,
				damageRecord: selections.damageRecord,
				damageAmount: selections.damageAmount,
				contact: {
					fullName: selections.contact.fullName,
					phone: selections.contact.phone,
					email: selections.contact.email || null
				},
				notes: selections.notes || null,
				images: selections.images || []
			};

			// API'ye POST isteği gönder
			const response = await fetch("/api/offers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(offerData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Teklif gönderilirken bir hata oluştu.");
			}

			setSubmitResult({
				success: true,
				message: "Teklif başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz."
			});
		} catch (error: any) {
			console.error("Teklif gönderilirken hata:", error);
			setSubmitResult({
				success: false,
				message: error.message || "Teklif gönderilirken bir hata oluştu."
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="confirmation-container">
			<h2 className="confirmation-title">Teklif İsteğinizi Onaylayın</h2>
			<p className="confirmation-text">
				Tüm bilgilerinizi gözden geçirin ve doğruladıktan sonra teklif isteğinizi gönderin.
				Ekibimiz en kısa sürede sizinle iletişime geçecektir.
			</p>

			<div className="confirmation-summary">
				<h3>Araç Bilgileri</h3>
				<div className="summary-grid">
					<div className="summary-item">
						<span className="item-label">Vasıta Tipi:</span>
						<span className="item-value">{selections.vehicleType?.name}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Yıl:</span>
						<span className="item-value">{selections.year?.year}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Marka:</span>
						<span className="item-value">{selections.brand?.name}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Model:</span>
						<span className="item-value">{selections.model?.name}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Alt Model:</span>
						<span className="item-value">{selections.subModel?.name}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Gövde Tipi:</span>
						<span className="item-value">{selections.bodyType?.name}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Yakıt Tipi:</span>
						<span className="item-value">{selections.fuelType?.name}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Vites Tipi:</span>
						<span className="item-value">{selections.transmissionType?.name}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Renk:</span>
						<span className="item-value">{selections.color?.name}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Kilometre:</span>
						<span className="item-value">{selections.mileage?.toLocaleString("tr-TR")} km</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Tramer Kaydı:</span>
						<span className="item-value">
              {selections.damageRecord === "NONE"
				  ? "Hasar Kaydı Yok"
				  : selections.damageAmount
					  ? `Hasar: ${selections.damageAmount.toLocaleString("tr-TR")} TL`
					  : "Hasar Kaydı Var"}
            </span>
					</div>
				</div>

				<h3>İletişim Bilgileri</h3>
				<div className="summary-grid">
					<div className="summary-item">
						<span className="item-label">Ad Soyad:</span>
						<span className="item-value">{selections.contact?.fullName}</span>
					</div>
					<div className="summary-item">
						<span className="item-label">Telefon:</span>
						<span className="item-value">{selections.contact?.phone}</span>
					</div>
					{selections.contact?.email && (
						<div className="summary-item">
							<span className="item-label">E-posta:</span>
							<span className="item-value">{selections.contact.email}</span>
						</div>
					)}
				</div>

				{selections.notes && (
					<div className="summary-section">
						<h3>Ek Notlar</h3>
						<p className="notes-text">{selections.notes}</p>
					</div>
				)}

				{selections.images && selections.images.length > 0 && (
					<div className="summary-section">
						<h3>Yüklenen Fotoğraflar</h3>
						<div className="image-count">{selections.images.length} fotoğraf</div>
					</div>
				)}
			</div>

			<div className="confirmation-actions">
				{submitResult && (
					<div className={`submit-result ${submitResult.success ? "success" : "error"}`}>
						{submitResult.message}
					</div>
				)}

				<button
					className={`submit-button ${isSubmitting ? "loading" : ""} ${
						submitResult?.success ? "success" : ""
					}`}
					onClick={handleSubmit}
					disabled={isSubmitting || submitResult?.success}
				>
					{isSubmitting
						? "Gönderiliyor..."
						: submitResult?.success
							? "Gönderildi ✓"
							: "Teklif İsteğini Gönder"}
				</button>
			</div>
		</div>
	);
}