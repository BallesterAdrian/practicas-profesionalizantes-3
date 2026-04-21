export function register_handler(register)
{
  return function(request, response)
  {
    if (request.method !== 'POST') {
      response.writeHead(405);
      response.end('Método no permitido');
      return;
    }

    let body = '';

    request.on('data', chunk => {
      body += chunk;
    });

    request.on('end', () => {
      const params = new URLSearchParams(body);
      const username = params.get("username");
      const password = params.get("password");

      console.log("BODY:", body);
      console.log("USER:", username);
      console.log("PASS:", password);

      register(username, password)
        .then(resultado => {
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ status: 'ok', data: resultado }));
        })
        .catch(error => {
          response.writeHead(500, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ status: 'error', message: error.message }));
        });
    });
  };
}