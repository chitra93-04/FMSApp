const mongoose = require("mongoose")

const InvoiceSchema = new mongoose.Schema(
    {
        invoiceType: { type: String, required: true, default: "PI" },
        invoiceNo: { type: String, required: true, unique: true },
        invoiceDate: { type: Date, required: true, default: Date.now },
        jobNo: { type: String, required: true },
        quoteNo: { type: String, default: "" },
        quoteDate: { type: Date },
        status: { type: String, required: true, default: "Open", enum: ["Open", "Closed"] },
        revNo: { type: String, default: "" },
        currency: { type: String, default: "AED" },
        invValue: { type: Number, default: 0 },
        weightKgs: { type: Number, default: 0 },
        contractValue: { type: Number, default: 0 },
        paymentType: { type: String, default: "" },
        customer: { type: String, required: true },
        address: { type: String, default: "" },
        trn: { type: String, default: "" },
        invoiceDetails: { type: String, default: "" },
        invoiceTerms: { type: String, default: "" },
        chequeInfo: { type: String, default: "" },
        contractInfo: { type: String, default: "" },
        bankAccount: { type: String, default: "" },
        bankDetails: { type: String, default: "" },
        swiftCode: { type: String, default: "" },
        beneficiaryName: { type: String, default: "" },
        fobValue: { type: Number, default: 0 },
        freightCost: { type: Number, default: 0 },
        accountPrint: { type: String, default: "Yes" },
        vatPrint: { type: String, default: "" },
        printSign: { type: String, default: "" },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Invoice", InvoiceSchema)
