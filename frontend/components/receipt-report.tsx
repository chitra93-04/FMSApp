"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  ScrollText,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function ReceiptReport() {
  const { data: receipts = [] } = useSWR("/api/receipts", fetcher)
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = useMemo(() => {
    return receipts.filter(
      (rec: {
        receiptType: string
        receiptNo: string
        receivedFrom: string
        invoiceNo: string
        jobNo: string
        paymentType: string
        accountantName: string
      }) => {
        const matchType =
          typeFilter === "all" || rec.receiptType === typeFilter
        const matchSearch =
          !searchTerm ||
          rec.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.receivedFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.jobNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.paymentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.accountantName.toLowerCase().includes(searchTerm.toLowerCase())
        return matchType && matchSearch
      }
    )
  }, [receipts, typeFilter, searchTerm])

  const totalReceived = filtered.reduce(
    (sum: number, rec: { receivedAmount: number }) =>
      sum + (rec.receivedAmount || 0),
    0
  )
  const autoCount = filtered.filter(
    (rec: { receiptType: string }) => rec.receiptType === "Auto"
  ).length
  const manualCount = filtered.filter(
    (rec: { receiptType: string }) => rec.receiptType === "Manual"
  ).length

  const typePie = [
    { name: "Auto", value: autoCount, color: "oklch(0.448 0.202 25.1)" },
    { name: "Manual", value: manualCount, color: "oklch(0.65 0.14 45)" },
  ]

  const paymentBreakdown = filtered.reduce(
    (
      acc: Record<string, number>,
      rec: { paymentType: string; receivedAmount: number }
    ) => {
      const type = rec.paymentType || "Other"
      acc[type] = (acc[type] || 0) + (rec.receivedAmount || 0)
      return acc
    },
    {} as Record<string, number>
  )

  const paymentBarData = Object.entries(paymentBreakdown).map(
    ([type, amount]) => ({
      type,
      amount,
    })
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Receipt Report
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Analyze receipts by type, payment method, and more
          </p>
        </div>
        <Button variant="outline" className="gap-2 text-xs sm:text-sm w-fit">
          <Download className="size-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <Filter className="size-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Receipt Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Auto">Auto (Against Invoice)</SelectItem>
                  <SelectItem value="Manual">Manual Entry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label>Search (any criteria)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search receipt no, customer, invoice, job, payment type, accountant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ScrollText className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Receipts</p>
              <p className="text-xl font-bold text-foreground">
                {filtered.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="size-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Received</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(totalReceived)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
              <TrendingUp className="size-5 text-chart-3" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Auto / Manual</p>
              <p className="text-xl font-bold text-foreground">
                {autoCount} / {manualCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Amount by Payment Method
            </CardTitle>
            <CardDescription>
              Breakdown of received amounts by payment type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentBarData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Amount",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="oklch(0.448 0.202 25.1)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receipt Type Split</CardTitle>
            <CardDescription>Auto vs Manual entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typePie}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {typePie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {typePie.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="size-4" />
            Receipt Data ({filtered.length} records)
          </CardTitle>
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
                  <TableHead>Job No.</TableHead>
                  <TableHead>Received From</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Accountant</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No matching receipts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(
                    (rec: {
                      _id: string
                      receiptNo: string
                      receiptType: string
                      receiptDate: string
                      invoiceNo: string
                      jobNo: string
                      receivedFrom: string
                      paymentType: string
                      accountantName: string
                      receivedAmount: number
                      currency: string
                    }) => (
                      <TableRow key={rec._id}>
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
                        <TableCell className="font-mono">
                          {rec.jobNo}
                        </TableCell>
                        <TableCell className="max-w-40 truncate">
                          {rec.receivedFrom}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {rec.paymentType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {rec.accountantName}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {formatCurrency(rec.receivedAmount)}
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
    </div>
  )
}
