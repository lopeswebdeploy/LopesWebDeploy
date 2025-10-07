-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "full_description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'venda',
    "type" TEXT,
    "property_type" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "location" TEXT,
    "state" TEXT NOT NULL DEFAULT 'Goiânia',
    "address" TEXT,
    "coordinates" JSONB,
    "embed_url" TEXT,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "suites" INTEGER NOT NULL DEFAULT 0,
    "parking" INTEGER NOT NULL DEFAULT 0,
    "area" TEXT,
    "balcony_types" JSONB NOT NULL DEFAULT '[]',
    "price" TEXT,
    "apartment_options" JSONB NOT NULL DEFAULT '[]',
    "developer" TEXT,
    "delivery_date" TEXT,
    "availability" TEXT,
    "characteristics" JSONB NOT NULL DEFAULT '[]',
    "location_benefits" JSONB NOT NULL DEFAULT '[]',
    "differentials" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'gallery',
    "property_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "property_id" TEXT,
    "owner_id" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "status" TEXT NOT NULL DEFAULT 'novo',
    "notes" TEXT,
    "whatsapp_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'corretor',
    "phone" TEXT,
    "avatar" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
