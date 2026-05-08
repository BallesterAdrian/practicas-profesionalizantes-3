import { createGroup, deleteGroup, updateGroup } from "../repositories/groupRepository.js";

export function createGroupHandler(db) {
  return async function(request, response) {
    if (request.method !== 'POST') {
      response.writeHead(405);
      return response.end(JSON.stringify({ status: 'error', message: 'Metodo no permitido' }));
    }

    let body = '';
    request.on('data', chunk => {
      body += chunk;
    });

    request.on('end', async () => {
      const params = new URLSearchParams(body);
      const name = params.get('name');

      try {
        const result = await createGroup(db, name);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'success', data: result }));
      } catch (err) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
  };
}

export function deleteGroupHandler(db) {
  return async function(request, response) {
    if (request.method !== 'POST') {
      response.writeHead(405);
      return response.end(JSON.stringify({ status: 'error', message: 'Metodo no permitido' }));
    }

    let body = '';
    request.on('data', chunk => {
      body += chunk;
    });

    request.on('end', async () => {
      const params = new URLSearchParams(body);
      const id = parseInt(params.get('id'));

      try {
        const result = await deleteGroup(db, id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'success', data: result }));
      } catch (err) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
  };
}

//funcion que no probe aun
export function updateGroupHandler(db) {
  return async function(request, response) {
    if (request.method !== 'POST') {
      response.writeHead(405);
      return response.end(JSON.stringify({ status: 'error', message: 'Metodo no permitido' }));
    }

    let body = '';
    request.on('data', chunk => {
      body += chunk;
    });

    request.on('end', async () => {
      const params = new URLSearchParams(body);
      const id = parseInt(params.get('id'));
      const name = params.get('name');

      try {
        const result = await updateGroup(db, id, name);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'success', data: result }));
      } catch (err) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
  };
}