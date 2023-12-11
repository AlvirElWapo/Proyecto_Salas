const express = require('express');
const db = require('../db/database_connection');
const fs = require('fs');
const app = express();

app.get('/load_database', (req, res) => {
  const filePath = 'db/creacion_db.sql'; // Replace with the path to your SQL file
  const fp2 = 'db/output.sql';
  const fp3 = 'db/output_mods.sql';

  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    const queries = sql.split(';').filter(query => query.trim() !== '');

    queries.forEach(query => {
      db.query(query, (error, results) => {
        if (error) {
          console.error('Error executing SQL query:', error);
        } else {
          console.log('SQL query executed successfully.');
        }
      });
    });

  } catch (error) {
    console.error('Error reading SQL file:', error);
    res.status(500).send('Internal Server Error');
  }

  try {
    const sql = fs.readFileSync(fp2, 'utf-8');
    const queries = sql.split(';').filter(query => query.trim() !== '');

    queries.forEach(query => {
      db.query(query, (error, results) => {
        if (error) {
          console.error('Error');
        } else {
        }
      });
    });

  } catch (error) {
    console.error('Error reading SQL file:', error);
    res.status(500).send('Internal Server Error');
  }

  try {
    const sql = fs.readFileSync(fp2, 'utf-8');
    const queries = sql.split(';').filter(query => query.trim() !== '');

    queries.forEach(query => {
      db.query(query, (error, results) => {
        if (error) {
          console.log("ERROR")
        } else {
        }
      });
    });

  } catch (error) {
    console.error('Error reading SQL file:', error);
    res.status(500).send('Internal Server Error');
  }
  res.send('Database loaded successfully.');
});

module.exports = app;
