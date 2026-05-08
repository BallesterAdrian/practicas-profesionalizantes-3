import { default_handler } from '../handlers/defaulthandler.js';
import { register_handler } from '../handlers/registerhandlers.js';
import { login_handler } from '../handlers/loginhandlers.js';
import { login } from '../usescause/login.js';
import { register } from '../usescause/register.js';
import { insertarUsuario } from '../repositories/userRepository.js';
import { deleteUserHandler, deleteOwnAccountHandler } from '../handlers/userManagementHandler.js';
import { editUserHandler } from '../handlers/editUserHandler.js';
import { createGroupHandler, deleteGroupHandler, updateGroupHandler } from '../handlers/grouphandler.js';
import { listUsersHandler, listGroupsHandler } from '../handlers/listdatahandler.js';
import { requireAuth, requireRole, isAdmin } from '../middleware/authMiddleware.js';
import { updatePermissionsHandler, createEndpointHandler, deleteEndpointHandler } from '../handlers/permissionHandler.js';

export function setupRoutes(router, config, db) {
  router.set('/', default_handler(config));
  router.set('/login', login_handler(config, login));
  const registerUseCase = register(insertarUsuario, db);
  router.set('/register', register_handler(registerUseCase));

  // Públicas
  router.set('/api/admin/user/delete', (req, res) => {
  deleteUserHandler(db)(req, res);
});

  router.set('/api/user/edit', (req, res) => {
    editUserHandler(db)(req, res);
  });

  router.set('/api/account/delete', (req, res) => {
    deleteOwnAccountHandler(db)(req, res);
  });

  router.set('/api/admin/group/create', (req, res) => {
    createGroupHandler(db)(req, res);
  });

  router.set('/api/admin/group/delete', (req, res) => {
    deleteGroupHandler(db)(req, res);
  });

  router.set('/api/admin/group/update', (req, res) => {
    updateGroupHandler(db)(req, res);
  });

  router.set('/api/admin/data', (req, res) => {
    listUsersAndGroupsHandler(db)(req, res);
  });

  router.set('/api/users', (req, res) => {
    listUsersHandler(db)(req, res);
  });

  router.set('/api/groups', (req, res) => {
    listGroupsHandler(db)(req, res);
  });

  router.set('/api/is-admin', (req, res) => {
  requireAuth(db)(req, res, () => {
    if (isAdmin(req)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', role: 'admin' }));
    } else {
      res.writeHead(403);
      res.end(JSON.stringify({ status: 'error', message: 'No eres admin' }));
    }
  });
});
  router.set('/api/admin/permissions', (req, res) => {
    updatePermissionsHandler(db)(req, res);
  });
  router.set('/api/admin/endpoint/create', (req, res) => {
    createEndpointHandler(db)(req, res);
  });
  router.set('/api/admin/endpoint/delete', (req, res) => {
  deleteEndpointHandler(db)(req, res);
});
}