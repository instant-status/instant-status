import KoaRouter from '@koa/router';

import { checkIn } from '../controllers/checkIn';
import {
  updateCreate,
  updateGet,
  updatePost,
  getStacksAvailableForUpdate,
  getUpdatingStacks,
} from '../controllers/update';
import { getMetadata } from '../controllers/metadata';

import { deleteServer, getServers } from '../controllers/servers';

import { authGoogle } from '../controllers/auth';

const router = new KoaRouter();

// Home
router.get('/', (ctx) => (ctx.body = { version: '2.0.0' }));

// Google Auth
router.get('/auth/google/callback', authGoogle);

// UI
router.get('/v2/servers', getServers);

// Server Communication
router.get('/v2/update', updateGet);
router.post('/v2/update', updatePost);
router.post('/v2/check-in', checkIn);
router.delete('/v2/server/delete', deleteServer);

// Update
router.post('/v2/update/create', updateCreate);

// Metadata
router.get('/v2/metadata', getMetadata);
router.get('/v2/stacks/available-for-update', getStacksAvailableForUpdate);
router.get('/v2/stacks/updating', getUpdatingStacks);

export default router;
