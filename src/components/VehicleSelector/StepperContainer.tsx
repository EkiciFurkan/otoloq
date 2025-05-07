// src/components/VehicleSelector/StepperContainer.tsx
import React from "react";
import { useStepperContext } from "./StepperContext";
import "./styles/StepperContainer.css";

export function StepperContainer() {
	const { activeStep, nextStep, prevStep, steps, selections, updateSelection } = useStepperContext();
	const currentStep = steps[activeStep];

	// Adım geçişi için geçerlilik kontrolü
	const handleNextStep = () => {
		// Kilometre adımı (dizin 9) için
		if (activeStep === 9) {
			const mileageInput = document.getElementById("mileage") as HTMLInputElement;

			if (!mileageInput || !mileageInput.value) {
				// Hata mesajını göster
				const errorDiv = document.querySelector(".form-error");
				if (errorDiv) {
					errorDiv.textContent = "Lütfen kilometreyi girin.";
				} else {
					const formGroup = document.querySelector(".form-group");
					if (formGroup) {
						const newErrorDiv = document.createElement("div");
						newErrorDiv.className = "form-error";
						newErrorDiv.textContent = "Lütfen kilometreyi girin.";
						formGroup.appendChild(newErrorDiv);
					}
				}
				return;
			}

			const mileageValue = parseInt(mileageInput.value, 10);

			if (isNaN(mileageValue) || mileageValue < 0 || mileageValue > 999999) {
				// Hata mesajını göster
				const errorDiv = document.querySelector(".form-error");
				if (errorDiv) {
					errorDiv.textContent = isNaN(mileageValue)
						? "Geçerli bir kilometre değeri girin."
						: mileageValue < 0
							? "Kilometre değeri 0'dan küçük olamaz."
							: "Kilometre değeri çok yüksek.";
				}
				return;
			}

			// Kilometre değerini kaydet
			updateSelection("mileage", mileageValue);
		}

		// Tramer kaydı adımı (dizin 10) için
		else if (activeStep === 10) {
			const damageRecord = selections.damageRecord;

			// Eğer hasar kaydı var ise, hasar miktarını kontrol et
			if (damageRecord === "EXISTS") {
				const damageAmountInput = document.getElementById("damageAmount") as HTMLInputElement;

				if (!damageAmountInput || !damageAmountInput.value.trim()) {
					// Hata mesajını göster
					const errorDiv = document.querySelector(".form-error");
					if (errorDiv) {
						errorDiv.textContent = "Lütfen hasar miktarını girin.";
					} else {
						const formGroup = document.querySelector(".form-group:last-child");
						if (formGroup) {
							const newErrorDiv = document.createElement("div");
							newErrorDiv.className = "form-error";
							newErrorDiv.textContent = "Lütfen hasar miktarını girin.";
							formGroup.appendChild(newErrorDiv);
						}
					}
					return;
				}

				// Virgülü noktaya çevir (ondalık sayılar için)
				const formattedAmount = damageAmountInput.value.replace(",", ".");
				const damageValue = parseFloat(formattedAmount);

				if (isNaN(damageValue) || damageValue < 0) {
					// Hata mesajını göster
					const errorDiv = document.querySelector(".form-error");
					if (errorDiv) {
						errorDiv.textContent = isNaN(damageValue)
							? "Geçerli bir hasar miktarı girin."
							: "Hasar miktarı 0'dan küçük olamaz.";
					}
					return;
				}

				// Hasar miktarını kaydet
				updateSelection("damageAmount", damageValue);
			}
		}

		// İletişim bilgileri adımı (dizin 11) için
		else if (activeStep === 11) {
			// İletişim formundaki alanları kontrol et
			const fullNameInput = document.getElementById("fullName") as HTMLInputElement;
			const phoneInput = document.getElementById("phone") as HTMLInputElement;
			const emailInput = document.getElementById("email") as HTMLInputElement;

			// Ad Soyad kontrolü
			if (!fullNameInput || !fullNameInput.value.trim()) {
				// Hata mesajını göster
				const errorDiv = document.querySelector("#contactForm .form-group:nth-child(1) .form-error");
				if (errorDiv) {
					errorDiv.textContent = "Ad Soyad alanı zorunludur";
				} else {
					const formGroup = document.querySelector("#contactForm .form-group:nth-child(1)");
					if (formGroup) {
						const newErrorDiv = document.createElement("div");
						newErrorDiv.className = "form-error";
						newErrorDiv.textContent = "Ad Soyad alanı zorunludur";
						formGroup.appendChild(newErrorDiv);
					}
				}
				return;
			}

			// Telefon kontrolü
			if (!phoneInput || !phoneInput.value.trim()) {
				// Hata mesajını göster
				const errorDiv = document.querySelector("#contactForm .form-group:nth-child(2) .form-error");
				if (errorDiv) {
					errorDiv.textContent = "Telefon alanı zorunludur";
				} else {
					const formGroup = document.querySelector("#contactForm .form-group:nth-child(2)");
					if (formGroup) {
						const newErrorDiv = document.createElement("div");
						newErrorDiv.className = "form-error";
						newErrorDiv.textContent = "Telefon alanı zorunludur";
						formGroup.appendChild(newErrorDiv);
					}
				}
				return;
			} else if (!/^[0-9]{10,11}$/.test(phoneInput.value.replace(/\s/g, ""))) {
				// Hata mesajını göster
				const errorDiv = document.querySelector("#contactForm .form-group:nth-child(2) .form-error");
				if (errorDiv) {
					errorDiv.textContent = "Geçerli bir telefon numarası giriniz";
				} else {
					const formGroup = document.querySelector("#contactForm .form-group:nth-child(2)");
					if (formGroup) {
						const newErrorDiv = document.createElement("div");
						newErrorDiv.className = "form-error";
						newErrorDiv.textContent = "Geçerli bir telefon numarası giriniz";
						formGroup.appendChild(newErrorDiv);
					}
				}
				return;
			}

			// E-posta kontrolü (opsiyonel, sadece doldurulmuşsa kontrol et)
			if (emailInput && emailInput.value.trim() && !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
				// Hata mesajını göster
				const errorDiv = document.querySelector("#contactForm .form-group:nth-child(3) .form-error");
				if (errorDiv) {
					errorDiv.textContent = "Geçerli bir e-posta adresi giriniz";
				} else {
					const formGroup = document.querySelector("#contactForm .form-group:nth-child(3)");
					if (formGroup) {
						const newErrorDiv = document.createElement("div");
						newErrorDiv.className = "form-error";
						newErrorDiv.textContent = "Geçerli bir e-posta adresi giriniz";
						formGroup.appendChild(newErrorDiv);
					}
				}
				return;
			}

			// İletişim bilgilerini kaydet
			updateSelection("contact", {
				fullName: fullNameInput.value,
				phone: phoneInput.value,
				email: emailInput.value
			});
		}

		// Ek bilgiler adımı (dizin 12) için
		else if (activeStep === 12) {
			const notesTextarea = document.getElementById("notes") as HTMLTextAreaElement;

			// Notları kaydet (bu adımda zorunlu değil)
			if (notesTextarea) {
				updateSelection("notes", notesTextarea.value);
			}

			// Resimlerin kontrolünü yap
			const errorDiv = document.querySelector("#vehicleDetailsForm .form-error");
			if (errorDiv && errorDiv.textContent) {
				// Mevcut bir hata varsa, ilerlemeyi engelle
				return;
			}
		}

		// Diğer adımlar için veya validasyon geçtiyse sonraki adıma geç
		nextStep();
	};

	return (
		<div className="stepper-paper">
			<div className="stepper">
				{steps.map((step, index) => (
					<div
						key={index}
						className={`step ${index === activeStep ? "active" : ""} ${index < activeStep ? "completed" : ""}`}
					>
						<div className="step-indicator">
							{index < activeStep ? (
								<span className="step-check">✓</span>
							) : (
								<span className="step-number">{index + 1}</span>
							)}
						</div>
						<div className="step-label">{step.label}</div>
					</div>
				))}
			</div>

			<div className="stepper-content">
				{currentStep.component}
			</div>

			<div className="stepper-actions">
				<button
					className="btn btn-outline"
					onClick={prevStep}
					disabled={activeStep === 0}
				>
					Geri
				</button>

				<button
					className="btn btn-primary"
					onClick={handleNextStep}
					disabled={activeStep === steps.length - 1}
				>
					İleri
				</button>
			</div>
		</div>
	);
}