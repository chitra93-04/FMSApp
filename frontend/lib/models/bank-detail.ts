import mongoose, { Schema, type Document } from "mongoose"

export interface IBankDetail extends Document {
    bankName: string
    accountNumber: string
    iban: string
    swiftCode: string
    beneficiaryName: string
    branch: string
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
}

const BankDetailSchema = new Schema<IBankDetail>(
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

export const BankDetail =
    mongoose.models.BankDetail || mongoose.model<IBankDetail>("BankDetail", BankDetailSchema)
