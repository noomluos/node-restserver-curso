// PUERTO
process.env.PORT = process.env.PORT || 3000;


// PUERTO

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// BASE DE DATOS
let urlDB;
if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe";
} else {
    urlDB = "mongodb://cafe-user:123456asd@ds127342.mlab.com:27342/cafe-soulmoon"
}

process.env.URLDB = urlDB;