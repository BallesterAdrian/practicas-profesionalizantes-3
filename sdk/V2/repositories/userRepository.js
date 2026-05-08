import bcrypt from 'bcryptjs';

export function insertarUsuario(db, username, password) 
{
  const hashedPassword = bcrypt.hashSync(password, 10); // Hashea la contraseña

  const sql = `
    INSERT INTO user (username, password)
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.run(sql, [username, hashedPassword], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        id: this.lastID,
        username
      });
    });
  });
}

export function deleteUser(db, userId) {

  const sql = `DELETE FROM user WHERE id = ?`;

  return new Promise((resolve, reject) => {

    db.run(sql, [userId], function(err) {

      if (err) {
        reject(err);
        return;
      }

      resolve({ message: 'Usuario eliminado' });
    });

  });
}

export function getAllUsers(db) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, username FROM user`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
