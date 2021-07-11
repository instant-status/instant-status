-- CreateTable
CREATE TABLE "Servers" (
    "id" SERIAL NOT NULL,
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
    "server_health_updated_at" TIMESTAMP(3) NOT NULL,
    "server_health_code" INTEGER NOT NULL,
    "server_health_message" TEXT NOT NULL,
    "server_update_progress" INTEGER NOT NULL,
    "server_update_stage" TEXT NOT NULL,
    "server_update_message" TEXT NOT NULL,
    "server_app_updating_to_version" TEXT NOT NULL,
    "server_xapi_updating_to_version" TEXT NOT NULL,
    "server_is_chosen_one" BOOLEAN NOT NULL,
    "server_updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Updates" (
    "id" SERIAL NOT NULL,
    "update_requested_by" TEXT,
    "stack_id" TEXT NOT NULL,
    "servers" TEXT[],
    "servers_ready_to_switch" TEXT[],
    "servers_finished" TEXT[],
    "server_count" INTEGER NOT NULL,
    "server_ready_to_switch_count" INTEGER NOT NULL,
    "server_finished_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "is_cancelled" BOOLEAN NOT NULL,
    "run_migrations" BOOLEAN NOT NULL,
    "rollback_migrations" BOOLEAN NOT NULL,
    "update_app_to" TEXT NOT NULL,
    "update_xapi_to" TEXT NOT NULL,
    "chosen_one" TEXT NOT NULL,
    "switch_code_at_date" INTEGER NOT NULL,
    "updatesId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Servers.server_id_unique" ON "Servers"("server_id");

-- AddForeignKey
ALTER TABLE "Updates" ADD FOREIGN KEY ("updatesId") REFERENCES "Updates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
