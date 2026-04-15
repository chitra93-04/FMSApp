const mongoose = require("mongoose")

const ReceiptSchema = new mongoose.Schema(
    {
        receiptType: { type: String, required: true, default: "Auto" },
        invoiceNo: { type: String, required: true },
        receiptDate: { type: Date, required: true, default: Date.now },
        receiptNo: { type: String, required: true, unique: true },
        jobNo: { type: String, default: "" },
        invoiceAmount: { type: Number, default: 0 },
        invoiceStatus: { type: String, default: "Open" },
        receivedAmount: { type: Number, default: 0 },
        receivedFrom: { type: String, required: true },
        paymentType: { type: String, default: "" },
        accountantName: { type: String, default: "" },
        details: { type: String, default: "" },
        currency: { type: String, default: "AED" },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Receipt", ReceiptSchema)
