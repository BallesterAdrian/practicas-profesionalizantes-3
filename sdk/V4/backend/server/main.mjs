import { createServer } from 'node:http';
import { setupRoutes } from './routes.js';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';
import { userSessions } from '../usescause/sessions.js';
import { authorize } from '../usescause/authorize.js'

function default_config() 
{
    const config = 
    {
        server: 
        {
            ip: '127.0.0.1',
            port: 3000,
            default_path: '../frontend/default.html'
        },
        database:
        {
            path: './db.sqlite3'
        }
    };

    return config;
}

function load_config() 
{
    let config = null;
    try 
    {
        const data = readFileSync('../config.json', 'utf-8');
        config = JSON.parse(data);
        console.log("Configuración cargada correctamente.");
    } 
    catch (error) 
    {
        console.error("Error cargando config.json. Usando valores por defecto.");
        config = default_config();
    }
    return config;
}

let config = load_config();

function connect_db(path) 
{
  const dbPath = resolve(path);

  const db = new DatabaseSync(dbPath);

  return db;
}

// Uso
const db = connect_db( config.database.path );

let router = new Map();
// Después de crear el router:
setupRoutes(router, config, db);

// Añade esta función para servir archivos estáticos
function static_file_handler(filePath, response) {
    try {
        const fullPath = './frontend/' + filePath;
        const content = readFileSync(fullPath, 'utf-8');
        
        // Determina el Content-Type según la extensión
        let contentType = 'text/html';
        if (filePath.endsWith('.css')) contentType = 'text/css';
        else if (filePath.endsWith('.js')) contentType = 'application/javascript';
        else if (filePath.endsWith('.json')) contentType = 'application/json';
        
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content);
    } catch (error) {
        response.writeHead(404);
        response.end('Archivo no encontrado');
    }
}


const publicRoutes =[
    '/login',
    '/register'
];

function isPublicRoute(path)
{
    return publicRoutes.includes(path);
}

function getSessionFromRequest(req)
{
    const userId =
        parseInt(
            req.headers['x-user-id']
        );

    const apiKey =
        req.headers['x-api-key'];

    if (isNaN(userId))
    {
        return null;
    }

    const session = userSessions.get(userId);

    if (!session)
    {
        return null;
    }

    if (session.apiKey !== apiKey)
    {
        return null;
    }

    return session;
}

async function request_dispatcher(req, res)
{
    const url = new URL(req.url, 'http://' + config.server.ip);

    const path = url.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, x-user-id, x-api-key');

    if (req.method === 'OPTIONS'){
        res.writeHead(204);
        res.end();
        return;
    }

    if (path.startsWith('/static/')){
        const filePath = path.substring(8);

        return static_file_handler(
            filePath,
            res
        );
    }

    const handler = router.get(path);

    if (!handler){
        res.writeHead(404);
        res.end('Método no encontrado');
        return;
    }

    if (isPublicRoute(path)){
        return await handler(
            req,
            res
        );
    }

    const session = getSessionFromRequest(req);

    if (!session){
        res.writeHead(401);
        res.end('Sesión inválida');
        return;
    }

    console.log('PATH:', path);
    console.log('SESSION:', session);
    console.log('SESSIONS:', userSessions);

    const authorized = authorize(session.userId, path);

    console.log('AUTHORIZED:', authorized);

    if (!authorized)
    {
        res.writeHead(403);
        res.end('Acceso denegado');
        return;
    }

    return await handler(req, res);
}


function start()
{
	console.log('Servidor ejecutandose...');
    console.log(`API: http://${config.server.ip}:${config.server.port}`);

    console.log('Frontend (Apache): http://localhost');
}

let server = createServer(request_dispatcher);

server.listen(config.server.port, config.server.ip, start);