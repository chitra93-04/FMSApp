import { NextResponse } from "next/server"
import { isMongoConfigured, connectToDatabase } from "@/lib/mongodb"
import { Receipt } from "@/lib/models/receipt"
import * as fallback from "@/lib/seed-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year") || new Date().getFullYear().toString()
    const jobNo = searchParams.get("jobNo") || ""

    if (!isMongoConfigured()) {
       // Fallback logic using seed-data
       const allReceipts = fallback.getReceipts()
       const yearPattern = new RegExp(`^RV\\d{4}/${year}`)
       const yearReceipts = allReceipts.filter((r: any) => yearPattern.test(r.receiptNo))
       
       let nextSerial = 1
       if (yearReceipts.length > 0) {
         // Sort by receiptNo descending
         yearReceipts.sort((a: any, b: any) => b.receiptNo.localeCompare(a.receiptNo))
         const match = yearReceipts[0].receiptNo.match(/^RV(\d{4})/)
         if (match) {
           nextSerial = parseInt(match[1]) + 1
         }
       }
       const paddedSerial = nextSerial.toString().padStart(4, "0")
       return NextResponse.json({ receiptNo: `RV${paddedSerial}/${year}-AE-${jobNo}`, nextSerial })
    }

    await connectToDatabase()

    // Find all receipts for the current year to determine the next serial
    // We look for receiptNo starting with "RV" and containing "/{year}"
    const yearPattern = new RegExp(`^RV\\d{4}/${year}`)
    const latestReceipt = (await Receipt.findOne({ 
      receiptNo: { $regex: yearPattern } 
    }).sort({ receiptNo: -1 }).lean()) as any

    let nextSerial = 1
    if (latestReceipt && latestReceipt.receiptNo) {
      // Extract serial from RVxxxx/...
      const match = (latestReceipt.receiptNo as string).match(/^RV(\d{4})/)
      if (match) {
        nextSerial = parseInt(match[1]) + 1
      }
    }

    const paddedSerial = nextSerial.toString().padStart(4, "0")
    const nextReceiptNo = `RV${paddedSerial}/${year}-AE-${jobNo}`

    return NextResponse.json({ receiptNo: nextReceiptNo, nextSerial })
  } catch (error) {
    console.error("GET /api/receipts/next-number error:", error)
    return NextResponse.json(
      { error: "Failed to generate receipt number" },
      { status: 500 }
    )
  }
}
