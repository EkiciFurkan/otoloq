// src/app/components/VehicleSelector/VehicleResult.tsx
import { Models } from "@/types/models";

interface VehicleResultProps {
	vehicles: Models["Vehicle"][];
	onReset: () => void;
}

export function VehicleResult({ vehicles, onReset }: VehicleResultProps) {
	if (!vehicles || vehicles.length === 0) {
		return (
			<div className="text-center p-8 bg-gray-50 rounded-lg">
				<h3 className="text-xl font-semibold mb-2">Sonuç Bulunamadı</h3>
				<p className="text-gray-600 mb-4">
					Seçtiğiniz kriterlere uygun araç bulunamamıştır.
				</p>
				<button
					onClick={onReset}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
				>
					Yeniden Araç Seç
				</button>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6 flex justify-between items-center">
				<h3 className="text-xl font-semibold">
					{vehicles.length} araç bulundu
				</h3>
				<button
					onClick={onReset}
					className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
				>
					Yeniden Araç Seç
				</button>
			</div>

			<div className="space-y-4">
				{vehicles.map((vehicle) => {
					const {
						id,
						price,
						description,
						accidentRecord,
					} = vehicle;

					// Hiyerarşideki bilgileri alıyoruz
					const color = accidentRecord.colorMileage.color;
					const mileage = accidentRecord.colorMileage.mileage;
					const year = mileage.vehicleYear.year;
					const transmissionType = mileage.vehicleYear.transmissionTypeFuel.transmissionType;
					const fuelType = mileage.vehicleYear.transmissionTypeFuel.fuelBody.fuelType;
					const bodyType = mileage.vehicleYear.transmissionTypeFuel.fuelBody.bodyVersion.bodyType;
					const version = mileage.vehicleYear.transmissionTypeFuel.fuelBody.bodyVersion.version;
					const model = version.model;
					const brand = model.brand;

					return (
						<div key={id} className="border rounded-lg p-4 bg-white shadow-sm">
							<div className="flex justify-between mb-3">
								<h3 className="text-lg font-semibold">
									{brand.name} {model.name} {version.name}
								</h3>
								<span className="text-lg font-bold text-blue-600">
                  {price.toLocaleString("tr-TR")} ₺
                </span>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
								<div className="text-sm">
									<span className="text-gray-500">Yıl:</span> {year}
								</div>
								<div className="text-sm">
									<span className="text-gray-500">Kilometre:</span>{" "}
									{mileage.minKm}-{mileage.maxKm} km
								</div>
								<div className="text-sm">
									<span className="text-gray-500">Yakıt:</span> {fuelType.name}
								</div>
								<div className="text-sm">
									<span className="text-gray-500">Vites:</span>{" "}
									{transmissionType.name}
								</div>
								<div className="text-sm">
									<span className="text-gray-500">Kasa Tipi:</span>{" "}
									{bodyType.name}
								</div>
								<div className="text-sm">
									<span className="text-gray-500">Renk:</span> {color.name}
								</div>
								<div className="text-sm">
									<span className="text-gray-500">Kaza Durumu:</span>{" "}
									{accidentRecord.status === "None" ? "Yok" : "Var"}
								</div>
								{accidentRecord.status === "Exists" && (
									<div className="text-sm">
										<span className="text-gray-500">Hasar Tutarı:</span>{" "}
										{accidentRecord.amount?.toLocaleString("tr-TR")} ₺
									</div>
								)}
							</div>

							{description && (
								<div className="mt-2 text-sm text-gray-600">
									{description}
								</div>
							)}

							<button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
								Aracı Seç
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default VehicleResult;