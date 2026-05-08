export function getUserByUsername(db, username) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, username, password FROM user WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getGroupsByUserId(db, userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT g.id, g.name
      FROM group AS g
      JOIN members AS m ON g.id = m.id_group
      WHERE m.id_user = ?
    `;
    db.all(sql, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function getEndpointsByGroupId(db, groupId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT e.path
      FROM endpoint AS e
      JOIN access AS a ON e.id = a.id_endpoint
      WHERE a.id_group = ?
    `;
    db.all(sql, [groupId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(r => r.path));
    });
  });
}