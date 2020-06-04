"use strict";
const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const jwtService = require('../Services/jwt');
const mongoosePaginate = require('mongoose-pagination');
const imageUtilites = require('./imageUtilities');
const FollowUtilites = require('./follow');

const userControllers = {

  saveUser: (req, res) => {
    let params = req.body;
    let user = new User();
    const { name, surname, nick, email, password } = params

    if (name && surname && nick && email && password) {
      user.name = name;
      user.surname = surname;
      user.nick = nick;
      user.email = email;
      user.role = 'ADMIN',
        user.image = null,
        user.bio = null,

        User.find({
          $or: [
            { email: user.email.toLowerCase() },
            { nick: user.nick },
            { nick: user.nick.toLowerCase() },
          ]
        }).exec((err, users) => {
          if (err) return res.status(500).send({ message: 'Error en la peticion' })
          if (users && users.length >= 1) return res.status(200).send({ message: 'El correo electronico o nombre de usuario ya ha sido utilizado' })
          else {
            bcrypt.hash(params.password, null, null, (err, hash) => {
              user.password = hash;

              user.save((err, userStored) => {
                if (err) return res.status(500).send({ message: 'Error al guardar usuario' })
                if (!userStored) return res.status(404).send({ message: 'No se ha podido registrar el usuario' })
                if (userStored) return res.status(200).send({ user: userStored })
              })
            })
          }
        })

    }
    else {
      res.status(400).send({
        message: "Faltan Campos por rellena",
      });
    }
  },
  loginUser: (req, res) => {
    const params = req.body;
    const { email, password } = params

    if (email && password) {
      User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (user) {
          bcrypt.compare(password, user.password, (err, check) => {

            if (check) {
              user.password = ''
              if (params.getToken) return res.status(200).send({ token: jwtService.generateToken(user) })
              else return res.status(200).send({ user: user })
            }

            else return res.status(404).send({ message: 'Correo electronico o contraseña no validos' })
          })
        } else return res.status(404).send({ message: 'Correo electronico o contraseña no validos' })
      })
    } else return res.status(400).send({ message: "Faltan Campos por rellena" });
  },
  getUser: (req, res) => {
    const userId = req.params.id

    User.findById(userId, (err, user) => {
      user.password = null //Hide password
      if (err) return res.status(500).send({ message: 'Error en la peticion' })
      if (!user) return res.status(404).send({ message: 'El usuario no existe' })
      FollowUtilites.followThisUser(req.user.sub, userId, req).then((value) => {
        console.log(value);
        res.status(200).send({
          user,
          follofing: value.following,
          followed: value.followed
        });
      })
    })
  },

  getUsers: (req, res) => {
    let currentUserId = req.user.sub;
    const params = req.params;
    let page = 1;
    const userData = [];

    if (params.page) {
      page = params.page;
    }
    const itemsPerPage = 5

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
      if (err) return res.status(500).send({ message: 'Server request error' })
      if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles' })

      users.forEach(user => {
        user.password = null
        userData.push(user)
      });

      FollowUtilites.followUsersId(currentUserId).then((value) => {
        return res.status(200).send({
          users: userData,
          total,
          pages: Math.ceil(total / itemsPerPage),
          user_following: value.follofing,
          users_follow_me: value.followed
        });

      })

    });
  },

  updateUser: (req, res) => {
    const userId = req.params.id;
    const update = req.body;
    delete update.password;

    if (userId != req.user.sub) return res.status(500).send({ message: 'No tienes permiso para actulizar los datos del usuario' })

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
      if (err) return res.status(500).send({ message: 'No tienes permiso para actulizar los datos del usuario' })
      if (!userUpdated) return res.status(404).send({ message: 'No hay usuarios disponibles' })
      userUpdated.password = null;
      return res.status(200).send({ user: userUpdated });
    })
  },

  uploadProfileImage: (req, res) => {
    if (Object.entries(req.files).length === 0) return res.status(404).send({ message: 'No se subido ningun archivo' });
    else {
      const userId = req.params.id;
      const filePath = req.files.image.path;
      const fileName = filePath.split('/')[3];
      const fileExtension = fileName.split('.')[1];

      if (userId != req.user.sub) return imageUtilites.removeFilesOfUploads(res, filePath, 'No tienes permiso para actulizar los datos del usuario');

      if (imageUtilites.checkExtension(res, filePath, fileExtension) === true) {
        User.findByIdAndUpdate(userId, { image: fileName }, (err, user) => {
          if (err) return res.status(500).send({ message: 'No tienes permiso para actulizar la imagen de usuario' })
          if (!user) return res.status(404).send({ message: 'No hay usuarios disponibles' })
          user.password = null;
          if (user.image) imageUtilites.removeOldImage(user.image)
          return res.status(200).send({ user: user });
        })
      }
    }
  },

  getProfileImage: (req, res) => {
    const imageName = req.params.imageFile;
    return imageUtilites.checkImage(res, imageName)
  },

  getCounters: (req,res) => {
    console.log(req.user.sub);
    let userId = req.user.sub;
    
    if (req.params.id) { userId = req.params.id}

    FollowUtilites.getCountFollow(userId).then((value) => {
      return res.status(200).send({ value });
    })
  }

};

module.exports = userControllers;
