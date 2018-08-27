// PUERTO
process.env.PORT = process.env.PORT || 3000;


// PUERTO

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// Virificación del TOKEN

process.env.CADUCIDAD_TOKEN = "48h";

// SEED de desarrollo

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//Google client id

process.env.CLIENT_ID = process.env.CLIENT_ID || '466254147480-9d52e6lkrnn20o10i5e6a1mr0n98sg8v.apps.googleusercontent.com';



// BASE DE DATOS
let urlDB;
if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;