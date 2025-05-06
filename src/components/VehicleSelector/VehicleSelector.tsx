"use client"

import React, { useState } from "react";
import { StepperContainer } from "./StepperContainer";
import { VehicleTypeSelector } from "./steps/VehicleTypeSelector";
import { YearSelector } from "./steps/YearSelector";
import "./styles/StepperContainer.css";

import { BrandSelector } from "./steps/BrandSelector";
import { ModelSelector } from "./steps/ModelSelector";
import { SubModelSelector } from "./steps/SubModelSelector";


import { BodyTypeSelector } from "./steps/BodyTypeSelector";

import { FuelTypeSelector } from "./steps/FuelTypeSelector";

import { TransmissionTypeSelector } from "./steps/TransmissionSelector";

import { ColorSelector } from "./steps/ColorSelector";
/*
import { VehicleDetailsForm } from "./steps/VehicleDetailsForm";
import { ContactForm } from "./steps/ContactForm";
import { Summary } from "./steps/Summary";
*/

import { StepperContext, VehicleSelections, StepperContextType } from "./StepperContext";
import {MileageForm} from "@/components/VehicleSelector/forms/MileageForm";
import {DamageRecordForm} from "@/components/VehicleSelector/forms/DamageRecordForm";
import {ContactForm} from "@/components/VehicleSelector/forms/ContactForm";
import {VehicleDetailsForm} from "@/components/VehicleSelector/forms/VehicleDetailsForm";


export function VehicleSelector() {
	const [selections, setSelections] = useState<VehicleSelections>({
		vehicleType: null,
		year: null,
		brand: null,
		model: null,
		subModel: null,
		bodyType: null,
		fuelType: null,
		transmissionType: null,
		color: null,
		mileage: 0,
		damageRecord: "NONE",
		damageAmount: null,
		contact: null,
		notes: "",
		images: []
	});

	const [activeStep, setActiveStep] = useState(0);

	const updateSelection = <K extends keyof VehicleSelections>(key: K, value: VehicleSelections[K]) => {
		setSelections((prev) => ({ ...prev, [key]: value }));

		if (key === "vehicleType") {
			setSelections((prev) => ({
				...prev,
				year: null,
				brand: null,
				model: null,
				subModel: null,
				bodyType: null,
				fuelType: null
			}));
		} else if (key === "year") {
			setSelections((prev) => ({
				...prev,
				brand: null,
				model: null,
				subModel: null,
				bodyType: null,
				fuelType: null
			}));
		} else if (key === "brand") {
			setSelections((prev) => ({
				...prev,
				model: null,
				subModel: null,
				bodyType: null,
				fuelType: null
			}));
		} else if (key === "model") {
			setSelections((prev) => ({
				...prev,
				subModel: null,
				bodyType: null,
				fuelType: null
			}));
		} else if (key === "subModel") {
			setSelections((prev) => ({
				...prev,
				bodyType: null,
				fuelType: null
			}));
		} else if (key === "bodyType") {
			setSelections((prev) => ({
				...prev,
				fuelType: null
			}));
		}
	};

	const nextStep = () => {
		setActiveStep((prev) => prev + 1);
	};

	const prevStep = () => {
		setActiveStep((prev) => prev - 1);
	};

	const steps = [
		{
			label: "Vasıta Tipi",
			component: <VehicleTypeSelector />
		},
		{
			label: "Yıl",
			component: <YearSelector />
		},
		{
			label: "Marka",
			component: <BrandSelector />
		},
		{
			label: "Model",
			component: <ModelSelector />
		},
		{
			label: "Alt Model",
			component: <SubModelSelector/>
		},
		{
			label: "Gövde Tipi",
			component: <BodyTypeSelector />
		},
		{
			label: "Yakıt Tipi",
			component: <FuelTypeSelector />
		},
		{
			label: "Vites Tipi",
			component: <TransmissionTypeSelector />
		},
		{
			label: "Renk",
			component: <ColorSelector />
		},
		{
			label: "Kilometre",
			component: <MileageForm />
		},
		{
			label: "Tramer Kaydı",
			component: <DamageRecordForm />
		},
		{
			label: "İletişim Bilgileri",
			component: <ContactForm />
		},
		{
			label: "Ek Bilgiler",
			component: <VehicleDetailsForm />
		}
	];

	const contextValue: StepperContextType = {
		selections,
		updateSelection,
		activeStep,
		nextStep,
		prevStep,
		steps
	};

	return (
		<StepperContext.Provider value={contextValue}>
			<StepperContainer />
		</StepperContext.Provider>
	);
}