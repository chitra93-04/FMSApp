"use client"

import { InvoicePrintTemplate } from "@/components/invoice-print-template"
import { ReceiptPrintTemplate } from "@/components/receipt-print-template"

const mockInvoice = {
    invoiceType: "SI",
    invoiceNo: "SI0325-00012",
    invoiceDate: "2025-03-12",
    jobNo: "AE-A0835",
    customer: "CIVIL MATRIX CONTRACTING L.L.C",
    address: "1203, Saheel Business Tower1, Al Ittihad Road,Dubai,UAE",
    trn: "100214486100003",
    invoiceDetails: "SUPPLY OF PRE-ENGINEERED STEEL BUILDING COMPONENTS\nPROPOSAL QUOTATION NO. AE-24-02179 REV. 04 DATED 03-JAN-2025",
    invValue: 690000.00,
    contractValue: 1725000.00,
    chequeInfo: "40% Production Payment by 60 Days PDC",
    bankDetails: "NATIONAL BANK OF RAS AL KHAIMAH\nG/F ABDUL RAHMAN BLDG 45 SHEIKH KHALIFA BIN ZAYED RD\nUMM HURRAIR 1 DUBAI UAE\nIBAN NO. AE710400000333148207001\nBeneficiary: FINFLOW LLC\nSWIFT CODE: NRAKAEAK",
    currency: "AED"
}

const mockReceipt = {
    receiptType: "Auto",
    invoiceNo: "SI0325-00012",
    receiptDate: "2025-03-12",
    receiptNo: "RV0098/2026-AE-OM",
    jobNo: "AE-A0835",
    invoiceAmount: 724500.00,
    receivedAmount: 690000.00,
    receivedFrom: "CIVIL MATRIX CONTRACTING L.L.C",
    paymentType: "Cheque",
    details: "Payment received against 40% production. Cheque #123456",
    currency: "AED"
}

export default function TestPrintPage() {
    return (
        <div className="flex flex-col gap-16 p-8 overflow-auto bg-gray-500 min-h-screen">
            <div>
                <h2 className="text-white mb-4 text-2xl font-bold">Invoice Print Preview</h2>
                <div className="[&>.hidden]:!block shadow-2xl overflow-hidden rounded-xl border-4 border-white inline-block">
                    <InvoicePrintTemplate data={mockInvoice} />
                </div>
            </div>

            <div>
                <h2 className="text-white mb-4 text-2xl font-bold">Receipt Print Preview</h2>
                <div className="[&>.hidden]:!block shadow-2xl overflow-hidden rounded-xl border-4 border-white inline-block">
                    <ReceiptPrintTemplate data={mockReceipt as any} />
                </div>
            </div>
        </div>
    )
}
