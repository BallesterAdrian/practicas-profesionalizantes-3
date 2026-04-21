export function login_handler(config, login)
{
    return async function(request, response)
    {
        const url = new URL(request.url, 'http://' + config.server.ip);
        const input = Object.fromEntries(url.searchParams);

        console.log(input);

        const output = login(input);

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    };
}