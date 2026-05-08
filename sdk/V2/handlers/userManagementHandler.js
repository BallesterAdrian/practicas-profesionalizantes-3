import { getGroupsByUserId } from '../repositories/authRepository.js';
import { deleteUser } from '../repositories/userRepository.js';
// puede elimiar cualquier usuario 
export function deleteUserHandler(db) {

  return async function(request, response) {

    if (request.method !== 'POST') {

      response.writeHead(405);

      return response.end(JSON.stringify({
        status: 'error',
        message: 'Metodo no permitido'
      }));
    }

    let body = '';

    request.on('data', chunk => {
      body += chunk;
    });

    request.on('end', async () => {

      const params = new URLSearchParams(body);

      const userId = parseInt(params.get('user_id'));

      try {

        const result = await deleteUser(db, userId);

        response.writeHead(200, {
          'Content-Type': 'application/json'
        });

        response.end(JSON.stringify({
          status: 'success',
          data: result
        }));

      } catch(err) {

        response.writeHead(500, {
          'Content-Type': 'application/json'
        });

        response.end(JSON.stringify({
          status: 'error',
          message: err.message
        }));
      }

    });

  };
}

// Handler para que un usuario elimine su propia cuenta, aun la tengo que probar
export function deleteOwnAccountHandler(db) {
  return async function(request, response) {
  
    const userId = request.userId;

    const sql = `DELETE FROM user WHERE id = ?`;
    db.run(sql, [userId], function(err) {
      if (err) {
        response.writeHead(500);
        return response.end(JSON.stringify({ status: 'error', message: err.message }));
      }

      response.writeHead(200);
      response.end(JSON.stringify({ status: 'success', message: 'Cuenta eliminada' }));
    });
  };
}