// Matches the rows created by the insert-roles seeder.
const ROLE = { ADMIN: 1, STAFF: 2 };
const roleName = (roleId) => (roleId === ROLE.ADMIN ? "admin" : "staff");

module.exports = { ROLE, roleName };
