import { NextResponse } from "next/server"
import { isMongoConfigured, connectToDatabase } from "@/lib/mongodb"
import { BankDetail } from "@/lib/models/bank-detail"
import * as fallback from "@/lib/seed-data"

export async function GET() {
    try {
        if (isMongoConfigured()) {
            await connectToDatabase()
            const bankDetails = await BankDetail.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean()
            return NextResponse.json(bankDetails)
        }
        return NextResponse.json(fallback.getBankDetails())
    } catch (error) {
        console.error("GET /api/bank-details error:", error)
        return NextResponse.json(fallback.getBankDetails())
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (isMongoConfigured()) {
            await connectToDatabase()
            const bankDetail = await BankDetail.create(body)
            return NextResponse.json(bankDetail, { status: 201 })
        }

        const bankDetail = fallback.createBankDetail(body)
        return NextResponse.json(bankDetail, { status: 201 })
    } catch (error) {
        console.error("POST /api/bank-details error:", error)
        return NextResponse.json(
            { error: "Failed to create bank detail" },
            { status: 500 }
        )
    }
}
