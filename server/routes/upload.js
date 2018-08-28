const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                message: "No se ha seleccionado ningun archivo. NO MAMES"
            })
    }
    // Valida Tipo
    let validaTipo = ["productos", "usuarios"];
    if (validaTipo.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'Los tipos permitidas son ' + validaTipo.join(', '),
                type: tipo
            });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split(".");
    let extenciones = nombreCortado[nombreCortado.length - 1];

    // Extenciones Permitidas
    let extencionesValidads = ["png", "jpg", "gif", "jpeg"];
    if (extencionesValidads.indexOf(extenciones) < 0) {
        return res.status(400)
            .json({
                ok: false,
                message: 'Las extenciones permitidas son ' + extencionesValidads.join(', '),
                ext: extenciones
            });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extenciones}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
        /* res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        }); */
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, "usuarios");
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, "usuarios");
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        borrarArchivo(usuarioDB.img, "usuarios");
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, "productos");
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id dado no existe'
                }
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, "productos");
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        borrarArchivo(productoDB.img, "productos");
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            console.log(productoGuardado);
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    })
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;