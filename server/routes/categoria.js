const express = require("express");
const jwt = require('jsonwebtoken');
const _ = require("underscore");

let { verificaToken, verificaAdmin_Role } = require("../middlewares/autenticacion");

let app = express();
let Categoria = require("../models/categoria");

//===================================
// CREAR UNA CATEGORIA
//===================================
app.post("/categoria", [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;
    let usuario = req.usuario;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    });

    categoria.save((err, catogoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!catogoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: catogoriaDB
        });
    });
});

//===================================
// MUESTRA TODAS LAS CATEGORIAS
//===================================
app.get("/categoria", verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    cuantos: conteo
                });
            })

        })
});

//===================================
// MUESTRA UNA CATEGORIAS POR ID
//===================================
app.get("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ["descripcion"]);

    Categoria.findById(id, body, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!catogoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//===================================
// ACTUALIZA UNA CATEGORIA
//===================================
app.put("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body, ["descripcion"]);
    let body = req.body;
    /* let descCategoria = {
        descripcion: body.descripcion
    } */
    Categoria.findByIdAndUpdate(id, body, { new: true, /* runValidators: true */ }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
})

//===================================
// ELIMINA UNA CATEGORIA
//===================================
app.delete("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: "Categoria borrada"
        });
    })
})

module.exports = app;