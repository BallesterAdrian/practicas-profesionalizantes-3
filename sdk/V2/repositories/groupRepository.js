export function createGroup(db, groupName) {
  const sql = `INSERT INTO \`group\` (name) VALUES (?)`;
  return new Promise((resolve, reject) => {
    db.run(sql, [groupName], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        id: this.lastID,
        name: groupName
      });
    });
  });
}

export function deleteGroup(db, groupId) {
  const sql = `DELETE FROM \`group\` WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [groupId], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({ message: 'Grupo eliminado' });
    });
  });
}

export function updateGroup(db, groupId, newName) {
  const sql = `UPDATE \`group\` SET name = ? WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [newName, groupId], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({ message: 'Grupo actualizado' });
    });
  });
}

export function getAllGroups(db) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, name FROM \`group\``;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// repositories/groupRepository.js
export function getGroupIdByName(db, name) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM \`group\` WHERE name = ?`;
    db.get(sql, [name], (err, row) => {
      if (err) reject(err);
      else resolve(row ? { id: row.id } : null);
    });
  });
}