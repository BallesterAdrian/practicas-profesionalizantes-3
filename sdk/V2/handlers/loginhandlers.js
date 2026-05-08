export function login_handler(config, login) {
  return async function(request, response) {
    let body = '';
    request.on('data', chunk => {
      body += chunk;
    });

    request.on('end', async () => {
      const params = new URLSearchParams(body);
      const username = params.get('username');
      const password = params.get('password');

      const result = await login(username, password);

      // Si la solicitud viene con cabecera de AJAX o es JSON
      if (request.headers['content-type']?.includes('application/json') ||
          request.headers.accept?.includes('application/json')) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(result));
      } else {
        // Comportamiento anterior
        if (result.status) {
          response.writeHead(302, { Location: '/' });
          response.end();
        } else {
          response.writeHead(401);
          response.end(result.description);
        }
      }
    });
  };
}