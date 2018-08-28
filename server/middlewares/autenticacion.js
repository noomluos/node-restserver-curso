const jwt = require('jsonwebtoken');

//====================
// VERIFICAR TOKEN
//====================
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });


};

//====================
// VERIFICAR AdminRol
//====================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario.rol;
    if (usuario === "ADMIN_ROL") {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No se puede realizar la acción porque el usuario no es administrador'
            }
        });
    }
};

//====================
// VERIFICAR TOKEN POR IMAGEN
//====================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });


};

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}