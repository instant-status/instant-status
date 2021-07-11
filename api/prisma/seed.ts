import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.server.upsert({
    where: { server_id: 'i-09bd3cebd759ddaa9' },
    update: {},
    create: {
      server_id: 'i-09bd3cebd759ddaa9',
      stack_id: 'fire-and-fury',
      // last_update_id: '1624725579363-fire-and-fury',
      stack_region: 'eu-west-3',
      stack_environment: 'production',
      stack_logo: 'https://logo.clearbit.com/flamingtext.com',
      stack_app_url: 'https://fire-and-fury.learninglocker.net/login/local',
      stack_logs_url:
        'https://eu-west-3.console.aws.amazon.com/cloudwatch/home?region=eu-west-3#logStream:group=ll-fire-and-fury',
      server_name: 'll fire and fury app',
      server_role: 'app',
      server_public_ip: '52.47.179.92',
      server_app_version: 'v10.11.3',
      server_xapi_version: 'v4.0.7',
      server_disk_used_gb: 9,
      server_disk_total_gb: 39,
      server_key_file_name: 'll-fire-and-fury',
      server_availability_zone: 'eu-west-3a',
      server_type: 't3.medium',
      server_health_updated_at: '2021-06-26T16:42:02Z',
      server_health_code: 0,
      server_health_message: 'All Good!',
      server_update_progress: 100,
      server_update_stage: 'finished',
      server_update_message: 'Update Finished!',
      server_app_updating_to_version: 'v10.11.3',
      server_xapi_updating_to_version: 'v4.0.7',
      server_is_chosen_one: false,
      server_updated_at: '2021-06-26T16:41:07.102Z',
    },
  });
  await prisma.server.upsert({
    where: { server_id: 'i-09bd3cebd759ddaa8' },
    update: {},
    create: {
      server_id: 'i-09bd3cebd759ddaa8',
      stack_id: 'fire-and-fury',
      // last_update_id: '1624725579363-fire-and-fury',
      stack_region: 'eu-west-3',
      stack_environment: 'production',
      stack_logo: 'https://logo.clearbit.com/flamingtext.com',
      stack_app_url: 'https://fire-and-fury.learninglocker.net/login/local',
      stack_logs_url:
        'https://eu-west-3.console.aws.amazon.com/cloudwatch/home?region=eu-west-3#logStream:group=ll-fire-and-fury',
      server_name: 'll fire and fury app',
      server_role: 'app',
      server_public_ip: '52.47.179.92',
      server_app_version: 'v10.11.3',
      server_xapi_version: 'v4.0.7',
      server_disk_used_gb: 9,
      server_disk_total_gb: 39,
      server_key_file_name: 'll-fire-and-fury',
      server_availability_zone: 'eu-west-3a',
      server_type: 't3.medium',
      server_health_updated_at: '2021-06-26T16:42:02Z',
      server_health_code: 0,
      server_health_message: 'All Good!',
      server_update_progress: 100,
      server_update_stage: 'finished',
      server_update_message: 'Update Finished!',
      server_app_updating_to_version: 'v10.11.3',
      server_xapi_updating_to_version: 'v4.0.7',
      server_is_chosen_one: false,
      server_updated_at: '2021-06-26T16:41:07.102Z',
    },
  });
  await prisma.server.upsert({
    where: { server_id: 'i-09bd3cebd759ddaa7' },
    update: {},
    create: {
      server_id: 'i-09bd3cebd759ddaa7',
      stack_id: 'fire-and-fury',
      // last_update_id: '1624725579363-fire-and-fury',
      stack_region: 'eu-west-3',
      stack_environment: 'production',
      stack_logo: 'https://logo.clearbit.com/flamingtext.com',
      stack_app_url: 'https://fire-and-fury.learninglocker.net/login/local',
      stack_logs_url:
        'https://eu-west-3.console.aws.amazon.com/cloudwatch/home?region=eu-west-3#logStream:group=ll-fire-and-fury',
      server_name: 'll fire and fury app',
      server_role: 'app',
      server_public_ip: '52.47.179.92',
      server_app_version: 'v10.11.3',
      server_xapi_version: 'v4.0.7',
      server_disk_used_gb: 9,
      server_disk_total_gb: 39,
      server_key_file_name: 'll-fire-and-fury',
      server_availability_zone: 'eu-west-3a',
      server_type: 't3.medium',
      server_health_updated_at: '2021-06-26T16:42:02Z',
      server_health_code: 0,
      server_health_message: 'All Good!',
      server_update_progress: 100,
      server_update_stage: 'finished',
      server_update_message: 'Update Finished!',
      server_app_updating_to_version: 'v10.11.3',
      server_xapi_updating_to_version: 'v4.0.7',
      server_is_chosen_one: false,
      server_updated_at: '2021-06-26T16:41:07.102Z',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
