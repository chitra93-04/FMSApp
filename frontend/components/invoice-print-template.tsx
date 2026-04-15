import React, { forwardRef } from "react"
import { toWords } from "number-to-words"

export interface InvoicePrintData {
    invoiceType: string
    invoiceNo: string
    invoiceDate: string
    jobNo: string
    customer: string
    address: string
    trn: string
    invoiceDetails: string
    invValue: number
    contractValue?: number
    bankDetails?: string
    swiftCode?: string
    beneficiaryName?: string
    chequeInfo?: string
    currency?: string
}

interface InvoicePrintTemplateProps {
    data: InvoicePrintData
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

export const InvoicePrintTemplate = forwardRef<HTMLDivElement, InvoicePrintTemplateProps>(
    ({ data }, ref) => {
        // Calculate VAT if needed (assuming 5% standard here)
        const totalExclVat = data.invValue || 0
        const vatAmount = totalExclVat * 0.05
        const totalInclVat = totalExclVat + vatAmount

        // Amount in words
        const amountInWords = capitalizeWords(toWords(totalInclVat))

        return (
            <div className="hidden">
                {/* The hidden wrapper ensures it doesn't affect main layout, react-to-print will extract the content inside `ref` */}
                <div
                    ref={ref}
                    className="bg-white text-black p-8 font-sans w-[210mm] min-h-[297mm] mx-auto box-border text-[11px] leading-relaxed"
                    style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                            {/* FinFlow Logo Placeholder - using text styling as stand-in if image not available */}
                            <div className="text-4xl font-black tracking-tighter text-[#b61f24] flex items-center">
                                <span className="text-gray-400 mr-1 opacity-70 italic font-light text-5xl leading-none">
                  //
                                </span>
                                FinFlow
                            </div>
                        </div>
                        <div className="flex items-center gap-2 h-12">
                            {/* Certifications Placeholder */}
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
                            {data.invoiceType === "PI" ? "PROFORMA INVOICE" : "TAX INVOICE"}
                        </div>

                        {/* Customer & Info Grid */}
                        <div className="flex border-b border-black">
                            {/* Left Customer Info */}
                            <div className="flex-1 border-r border-black p-2 flex">
                                <div className="w-20 font-bold">CUSTOMER</div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="font-bold text-xs uppercase mb-4">{data.customer}</div>
                                    <div className="text-xs">
                                        {data.address && <div>{data.address}</div>}
                                        {data.trn && <div>TRN : {data.trn}</div>}
                                    </div>
                                </div>
                            </div>
                            {/* Right Details Info */}
                            <div className="w-[35%] flex flex-col">
                                <div className="flex border-b border-black flex-1">
                                    <div className="w-24 p-1.5 font-bold border-r border-black flex items-center">Job No.</div>
                                    <div className="p-1.5 flex-1 flex items-center">{data.jobNo}</div>
                                </div>
                                <div className="flex border-b border-black flex-1">
                                    <div className="w-24 p-1.5 font-bold border-r border-black flex items-center">Invoice Date</div>
                                    <div className="p-1.5 flex-1 flex items-center">
                                        {data.invoiceDate ? new Date(data.invoiceDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : ''}
                                    </div>
                                </div>
                                <div className="flex flex-1">
                                    <div className="w-24 p-1.5 font-bold border-r border-black flex items-center">Invoice No.</div>
                                    <div className="p-1.5 flex-1 flex items-center">{data.invoiceNo}</div>
                                </div>
                            </div>
                        </div>

                        {/* Table Header */}
                        <div className="flex bg-[#e5e7eb] font-bold text-center border-b border-black">
                            <div className="flex-1 py-1.5 border-r border-black uppercase">DESCRIPTION OF GOODS</div>
                            <div className="w-[120px] py-1.5 uppercase">TOTAL Value</div>
                        </div>

                        {/* Table Body */}
                        <div className="flex min-h-[350px]">
                            <div className="flex-1 border-r border-black p-3 whitespace-pre-wrap flex flex-col">
                                <div className="uppercase font-bold mb-4 leading-tight">
                                    {data.invoiceDetails || "SUPPLY OF PRE-ENGINEERED STEEL BUILDING COMPONENTS AS PER PROPOSAL QUOTATION"}
                                </div>

                                <div className="mb-6 font-bold">
                                    {/* Dynamic description of terms, using chequeInfo or generic text */}
                                    {data.chequeInfo ? `This Invoice pertains to ${data.chequeInfo}` : "This Invoice pertains to 40% Production Payment by 60 Days PDC"}
                                </div>

                                <div className="mb-4">
                                    <span className="font-bold">Cheque should be issued in the name of:</span><br />
                                    <span className="font-bold">FinFlow </span>
                                </div>

                                <div className="mb-6 font-bold">
                                    Total Contract Value..........AED {formatCurrency(data.contractValue || 0)} (Exclusive of VAT)
                                </div>

                                {data.bankDetails && (
                                    <div className="mt-auto">
                                        <span className="underline decoration-black underline-offset-2 italic">Bank Transfer Details:</span><br />
                                        <div className="font-bold text-[10px] mt-1">
                                            {data.beneficiaryName && (
                                                <div className="flex">
                                                    <span className="w-24">Beneficiary :</span>
                                                    <span>{data.beneficiaryName}</span>
                                                </div>
                                            )}
                                            <div className="whitespace-pre-wrap leading-tight">
                                                {data.bankDetails}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-[120px] p-2 text-right">
                                {formatCurrency(totalExclVat)}
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="border-t border-black flex">
                            <div className="flex-1 border-r border-black p-1.5 font-bold">Total</div>
                            <div className="w-12 border-r border-black p-1.5 flex items-center">{data.currency || "AED"}</div>
                            <div className="w-[120px] p-1.5 text-right font-mono">{formatCurrency(totalExclVat)}</div>
                        </div>
                        <div className="border-t border-black flex">
                            <div className="flex-1 border-r border-black p-1.5 font-bold">VAT Amount 5%</div>
                            <div className="w-12 border-r border-black p-1.5 flex items-center">{data.currency || "AED"}</div>
                            <div className="w-[120px] p-1.5 text-right font-mono">{formatCurrency(vatAmount)}</div>
                        </div>
                        <div className="border-t border-black flex">
                            <div className="flex-1 border-r border-black p-1.5 font-bold">Total Invoice Amount</div>
                            <div className="w-12 border-r border-black p-1.5 flex items-center font-bold">{data.currency || "AED"}</div>
                            <div className="w-[120px] p-1.5 text-right font-mono font-bold bg-[#f3f4f6]">
                                {formatCurrency(totalInclVat)}
                            </div>
                        </div>
                        <div className="border-t border-black p-2 font-bold bg-white">
                            Total Invoice Value in {data.currency || "AED"} {amountInWords} Only
                        </div>
                    </div>

                    {/* Footer Signature Area */}
                    <div className="mt-6 pl-2">
                        <div className="text-[10px]">For</div>
                        <div className="font-bold text-xs uppercase mb-16">
                            FinFlow
                        </div>

                        <div className="relative w-64 h-16 mb-4">
                            {/* Fake Signature */}
                            <div className="absolute bottom-0 left-4 text-blue-700 font-signature text-3xl opacity-80" style={{ fontFamily: "cursive", transform: "rotate(-5deg)" }}>
                                A. Elmansi
                            </div>
                            {/* Fake Stamp */}
                            <div className="absolute -top-4 right-0 w-24 h-24 border-2 border-blue-600 rounded-full flex items-center justify-center opacity-70" style={{ transform: "rotate(15deg)" }}>
                                <div className="text-center text-[6px] text-blue-600 font-bold uppercase tracking-tighter w-16 w-full px-2">
                                    FinFlow
                                    <br /><br />
                                    <span className="text-blue-800 text-[8px] tracking-wide">DUBAI - UAE</span>
                                </div>
                            </div>
                        </div>

                        <div className="font-bold uppercase text-xs">AUTHORIZED SIGNATORY</div>
                    </div>
                </div>
            </div>
        )
    }
)
InvoicePrintTemplate.displayName = "InvoicePrintTemplate"
