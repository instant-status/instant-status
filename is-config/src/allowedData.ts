const ALLOWED_DATA = <const>[
  'server_id',
  'stack_id',
  'last_update_id',
  'server_role',
  'server_public_ip',
  'server_updated_at',
  'server_app_version',
  'server_app_updating_to_version',
  'server_disk_used_gb',
  'server_disk_total_gb',
  'server_key_file_name',
  'server_availability_zone',
  'server_type',
  'server_health_updated_at',
  'server_health_code',
  'server_health_message',
  'server_update_progress',
];

export type AllowedDataType = typeof ALLOWED_DATA[number];

export default ALLOWED_DATA;
