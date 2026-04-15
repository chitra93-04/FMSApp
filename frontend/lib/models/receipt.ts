import mongoose, { Schema, type Document } from "mongoose"

export interface IReceipt extends Document {
  receiptType: string
  invoiceNo: string
  receiptDate: Date
  receiptNo: string
  jobNo: string
  invoiceAmount: number
  invoiceStatus: string
  receivedAmount: number
  receivedFrom: string
  paymentType: string
  accountantName: string
  details: string
  currency: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const ReceiptSchema = new Schema<IReceipt>(
  {
    receiptType: { type: String, required: true, default: "Auto", enum: ["Auto", "Manual"] },
    invoiceNo: { type: String, required: true },
    receiptDate: { type: Date, required: true, default: Date.now },
    receiptNo: { type: String, required: true, unique: true },
    jobNo: { type: String, default: "" },
    invoiceAmount: { type: Number, default: 0 },
    invoiceStatus: { type: String, default: "Open", enum: ["Open", "Closed"] },
    receivedAmount: { type: Number, required: true },
    receivedFrom: { type: String, required: true },
    paymentType: { type: String, default: "" },
    accountantName: { type: String, default: "" },
    details: { type: String, default: "" },
    currency: { type: String, default: "AED" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Receipt =
  mongoose.models.Receipt || mongoose.model<IReceipt>("Receipt", ReceiptSchema)
