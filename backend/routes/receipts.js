const express = require("express")
const router = express.Router()
const Receipt = require("../models/Receipt")

// GET all receipts (exclude soft-deleted)
router.get("/", async (req, res) => {
    try {
        const receipts = await Receipt.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 })
        res.json(receipts)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch receipts" })
    }
})

// GET single receipt
router.get("/:id", async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id)
        if (!receipt || receipt.isDeleted) return res.status(404).json({ error: "Receipt not found" })
        res.json(receipt)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch receipt" })
    }
})

// POST create receipt
router.post("/", async (req, res) => {
    try {
        const receipt = new Receipt(req.body)
        await receipt.save()
        res.status(201).json(receipt)
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to create receipt" })
    }
})

// PUT update receipt
router.put("/:id", async (req, res) => {
    try {
        const { _id, __v, createdAt, ...updateData } = req.body
        const receipt = await Receipt.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            updateData,
            { new: true, runValidators: true }
        )
        if (!receipt) return res.status(404).json({ error: "Receipt not found" })
        res.json(receipt)
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to update receipt" })
    }
})

// DELETE (soft delete) receipt
router.delete("/:id", async (req, res) => {
    try {
        const receipt = await Receipt.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true }
        )
        if (!receipt) return res.status(404).json({ error: "Receipt not found" })
        res.json({ success: true, message: "Receipt deleted" })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete receipt" })
    }
})

module.exports = router
