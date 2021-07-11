-- AlterTable
ALTER TABLE "Servers" ALTER COLUMN "server_update_stage" DROP NOT NULL,
ALTER COLUMN "server_update_message" DROP NOT NULL,
ALTER COLUMN "server_app_updating_to_version" DROP NOT NULL,
ALTER COLUMN "server_xapi_updating_to_version" DROP NOT NULL,
ALTER COLUMN "server_is_chosen_one" DROP NOT NULL,
ALTER COLUMN "server_updated_at" DROP NOT NULL;
