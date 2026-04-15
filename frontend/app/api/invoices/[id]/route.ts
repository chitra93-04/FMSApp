import { NextResponse } from "next/server"
import { isMongoConfigured, connectToDatabase } from "@/lib/mongodb"
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
      const invoice = await Invoice.findById(id).lean() as any
      if (!invoice || invoice.isDeleted) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
      }
      return NextResponse.json(invoice)
    }

    const invoice = fallback.getInvoiceById(id)
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }
    return NextResponse.json(invoice)
  } catch (error) {
    console.error("GET /api/invoices/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
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
      const invoice = await Invoice.findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } },
        body,
        { new: true }
      ).lean()
      if (!invoice) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
      }
      return NextResponse.json(invoice)
    }

    const invoice = fallback.updateInvoice(id, body)
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }
    return NextResponse.json(invoice)
  } catch (error) {
    console.error("PUT /api/invoices/[id] error:", error)
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
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
      const invoice = await Invoice.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      if (!invoice) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }

    const success = fallback.deleteInvoice(id)
    if (!success) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/invoices/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
}
