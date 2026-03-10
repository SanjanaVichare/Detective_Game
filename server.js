import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database/detective.db");

// GET all criminals
app.get("/criminals", (req, res) => {
    db.all("SELECT * FROM criminals", [], (err, rows) => {
        if (err) {
            res.json({ error: err.message });
            return;
        }
        res.json(rows);
    });

});

app.post("/query", (req, res) => {
    const { query } = req.body;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.json({
                columns: [],
                rows: [],
                error: err.message
            });
            return;
        }

        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

        const formattedRows = rows.map(row =>
            columns.map(col => row[col])
        );

        res.json({
            columns,
            rows: formattedRows
        });
    });
});

// ADD criminal
app.post("/criminals", (req, res) => {
    const c = req.body;

    db.run(
        `INSERT INTO criminals
    (name, gender, age, eye_color, hair_color, height, scar_location, distinctive_features, last_known_location, crime_type, threat_level)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
            c.name,
            c.gender,
            c.age,
            c.eye_color,
            c.hair_color,
            c.height,
            c.scar_location,
            c.distinctive_features,
            c.last_known_location,
            c.crime_type,
            c.threat_level
        ],
        function (err) {
            if (err) {
                res.json({ error: err.message });
                return;
            }

            res.json({
                success: true,
                id: this.lastID
            });
        }
    );
});

// SEARCH criminals
app.post("/search", (req, res) => {
    const filters = req.body;

    let query = "SELECT * FROM criminals WHERE 1=1";
    const params = [];

    if (filters.eye_color) {
        query += " AND eye_color=?";
        params.push(filters.eye_color);
    }

    if (filters.crime_type) {
        query += " AND crime_type=?";
        params.push(filters.crime_type);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});