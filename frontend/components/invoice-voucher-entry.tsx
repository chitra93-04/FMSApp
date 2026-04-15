"use client"

import { useState, useRef } from "react"
import useSWR from "swr"
import { useReactToPrint } from "react-to-print"
import { InvoicePrintTemplate } from "./invoice-print-template"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Save,
  RefreshCw,
  Trash2,
  Printer,
  Search,
  FileText,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const emptyInvoice = {
  invoiceType: "PI",
  invoiceNo: "",
  invoiceDate: new Date().toISOString().split("T")[0],
  jobNo: "",
  quoteNo: "",
  quoteDate: "",
  status: "Open",
  revNo: "",
  currency: "AED",
  invValue: 0,
  weightKgs: 0,
  contractValue: 0,
  paymentType: "",
  customer: "",
  address: "",
  trn: "",
  invoiceDetails: "",
  invoiceTerms: "",
  chequeInfo: "",
  contractInfo: "",
  bankAccount: "",
  bankDetails: "",
  swiftCode: "",
  beneficiaryName: "",
  fobValue: 0,
  freightCost: 0,
  accountPrint: "Yes",
  vatPrint: "",
  printSign: "",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function InvoiceVoucherEntry() {
  const { data: invoices = [], mutate } = useSWR("/api/invoices", fetcher)
  const { data: bankAccounts = [] } = useSWR("/api/bank-details", fetcher)
  const [form, setForm] = useState(emptyInvoice)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: form.invoiceNo ? `Invoice_${form.invoiceNo}` : "Invoice",
  })

  const filteredInvoices = invoices.filter(
    (inv: { invoiceNo: string; customer: string; jobNo: string }) =>
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.jobNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleNew() {
    setForm({ ...emptyInvoice })
    setSelectedId(null)
  }

  function handleSelectInvoice(invoice: typeof emptyInvoice & { _id: string }) {
    setSelectedId(invoice._id)
    setForm({
      invoiceType: invoice.invoiceType,
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate
        ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
        : "",
      jobNo: invoice.jobNo,
      quoteNo: invoice.quoteNo,
      quoteDate: invoice.quoteDate
        ? new Date(invoice.quoteDate).toISOString().split("T")[0]
        : "",
      status: invoice.status,
      revNo: invoice.revNo,
      currency: invoice.currency,
      invValue: invoice.invValue,
      weightKgs: invoice.weightKgs,
      contractValue: invoice.contractValue,
      paymentType: invoice.paymentType,
      customer: invoice.customer,
      address: invoice.address,
      trn: invoice.trn,
      invoiceDetails: invoice.invoiceDetails,
      invoiceTerms: invoice.invoiceTerms,
      chequeInfo: invoice.chequeInfo,
      contractInfo: invoice.contractInfo,
      bankAccount: invoice.bankAccount || "",
      bankDetails: invoice.bankDetails || "",
      swiftCode: invoice.swiftCode || "",
      beneficiaryName: invoice.beneficiaryName || "",
      fobValue: invoice.fobValue || 0,
      freightCost: invoice.freightCost || 0,
      accountPrint: invoice.accountPrint || "Yes",
      vatPrint: invoice.vatPrint || "",
      printSign: invoice.printSign || "",
    })
  }

  async function handleSave() {
    if (!form.invoiceNo || !form.customer || !form.jobNo) {
      toast.error("Please fill in Invoice No, Customer, and Job No.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Invoice saved successfully")
      handleNew()
      mutate()
    } catch {
      toast.error("Failed to save invoice")
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate() {
    if (!selectedId) {
      toast.error("Select an invoice to update")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/invoices/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to update")
      toast.success("Invoice updated successfully")
      mutate()
    } catch {
      toast.error("Failed to update invoice")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedId) return
    try {
      const res = await fetch(`/api/invoices/${selectedId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Invoice deleted successfully")
      handleNew()
      mutate()
    } catch {
      toast.error("Failed to delete invoice")
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Invoice Voucher Entry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create and manage proforma and tax invoices
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleNew} variant="outline" className="gap-2 text-xs sm:text-sm">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !!selectedId}
            className="gap-2 text-xs sm:text-sm"
          >
            <Save className="size-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={saving || !selectedId}
            variant="secondary"
            className="gap-2 text-xs sm:text-sm"
          >
            <RefreshCw className="size-4" />
            <span className="hidden sm:inline">Update</span>
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            disabled={!selectedId}
            variant="destructive"
            className="gap-2 text-xs sm:text-sm"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
          <Button onClick={() => handlePrint()} variant="outline" className="gap-2 text-xs sm:text-sm">
            <Printer className="size-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
          {/* Invoice Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Invoice Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invoiceType">Invoice Type</Label>
                <Select
                  value={form.invoiceType}
                  onValueChange={(v) => updateField("invoiceType", v)}
                >
                  <SelectTrigger id="invoiceType" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PI">PI - Proforma Invoice</SelectItem>
                    <SelectItem value="SI">SI - Tax Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invoiceNo">Invoice No.</Label>
                <Input
                  id="invoiceNo"
                  value={form.invoiceNo}
                  onChange={(e) => updateField("invoiceNo", e.target.value)}
                  placeholder="e.g. PI-1225-00069"
                  className="font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) => updateField("invoiceDate", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="jobNo">Job No.</Label>
                <Input
                  id="jobNo"
                  value={form.jobNo}
                  onChange={(e) => updateField("jobNo", e.target.value)}
                  placeholder="e.g. AE-A0341"
                  className="font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="quoteNo">Quote No.</Label>
                <Input
                  id="quoteNo"
                  value={form.quoteNo}
                  onChange={(e) => updateField("quoteNo", e.target.value)}
                  placeholder="e.g. AE-23-00789"
                  className="font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="quoteDate">Quote Date</Label>
                <Input
                  id="quoteDate"
                  type="date"
                  value={form.quoteDate}
                  onChange={(e) => updateField("quoteDate", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => updateField("status", v)}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="revNo">Rev No.</Label>
                <Input
                  id="revNo"
                  value={form.revNo}
                  onChange={(e) => updateField("revNo", e.target.value)}
                  placeholder="e.g. R07"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => updateField("currency", v)}
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="QAR">QAR</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                    <SelectItem value="OMR">OMR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invValue">Inv Value</Label>
                <Input
                  id="invValue"
                  type="number"
                  value={form.invValue || ""}
                  onChange={(e) => updateField("invValue", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="weightKgs">Weight (Kgs)</Label>
                <Input
                  id="weightKgs"
                  type="number"
                  value={form.weightKgs || ""}
                  onChange={(e) => updateField("weightKgs", parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contractValue">Contract Value</Label>
                <Input
                  id="contractValue"
                  type="number"
                  value={form.contractValue || ""}
                  onChange={(e) => updateField("contractValue", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select
                  value={form.paymentType}
                  onValueChange={(v) => updateField("paymentType", v)}
                >
                  <SelectTrigger id="paymentType" className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="CDC/TT">CDC/TT</SelectItem>
                    <SelectItem value="LC">LC</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  value={form.customer}
                  onChange={(e) => updateField("customer", e.target.value)}
                  placeholder="Customer name"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Full address"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trn">TRN</Label>
                <Input
                  id="trn"
                  value={form.trn}
                  onChange={(e) => updateField("trn", e.target.value)}
                  placeholder="Tax Registration Number"
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invoiceDetails">Description</Label>
                <Textarea
                  id="invoiceDetails"
                  value={form.invoiceDetails}
                  onChange={(e) => updateField("invoiceDetails", e.target.value)}
                  placeholder="Invoice description..."
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invoiceTerms">Payment Terms</Label>
                <Textarea
                  id="invoiceTerms"
                  value={form.invoiceTerms}
                  onChange={(e) => updateField("invoiceTerms", e.target.value)}
                  placeholder="Payment terms..."
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="chequeInfo">Cheque Information</Label>
                <Textarea
                  id="chequeInfo"
                  value={form.chequeInfo}
                  onChange={(e) => updateField("chequeInfo", e.target.value)}
                  placeholder="Cheque payee details..."
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contractInfo">Contract Information</Label>
                <Textarea
                  id="contractInfo"
                  value={form.contractInfo}
                  onChange={(e) => updateField("contractInfo", e.target.value)}
                  placeholder="Contract value details..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Bank Details Card */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bankAccount">Bank Account</Label>
                <Select
                  value={form.bankAccount}
                  onValueChange={(val) => {
                    const selectedBank = bankAccounts.find((b: any) => b.bankName === val)
                    if (selectedBank) {
                      setForm({
                        ...form,
                        bankAccount: val,
                        bankDetails: `Account: ${selectedBank.accountNumber}\nIBAN: ${selectedBank.iban}\nSwift: ${selectedBank.swiftCode}`,
                        swiftCode: selectedBank.swiftCode,
                        beneficiaryName: selectedBank.beneficiaryName,
                      })
                    } else {
                      setForm({ ...form, bankAccount: val })
                    }
                  }}
                >
                  <SelectTrigger id="bankAccount" className="w-full">
                    <SelectValue placeholder="Select bank..." />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((bank: any) => (
                      <SelectItem key={bank._id} value={bank.bankName}>
                        {bank.bankName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="beneficiaryName">Beneficiary</Label>
                  <Input
                    id="beneficiaryName"
                    value={form.beneficiaryName}
                    onChange={(e) => setForm({ ...form, beneficiaryName: e.target.value })}
                    placeholder="Beneficiary name"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="swiftCode">Swift Code</Label>
                  <Input
                    id="swiftCode"
                    value={form.swiftCode}
                    onChange={(e) => setForm({ ...form, swiftCode: e.target.value })}
                    className="font-mono uppercase"
                    placeholder="Swift code"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bankDetails">Account Details (Display in Print)</Label>
                <Textarea
                  id="bankDetails"
                  value={form.bankDetails}
                  onChange={(e) => setForm({ ...form, bankDetails: e.target.value })}
                  placeholder="Account, IBAN, Swift..."
                  rows={3}
                  className="text-xs resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Value Details Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Value Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fobValue">FOB Value</Label>
                <Input
                  id="fobValue"
                  type="number"
                  value={form.fobValue || ""}
                  onChange={(e) => setForm({ ...form, fobValue: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="freightCost">Freight Cost</Label>
                <Input
                  id="freightCost"
                  type="number"
                  value={form.freightCost || ""}
                  onChange={(e) => setForm({ ...form, freightCost: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>

          {/* Print Options Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Print Options
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="accountPrint">Account Print</Label>
                <Select
                  value={form.accountPrint}
                  onValueChange={(v) => setForm({ ...form, accountPrint: v })}
                >
                  <SelectTrigger id="accountPrint" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="vatPrint">VAT Print</Label>
                <Select
                  value={form.vatPrint || ""}
                  onValueChange={(v) => setForm({ ...form, vatPrint: v })}
                >
                  <SelectTrigger id="vatPrint" className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <Label htmlFor="printSign">Print Sign</Label>
                <Select
                  value={form.printSign || ""}
                  onValueChange={(v) => setForm({ ...form, printSign: v })}
                >
                  <SelectTrigger id="printSign" className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col gap-3 sm:gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <FileText className="size-4" />
              Invoice Records
            </CardTitle>
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Job No.</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map(
                    (inv: {
                      _id: string
                      invoiceNo: string
                      invoiceType: string
                      invoiceDate: string
                      jobNo: string
                      customer: string
                      invValue: number
                      status: string
                      currency: string
                    }) => (
                      <TableRow
                        key={inv._id}
                        onClick={() =>
                          handleSelectInvoice(inv as typeof emptyInvoice & { _id: string })
                        }
                        className={`cursor-pointer ${selectedId === inv._id
                            ? "bg-primary/5 border-l-2 border-l-primary"
                            : ""
                          }`}
                      >
                        <TableCell className="font-mono font-medium">
                          {inv.invoiceNo}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              inv.invoiceType === "PI"
                                ? "border-chart-3/40 text-chart-3"
                                : "border-primary/40 text-primary"
                            }
                          >
                            {inv.invoiceType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(inv.invoiceDate).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell className="font-mono">
                          {inv.jobNo}
                        </TableCell>
                        <TableCell className="max-w-48 truncate">
                          {inv.customer}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(inv.invValue)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              inv.status === "Open"
                                ? "bg-warning/15 text-warning-foreground border-warning/30"
                                : "bg-success/15 text-success border-success/30"
                            }
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden Print Template */}
      <div className="hidden">
        <InvoicePrintTemplate ref={contentRef} data={form} />
      </div>
    </div>
  )
}
