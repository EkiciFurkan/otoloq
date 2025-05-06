// src/components/VehicleSelector/StepperContext.tsx
import { createContext, useContext, ReactNode } from "react";

export interface ContactDetails {
	fullName: string;
	email: string;
	phone: string;
}

export interface VehicleTypeOption {
	id: number;
	name: string;
}

export interface YearOption {
	id: number;
	year: number;
}

export interface BrandOption {
	id: number;
	name: string;
}

export interface ModelOption {
	id: number;
	name: string;
}

export interface SubModelOption {
	id: number;
	name: string;
}

export interface BodyTypeOption {
	id: number;
	name: string;
}

export interface FuelTypeOption {
	id: number;
	name: string;
}

export interface TransmissionTypeOption {
	id: number;
	name: string;
}

export interface ColorOption {
	id: number;
	name: string;
}

export interface VehicleSelections {
	vehicleType: VehicleTypeOption | null;
	year: YearOption | null;
	brand: BrandOption | null;
	model: ModelOption | null;
	subModel: SubModelOption | null;
	bodyType: BodyTypeOption | null;
	fuelType: FuelTypeOption | null;
	transmissionType: TransmissionTypeOption | null;
	color: ColorOption | null;
	mileage: number;
	damageRecord: string;
	damageAmount: number | null;
	contact: ContactDetails | null;
	notes: string;
	images: string[];
}

export interface StepperContextType {
	selections: VehicleSelections;
	updateSelection: <K extends keyof VehicleSelections>(key: K, value: VehicleSelections[K]) => void;
	activeStep: number;
	nextStep: () => void;
	prevStep: () => void;
	steps: {
		label: string;
		component: ReactNode;
	}[];
}

export const StepperContext = createContext<StepperContextType | undefined>(undefined);

export function useStepperContext() {
	const context = useContext(StepperContext);
	if (context === undefined) {
		throw new Error("useStepperContext must be used within a StepperProvider");
	}
	return context;
}