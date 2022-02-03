const router = require('express').Router();
const User = require('../users/user-model');

const bcryptjs = require('bcryptjs');
const tokenBuilder = require('./auth-token');

const { 
    restricted,
    checkUserPassPhone,
    checkUser,
    checkPhone,
    checkUserPass,
    checkUserExists,} = require('./auth-middleware')


// Routes
router.post('/register', checkUserPassPhone, checkUser, checkPhone, (req, res, next) => {
    const user = req.body;
    user.password = bcryptjs.hashSync(user.password, 8);
    User.create(user)
        .then( response => {
            res.status(201).json(response)
        })
        .catch( next );
})

router.post('/login', checkUserPass, checkUserExists, (req, res, next) => {
    const {username, password} = req.body;
    User.findByFilter( {username} ) 
        .then( ([userFromDb]) => {
            if (bcryptjs.compareSync(password, userFromDb.password)){
                const token = tokenBuilder(userFromDb);
                res.status(200).json({ user_id: userFromDb.user_id, username: userFromDb.username, token: token });
            } else {
                next({ status: 401, message: 'invalid credentials'})
            }
        })
        .catch( next );

})

router.put('/update/', restricted, checkPhone, (req, res, next) => {
    const user = req.body
    const {user_id} = user;
    const updates = {password: user.password, phoneNumber: user.phoneNumber}
    updates.password = bcryptjs.hashSync(updates.password, 8);
    
    User.update(user_id, updates)
        .then( response => {
            res.status(200).json(response);
        })
        .catch(next);
})

module.exports = router;
