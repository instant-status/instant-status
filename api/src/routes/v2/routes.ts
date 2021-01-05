import KoaRouter from '@koa/router';

import { checkIn } from '../../controllers/v2/checkIn';
import { updateGet, updatePost } from '../../controllers/v2/update';
import { getMetadata } from '../../controllers/v2/metadata';

const routerV2 = new KoaRouter({
  prefix: '/v2',
});

// Home
routerV2.get('/', (ctx) => (ctx.body = { version: '2.0.0' }));

// Check-in
routerV2.post('/check-in', checkIn);

// Update
routerV2.get('/update', updateGet);
routerV2.post('/update', updatePost);

// Metadata
routerV2.get('/metadata', getMetadata);

export default routerV2;
