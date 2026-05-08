export function addAccess(db, groupId, endpointId) {

  return new Promise((resolve, reject) => {

    const sql = `
      INSERT OR IGNORE INTO access (id_group, id_endpoint)
      VALUES (?, ?)
    `;

    db.run(sql, [groupId, endpointId], function(err) {

      if (err) {
        reject(err);
        return;
      }

      resolve({
        message: 'Permiso agregado'
      });

    });

  });
}