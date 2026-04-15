import mongoose, { Schema, type Document } from "mongoose"

export interface IInvoice extends Document {
  invoiceType: string
  invoiceNo: string
  invoiceDate: Date
  jobNo: string
  quoteNo: string
  quoteDate: Date
  status: string
  revNo: string
  currency: string
  invValue: number
  weightKgs: number
  contractValue: number
  paymentType: string
  customer: string
  address: string
  trn: string
  invoiceDetails: string
  invoiceTerms: string
  chequeInfo: string
  contractInfo: string
  bankAccount: string
  bankDetails: string
  swiftCode: string
  beneficiaryName: string
  fobValue: number
  freightCost: number
  accountPrint: string
  vatPrint: string
  printSign: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const InvoiceSchema = new Schema<IInvoice>(
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

export const Invoice =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema)
