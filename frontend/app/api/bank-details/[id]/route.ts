import { NextResponse } from "next/server"
import { isMongoConfigured, connectToDatabase } from "@/lib/mongodb"
import { BankDetail } from "@/lib/models/bank-detail"
import * as fallback from "@/lib/seed-data"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        if (isMongoConfigured()) {
            await connectToDatabase()
            const bankDetail = await BankDetail.findById(id).lean()
            if (!bankDetail || (bankDetail as any).isDeleted) {
                return NextResponse.json({ error: "Bank detail not found" }, { status: 404 })
            }
            return NextResponse.json(bankDetail)
        }

        const bankDetail = fallback.getBankDetailById(id)
        if (!bankDetail) {
            return NextResponse.json({ error: "Bank detail not found" }, { status: 404 })
        }
        return NextResponse.json(bankDetail)
    } catch (error) {
        console.error("GET /api/bank-details/[id] error:", error)
        return NextResponse.json({ error: "Failed to fetch bank detail" }, { status: 500 })
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
            // Make sure we only update existing, non-deleted records
            const bankDetail = await BankDetail.findOneAndUpdate(
                { _id: id, isDeleted: { $ne: true } },
                body,
                { new: true }
            ).lean()
            if (!bankDetail) {
                return NextResponse.json({ error: "Bank detail not found" }, { status: 404 })
            }
            return NextResponse.json(bankDetail)
        }

        const bankDetail = fallback.updateBankDetail(id, body)
        if (!bankDetail) {
            return NextResponse.json({ error: "Bank detail not found" }, { status: 404 })
        }
        return NextResponse.json(bankDetail)
    } catch (error) {
        console.error("PUT /api/bank-details/[id] error:", error)
        return NextResponse.json({ error: "Failed to update bank detail" }, { status: 500 })
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
            const bankDetail = await BankDetail.findOneAndUpdate(
                { _id: id, isDeleted: { $ne: true } },
                { isDeleted: true },
                { new: true }
            )
            if (!bankDetail) {
                return NextResponse.json({ error: "Bank detail not found" }, { status: 404 })
            }
            return NextResponse.json({ success: true })
        }

        const success = fallback.deleteBankDetail(id)
        if (!success) {
            return NextResponse.json({ error: "Bank detail not found" }, { status: 404 })
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DELETE /api/bank-details/[id] error:", error)
        return NextResponse.json({ error: "Failed to delete bank detail" }, { status: 500 })
    }
}
