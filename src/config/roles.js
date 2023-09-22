const roles = ['user', 'admin','editor'];
const adminRoles = ['admin','editor']; //only this roles can login to dashboard

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers', "manageUsers"]);
roleRights.set(roles[1], ['getUsers', 'adminAccess']);
roleRights.set(roles[2], ['getUsers', 'adminAccess']);

module.exports = {
  roles,
  roleRights,
  adminRoles
};
