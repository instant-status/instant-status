export interface ServerProps {
  // Stack
  stack_id: number;
  stack_environment: string;
  stack_region: string;
  stack_app_url: string;
  stack_logs_url: string;
  stack_logo_url: string;

  // Server Display
  server_name: string;
  server_role: string;
  server_public_ip: string;
  server_updated_at: string;
  server_app_version: string;
  server_xapi_version: string;
  server_disk_used_gb: number;
  server_disk_total_gb: number;
  server_key_file_name: string;
  server_is_chosen_one: boolean;

  // Server Updates
  server_update_state: string;
  server_update_progress: number;
  server_update_message: string;
  server_app_updating_to_version: string;
  server_xapi_updating_to_version: string;

  // Server Display Advanced
  server_availability_zone: string;
  server_id: string;
  server_type: string;

  // Health Check
  server_health_updated_at: string;
  server_health_code: number;
  server_health_message: string;
}

export interface StackProps {
  id: number;
  name: string;
  region: string;
  app_url: string;
  logs_url: string;
  logo_url: string;
  environment: string;

  servers: ServerProps[];
}
