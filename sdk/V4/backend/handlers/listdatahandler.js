import { getAllUsers } from '../repositories/userRepository.js';
import { getAllGroups } from '../repositories/groupRepository.js';

export function listUsersHandler(req, res) {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Metodo no permitido');
      return;
    }
    try {
      const users = getAllUsers();

       res.writeHead(200, {'Content-Type': 'application/json'});

        res.end(JSON.stringify({
            status: 'success',
            data: users
        }));

    } catch(error) {
        res.writeHead(500, {'Content-Type': 'application/json'});

        res.end(JSON.stringify({
            status: 'error',
            message: error.message
        }));
    }
}

export function listGroupsHandler(req, res) {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Metodo no permitido');
      return;
    }
    try {
      const groups = getAllGroups();

       res.writeHead(200, {'Content-Type': 'application/json'});

        res.end(JSON.stringify({
            status: 'success',
            data: groups
        }));

    } catch(error) {
        res.writeHead(500, {'Content-Type': 'application/json'});

        res.end(JSON.stringify({
            status: 'error',
            message: error.message
        }));
    }
}