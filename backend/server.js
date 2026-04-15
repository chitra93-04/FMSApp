const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const invoiceRoutes = require("./routes/invoices")
const receiptRoutes = require("./routes/receipts")
const bankDetailRoutes = require("./routes/bankDetails")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}))
app.use(express.json())

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/invoice-app"

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message)
        process.exit(1)
    })

// Routes
app.use("/api/invoices", invoiceRoutes)
app.use("/api/receipts", receiptRoutes)
app.use("/api/bank-details", bankDetailRoutes)

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" })
})

// Error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err)
    res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
