import { NextResponse } from "next/server"
import { isMongoConfigured, connectToDatabase } from "@/lib/mongodb"
import { Receipt } from "@/lib/models/receipt"
import { Invoice } from "@/lib/models/invoice"
import * as fallback from "@/lib/seed-data"

export async function GET() {
  try {
    if (isMongoConfigured()) {
      await connectToDatabase()
      const receipts = await Receipt.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean()
      return NextResponse.json(receipts)
    }
    return NextResponse.json(fallback.getReceipts())
  } catch (error) {
    console.error("GET /api/receipts error:", error)
    return NextResponse.json(fallback.getReceipts())
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (isMongoConfigured()) {
      await connectToDatabase()
      
      // Create the receipt
      const receipt = await Receipt.create(body)

      // Update Invoice Status logic
      const invoiceNo = body.invoiceNo
      if (invoiceNo) {
        // Calculate total received for this invoice
        const allReceipts = await Receipt.find({ invoiceNo, isDeleted: { $ne: true } })
        const totalReceived = allReceipts.reduce((sum, r) => sum + (r.receivedAmount || 0), 0)

        // Find the invoice
        const invoice = await Invoice.findOne({ invoiceNo })
        if (invoice) {
          const invAmount = invoice.invValue || 0
          
          if (totalReceived >= invAmount) {
            invoice.status = "Closed"
          } else {
            invoice.status = "Open"
          }
          await invoice.save()
          
          return NextResponse.json({ 
            receipt, 
            invoiceStatus: invoice.status,
            totalReceived,
            balance: invAmount - totalReceived,
            message: totalReceived > invAmount ? "Overpayment" : undefined
          }, { status: 201 })
        }
      }

      return NextResponse.json(receipt, { status: 201 })
    }

    const receipt = fallback.createReceipt(body)
    return NextResponse.json(receipt, { status: 201 })
  } catch (error) {
    console.error("POST /api/receipts error:", error)
    return NextResponse.json(
      { error: "Failed to create receipt" },
      { status: 500 }
    )
  }
}
