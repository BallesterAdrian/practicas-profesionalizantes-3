import { getUserByUsername } from '../repositories/authRepository.js';
import bcrypt from 'bcryptjs';

export function login(db) {
  return async function(username, password) {
    const user = await getUserByUsername(db, username);
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return {
        status: false,
        result: null,
        description: 'INVALID_USER_PASS'
      };
    }

    const groups = await getGroupsByUserId(db, user.id);

    return {
      status: true,
      result: { id: user.id, username: user.username, groups },
      description: null
    };
  };
}