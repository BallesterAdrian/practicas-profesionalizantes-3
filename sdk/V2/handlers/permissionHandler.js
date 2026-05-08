import { getGroupIdByName } from '../repositories/groupRepository.js';
import { getEndpointIdByPath, createEndpoint, deleteEndpoint } from '../repositories/endpointRepository.js';
import { addAccess } from '../repositories/accessRepository.js';

export function createEndpointHandler(db) {
  return async (req, res) => {

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const params = new URLSearchParams(body);
        const path = params.get('path');

        if (!path) {
          res.writeHead(400, {
            'Content-Type': 'application/json'
          });

          return res.end(JSON.stringify({
            error: 'Path requerido'
          }));
        }

        const result = await createEndpoint(db, path);
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          success: true,
          data: result
        }));

      } catch(error) {

        res.writeHead(500, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }

    });

  };
}

export function updatePermissionsHandler(db) {
  return async (req, res) => {

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const params = new URLSearchParams(body);
        const group_name = params.get('group_name');
        const endpoint = params.get('endpoint');

        const group = await getGroupIdByName(db, group_name);

        if (!group) {

          res.writeHead(404, {
            'Content-Type': 'application/json'
          });

          return res.end(JSON.stringify({
            error: 'Grupo no encontrado'
          }));
        }

        const endpointInfo = await getEndpointIdByPath(db, endpoint);

        if (!endpointInfo) {

          res.writeHead(404, {
            'Content-Type': 'application/json'
          });

          return res.end(JSON.stringify({
            error: 'Endpoint no encontrado'
          }));
        }

        await addAccess(db, group.id, endpointInfo.id);

        res.writeHead(200, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          success: true,
          message: 'Permiso agregado'
        }));

      } catch(error) {

        res.writeHead(500, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          error: error.message
        }));
      }

    });

  };
}

export function deleteEndpointHandler(db) {

  return async (req, res) => {

    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {

      try {

        const params = new URLSearchParams(body);

        const endpointId = parseInt(
          params.get('endpoint_id')
        );

        if (isNaN(endpointId)) {

          res.writeHead(400, {
            'Content-Type': 'application/json'
          });

          return res.end(JSON.stringify({
            error: 'ID inválido'
          }));
        }

        const result = await deleteEndpoint(db, endpointId);

        res.writeHead(200, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          success: true,
          data: result
        }));

      } catch(error) {

        res.writeHead(500, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }

    });

  };
}