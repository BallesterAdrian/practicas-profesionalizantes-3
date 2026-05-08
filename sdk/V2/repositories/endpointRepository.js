export function getEndpointIdByPath(db, path) {

  return new Promise((resolve, reject) => {

    const sql = `SELECT id FROM endpoint WHERE path = ?`;

    db.get(sql, [path], (err, row) => {

      if (err) {
        reject(err);
        return;
      }

      resolve(row || null);

    });

  });
}


export function createEndpoint(db, path) {

  return new Promise((resolve, reject) => {

    const sql = `
      INSERT OR IGNORE INTO endpoint (path)
      VALUES (?)
    `;

    db.run(sql, [path], function(err) {

      if (err) {
        reject(err);
        return;
      }

      resolve({
        message: 'Endpoint creado',
        endpointId: this.lastID
      });

    });

  });
}


export function deleteEndpoint(db, endpointId) {

  return new Promise((resolve, reject) => {

    const sql = `
      DELETE FROM endpoint
      WHERE id = ?
    `;

    db.run(sql, [endpointId], function(err) {

      if (err) {
        reject(err);
        return;
      }

      resolve({
        message: 'Endpoint eliminado'
      });

    });

  });
}


export function getAllEndpoints(db) {

  return new Promise((resolve, reject) => {

    const sql = `
      SELECT *
      FROM endpoint
    `;

    db.all(sql, [], (err, rows) => {

      if (err) {
        reject(err);
        return;
      }

      resolve(rows);

    });

  });
}