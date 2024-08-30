const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8001;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Endpoint para obtener todos los empleados
app.get('/employees', (req, res) => {
    db.all("SELECT * FROM employees", [], (err, rows) => {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.status(200).json({status: 'success', data: rows});
    });
});

// Endpoint para obtener un empleado por ID
app.get('/employees/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM employees WHERE employee_id = ?", [id], (err, row) => {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        if (!row) {
            return res.status(404).json({"error": "Employee not found"});
        }
        res.status(200).json({status: 'success', data: row});
    });
});

// Endpoint para agregar un nuevo empleado
app.post('/employees', (req, res) => {
    const { last_name, first_name, title, address, country_code } = req.body;
    if (!last_name || !first_name) {
        return res.status(400).json({"error": "Last name and first name are required"});
    }
    const sql = `INSERT INTO employees (last_name, first_name, title, address, country_code) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [last_name, first_name, title, address, country_code], function(err) {
        if (err) {
            return res.status(400).json({"error": err.message});
        }
        res.status(201).json({ status: 'success', "employee_id": this.lastID });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
