"use strict"

const jwt = require('jwt-simple');
const moment = require("moment");
const secretPass = 'o7DwtwfO2wHVrmyA48tpjWKsT4PfsvH0qHSKUfhxvMXHPFDsjH5vXlPvKwPNDwlIzQwBzStDXUsPb5FF';

exports.generateToken = function (user) {
    const { _id, name, surname, nick , email , role, image, bio } = user
    const payload = {
        sub: _id,
        name: name,
        surname: surname,
        nick: nick,
        email: email,
        role: role,
        image: image,
        bio: bio,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix
    };
    
    return jwt.encode(payload,secretPass)
}

