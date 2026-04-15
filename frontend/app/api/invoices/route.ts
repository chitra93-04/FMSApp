import { NextResponse } from "next/server"
import { isMongoConfigured, connectToDatabase } from "@/lib/mongodb"
import { Invoice } from "@/lib/models/invoice"
import * as fallback from "@/lib/seed-data"

export async function GET() {
  try {
    if (isMongoConfigured()) {
      await connectToDatabase()
      const invoices = await Invoice.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean()
      return NextResponse.json(invoices)
    }
    return NextResponse.json(fallback.getInvoices())
  } catch (error) {
    console.error("GET /api/invoices error:", error)
    return NextResponse.json(fallback.getInvoices())
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (isMongoConfigured()) {
      await connectToDatabase()
      const invoice = await Invoice.create(body)
      return NextResponse.json(invoice, { status: 201 })
    }

    const invoice = fallback.createInvoice(body)
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("POST /api/invoices error:", error)
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    )
  }
}
