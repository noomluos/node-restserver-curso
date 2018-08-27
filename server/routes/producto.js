const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");
const app = express();
let Producto = require("../models/producto");


//===================================
// OBETENER PRODUCTOS
//===================================
app.get("/producto", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    limite = Number(limite);
    Producto.find({ disponible: "true" }, )
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("usuario", "nombre")
        .populate("categoria", "descripcion")
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: "true" }, (err, conteo) => {
                res.json({
                    ok: true,
                    producto,
                    cuantos: conteo
                });
            })

        })
});

//===================================
// OBETENER PRODUCTO POR ID
//===================================
app.get("/producto/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no es correcto'
                    }
                });
            }
            if (productoDB.disponible === false) {
                res.json({
                    ok: false,
                    message: `El producto con id ${id} y nombre ${productoDB.nombre} no se encuentra disponible`
                });
            } else {
                res.json({
                    ok: true,
                    producto: productoDB
                });
            }
        })
        .populate("usuario", "nombre")
        .populate("categoria", "descripcion")

});

//===================================
// BUSCAR UN PRODUCTO
//===================================
app.get("/producto/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, "i");
    Producto.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            })

        })
});

//===================================
// CREAR UN NUEVO PRODUCTO
//===================================
app.post("/producto", verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoriaId,
        usuario: req.usuario._id,
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//===================================
// ACTUALIZAR UN PRODUCTO
//===================================
app.put("/producto/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario
    }
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: descProducto
            });
        })
        .populate("usuario", "nombre")
        .populate("categoria", "descripcion")
});

//===================================
// BORRAR UN PRODUCTO
//===================================
app.delete("/producto/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let cambioEstado = {
        disponible: 'false'
    }
    Producto.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado
            });
        })
        .populate("usuario", "nombre")
        .populate("categoria", "descripcion")
});

module.exports = app;