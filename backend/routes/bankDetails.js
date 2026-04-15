const express = require("express")
const router = express.Router()
const BankDetail = require("../models/BankDetail")

// GET all bank details (exclude soft-deleted)
router.get("/", async (req, res) => {
    try {
        const banks = await BankDetail.find({ isDeleted: { $ne: true } }).sort({ bankName: 1 })
        res.json(banks)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bank details" })
    }
})

// GET single bank detail
router.get("/:id", async (req, res) => {
    try {
        const bank = await BankDetail.findById(req.params.id)
        if (!bank || bank.isDeleted) return res.status(404).json({ error: "Bank detail not found" })
        res.json(bank)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bank detail" })
    }
})

// POST create bank detail
router.post("/", async (req, res) => {
    try {
        const bank = new BankDetail(req.body)
        await bank.save()
        res.status(201).json(bank)
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to create bank detail" })
    }
})

// PUT update bank detail - strip immutable fields
router.put("/:id", async (req, res) => {
    try {
        const { _id, __v, createdAt, ...updateData } = req.body
        const bank = await BankDetail.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            { $set: updateData },
            { new: true, runValidators: true }
        )
        if (!bank) return res.status(404).json({ error: "Bank detail not found" })
        res.json(bank)
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to update bank detail" })
    }
})

// DELETE (soft delete) bank detail
router.delete("/:id", async (req, res) => {
    try {
        const bank = await BankDetail.findOneAndUpdate(
            { _id: req.params.id, isDeleted: { $ne: true } },
            { $set: { isDeleted: true } },
            { new: true }
        )
        if (!bank) return res.status(404).json({ error: "Bank detail not found" })
        res.json({ success: true, message: "Bank detail deleted" })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete bank detail" })
    }
})

module.exports = router
