const express = require('express');
const { exec } = require('child_process');

const app = express();

app.get('/cargar_bdd', (req, res) => {
    exec("ls -la", (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            res.status(500).send('Error executing command');
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send('Error executing command');
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send('Command executed successfully');
    });
});
 
module.exports = app

