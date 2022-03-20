-- CreateTable
CREATE TABLE "Stacks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "environment" TEXT,
    "logo_url" TEXT,
    "app_url" TEXT,
    "logs_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servers" (
    "id" SERIAL NOT NULL,
    "server_id" TEXT NOT NULL,
    "stack_id" INTEGER NOT NULL,
    "last_update_id" INTEGER,
    "server_name" TEXT NOT NULL,
    "server_role" TEXT NOT NULL,
    "server_public_ip" TEXT NOT NULL,
    "server_app_version" TEXT NOT NULL,
    "server_disk_used_gb" INTEGER NOT NULL,
    "server_disk_total_gb" INTEGER NOT NULL,
    "server_key_file_name" TEXT NOT NULL,
    "server_availability_zone" TEXT NOT NULL,
    "server_type" TEXT NOT NULL,
    "server_health_updated_at" TIMESTAMP(3) NOT NULL,
    "server_health_code" INTEGER NOT NULL,
    "server_health_message" TEXT NOT NULL,
    "server_update_progress" INTEGER,
    "server_update_stage" TEXT,
    "server_update_message" TEXT,
    "server_app_updating_to_version" TEXT,
    "server_is_chosen_one" BOOLEAN,
    "server_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_updated_at" TIMESTAMP(3),

    CONSTRAINT "Servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Updates" (
    "id" SERIAL NOT NULL,
    "update_requested_by" TEXT,
    "last_update_id" INTEGER,
    "stack_id" INTEGER NOT NULL,
    "servers" TEXT[],
    "servers_ready_to_switch" TEXT[],
    "servers_finished" TEXT[],
    "server_count" INTEGER NOT NULL,
    "server_ready_to_switch_count" INTEGER NOT NULL,
    "server_finished_count" INTEGER NOT NULL,
    "is_cancelled" BOOLEAN NOT NULL,
    "run_migrations" BOOLEAN NOT NULL,
    "update_app_to" TEXT NOT NULL,
    "chosen_one" TEXT NOT NULL,
    "switch_code_at_date" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "view_stack_environments" TEXT[],
    "update_stack_environments" TEXT[],

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UsersToStacksView" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UsersToStacksUpdate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UsersToRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Stacks_name_key" ON "Stacks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Servers_server_id_key" ON "Servers"("server_id");

-- CreateIndex
CREATE UNIQUE INDEX "Updates_last_update_id_key" ON "Updates"("last_update_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UsersToStacksView_AB_unique" ON "_UsersToStacksView"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersToStacksView_B_index" ON "_UsersToStacksView"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UsersToStacksUpdate_AB_unique" ON "_UsersToStacksUpdate"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersToStacksUpdate_B_index" ON "_UsersToStacksUpdate"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UsersToRoles_AB_unique" ON "_UsersToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersToRoles_B_index" ON "_UsersToRoles"("B");

-- AddForeignKey
ALTER TABLE "Servers" ADD CONSTRAINT "Servers_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "Stacks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servers" ADD CONSTRAINT "Servers_last_update_id_fkey" FOREIGN KEY ("last_update_id") REFERENCES "Updates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_stack_id_fkey" FOREIGN KEY ("stack_id") REFERENCES "Stacks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_last_update_id_fkey" FOREIGN KEY ("last_update_id") REFERENCES "Updates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersToStacksView" ADD FOREIGN KEY ("A") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersToStacksView" ADD FOREIGN KEY ("B") REFERENCES "Stacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersToStacksUpdate" ADD FOREIGN KEY ("A") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersToStacksUpdate" ADD FOREIGN KEY ("B") REFERENCES "Stacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersToRoles" ADD FOREIGN KEY ("A") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersToRoles" ADD FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
