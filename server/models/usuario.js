const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ["ADMIN_ROL", "USER_ROL"],
    message: `{values} no es un rol valido`
}

let Schema = mongoose.Schema;

let usarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, "Se requiere un nombre"]
    },
    email: {
        type: String,
        require: [true, "Se requiere un email"],
        unique: true
    },
    password: {
        type: String,
        require: [true, "Se requiere un paswword"]
    },
    img: {
        type: String,
        require: false
    },
    rol: {
        type: String,
        default: "USER_ROL",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

usarioSchema.method.toJson = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser el único' });

module.exports = mongoose.model("Usuario", usarioSchema);