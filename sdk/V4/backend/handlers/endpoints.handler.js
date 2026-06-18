export function log_handler(req, res)
{
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Metodo no permitido');
      return;
    }
    res.writeHead(200, {'Content-Type': 'application/json'});

    res.end(JSON.stringify({
        success: true,
        message: "Endpoint /log ejecutado correctamente"
    }));
}

export function say_hello_handler(req, res)
{
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Metodo no permitido');
      return;
    }
    res.writeHead(200, {'Content-Type': 'application/json'});

    res.end(JSON.stringify({
        success: true,
        message: "Endpoint /sayHello ejecutado correctamente"
    }));
}