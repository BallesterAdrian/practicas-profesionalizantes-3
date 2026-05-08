import { getGroupsByUserId } from '../repositories/authRepository.js';

//ni lo probe bien
export function requireAuth(db) {
  return async function(request, response, next) {
    
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      response.writeHead(401);
      return response.end(JSON.stringify({ status: 'error', message: 'No autorizado' }));
    }

    const userId = parseInt(authHeader.split(' ')[1]);
    if (isNaN(userId)) {
      response.writeHead(401);
      return response.end(JSON.stringify({ status: 'error', message: 'Token invalido' }));
    }

    request.userId = userId;

    try {
      const groups = await getGroupsByUserId(db, userId);
      request.userGroups = groups;
      next();
    } catch (error) {
      response.writeHead(500);
      response.end(JSON.stringify({ status: 'error', message: error.message }));
    }
  };
}

//no probe aun
export function requireRole(roleName) {
  return function(request, response, next) {
    const hasRole = request.userGroups.some(g => g.name === roleName);
    if (!hasRole) {
      response.writeHead(403);
      return response.end(JSON.stringify({ status: 'error', message: 'Acceso denegado' }));
    }
    next();
  };
}

export function isAdmin(request) {
  return request.userGroups && request.userGroups.some(g => g.name === 'admin');
}