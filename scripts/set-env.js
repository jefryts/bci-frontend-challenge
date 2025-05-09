const fs = require("fs");
const dotenv = require("dotenv");

// Cargar las variables del archivo .env
dotenv.config();

// Crear el contenido del environment.ts
const envConfig = `export const environment = {
  production: false,
  apiUrl: "${process.env["API_URL"]}"
};`;

// Escribir el archivo en src/environments/environment.ts
fs.writeFileSync("src/environments/environment.ts", envConfig);

console.log("Archivo environment.ts generado correctamente.");
