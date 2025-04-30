// src/app/components/VehicleSelector/StepIndicator.tsx
import React from "react";

interface StepIndicatorProps {
	steps: string[];
	currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
	return (
		<div className="mb-8">
			<div className="flex justify-between items-center">
				{steps.map((step, index) => (
					<React.Fragment key={index}>
						{/* Adım dairesi */}
						<div className="flex flex-col items-center">
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center ${
									index < currentStep
										? "bg-blue-500 text-white"
										: index === currentStep
											? "bg-blue-100 border-2 border-blue-500 text-blue-500"
											: "bg-gray-200 text-gray-500"
								}`}
							>
								{index + 1}
							</div>
							<span className="text-xs mt-1 text-center hidden md:block">
                {step}
              </span>
						</div>

						{/* Adımlar arası çizgi (son adım hariç) */}
						{index < steps.length - 1 && (
							<div
								className={`flex-1 h-0.5 mx-2 ${
									index < currentStep ? "bg-blue-500" : "bg-gray-200"
								}`}
							/>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

export default StepIndicator;