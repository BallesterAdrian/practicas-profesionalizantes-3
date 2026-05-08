export function editUserHandler(db) {
  return async function(request, response) {
    if (request.method !== 'POST') {
      response.writeHead(405);
      return response.end(JSON.stringify({ status: 'error', message: 'Método no permitido' }));
    }

    let body = '';
    request.on('data', chunk => {
      body += chunk;
    });

    request.on('end', () => {
      const params = new URLSearchParams(body);
      const userId = parseInt(params.get('id_user'));
      const newGroup = params.get('group'); 

      console.log('Valores recibidos:', { userId, newGroup });

      if (newGroup) {
        // Asignar usuario a nuevo grupo
        const sql = `
          INSERT OR REPLACE INTO members (id_user, id_group)
          VALUES (?, (SELECT id FROM \`group\` WHERE name = ?))
        `;
        db.run(sql, [userId, newGroup], function(err) {
          console.log('Callback ejecutado. Error:', err);
          if (err) {
            response.writeHead(500);
            return response.end(JSON.stringify({ status: 'error', message: err.message }));
          }

          response.writeHead(200);
          response.end(JSON.stringify({ status: 'success', message: 'Grupo actualizado' }));
        });
      }
    });
  };
}