// In-memory fallback data when MongoDB is not configured
// This allows the app to work fully in preview mode

export interface InvoiceData {
  _id: string
  invoiceType: string
  invoiceNo: string
  invoiceDate: string
  jobNo: string
  quoteNo: string
  quoteDate: string
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
  createdAt: string
  updatedAt: string
}

export interface ReceiptData {
  _id: string
  receiptType: string
  invoiceNo: string
  receiptDate: string
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
  createdAt: string
  updatedAt: string
}

export interface BankDetailData {
  _id: string
  bankName: string
  accountNumber: string
  iban: string
  swiftCode: string
  beneficiaryName: string
  branch: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

// Global storage for dev mode persistence
const globalStore = globalThis as any

let invoices: InvoiceData[] = globalStore.mockInvoices || [
  {
    _id: "inv1",
    invoiceType: "SI",
    invoiceNo: "SI-1123-00015",
    invoiceDate: "2026-02-26",
    jobNo: "AE-A0341",
    quoteNo: "AE-23-00789",
    quoteDate: "2023-05-08",
    status: "Open",
    revNo: "R07",
    currency: "AED",
    invValue: 245000,
    weightKgs: 1200,
    contractValue: 490000,
    paymentType: "CDC/TT",
    customer: "Modern Steel House Contracting LLC",
    address: "PO Box 449857, Schon Business Park, DIP-1, Dubai, UAE",
    trn: "100525575500003",
    invoiceDetails: "SUPPLY OF PRE-ENGINEERED STEEL BUILDING COMPONENTS AS PER FinFlow PROPOSAL QUOTATION NO. AE-23-00789 REV. R07 DATED 08-MAY-2023",
    invoiceTerms: "This Invoice pertains to 50% Down Payment by CDC/TT",
    chequeInfo: "Cheque should be issued in the name of:\nFinFlow Structural Steel Manufacturing Co. LLC",
    contractInfo: "Total Contract Value..........AED (Exclusive of VAT)",
    bankAccount: "Emirates NBD",
    bankDetails: "Account: 1012345678901\nIBAN: AE12 0260 0010 1234 5678 901\nSwift: EABORAEAXXX",
    swiftCode: "EABORAEAXXX",
    beneficiaryName: "FinFlow Structural Steel Manufacturing Co LLC",
    fobValue: 195000,
    freightCost: 12500,
    accountPrint: "Yes",
    vatPrint: "Yes",
    printSign: "Yes",
    isDeleted: false,
    createdAt: "2026-02-26T08:00:00Z",
    updatedAt: "2026-02-26T08:00:00Z",
  },
  {
    _id: "inv2",
    invoiceType: "PI",
    invoiceNo: "PI-1225-00069",
    invoiceDate: "2026-02-20",
    jobNo: "OM-A1215",
    quoteNo: "OM-24-00102",
    quoteDate: "2024-01-15",
    status: "Open",
    revNo: "R03",
    currency: "AED",
    invValue: 10000,
    weightKgs: 500,
    contractValue: 320000,
    paymentType: "Cheque",
    customer: "MS. Speed Building SPC",
    address: "PO Box 112, Muscat, Oman",
    trn: "200678123456789",
    invoiceDetails: "Supply of structural steel components for warehouse project",
    invoiceTerms: "30% advance payment required",
    chequeInfo: "Cheque should be issued in the name of:\nFinFlow Structural Steel Manufacturing Co. LLC",
    contractInfo: "Total Contract Value..........AED (Exclusive of VAT)",
    bankAccount: "Abu Dhabi Commercial Bank",
    bankDetails: "Account: 2034567890123\nIBAN: AE45 0030 0020 3456 7890 123",
    swiftCode: "ADCB A EAA",
    beneficiaryName: "FinFlow Structural Steel Manufacturing Co LLC",
    fobValue: 85000,
    freightCost: 8500,
    accountPrint: "Yes",
    vatPrint: "Yes",
    printSign: "Yes",
    isDeleted: false,
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
  },
  {
    _id: "inv3",
    invoiceType: "SI",
    invoiceNo: "SI-1123-00016",
    invoiceDate: "2026-02-18",
    jobNo: "AE-B0567",
    quoteNo: "AE-24-00345",
    quoteDate: "2024-03-20",
    status: "Closed",
    revNo: "R02",
    currency: "AED",
    invValue: 175000,
    weightKgs: 900,
    contractValue: 350000,
    paymentType: "Bank Transfer",
    customer: "Gulf Construction & Engineering",
    address: "PO Box 55123, Abu Dhabi, UAE",
    trn: "100987654321098",
    invoiceDetails: "Supply and installation of steel roofing system",
    invoiceTerms: "50% on delivery, 50% on completion",
    chequeInfo: "",
    contractInfo: "Total Contract Value..........AED (Exclusive of VAT)",
    bankAccount: "Emirates NBD",
    bankDetails: "",
    swiftCode: "",
    beneficiaryName: "",
    fobValue: 140000,
    freightCost: 10000,
    accountPrint: "Yes",
    vatPrint: "Yes",
    printSign: "No",
    isDeleted: false,
    createdAt: "2026-02-18T14:30:00Z",
    updatedAt: "2026-02-25T09:00:00Z",
  },
  {
    _id: "inv4",
    invoiceType: "PI",
    invoiceNo: "PI-1225-00070",
    invoiceDate: "2026-02-15",
    jobNo: "AE-C0890",
    quoteNo: "AE-25-00012",
    quoteDate: "2025-01-10",
    status: "Open",
    revNo: "R01",
    currency: "USD",
    invValue: 520000,
    weightKgs: 3500,
    contractValue: 1040000,
    paymentType: "LC",
    customer: "Al Habtoor Engineering LLC",
    address: "PO Box 33678, Sharjah, UAE",
    trn: "100456789012345",
    invoiceDetails: "Heavy structural steel for commercial tower project Phase-1",
    invoiceTerms: "Payment via Letter of Credit",
    chequeInfo: "",
    contractInfo: "Total Contract Value..........USD (Exclusive of VAT)",
    bankAccount: "HSBC Middle East",
    bankDetails: "Account: 5067891234567",
    swiftCode: "BBME AE AD",
    beneficiaryName: "FinFlow Structural Steel Manufacturing Co LLC",
    fobValue: 480000,
    freightCost: 25000,
    accountPrint: "Yes",
    vatPrint: "No",
    printSign: "Yes",
    isDeleted: false,
    createdAt: "2026-02-15T07:00:00Z",
    updatedAt: "2026-02-15T07:00:00Z",
  },
  {
    _id: "inv5",
    invoiceType: "SI",
    invoiceNo: "SI-1123-00017",
    invoiceDate: "2026-01-28",
    jobNo: "QA-D0123",
    quoteNo: "QA-24-00067",
    quoteDate: "2024-07-15",
    status: "Closed",
    revNo: "R05",
    currency: "QAR",
    invValue: 890000,
    weightKgs: 4200,
    contractValue: 1780000,
    paymentType: "Bank Transfer",
    customer: "Qatar Building Materials Co.",
    address: "PO Box 8901, Doha, Qatar",
    trn: "300123456789012",
    invoiceDetails: "Pre-fabricated steel structure for logistics warehouse",
    invoiceTerms: "Progressive billing as per milestones",
    chequeInfo: "",
    contractInfo: "Total Contract Value..........QAR (Exclusive of VAT)",
    bankAccount: "Qatar National Bank",
    bankDetails: "Account: 7089123456789",
    swiftCode: "QNBA QA QA",
    beneficiaryName: "FinFlow Structural Steel Manufacturing Co LLC",
    fobValue: 820000,
    freightCost: 45000,
    accountPrint: "Yes",
    vatPrint: "Yes",
    printSign: "Yes",
    isDeleted: false,
    createdAt: "2026-01-28T12:00:00Z",
    updatedAt: "2026-02-20T16:00:00Z",
  },
]

if (!globalStore.mockInvoices) globalStore.mockInvoices = invoices

let receipts: ReceiptData[] = globalStore.mockReceipts || [
  {
    _id: "rec1",
    receiptType: "Auto",
    invoiceNo: "PI-1225-00069",
    receiptDate: "2026-02-26",
    receiptNo: "RV0098/2026-AE-OM-A1215",
    jobNo: "OM-A1215",
    invoiceAmount: 10000,
    invoiceStatus: "Open",
    receivedAmount: 5000,
    receivedFrom: "MS. Speed Building SPC",
    paymentType: "Cheque",
    accountantName: "Ahmed Al Rashid",
    details: "Partial payment received against proforma invoice PI-1225-00069",
    currency: "AED",
    isDeleted: false,
    createdAt: "2026-02-26T09:00:00Z",
    updatedAt: "2026-02-26T09:00:00Z",
  },
  {
    _id: "rec2",
    receiptType: "Auto",
    invoiceNo: "SI-1123-00016",
    receiptDate: "2026-02-25",
    receiptNo: "RV0097/2026-AE-AE-B0567",
    jobNo: "AE-B0567",
    invoiceAmount: 175000,
    invoiceStatus: "Closed",
    receivedAmount: 175000,
    receivedFrom: "Gulf Construction & Engineering",
    paymentType: "Bank Transfer",
    accountantName: "Fatima Hassan",
    details: "Full and final payment against tax invoice SI-1123-00016",
    currency: "AED",
    isDeleted: false,
    createdAt: "2026-02-25T11:30:00Z",
    updatedAt: "2026-02-25T11:30:00Z",
  },
  {
    _id: "rec3",
    receiptType: "Manual",
    invoiceNo: "SI-1123-00015",
    receiptDate: "2026-02-22",
    receiptNo: "RV0096/2026-AE-AE-A0341",
    jobNo: "AE-A0341",
    invoiceAmount: 245000,
    invoiceStatus: "Open",
    receivedAmount: 122500,
    receivedFrom: "Modern Steel House Contracting LLC",
    paymentType: "CDC/TT",
    accountantName: "Ahmed Al Rashid",
    details: "50% advance payment received for structural steel supply",
    currency: "AED",
    isDeleted: false,
    createdAt: "2026-02-22T14:00:00Z",
    updatedAt: "2026-02-22T14:00:00Z",
  },
  {
    _id: "rec4",
    receiptType: "Auto",
    invoiceNo: "SI-1123-00017",
    receiptDate: "2026-02-20",
    receiptNo: "RV0095/2026-QA-QA-D0123",
    jobNo: "QA-D0123",
    invoiceAmount: 890000,
    invoiceStatus: "Closed",
    receivedAmount: 890000,
    receivedFrom: "Qatar Building Materials Co.",
    paymentType: "Bank Transfer",
    accountantName: "Fatima Hassan",
    details: "Final milestone payment for logistics warehouse project",
    currency: "QAR",
    isDeleted: false,
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
  },
  {
    _id: "rec5",
    receiptType: "Manual",
    invoiceNo: "PI-1225-00070",
    receiptDate: "2026-02-18",
    receiptNo: "RV0094/2026-AE-AE-C0890",
    jobNo: "AE-C0890",
    invoiceAmount: 520000,
    invoiceStatus: "Open",
    receivedAmount: 260000,
    receivedFrom: "Al Habtoor Engineering LLC",
    paymentType: "LC",
    accountantName: "Ahmed Al Rashid",
    details: "LC payment for Phase-1 structural steel - 50% advance",
    currency: "USD",
    isDeleted: false,
    createdAt: "2026-02-18T08:30:00Z",
    updatedAt: "2026-02-18T08:30:00Z",
  },
]

// Initialize global store if not present
if (!globalStore.mockInvoices) globalStore.mockInvoices = invoices
if (!globalStore.mockReceipts) globalStore.mockReceipts = receipts
if (!globalStore.nextInvId) globalStore.nextInvId = 100
if (!globalStore.nextRecId) globalStore.nextRecId = 100
if (!globalStore.nextBankId) globalStore.nextBankId = 100

export function getInvoices() {
  return [...invoices.filter((inv) => !inv.isDeleted)]
}

export function getInvoiceById(id: string) {
  return invoices.find((inv) => inv._id === id && !inv.isDeleted) || null
}

export function createInvoice(data: Omit<InvoiceData, "_id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString()
  const newInvoice: InvoiceData = {
    ...data,
    _id: `inv${globalStore.nextInvId++}`,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  }
  invoices.push(newInvoice)
  return newInvoice
}

export function updateInvoice(id: string, data: Partial<InvoiceData>) {
  const index = invoices.findIndex((inv) => inv._id === id && !inv.isDeleted)
  if (index === -1) return null
  invoices[index] = { ...invoices[index], ...data, updatedAt: new Date().toISOString() }
  return invoices[index]
}

export function deleteInvoice(id: string) {
  const index = invoices.findIndex((inv) => inv._id === id && !inv.isDeleted)
  if (index === -1) return false
  invoices[index].isDeleted = true
  invoices[index].updatedAt = new Date().toISOString()
  return true
}

export function getReceipts() {
  return [...receipts.filter((rec) => !rec.isDeleted)]
}

export function getReceiptById(id: string) {
  return receipts.find((rec) => rec._id === id && !rec.isDeleted) || null
}

export function createReceipt(data: Omit<ReceiptData, "_id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString()
  const newReceipt: ReceiptData = {
    ...data,
    _id: `rec${globalStore.nextRecId++}`,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  }
  receipts.push(newReceipt)
  return newReceipt
}

export function updateReceipt(id: string, data: Partial<ReceiptData>) {
  const index = receipts.findIndex((rec) => rec._id === id && !rec.isDeleted)
  if (index === -1) return null
  receipts[index] = { ...receipts[index], ...data, updatedAt: new Date().toISOString() }
  return receipts[index]
}

export function deleteReceipt(id: string) {
  const index = receipts.findIndex((rec) => rec._id === id && !rec.isDeleted)
  if (index === -1) return false
  receipts[index].isDeleted = true
  receipts[index].updatedAt = new Date().toISOString()
  return true
}

let bankDetails: BankDetailData[] = [
  {
    _id: "bank1",
    bankName: "Emirates NBD",
    accountNumber: "1012345678901",
    iban: "AE12 0260 0010 1234 5678 901",
    swiftCode: "EABORAEAXXX",
    beneficiaryName: "FinFlow Structural Steel Manufacturing Co LLC",
    branch: "Dubai Main Branch",
    isDeleted: false,
    createdAt: "2026-01-01T08:00:00Z",
    updatedAt: "2026-01-01T08:00:00Z",
  },
  {
    _id: "bank2",
    bankName: "Abu Dhabi Commercial Bank",
    accountNumber: "2034567890123",
    iban: "AE45 0030 0020 3456 7890 123",
    swiftCode: "ADCB A EAA",
    beneficiaryName: "FinFlow Structural Steel Manufacturing Co LLC",
    branch: "Abu Dhabi Central",
    isDeleted: false,
    createdAt: "2026-01-02T08:00:00Z",
    updatedAt: "2026-01-02T08:00:00Z",
  },
  {
    _id: "bank3",
    bankName: "HSBC Middle East",
    accountNumber: "5067891234567",
    iban: "QA12 3456 0000 5067 8912 345",
    swiftCode: "BBME AE AD",
    beneficiaryName: "FinFlow Structural Steel Manufacturing Co LLC",
    branch: "Doha Branch",
    isDeleted: false,
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-05T08:00:00Z",
  },
]

export function getBankDetails() {
  return [...bankDetails.filter((bank) => !bank.isDeleted)]
}

export function getBankDetailById(id: string) {
  return bankDetails.find((bank) => bank._id === id && !bank.isDeleted) || null
}

export function createBankDetail(data: Omit<BankDetailData, "_id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString()
  const newBank: BankDetailData = {
    ...data,
    _id: `bank${globalStore.nextBankId++}`,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  }
  bankDetails.push(newBank)
  return newBank
}

export function updateBankDetail(id: string, data: Partial<BankDetailData>) {
  const index = bankDetails.findIndex((bank) => bank._id === id && !bank.isDeleted)
  if (index === -1) return null
  bankDetails[index] = { ...bankDetails[index], ...data, updatedAt: new Date().toISOString() }
  return bankDetails[index]
}

export function deleteBankDetail(id: string) {
  const index = bankDetails.findIndex((bank) => bank._id === id && !bank.isDeleted)
  if (index === -1) return false
  bankDetails[index].isDeleted = true
  bankDetails[index].updatedAt = new Date().toISOString()
  return true
}
