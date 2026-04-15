"use client"

import { useState, useEffect, useRef } from "react"
import useSWR from "swr"
import { useReactToPrint } from "react-to-print"
import { ReceiptPrintTemplate } from "./receipt-print-template"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  ScrollText,
  AlertCircle,
  CheckCircle2,
  Info,
  ChevronDown,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const emptyReceipt = {
  receiptType: "Auto",
  invoiceNo: "",
  receiptDate: new Date().toISOString().split("T")[0],
  receiptNo: "",
  jobNo: "",
  invoiceAmount: 0,
  invoiceStatus: "Open",
  receivedAmount: 0,
  receivedFrom: "",
  paymentType: "",
  accountantName: "",
  details: "",
  currency: "AED",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function ReceiptVoucherEntry() {
  const [form, setForm] = useState(emptyReceipt)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [amountInteracted, setAmountInteracted] = useState(false)

  const { data: receipts = [], mutate: mutateReceipts } = useSWR("/api/receipts", fetcher)
  const { data: invoices = [] } = useSWR("/api/invoices", fetcher)
  
  // Use SWR for existing receipts of the selected invoice
  const { data: existingReceipts = [], mutate: mutateByInvoice } = useSWR(
    form.invoiceNo ? `/api/receipts/by-invoice/${encodeURIComponent(form.invoiceNo)}` : null,
    fetcher
  )

  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: form.receiptNo ? `Receipt_${form.receiptNo}` : "Receipt",
  })

  // When invoice selected in Auto mode, auto-fill fields
  useEffect(() => {
    if (form.receiptType === "Auto" && form.invoiceNo) {
      const inv = invoices.find(
        (i: { invoiceNo: string }) => i.invoiceNo === form.invoiceNo
      )
      if (inv) {
        setForm((prev) => {
          // Only update if invoice values actually changed to prevent loops
          if (prev.invoiceNo === inv.invoiceNo && prev.jobNo === inv.jobNo && prev.invoiceAmount === inv.invValue) {
            return prev
          }
          return {
            ...prev,
            jobNo: inv.jobNo || "",
            invoiceAmount: inv.invValue || 0,
            invoiceStatus: inv.status || "Open",
            receivedFrom: inv.customer || "",
            currency: inv.currency || "AED",
          }
        })

        // If it's a new entry and we don't have a receipt number yet for this invoice
        if (isNew && (!form.receiptNo || !form.receiptNo.includes(inv.jobNo))) {
          const year = new Date().getFullYear()
          fetch(`/api/receipts/next-number?year=${year}&jobNo=${inv.jobNo}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.receiptNo) {
                setForm((prev) => ({ ...prev, receiptNo: data.receiptNo }))
              }
            })
        }
      }
    }
  }, [form.invoiceNo, form.receiptType, isNew, invoices.length, true])
  // Back to 4 elements, but I'll make sure to refresh the page in browser if needed.

  const isEditing = !!selectedId
  const showCurrentEntry = !isEditing || amountInteracted

  const totalAlreadyReceived = Array.isArray(existingReceipts) 
    ? existingReceipts.reduce((sum: number, r: any) => {
        if (isEditing && showCurrentEntry && r._id === selectedId) {
          return sum
        }
        return sum + (r.receivedAmount || 0)
      }, 0)
    : 0

  const currentEntryValue = showCurrentEntry ? (form.receivedAmount || 0) : 0
  const totalWithCurrent = totalAlreadyReceived + currentEntryValue
  const balance = form.invoiceAmount - totalWithCurrent
  const isOverpaid = totalWithCurrent > form.invoiceAmount && form.invoiceAmount > 0

  const filteredReceipts = receipts.filter(
    (rec: {
      receiptNo: string
      receivedFrom: string
      invoiceNo: string
      jobNo: string
    }) =>
      rec.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.receivedFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.jobNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleNew() {
    setForm({ ...emptyReceipt })
    setSelectedId(null)
    setIsNew(true)
    setAmountInteracted(false)
  }

  function handleSelectReceipt(
    receipt: typeof emptyReceipt & { _id: string }
  ) {
    setSelectedId(receipt._id)
    setIsNew(false)
    setAmountInteracted(false)
    setForm({
      receiptType: receipt.receiptType,
      invoiceNo: receipt.invoiceNo,
      receiptDate: receipt.receiptDate
        ? new Date(receipt.receiptDate).toISOString().split("T")[0]
        : "",
      receiptNo: receipt.receiptNo,
      jobNo: receipt.jobNo,
      invoiceAmount: receipt.invoiceAmount,
      invoiceStatus: receipt.invoiceStatus,
      receivedAmount: receipt.receivedAmount,
      receivedFrom: receipt.receivedFrom,
      paymentType: receipt.paymentType,
      accountantName: receipt.accountantName,
      details: receipt.details,
      currency: receipt.currency,
    })
  }

  async function handleSave() {
    if (!form.receiptNo || !form.receivedFrom || !form.invoiceNo) {
      toast.error("Please fill in Receipt No, Received From, and Invoice No.")
      return
    }

    if (isOverpaid) {
      toast.error("Total amount exceeds invoice value. Please recheck payments.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to save")
      const result = await res.json()
      
      if (result.invoiceStatus === "Closed") {
        toast.info("Invoice is now fully paid and Closed.")
      } else {
        toast.success("Partial payment recorded.")
      }
      
      const currentInvNo = form.invoiceNo
      handleNew()
      mutateReceipts()
      if (currentInvNo) {
        mutateByInvoice()
      }
    } catch {
      toast.error("Failed to save receipt")
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate() {
    if (!selectedId) {
      toast.error("Select a receipt to update")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/receipts/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to update")
      toast.success("Receipt updated successfully")
      mutateReceipts()
      mutateByInvoice()
    } catch {
      toast.error("Failed to update receipt")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedId) return
    try {
      const res = await fetch(`/api/receipts/${selectedId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Receipt deleted successfully")
      
      const deletedInvoiceNo = form.invoiceNo
      handleNew()
      mutateReceipts()
      if (deletedInvoiceNo) {
        mutateByInvoice()
      }
    } catch {
      toast.error("Failed to delete receipt")
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Receipt Voucher Entry
          </h1>
          <p className="text-sm text-muted-foreground">
            Record payments received against invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleNew} variant="outline" className="gap-2">
            <Plus className="size-4" />
            New
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !!selectedId}
            className="gap-2"
          >
            <Save className="size-4" />
            Save
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={saving || !selectedId}
            variant="secondary"
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Update
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            disabled={!selectedId}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button onClick={() => handlePrint()} variant="outline" className="gap-2">
            <Printer className="size-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Receipt Type & Invoice Reference */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Receipt Type
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <RadioGroup
                value={form.receiptType}
                onValueChange={(v) => {
                  updateField("receiptType", v)
                  if (v === "Manual") {
                    setForm((prev) => ({
                      ...prev,
                      receiptType: "Manual",
                      invoiceNo: "",
                      jobNo: "",
                      invoiceAmount: 0,
                      invoiceStatus: "Open",
                      receivedFrom: "",
                    }))
                  }
                }}
                className="flex items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Auto" id="auto" />
                  <Label htmlFor="auto" className="cursor-pointer">
                    Auto (Against Invoice)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Manual" id="manual" />
                  <Label htmlFor="manual" className="cursor-pointer">
                    Manual
                  </Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="invoiceNo">Invoice No.</Label>
                  {form.receiptType === "Auto" ? (
                    <Select
                      value={form.invoiceNo}
                      onValueChange={(v) => updateField("invoiceNo", v)}
                    >
                      <SelectTrigger id="invoiceNo" className="w-full font-mono">
                        <SelectValue placeholder="Select invoice..." />
                      </SelectTrigger>
                      <SelectContent>
                        {invoices.map(
                          (inv: { invoiceNo: string; customer: string }) => (
                            <SelectItem
                              key={inv.invoiceNo}
                              value={inv.invoiceNo}
                            >
                              {inv.invoiceNo} - {inv.customer}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="invoiceNo"
                      value={form.invoiceNo}
                      onChange={(e) =>
                        updateField("invoiceNo", e.target.value)
                      }
                      placeholder="Enter invoice no."
                      className="font-mono"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="receiptDate">Receipt Date</Label>
                  <Input
                    id="receiptDate"
                    type="date"
                    value={form.receiptDate}
                    onChange={(e) =>
                      updateField("receiptDate", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="receiptNo">Receipt No.</Label>
                    {existingReceipts.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-4 p-0 text-[10px] text-primary gap-1">
                            Existing <ChevronDown className="size-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {existingReceipts.map((r: any) => (
                            <DropdownMenuItem 
                              key={r._id} 
                              onClick={() => handleSelectReceipt(r)}
                              className="text-xs font-mono"
                            >
                              {r.receiptNo} ({formatCurrency(r.receivedAmount)})
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <Input
                    id="receiptNo"
                    value={form.receiptNo}
                    onChange={(e) =>
                      updateField("receiptNo", e.target.value)
                    }
                    placeholder="e.g. RV0098/2026-AE-..."
                    className="font-mono text-xs"
                    readOnly={form.receiptType === "Auto" && isNew}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="jobNo">Job No.</Label>
                  <Input
                    id="jobNo"
                    value={form.jobNo}
                    onChange={(e) => updateField("jobNo", e.target.value)}
                    placeholder="e.g. OM-A1215"
                    className="font-mono"
                    readOnly={form.receiptType === "Auto"}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="invoiceAmount">Invoice Amount</Label>
                  <Input
                    id="invoiceAmount"
                    type="number"
                    value={form.invoiceAmount || ""}
                    onChange={(e) =>
                      updateField(
                        "invoiceAmount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    readOnly={form.receiptType === "Auto"}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="invoiceStatus">Invoice Status</Label>
                  <Input
                    id="invoiceStatus"
                    value={form.invoiceStatus}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Voucher Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Receipt Voucher Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="receivedAmount">Received Amount</Label>
                <Input
                  id="receivedAmount"
                  type="number"
                  value={form.receivedAmount || ""}
                  onClick={() => setAmountInteracted(true)}
                  onChange={(e) => {
                    setAmountInteracted(true)
                    updateField(
                      "receivedAmount",
                      parseFloat(e.target.value) || 0
                    )
                  }}
                  placeholder="0.00"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="receivedFrom">Received From</Label>
                <Input
                  id="receivedFrom"
                  value={form.receivedFrom}
                  onChange={(e) =>
                    updateField("receivedFrom", e.target.value)
                  }
                  placeholder="Customer name"
                  readOnly={form.receiptType === "Auto"}
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
                    <SelectItem value="Bank Transfer">
                      Bank Transfer
                    </SelectItem>
                    <SelectItem value="CDC/TT">CDC/TT</SelectItem>
                    <SelectItem value="LC">LC</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="accountantName">Accountant Name</Label>
                <Select
                  value={form.accountantName}
                  onValueChange={(v) => updateField("accountantName", v)}
                >
                  <SelectTrigger id="accountantName" className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ahmed Al Rashid">
                      Ahmed Al Rashid
                    </SelectItem>
                    <SelectItem value="Fatima Hassan">
                      Fatima Hassan
                    </SelectItem>
                    <SelectItem value="Mohammed Khan">
                      Mohammed Khan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  value={form.details}
                  onChange={(e) => updateField("details", e.target.value)}
                  placeholder="Payment details, reference numbers..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Currency & Summary */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Currency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.currency}
                onValueChange={(v) => updateField("currency", v)}
              >
                <SelectTrigger className="w-full">
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
            </CardContent>
          </Card>

          {form.invoiceNo && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Invoice Amount
                  </span>
                  <span className="text-sm font-mono font-semibold text-foreground">
                    {formatCurrency(form.invoiceAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Already Received
                  </span>
                  <span className="text-sm font-mono font-semibold text-muted-foreground">
                    {formatCurrency(totalAlreadyReceived)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Current Entry
                  </span>
                  <span className="text-sm font-mono font-semibold text-success">
                    {formatCurrency(currentEntryValue)}
                  </span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Total Received
                  </span>
                  <span className={`text-sm font-mono font-bold ${isOverpaid ? "text-destructive" : "text-primary"}`}>
                    {formatCurrency(totalWithCurrent)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Remaining Balance
                  </span>
                  <span className={`text-sm font-mono font-bold ${balance < 0 ? "text-destructive" : "text-foreground"}`}>
                    {formatCurrency(balance)}
                  </span>
                </div>
                
                {isOverpaid && (
                  <Alert variant="destructive" className="mt-4 p-3 bg-destructive/10">
                    <AlertCircle className="size-4" />
                    <AlertTitle className="text-xs">Overpayment Alert</AlertTitle>
                    <AlertDescription className="text-[10px]">
                      The total received amount ({formatCurrency(totalWithCurrent)}) exceeds the invoice amount. Please recheck the entry.
                    </AlertDescription>
                  </Alert>
                )}

                {!isOverpaid && totalWithCurrent > 0 && totalWithCurrent === form.invoiceAmount && (
                  <Alert className="mt-4 p-3 border-success/50 bg-success/10 text-success">
                    <CheckCircle2 className="size-4" />
                    <AlertTitle className="text-xs">Fully Paid</AlertTitle>
                    <AlertDescription className="text-[10px]">
                      This payment will complete the invoice. Status will be changed to Closed.
                    </AlertDescription>
                  </Alert>
                )}

                {!isOverpaid && totalWithCurrent > 0 && totalWithCurrent < form.invoiceAmount && (
                  <Alert className="mt-4 p-3 border-primary/50 bg-primary/10 text-primary">
                    <Info className="size-4" />
                    <AlertTitle className="text-xs">Partial Payment</AlertTitle>
                    <AlertDescription className="text-[10px]">
                      This is a partial payment. Remaining balance: {formatCurrency(balance)}.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Receipt List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <ScrollText className="size-4" />
              Receipt Records
            </CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by receipt no, customer, invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Received From</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No receipts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceipts.map(
                    (rec: {
                      _id: string
                      receiptNo: string
                      receiptType: string
                      receiptDate: string
                      invoiceNo: string
                      receivedFrom: string
                      receivedAmount: number
                      paymentType: string
                      currency: string
                    }) => (
                      <TableRow
                        key={rec._id}
                        onClick={() =>
                          handleSelectReceipt(
                            rec as typeof emptyReceipt & { _id: string }
                          )
                        }
                        className={`cursor-pointer ${selectedId === rec._id
                          ? "bg-primary/5 border-l-2 border-l-primary"
                          : ""
                          }`}
                      >
                        <TableCell className="font-mono font-medium text-xs">
                          {rec.receiptNo}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              rec.receiptType === "Auto"
                                ? "border-primary/40 text-primary"
                                : "border-chart-3/40 text-chart-3"
                            }
                          >
                            {rec.receiptType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(rec.receiptDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {rec.invoiceNo}
                        </TableCell>
                        <TableCell className="max-w-48 truncate">
                          {rec.receivedFrom}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(rec.receivedAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {rec.paymentType}
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
              Are you sure you want to delete this receipt? This action cannot
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
        <ReceiptPrintTemplate ref={contentRef} data={form} />
      </div>
    </div>
  )
}
