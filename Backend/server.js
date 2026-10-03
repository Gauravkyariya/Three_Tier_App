const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "Three Tier Application Backend is running"
    });
});

// Test database connection
app.get("/api/health", async (req, res) => {
    try {
        const connection = await pool.getConnection();

        await connection.query("SELECT 1");

        connection.release();

        res.json({
            status: "OK",
            database: "Connected"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: "ERROR",
            database: "Not Connected"
        });
    }
});

// Get all employees
app.get("/api/employees", async (req, res) => {

    try {

        const [rows] = await pool.query(
            "SELECT * FROM employees ORDER BY id DESC"
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get employees"
        });
    }
});

// Add employee
app.post("/api/employees", async (req, res) => {

    try {

        const { name, email, department } = req.body;

        if (!name || !email || !department) {

            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO employees
            (name, email, department)
            VALUES (?, ?, ?)`,
            [name, email, department]
        );

        res.status(201).json({
            message: "Employee added successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to add employee"
        });
    }
});

// Delete employee
app.delete("/api/employees/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM employees WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete employee"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Backend running on port ${PORT}`);

});