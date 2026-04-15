"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Save, Trash2, Edit2, Search, Building2, X } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface BankDetail {
    _id: string
    bankName: string
    accountNumber: string
    iban: string
    swiftCode: string
    beneficiaryName: string
    branch: string
}

const emptyBank: Omit<BankDetail, "_id"> = {
    bankName: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
    beneficiaryName: "",
    branch: "",
}

export function BankDetailsManager() {
    const { data: bankDetails = [], mutate } = useSWR<BankDetail[]>("/api/bank-details", fetcher)
    const [form, setForm] = useState<Omit<BankDetail, "_id">>(emptyBank)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    const filteredBanks = bankDetails.filter((bank) =>
        bank.bankName.toLowerCase().includes(search.toLowerCase()) ||
        bank.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
        bank.iban.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (bank: BankDetail) => {
        // Only store the editable fields in form (exclude _id)
        const { _id, ...editableFields } = bank
        setForm(editableFields)
        setSelectedId(bank._id)
    }

    const handleReset = () => {
        setForm(emptyBank)
        setSelectedId(null)
    }

    const handleSave = async () => {
        if (!form.bankName.trim()) {
            toast.error("Bank Name is required")
            return
        }

        setSaving(true)
        try {
            const url = selectedId ? `/api/bank-details/${selectedId}` : "/api/bank-details"
            const method = selectedId ? "PUT" : "POST"

            // form already excludes _id so we send it directly
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.error || "Failed to save")
            }

            toast.success(selectedId ? "Bank account updated successfully" : "Bank account created successfully")
            handleReset()
            mutate()
        } catch (error: any) {
            toast.error(error.message || "An error occurred while saving")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedId) return

        try {
            const response = await fetch(`/api/bank-details/${selectedId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.error || "Failed to delete")
            }

            toast.success("Bank account removed successfully")
            setDeleteDialogOpen(false)
            handleReset()
            mutate()
        } catch (error: any) {
            toast.error(error.message || "An error occurred while deleting")
        }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="size-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Bank Accounts</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your company bank accounts and transfer details
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {selectedId && (
                        <Button onClick={handleReset} variant="ghost" size="sm" className="gap-1.5">
                            <X className="size-3.5" />
                            Cancel Edit
                        </Button>
                    )}
                    <Button onClick={handleReset} variant="outline" size="sm" className="gap-1.5">
                        <Plus className="size-3.5" />
                        New Account
                    </Button>
                    <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5">
                        <Save className="size-3.5" />
                        {saving ? "Saving..." : selectedId ? "Update Account" : "Save Account"}
                    </Button>
                    {selectedId && (
                        <Button
                            onClick={() => setDeleteDialogOpen(true)}
                            variant="destructive"
                            size="sm"
                            className="gap-1.5"
                        >
                            <Trash2 className="size-3.5" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {/* Status Banner */}
            {selectedId && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 flex items-center gap-2 text-sm text-primary font-medium">
                    <Edit2 className="size-3.5" />
                    Editing bank account — make your changes and click "Update Account"
                </div>
            )}

            {/* Main Layout: Form + Table */}
            {/* Main Layout: Form above Table */}
            <div className="flex flex-col gap-6">

                {/* ---- Account Form ---- */}
                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {selectedId ? "Edit Bank Account" : "Add New Account"}
                        </CardTitle>
                        {selectedId && (
                            <Badge variant="outline" className="text-primary border-primary/30">
                                Editing: {form.bankName}
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Bank Identity Group */}
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="bankName" className="text-xs font-medium">
                                        Bank Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="bankName"
                                        value={form.bankName}
                                        onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                                        placeholder="e.g. Emirates NBD"
                                        className="h-9"
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="branch" className="text-xs font-medium">Branch</Label>
                                    <Input
                                        id="branch"
                                        value={form.branch}
                                        onChange={(e) => setForm({ ...form, branch: e.target.value })}
                                        placeholder="e.g. Dubai Main Branch"
                                        className="h-9"
                                    />
                                </div>
                            </div>

                            {/* Account Details Group */}
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="accountNumber" className="text-xs font-medium">Account Number</Label>
                                    <Input
                                        id="accountNumber"
                                        value={form.accountNumber}
                                        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                                        className="font-mono h-9"
                                        placeholder="e.g. 1012345678901"
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="beneficiaryName" className="text-xs font-medium">Beneficiary Name</Label>
                                    <Input
                                        id="beneficiaryName"
                                        value={form.beneficiaryName}
                                        onChange={(e) => setForm({ ...form, beneficiaryName: e.target.value })}
                                        placeholder="Company name as registered"
                                        className="h-9"
                                    />
                                </div>
                            </div>

                            {/* Codes Group */}
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="iban" className="text-xs font-medium">IBAN</Label>
                                    <Input
                                        id="iban"
                                        value={form.iban}
                                        onChange={(e) =>
                                            setForm({ ...form, iban: e.target.value.toUpperCase() })
                                        }
                                        className="font-mono h-9"
                                        placeholder="AE12 0260 0010 1234 5678 901"
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="swiftCode" className="text-xs font-medium">Swift / BIC Code</Label>
                                    <Input
                                        id="swiftCode"
                                        value={form.swiftCode}
                                        onChange={(e) =>
                                            setForm({ ...form, swiftCode: e.target.value.toUpperCase() })
                                        }
                                        className="font-mono h-9"
                                        placeholder="e.g. EABORAEAXXX"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ---- Accounts Table ---- */}
                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Saved Accounts
                            {bankDetails.length > 0 && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                    {bankDetails.length}
                                </Badge>
                            )}
                        </CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search accounts..."
                                className="pl-8 h-9 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/40 hover:bg-muted/40">
                                    <TableHead className="text-xs">Bank Name</TableHead>
                                    <TableHead className="text-xs">Beneficiary</TableHead>
                                    <TableHead className="text-xs">Account Number</TableHead>
                                    <TableHead className="text-xs">IBAN</TableHead>
                                    <TableHead className="text-xs">Swift</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBanks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-36 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <Building2 className="size-8 opacity-30" />
                                                <p className="text-sm">No bank accounts found</p>
                                                <p className="text-xs">Add a new account using the form above</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBanks.map((bank) => (
                                        <TableRow
                                            key={bank._id}
                                            className={`cursor-pointer transition-colors ${selectedId === bank._id
                                                    ? "bg-primary/8 border-l-2 border-l-primary"
                                                    : "hover:bg-muted/50"
                                                }`}
                                            onClick={() => handleSelect(bank)}
                                        >
                                            <TableCell className="font-medium text-sm py-3">
                                                {bank.bankName}
                                                {bank.branch && (
                                                    <p className="text-[10px] text-muted-foreground font-normal">{bank.branch}</p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground py-3">
                                                {bank.beneficiaryName || "—"}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs py-3">
                                                {bank.accountNumber || "—"}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs py-3">
                                                {bank.iban || "—"}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs py-3">
                                                {bank.swiftCode || "—"}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleSelect(bank)
                                                    }}
                                                >
                                                    <Edit2 className="size-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Bank Account?</DialogTitle>
                        <DialogDescription>
                            This will soft-delete the account. It will no longer appear in selection menus,
                            but historical invoice records linked to this account will remain intact.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
