import { createServer } from 'node:http';
import { setupRoutes } from './routes.js';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import  sqlite3  from 'sqlite3';
import { resolve } from 'node:path';

function default_config() 
{
    const config = 
    {
        server: 
        {
            ip: '127.0.0.1',
            port: 3000,
            default_path: './frontend/default.html'
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

function connect_db( path ) 
{
  const dbPath = resolve(path);

  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      throw new Error(`Error al conectar a la base de datos: ${err.message}`);
    }
  });

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

// Modifica el despachador principal para manejar archivos estáticos
async function request_dispatcher(request, response)
{
    const url = new URL(request.url, 'http://' + config.server.ip);
    const path = url.pathname;

    // 🔹 Manejo de la vista principal
    if (path === '/' || path === '/default.html') {
        const html = readFileSync(config.server.default_path, 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        return response.end(html); 
    }

    // 🔹 Archivos estáticos
    if (path.startsWith('/static/')) {
        const filePath = path.substring(8);
        return static_file_handler(filePath, response);
    }

    // 🔹 Rutas dinámicas (handlers)
    const handler = router.get(path);

    if (handler)
    {
        return await handler(request, response); 
    }
    else
    {
        response.writeHead(404);
        response.end('Método no encontrado');
    }
}

function start()
{
	console.log('Servidor ejecutándose...');
}

let server = createServer(request_dispatcher);

server.listen(config.server.port, config.server.ip, start);