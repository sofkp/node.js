const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

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

// Endpoint para actualizar un empleado por ID
app.put('/employees/:id', (req, res) => {
    const id = req.params.id;
    const { last_name, first_name, title, address, country_code } = req.body;

    // Verificar que al menos uno de los campos sea proporcionado
    if (!last_name && !first_name && !title && !address && !country_code) {
        return res.status(400).json({ "error": "At least one field is required to update" });
    }

    // Construir la instrucción SQL dinámicamente
    let sql = `UPDATE employees SET `;
    let params = [];

    if (last_name) {
        sql += `last_name = ?, `;
        params.push(last_name);
    }
    if (first_name) {
        sql += `first_name = ?, `;
        params.push(first_name);
    }
    if (title) {
        sql += `title = ?, `;
        params.push(title);
    }
    if (address) {
        sql += `address = ?, `;
        params.push(address);
    }
    if (country_code) {
        sql += `country_code = ?, `;
        params.push(country_code);
    }

    // Eliminar la última coma y espacio
    sql = sql.slice(0, -2);
    sql += ` WHERE employee_id = ?`;
    params.push(id);

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Employee not found" });
        }
        res.status(200).json({ "status": "success", "message": "Employee updated successfully" });
    });
});

// Endpoint para eliminar un empleado por ID
app.delete('/employees/:id', (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM employees WHERE employee_id = ?`;

    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Employee not found" });
        }
        res.status(200).json({ "status": "success", "message": "Employee deleted successfully" });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
