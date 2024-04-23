import express from "express";
import path from "path";
import pg from "pg";
import axios from "axios";
import { randomInt } from "crypto";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'ejs');

// Set up PostgreSQL client
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "pbl",
    password: "Arnav@112",
    port: "5432",
});
db.connect();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// Handle GET request to fetch transaction details from Etherscan API
app.get("/transactions/address", async (req, res) => {
    const address = req.params.address;
    const apiKey = "ZYBG3U52UJCXHPE752BG435HMQHN84EDKR"; // Your Etherscan API key
    const etherscanAPI = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apiKey}`;

    try {
        // Fetch transaction details from Etherscan API using Axios
        const response = await axios.get(etherscanAPI);
        const data = response.data;

        // Extract relevant transaction details (amount, timestamp)
        const transactions = data.result.map(tx => ({
            amount: tx.value,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000) // Convert Unix timestamp to JavaScript Date object
        }));

        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions from Etherscan:", error);
        res.status(500).send("Error fetching transactions");
    }
});

app.get("/temples", async (req, res) => {
    res.sendFile(path.join(__dirname, "temples.html"));
});

app.get("/index.html", async (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/author.html", async (req, res) => {
    res.sendFile(path.join(__dirname, "author.html"));
});

app.get("/admin.html", async (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

// Handle POST request to submit transaction
app.post("/submit", async (req, res) => {
    const address = req.body.recipientAddress;
    const amount = req.body.amount;
    const txhash = 112 * randomInt;
    // Send transaction using MetaMask
    // Insert transaction details into the database
    db.query(
        "INSERT INTO transactions (tx_hash, recipient_address, amount) VALUES ($1, $2, $3) RETURNING *",
        [txhash, address, amount],
        (err, result) => {
            if (err) {
                console.error("Error inserting transaction:", err);
                res.status(500).send("Error submitting transaction");
            } else {
                console.log("Transaction inserted:", result.rows[0]);
                res.send("Transaction submitted successfully");
            }
        }
    );
});

// Handle GET request to submit transaction and store in database
app.get("/submit", (req, res) => {
    const txHash = 12;
    const recipientAddress = req.query.recipientAddress;
    const amount = req.query.amount;

    // Insert transaction details into the database
    const insertQuery = `
        INSERT INTO transactions (tx_hash, recipient_address, amount)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [txHash, recipientAddress, amount];

    db.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error("Error inserting transaction:", err);
            res.status(500).send("Error submitting transaction");
        } else {
            console.log("Transaction inserted:", result.rows[0]);
            res.send("Transaction submitted successfully");
        }
    });
});

app.get('/admin', async (req, res) => {
    try {
        // Query the database for transaction data
        const { rows } = await db.query('SELECT recipient_address, amount, timestamp FROM transactions');

        // Calculate total amount received
        const result = await db.query('select sum(amount) from transactions');
        const totalAmount = result.rows[0].sum;

        // Render the EJS template with data
        res.render('admin', { totalAmount, transactions: rows });
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/expenses.html", async (req, res) => {
    res.sendFile(__dirname, "expenses.html");
});

// Handle POST request to submit transaction and store in database
app.listen(5000, () => {
    console.log("Server listening on port 5000");
});
