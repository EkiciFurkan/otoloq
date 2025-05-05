// src/components/VehicleSelector/StepperContainer.tsx
import React from "react";
import { useStepperContext } from "./StepperContext";
import "./styles/StepperContainer.css";

export function StepperContainer() {
	const { activeStep, nextStep, prevStep, steps } = useStepperContext();
	const currentStep = steps[activeStep];

	return (
		<div className="stepper-paper">
			<div className="stepper">
				{steps.map((step, index) => (
					<div
						key={index}
						className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
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
					onClick={nextStep}
					disabled={activeStep === steps.length - 1}
				>
					İleri
				</button>
			</div>
		</div>
	);
}