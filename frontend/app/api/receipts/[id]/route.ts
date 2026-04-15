import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { isMongoConfigured, connectToDatabase } from "@/lib/mongodb"
import { Receipt } from "@/lib/models/receipt"
import { Invoice } from "@/lib/models/invoice"
import * as fallback from "@/lib/seed-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    if (isMongoConfigured()) {
      await connectToDatabase()
      const receipt = await Receipt.findById(id).lean() as any
      if (!receipt || receipt.isDeleted) {
        return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
      }
      return NextResponse.json(receipt)
    }

    const receipt = fallback.getReceiptById(id)
    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }
    return NextResponse.json(receipt)
  } catch (error) {
    console.error("GET /api/receipts/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch receipt" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()

    if (isMongoConfigured()) {
      await connectToDatabase()
      const receipt = await Receipt.findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } },
        body,
        { new: true }
      ).lean()
      if (!receipt) {
        return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
      }

      // Re-evaluate Invoice Status
      const invoiceNo = (receipt as any).invoiceNo
      if (invoiceNo) {
        const allReceipts = await Receipt.find({ invoiceNo, isDeleted: { $ne: true } })
        const totalReceived = allReceipts.reduce((sum, r) => sum + (r.receivedAmount || 0), 0)
        const invoice = await Invoice.findOne({ invoiceNo })
        if (invoice) {
          invoice.status = totalReceived >= (invoice.invValue || 0) ? "Closed" : "Open"
          await invoice.save()
          return NextResponse.json({ receipt, invoiceStatus: invoice.status })
        }
      }
      
      return NextResponse.json(receipt)
    }

    const receipt = fallback.updateReceipt(id, body)
    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }
    // Fallback status re-evaluation
    if (receipt.invoiceNo) {
      const inv = fallback.getInvoices().find(i => i.invoiceNo === receipt.invoiceNo)
      if (inv) {
        const all = fallback.getReceipts().filter(r => r.invoiceNo === receipt.invoiceNo)
        const total = all.reduce((sum, r) => sum + r.receivedAmount, 0)
        fallback.updateInvoice(inv._id, { status: total >= inv.invValue ? "Closed" : "Open" })
      }
    }
    return NextResponse.json(receipt)
  } catch (error) {
    console.error("PUT /api/receipts/[id] error:", error)
    return NextResponse.json({ error: "Failed to update receipt" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    if (isMongoConfigured()) {
      await connectToDatabase()
      const receipt = await Receipt.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      if (!receipt) {
        return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
      }

      // Re-evaluate Invoice Status after deletion
      const invoiceNo = receipt.invoiceNo
      if (invoiceNo) {
        const allReceipts = await Receipt.find({ invoiceNo, isDeleted: { $ne: true } })
        const totalReceived = allReceipts.reduce((sum, r) => sum + (r.receivedAmount || 0), 0)
        const invoice = await Invoice.findOne({ invoiceNo })
        if (invoice) {
          invoice.status = totalReceived >= (invoice.invValue || 0) ? "Closed" : "Open"
          await invoice.save()
        }
      }
      return NextResponse.json({ success: true })
    }

    const receiptToDelete = fallback.getReceiptById(id)
    const success = fallback.deleteReceipt(id)
    if (!success) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }
    // Fallback status re-evaluation
    if (receiptToDelete && receiptToDelete.invoiceNo) {
      const inv = fallback.getInvoices().find(i => i.invoiceNo === receiptToDelete.invoiceNo)
      if (inv) {
        const all = fallback.getReceipts().filter(r => r.invoiceNo === receiptToDelete.invoiceNo)
        const total = all.reduce((sum, r) => sum + r.receivedAmount, 0)
        fallback.updateInvoice(inv._id, { status: total >= inv.invValue ? "Closed" : "Open" })
      }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/receipts/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete receipt" }, { status: 500 })
  }
}
