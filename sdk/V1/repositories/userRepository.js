export function insertarUsuario(db, username, password) 
{
  const sql = `
    INSERT INTO user (username, password)
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.run(sql, [username, password], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        id: this.lastID,
        username,
        password
      });
    });
  });
}
