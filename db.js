const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('employees.db');

const createTable = `
CREATE TABLE IF NOT EXISTS employees (
  employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  title TEXT,
  address TEXT,
  country_code INTEGER
);
`;

db.run(createTable, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created successfully');
  }
});

module.exports = db;
