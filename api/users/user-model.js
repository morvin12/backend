const db = require('../data/db-config');


async function findAll() { 
  return await db('users') 
}
async function findById (id) {
  return await db('users').where('id', id)
}
async function findByFilter (filter) {  
  return await db('users').where(filter);
}

async function create(user) {
  const [newUser] = await db('users')
    .insert(user, ['user_id', 'username', 'phoneNumber']);
  return newUser;
}
async function update(user_id, updates){
  const [updatedUser] = await db('users')
    .update(updates, ['user_id', 'phoneNumber'])
    .where('user_id', user_id);
  return updatedUser;
}

module.exports = {
  findAll,
  findById,
  findByFilter,
  create,
  update,
};
