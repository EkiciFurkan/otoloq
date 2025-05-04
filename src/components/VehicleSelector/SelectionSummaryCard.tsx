import { SelectionParams } from "./VehicleSelectorContainer";

interface SelectionSummaryCardProps {
	selections: SelectionParams;
	selectedOptions: Record<string, any>;
	steps: string[];
	currentStep: number;
}

export function SelectionSummaryCard({
										 selectedOptions,
										 steps,
										 currentStep
									 }: SelectionSummaryCardProps) {
	if (currentStep === 0 || !Object.keys(selectedOptions).length) {
		return null;
	}

	return (
		<div className="mb-6 p-4 border rounded-lg bg-blue-50 shadow-sm" style={{background: "black"}}>
			<h3 className="text-lg font-semibold mb-2">Araba Teklif Özeti</h3>
			<div className="grid grid-cols-2 gap-2">
				{steps.map((step, index) => {
					if (index >= currentStep) {
						return null;
					}

					const value = selectedOptions[step];

					if (!value) {
						return null;
					}

					return (
						<div key={step} className="flex justify-between">
							<span className="text-gray-600 capitalize">{step}:</span>
							<span className="font-medium">{value}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default SelectionSummaryCard;