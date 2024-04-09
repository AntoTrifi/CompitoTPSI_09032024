const express = require('express');
const app = express();

const port = 8888;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("compito.db");
const currentDate = new Date();



app.post('/biglietto', (req, res) => {
        const t = currentDate.getTime();
        const x = Date(t)
        const id = Math.random().toString().replace("0.", "");
    db.run(`INSERT INTO biglietto (id, ora_entrata) VALUES (?,?)`, id, t, (error, rows) => {
        if(error) {
            console.error(error.message);
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(error.response);
        }
        response = {
            "code": 1,
            "data": "Benvenuto! Biglietto numero: " + id + " Entrata alle: " + x
        }
        res.status(200).send(response);
    });
});

app.put('/biglietto/:id', (req, res) => {
    const id = req.params.id;
    const t = currentDate.getTime();
    const x = Date(t)
    db.run(`UPDATE biglietto SET ora_uscita = ? WHERE id = ?`, t, id, (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1,
            "data": "Orario di uscita alle: " + x
        }
        res.status(201).send(response);
    });
});

app.get('/biglietti', (req, res) => {
    db.all(`SELECT * FROM biglietto`, (error, rows) => {
        if(error) {
            console.error(error.message);
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(error.response);
        }
        response = {
            "code": 1,
            "data": rows
        }
        res.status(200).send(response);
    });
});

app.get('/biglietto/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM biglietto WHERE id=?`, id, (error, row) => {
        if(row != null)
        {
            ingresso = row.ora_entrata;
            uscita = row.ora_uscita;
            ris = uscita - ingresso;
            ris_secondi = ris/1000;
            ris_minuti = ris_secondi/60
            prezzo = ris_minuti * 0.10;
            if(error){
                console.log(error.message);
                response = {
                    "code": -1,
                    "data": error.message
                }
                res.status(500).send(response);
            }
            response = {
                "code": 1,
                "data": "Il cliente paga: " + prezzo + "€ per: " + ris_minuti + " minuti di sosta"
            }
            res.status(200).send(response);
        }
    });
});



app.delete('/biglietto/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM biglietto WHERE id = ?`, id, (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        response = {
            "code": 1,
            "data": "Grazie per aver utilizzato il parcheggio, a presto!"
        }
        res.status(200).send(response);
    });
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});