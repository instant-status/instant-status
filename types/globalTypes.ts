export interface InstanceProps {
  server_availability_zone: string;
  server_disk_total_gb: number;
  server_disk_used_gb: number;
  server_health_code: number;
  server_health_message: string;
  server_id: string;
  server_is_chosen_one: true;
  server_key_file_name: string;
  server_health_updated_at: string;
  server_name: string;
  server_public_ip: string;
  server_type: string;
  server_updated_at: string;
  server_updating_app_to: null;
  server_app_version: string;
  stack_app_url: string;
  stack_environment: string;
  stack_logs_url: string;
  stack_id: string;
  stack_region: string;
}
