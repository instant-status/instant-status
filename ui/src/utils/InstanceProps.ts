export default interface InstanceProps {
  // Stack
  stack_id: string;
  stack_environment: string;
  stack_region: string;
  stack_app_url: string;
  stack_logs_url: string;
  stack_logo: string;

  // Instance Display
  server_name: string;
  server_public_ip: string;
  instanceCreatedAt: string;
  server_updated_at: string;
  server_app_version: string;
  server_xapi_version: string;
  server_disk_used_gb: number;
  server_disk_total_gb: number;
  server_key_file_name: string;
  server_is_chosen_one: boolean;
  server_updating_app_to: string;
  server_updating_xapi_to: string;

  // Instance Display Advanced
  server_availability_zone: string;
  server_id: string;
  server_type: string;

  // Instance State
  instanceStateCode: number;

  // Health Check
  server_health_updated_at: string;
  server_health_code: number;
  server_health_message: string;
}
