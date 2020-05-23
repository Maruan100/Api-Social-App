'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretPass = 'o7DwtwfO2wHVrmyA48tpjWKsT4PfsvH0qHSKUfhxvMXHPFDsjH5vXlPvKwPNDwlIzQwBzStDXUsPb5FF';

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).send({ message: 'La peticion no incluye la cabezera de autentificacion' })

    const token = req.headers.authorization.replace(/['"]+/g, '');
    const payload = jwt.decode(token, secretPass);

    try {

        if (payload.exp <= moment().unix()) return res.status(401).send({ message: 'El token ha expirado' })

    } catch (ex) {
        return res.status(401).send({ message: 'El token no es valido' })
    }

    req.user = payload;

    next();
}