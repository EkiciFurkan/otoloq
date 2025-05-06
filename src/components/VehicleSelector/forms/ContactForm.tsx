import React, { useState } from "react";
import { useStepperContext, ContactDetails } from "../StepperContext";

import "../styles/StepperContainer.css";

export function ContactForm() {
	const { selections, updateSelection, nextStep } = useStepperContext();
	const [contact, setContact] = useState<ContactDetails>({
		fullName: selections.contact?.fullName || "",
		phone: selections.contact?.phone || "",
		email: selections.contact?.email || ""
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setContact(prev => ({
			...prev,
			[name]: value
		}));

		// Giriş yapıldığında mevcut hata mesajını temizle
		if (errors[name]) {
			setErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!contact.fullName.trim()) {
			newErrors.fullName = "Ad Soyad alanı zorunludur";
		}

		if (!contact.phone.trim()) {
			newErrors.phone = "Telefon alanı zorunludur";
		} else if (!/^[0-9]{10,11}$/.test(contact.phone.replace(/\s/g, ''))) {
			newErrors.phone = "Geçerli bir telefon numarası giriniz";
		}

		if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
			newErrors.email = "Geçerli bir e-posta adresi giriniz";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			updateSelection("contact", contact);
			nextStep();
		}
	};

	if (!selections.vehicleType || !selections.year || !selections.brand ||
		!selections.model || !selections.subModel || !selections.bodyType ||
		!selections.fuelType || !selections.transmissionType ||
		!selections.color || !selections.mileage ||
		selections.damageRecord === undefined) {
		return <div className="message">Lütfen önce araç bilgilerini ve hasar kaydını tamamlayın.</div>;
	}

	return (
		<div className="form-container">
			<h2 className="form-title">İletişim Bilgileri</h2>
			<p className="form-subtitle">Size ulaşabilmemiz için bilgilerinizi giriniz.</p>

			<div className="form-group">
				<label htmlFor="fullName" className="form-label">Ad Soyad <span className="required">*</span></label>
				<input
					type="text"
					id="fullName"
					name="fullName"
					className={`form-input ${errors.fullName ? "error" : ""}`}
					value={contact.fullName}
					onChange={handleChange}
					placeholder="Ad Soyad"
				/>
				{errors.fullName && <div className="form-error">{errors.fullName}</div>}
			</div>

			<div className="form-group">
				<label htmlFor="phone" className="form-label">Telefon <span className="required">*</span></label>
				<input
					type="tel"
					id="phone"
					name="phone"
					className={`form-input ${errors.phone ? "error" : ""}`}
					value={contact.phone}
					onChange={handleChange}
					placeholder="05XX XXX XX XX"
				/>
				{errors.phone && <div className="form-error">{errors.phone}</div>}
			</div>

			<div className="form-group">
				<label htmlFor="email" className="form-label">E-posta</label>
				<input
					type="email"
					id="email"
					name="email"
					className={`form-input ${errors.email ? "error" : ""}`}
					value={contact.email || ""}
					onChange={handleChange}
					placeholder="ornek@domain.com"
				/>
				{errors.email && <div className="form-error">{errors.email}</div>}
			</div>

			<div className="form-actions">
				<button
					className="form-button primary"
					onClick={handleSubmit}
				>
					Devam Et
				</button>
			</div>
		</div>
	);
}