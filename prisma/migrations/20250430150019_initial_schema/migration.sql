-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Version" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyTypeVersion" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "versionId" INTEGER NOT NULL,
    "bodyTypeId" INTEGER NOT NULL,

    CONSTRAINT "BodyTypeVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelTypeBody" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bodyVersionId" INTEGER NOT NULL,
    "fuelTypeId" INTEGER NOT NULL,

    CONSTRAINT "FuelTypeBody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransmissionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransmissionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransmissionTypeFuel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fuelBodyId" INTEGER NOT NULL,
    "transmissionTypeId" INTEGER NOT NULL,

    CONSTRAINT "TransmissionTypeFuel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleYear" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transmissionTypeFuelId" INTEGER NOT NULL,

    CONSTRAINT "VehicleYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mileage" (
    "id" SERIAL NOT NULL,
    "minKm" INTEGER NOT NULL,
    "maxKm" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vehicleYearId" INTEGER NOT NULL,

    CONSTRAINT "Mileage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorMileage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mileageId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,

    CONSTRAINT "ColorMileage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccidentRecord" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "colorMileageId" INTEGER NOT NULL,

    CONSTRAINT "AccidentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "accidentRecordId" INTEGER NOT NULL,
    "description" TEXT,
    "listingStatus" TEXT NOT NULL DEFAULT 'Active',

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOffer" (
    "id" SERIAL NOT NULL,
    "year" INTEGER,
    "kilometer" INTEGER,
    "accidentStatus" TEXT,
    "accidentAmount" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "displayValues" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "brandId" INTEGER,
    "modelId" INTEGER,
    "versionId" INTEGER,
    "bodyTypeId" INTEGER,
    "fuelTypeId" INTEGER,
    "transmissionTypeId" INTEGER,
    "colorId" INTEGER,
    "notes" TEXT,
    "adminNotes" TEXT,

    CONSTRAINT "VehicleOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_brandId_name_key" ON "Model"("brandId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Version_modelId_name_key" ON "Version"("modelId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "BodyType_name_key" ON "BodyType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BodyTypeVersion_versionId_bodyTypeId_key" ON "BodyTypeVersion"("versionId", "bodyTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "FuelType_name_key" ON "FuelType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FuelTypeBody_bodyVersionId_fuelTypeId_key" ON "FuelTypeBody"("bodyVersionId", "fuelTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "TransmissionType_name_key" ON "TransmissionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TransmissionTypeFuel_fuelBodyId_transmissionTypeId_key" ON "TransmissionTypeFuel"("fuelBodyId", "transmissionTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleYear_transmissionTypeFuelId_year_key" ON "VehicleYear"("transmissionTypeFuelId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Mileage_vehicleYearId_minKm_maxKm_key" ON "Mileage"("vehicleYearId", "minKm", "maxKm");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ColorMileage_mileageId_colorId_key" ON "ColorMileage"("mileageId", "colorId");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyTypeVersion" ADD CONSTRAINT "BodyTypeVersion_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "Version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyTypeVersion" ADD CONSTRAINT "BodyTypeVersion_bodyTypeId_fkey" FOREIGN KEY ("bodyTypeId") REFERENCES "BodyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelTypeBody" ADD CONSTRAINT "FuelTypeBody_bodyVersionId_fkey" FOREIGN KEY ("bodyVersionId") REFERENCES "BodyTypeVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelTypeBody" ADD CONSTRAINT "FuelTypeBody_fuelTypeId_fkey" FOREIGN KEY ("fuelTypeId") REFERENCES "FuelType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransmissionTypeFuel" ADD CONSTRAINT "TransmissionTypeFuel_fuelBodyId_fkey" FOREIGN KEY ("fuelBodyId") REFERENCES "FuelTypeBody"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransmissionTypeFuel" ADD CONSTRAINT "TransmissionTypeFuel_transmissionTypeId_fkey" FOREIGN KEY ("transmissionTypeId") REFERENCES "TransmissionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleYear" ADD CONSTRAINT "VehicleYear_transmissionTypeFuelId_fkey" FOREIGN KEY ("transmissionTypeFuelId") REFERENCES "TransmissionTypeFuel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mileage" ADD CONSTRAINT "Mileage_vehicleYearId_fkey" FOREIGN KEY ("vehicleYearId") REFERENCES "VehicleYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorMileage" ADD CONSTRAINT "ColorMileage_mileageId_fkey" FOREIGN KEY ("mileageId") REFERENCES "Mileage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorMileage" ADD CONSTRAINT "ColorMileage_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccidentRecord" ADD CONSTRAINT "AccidentRecord_colorMileageId_fkey" FOREIGN KEY ("colorMileageId") REFERENCES "ColorMileage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_accidentRecordId_fkey" FOREIGN KEY ("accidentRecordId") REFERENCES "AccidentRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "Version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_bodyTypeId_fkey" FOREIGN KEY ("bodyTypeId") REFERENCES "BodyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_fuelTypeId_fkey" FOREIGN KEY ("fuelTypeId") REFERENCES "FuelType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_transmissionTypeId_fkey" FOREIGN KEY ("transmissionTypeId") REFERENCES "TransmissionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;
