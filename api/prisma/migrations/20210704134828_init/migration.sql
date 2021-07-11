-- CreateTable
CREATE TABLE "Server" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "server_id" TEXT NOT NULL,
    "stack_id" TEXT NOT NULL,
    "stack_region" TEXT NOT NULL,
    "stack_environment" TEXT NOT NULL,
    "stack_logo" TEXT NOT NULL,
    "stack_app_url" TEXT NOT NULL,
    "stack_logs_url" TEXT NOT NULL,
    "server_name" TEXT NOT NULL,
    "server_role" TEXT NOT NULL,
    "server_public_ip" TEXT NOT NULL,
    "server_app_version" TEXT NOT NULL,
    "server_xapi_version" TEXT NOT NULL,
    "server_disk_used_gb" INTEGER NOT NULL,
    "server_disk_total_gb" INTEGER NOT NULL,
    "server_key_file_name" TEXT NOT NULL,
    "server_availability_zone" TEXT NOT NULL,
    "server_type" TEXT NOT NULL,
    "server_health_updated_at" DATETIME NOT NULL,
    "server_health_code" INTEGER NOT NULL,
    "server_health_message" TEXT NOT NULL,
    "server_update_progress" INTEGER NOT NULL,
    "server_update_stage" TEXT NOT NULL,
    "server_update_message" TEXT NOT NULL,
    "server_app_updating_to_version" TEXT NOT NULL,
    "server_xapi_updating_to_version" TEXT NOT NULL,
    "server_is_chosen_one" BOOLEAN NOT NULL,
    "server_updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Server.server_id_unique" ON "Server"("server_id");
