import React, { forwardRef } from "react"
import { toWords } from "number-to-words"

export interface ReceiptPrintData {
    receiptType: string
    invoiceNo: string
    receiptDate: string
    receiptNo: string
    jobNo: string
    invoiceAmount: number
    receivedAmount: number
    receivedFrom: string
    paymentType: string
    details: string
    currency: string
}

interface ReceiptPrintTemplateProps {
    data: ReceiptPrintData
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-AE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

export const ReceiptPrintTemplate = forwardRef<HTMLDivElement, ReceiptPrintTemplateProps>(
    ({ data }, ref) => {
        const amountInWords = capitalizeWords(toWords(data.receivedAmount || 0))

        return (
            <div className="hidden">
                <div
                    ref={ref}
                    className="bg-white text-black p-8 font-sans w-[210mm] min-h-[297mm] mx-auto box-border text-[11px] leading-relaxed"
                    style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="text-4xl font-black tracking-tighter text-[#b61f24] flex items-center">
                                <span className="text-gray-400 mr-1 opacity-70 italic font-light text-5xl leading-none">
                  //
                                </span>
                                FinFlow
                            </div>
                        </div>
                        <div className="flex items-center gap-2 h-12">
                            <div className="flex gap-1 h-full opacity-80" style={{ filter: 'grayscale(60%)' }}>
                                <div className="w-12 h-12 rounded-full border border-blue-600 border-dashed flex items-center justify-center text-[6px] text-center font-bold text-blue-600">
                                    DNV GL<br />ISO 9001
                                </div>
                                <div className="w-12 h-12 bg-blue-600 text-white rounded flex items-center justify-center text-[8px] font-bold">
                                    TUV SUD
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Container border */}
                    <div className="border border-black">
                        {/* Title */}
                        <div className="bg-[#e5e7eb] font-bold text-lg text-center py-1 border-b border-black tracking-wide">
                            RECEIPT VOUCHER
                        </div>

                        {/* Customer & Info Grid */}
                        <div className="flex border-b border-black">
                            {/* Left Customer Info */}
                            <div className="flex-1 border-r border-black p-2 flex">
                                <div className="w-24 font-bold">RECEIVED FROM</div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="font-bold text-sm uppercase">{data.receivedFrom}</div>
                                </div>
                            </div>
                            {/* Right Details Info */}
                            <div className="w-[35%] flex flex-col">
                                <div className="flex border-b border-black flex-1">
                                    <div className="w-24 p-1.5 font-bold border-r border-black flex items-center">Receipt No.</div>
                                    <div className="p-1.5 flex-1 flex items-center font-bold">{data.receiptNo}</div>
                                </div>
                                <div className="flex flex-1 border-b border-black">
                                    <div className="w-24 p-1.5 font-bold border-r border-black flex items-center">Date</div>
                                    <div className="p-1.5 flex-1 flex items-center">
                                        {data.receiptDate ? new Date(data.receiptDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : ''}
                                    </div>
                                </div>
                                <div className="flex flex-1">
                                    <div className="w-24 p-1.5 font-bold border-r border-black flex items-center">Job No.</div>
                                    <div className="p-1.5 flex-1 flex items-center">{data.jobNo || "-"}</div>
                                </div>
                            </div>
                        </div>

                        {/* Table Header */}
                        <div className="flex bg-[#e5e7eb] font-bold text-center border-b border-black">
                            <div className="flex-1 py-1.5 border-r border-black uppercase w-[120px]">AMOUNT</div>
                            <div className="flex-[3] py-1.5 border-r border-black uppercase">PARTICULARS</div>
                            <div className="flex-1 py-1.5 uppercase w-[120px]">PAYMENT REF</div>
                        </div>

                        {/* Table Body */}
                        <div className="flex min-h-[350px]">
                            <div className="flex-1 w-[120px] border-r border-black p-2 text-center pt-8 font-bold text-lg">
                                {data.currency || "AED"} <br />
                                {formatCurrency(data.receivedAmount)}
                            </div>
                            <div className="flex-[3] border-r border-black p-4 whitespace-pre-wrap flex flex-col">
                                {data.invoiceNo && (
                                    <div className="uppercase font-bold mb-4">
                                        Received with thanks against Invoice No: {data.invoiceNo}
                                    </div>
                                )}

                                <div className="leading-tight mb-4">
                                    {data.details || "Payment received for services/goods rendered."}
                                </div>

                                {data.invoiceAmount > 0 && (
                                    <div className="mt-8 text-sm">
                                        Total Invoice Amount: {data.currency} {formatCurrency(data.invoiceAmount)}
                                        <br />
                                        Amount Received: {data.currency} {formatCurrency(data.receivedAmount)}
                                        <br />
                                        Current Balance: {data.currency} {formatCurrency(data.invoiceAmount - data.receivedAmount)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 w-[120px] p-2 text-center pt-8 font-bold">
                                {data.paymentType}
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="border-t border-black bg-[#f3f4f6] flex items-center">
                            <div className="p-2 font-bold w-32 border-r border-black text-center">
                                Sum of {data.currency || "AED"}
                            </div>
                            <div className="p-2 font-bold flex-1 text-center bg-white">
                                ** {amountInWords} Only **
                            </div>
                        </div>
                    </div>

                    {/* Footer Signature Area */}
                    <div className="mt-6 flex justify-between px-2">
                        <div>
                            <div className="text-[10px]">Received By</div>
                            <div className="font-bold text-xs uppercase mb-16">
                                FinFlow LLC
                            </div>

                            <div className="relative w-64 h-16 mb-4">
                                {/* Fake Stamp */}
                                <div className="absolute -top-4 left-0 w-24 h-24 border-2 border-green-600 rounded-full flex items-center justify-center opacity-70" style={{ transform: "rotate(-10deg)" }}>
                                    <div className="text-center text-[6px] text-green-600 font-bold uppercase tracking-tighter w-16 w-full px-2">
                                        FinFlow LLC
                                        <br /><br />
                                        <span className="text-green-800 text-[8px] tracking-wide">RECEIVED</span>
                                    </div>
                                </div>
                            </div>

                            <div className="font-bold uppercase text-xs">AUTHORIZED SIGNATORY</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
)
ReceiptPrintTemplate.displayName = "ReceiptPrintTemplate"
