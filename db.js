const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./employees.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Crear la tabla si no existe
        db.run(`CREATE TABLE IF NOT EXISTS employees (
            employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
            last_name TEXT NOT NULL,
            first_name TEXT NOT NULL,
            title TEXT,
            address TEXT,
            country_code INTEGER
        )`);
    }
});

db.run(createTable, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Table 'employees' created or already exists.");
    }
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});
