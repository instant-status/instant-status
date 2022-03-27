import KoaRouter from '@koa/router';

import * as checkInController from '../controllers/checkIn';
import * as updateController from '../controllers/update';
import * as metadataController from '../controllers/metadata';
import * as stackController from '../controllers/stack';
import * as serverController from '../controllers/server';
import * as userController from '../controllers/user';
import * as authController from '../controllers/auth';
import * as roleController from '../controllers/role';

const serverOnly = (ctx: KoaRouter.RouterContext, next: () => void) => {
  const isRequestFromServer =
    authController.getRequesterIdentity(ctx.request) ===
    `server@instantstatus.local`;
  if (!isRequestFromServer) ctx.throw(401);
  return next();
};

const router = new KoaRouter();

// Home
router.get('/', (ctx) => (ctx.body = { version: '2.0.0' }));

// Google Auth
router.get('/auth/google/callback', authController.authGoogle);

// Stack
router.get('/v2/stacks', stackController.listStacks);
router.get('/v2/stack/get-id', serverOnly, stackController.getIdByName);
router.post('/v2/stack', stackController.createStack);
router.post('/v2/admin/stacks/delete', stackController.deleteStacks);
router.get(
  '/v2/stack/get-available-stacks-and-environments',
  stackController.getAvailableStacksAndEnvironments
);

// Server Communication
router.get('/v2/update', serverOnly, updateController.updateGet);
router.post('/v2/update', serverOnly, updateController.updateServerProgress);
router.post('/v2/check-in', serverOnly, checkInController.checkIn);
router.delete('/v2/server/delete', serverController.deleteServer);

// Update
router.post('/v2/update/create', updateController.updateCreate);

// Metadata
router.get('/v2/metadata', metadataController.getMetadata);

// User
router.get('/v2/admin/users', userController.getUsers);
router.post('/v2/admin/user/create', userController.createUser);
router.post('/v2/admin/user/edit', userController.editUser);
router.post('/v2/admin/users/delete', userController.deleteUsers);

// Roles
router.get('/v2/admin/roles', roleController.getRoles);
router.post('/v2/admin/role/create', roleController.createRole);
router.post('/v2/admin/role/edit', roleController.editRole);
router.post('/v2/admin/roles/delete', roleController.deleteRoles);

export default router;
