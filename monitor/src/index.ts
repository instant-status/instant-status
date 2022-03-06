import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { prisma } from 'is-prisma';

dayjs.extend(utc);

let runMonitor = false;

const monitor = async () => {
  if (runMonitor) {
    console.log(`[${dayjs().utc()}] Running monitor`);
    const truantServers = await prisma.servers.findMany({
      where: {
        server_health_updated_at: {
          lt: dayjs().utc().subtract(5, 'minutes').toDate(),
        },
      },
      select: {
        id: true,
        server_id: true,
        server_health_updated_at: true,
        stackId: {
          select: {
            name: true,
          },
        },
      },
    });

    const truantServersIds = truantServers.map((server) => server.id);

    const serversToDelete = await prisma.servers.deleteMany({
      where: { id: { in: truantServersIds } },
    });

    if (serversToDelete.count > 0) {
      console.log('🚮 Deleted the following truant servers:', truantServers);
    }
  } else {
    console.log('Skipping monitor');
  }
};

setInterval(monitor, 1 * 60 * 1000);
setTimeout(() => {
  runMonitor = true;
}, 2 * 60 * 1000);
