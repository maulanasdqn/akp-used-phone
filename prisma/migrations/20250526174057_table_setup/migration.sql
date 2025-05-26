-- CreateTable
CREATE TABLE "AppUsers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppRoles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppPermissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppRolePermissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppRolePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppProducts" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "imageUrl" TEXT,
    "stockQuantity" INTEGER NOT NULL,
    "minimumOrderQuantity" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppProducts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUsers_email_key" ON "AppUsers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppPermissions_name_key" ON "AppPermissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AppRolePermissions_roleId_permissionId_key" ON "AppRolePermissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "AppProducts_sku_key" ON "AppProducts"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "AppProducts_slug_key" ON "AppProducts"("slug");

-- AddForeignKey
ALTER TABLE "AppUsers" ADD CONSTRAINT "AppUsers_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "AppRoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppRolePermissions" ADD CONSTRAINT "AppRolePermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "AppRoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppRolePermissions" ADD CONSTRAINT "AppRolePermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "AppPermissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppProducts" ADD CONSTRAINT "AppProducts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "AppUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
