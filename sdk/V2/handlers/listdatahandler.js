import { getAllUsers } from '../repositories/userRepository.js';
import { getAllGroups } from '../repositories/groupRepository.js';

export function listUsersHandler(db) {
  return async function(request, response) {
    try {
      const users = await getAllUsers(db);

      let html = '<table border="1"><tr><th>ID</th><th>Username</th></tr>';
      users.forEach(u => {
        html += `<tr><td>${u.id}</td><td>${u.username}</td></tr>`;
      });
      html += '</table>';

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(html);
    } catch (error) {
      response.writeHead(500);
      response.end('Error al cargar usuarios.');
    }
  };
}

export function listGroupsHandler(db) {
  return async function(request, response) {
    try {
      const groups = await getAllGroups(db);

      let html = '<table border="1"><tr><th>ID</th><th>Name</th></tr>';
      groups.forEach(g => {
        html += `<tr><td>${g.id}</td><td>${g.name}</td></tr>`;
      });
      html += '</table>';

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(html);
    } catch (error) {
      response.writeHead(500);
      response.end('Error al cargar grupos.');
    }
  };
}