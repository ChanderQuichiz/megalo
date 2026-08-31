-- CreateTable
CREATE TABLE "Field" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "costPerHour" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldImage" (
    "id" SERIAL NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "FieldImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FieldImage" ADD CONSTRAINT "FieldImage_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
