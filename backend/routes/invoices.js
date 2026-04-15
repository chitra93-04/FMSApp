const express = require("express")
const router = express.Router()
const Invoice = require("../models/Invoice")

// GET all invoices (exclude soft-deleted)
router.get("/", async (req, res) => {
    try {
        const invoices = await Invoice.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 })
        res.json(invoices)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch invoices" })
    }
})

// GET single invoice
router.get("/:id", async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
        if (!invoice || invoice.isDeleted) return res.status(404).json({ error: "Invoice not found" })
        res.json(invoice)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch invoice" })
    }
})

// POST create invoice
router.post("/", async (req, res) => {
    try {
        const invoice = new Invoice(req.body)
        await invoice.save()
        res.status(201).json(invoice)
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to create invoice" })
    }
})

// PUT update invoice
router.put("/:id", async (req, res) => {
    try {
        const { _id, __v, createdAt, ...updateData } = req.body
        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            updateData,
            { new: true, runValidators: true }
        )
        if (!invoice) return res.status(404).json({ error: "Invoice not found" })
        res.json(invoice)
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to update invoice" })
    }
})

// DELETE (soft delete) invoice
router.delete("/:id", async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true }
        )
        if (!invoice) return res.status(404).json({ error: "Invoice not found" })
        res.json({ success: true, message: "Invoice deleted" })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete invoice" })
    }
})

module.exports = router
