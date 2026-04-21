export function default_handler(config)
{
    return function(request, response)
    {
        try 
        {
            const html = readFileSync(config.server.default_path, 'utf-8');
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(html);
        } 
        catch (error) 
        {
            response.writeHead(500);
            response.end('Error interno: No se pudo cargar la vista principal.');
        }
    };
}