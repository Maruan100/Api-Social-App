"use strict";

const mongoose = require("mongoose");
const app = require("./app");
const port = 8080;

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://user:user@cluster0-lcuws.mongodb.net/test?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("La conexion a la base de datos se ha realizado correctamente");
    app.listen(port, () => {
      console.log(`Servidor corriendo en: http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Error al conectar a la base de datos");
  });
