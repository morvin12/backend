const User = require('../users/user-model');
const jwt = require('jsonwebtoken'); 
const { JWT_SECRET } = require('./secret')


function restricted (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return next({ status: 401, message: "Token required" })
    } else {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err){
                return next({ status: 401, message: "Token invalid" })
            } 
            req.decoded = decoded;
            next();
        })
    }
}

// Register
function checkUserPassPhone (req, res, next) {
    const { username, password, phoneNumber } = req.body;
    if (username === undefined || password === undefined || phoneNumber === undefined){
        next({ status: 401, message: "username, password, and valid phone number required" })
    } else {
        next();
    }
}
function checkUser(req, res, next){
    const { username } = req.body;
    User.findByFilter({username})
        .then( ([response]) => {
            if (!response){
                next();
            } else {
                next({ status: 422, message: "username taken" })
            }
        })
        .catch( next );
}

// Register & Login
function checkPhone (req, res, next){
    const { phoneNumber } = req.body;
    User.findByFilter({phoneNumber})
        .then( ([response]) => {
            if (!response){
                next();
            } else {
                next({ status: 422, message: "phone number taken" })
            }
        })
        .catch( next );

}

// Login
function checkUserPass (req, res, next) {
    const { username, password } = req.body;
    if (username === undefined || password === undefined){
        next({ status: 401, message: "username and password required" })
    } else {
        next();
    }

}
function checkUserExists (req, res, next){
    const { username } = req.body;
    User.findByFilter({username})
        .then( ([response]) => {
            if (response){
                return next()
            } else {
                return next({ status: 422, message: "username not found" })
            }
        })
        .catch( next);
}


module.exports = {
    restricted,
    checkUserPassPhone,
    checkUser,
    checkPhone,
    checkUserPass,
    checkUserExists,
}