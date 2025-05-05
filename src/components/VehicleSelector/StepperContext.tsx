import React, { createContext } from "react";

export interface StepperContextType {
	selections: any;
	updateSelection: (key: string, value: any) => void;
	activeStep: number;
	nextStep: () => void;
	prevStep: () => void;
	steps: {
		label: string;
		component: React.ReactNode;
	}[];
}

export const StepperContext = createContext<StepperContextType | undefined>(undefined);

export function useStepperContext() {
	const context = React.useContext(StepperContext);
	if (context === undefined) {
		throw new Error("useStepperContext must be used within a StepperProvider");
	}
	return context;
}