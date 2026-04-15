import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { isMongoConfigured, connectToDatabase } from "@/lib/mongodb"
import { Receipt } from "@/lib/models/receipt"
import * as fallback from "@/lib/seed-data"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceNo: string }> }
) {
  try {
    const { invoiceNo } = await params

    if (!isMongoConfigured()) {
      const allReceipts = fallback.getReceipts()
      const filtered = allReceipts.filter((r: any) => 
        r.invoiceNo === invoiceNo || r.invoiceNo?.includes(invoiceNo) || invoiceNo?.includes(r.invoiceNo)
      )
      return NextResponse.json(filtered)
    }

    await connectToDatabase()
    const receipts = await Receipt.find({ 
      invoiceNo, 
      isDeleted: { $ne: true } 
    }).sort({ receiptDate: -1 }).lean()

    return NextResponse.json(receipts)
  } catch (error) {
    const { invoiceNo } = await params
    console.error(`GET /api/receipts/by-invoice/${invoiceNo} error:`, error)
    return NextResponse.json(
      { error: "Failed to fetch receipts for invoice" },
      { status: 500 }
    )
  }
}
