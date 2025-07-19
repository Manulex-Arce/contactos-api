const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./db.sqlite');

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS contactos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  telefono TEXT NOT NULL
)`);

// Obtener todos los contactos
app.get('/contactos', (req, res) => {
  db.all('SELECT * FROM contactos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear un nuevo contacto
app.post('/contactos', (req, res) => {
  const { nombre, correo, telefono } = req.body;
  if (!nombre || !correo || !telefono) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  db.run('INSERT INTO contactos (nombre, correo, telefono) VALUES (?, ?, ?)',
    [nombre, correo, telefono],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, nombre, correo, telefono });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});
