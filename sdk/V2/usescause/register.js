export function register(insertarUsuario, db)
{
  return function(username, password)
  {
    return insertarUsuario(db, username, password);
  };
}