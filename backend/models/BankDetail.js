const mongoose = require("mongoose")

const BankDetailSchema = new mongoose.Schema(
    {
        bankName: { type: String, required: true },
        accountNumber: { type: String, default: "" },
        iban: { type: String, default: "" },
        swiftCode: { type: String, default: "" },
        beneficiaryName: { type: String, default: "" },
        branch: { type: String, default: "" },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
)

module.exports = mongoose.model("BankDetail", BankDetailSchema)
