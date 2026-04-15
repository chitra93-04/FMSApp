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
  FileText,
  Filter,
  Download,
  BarChart3,
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

export function InvoiceStatusReport() {
  const { data: invoices = [] } = useSWR("/api/invoices", fetcher)
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = useMemo(() => {
    return invoices.filter(
      (inv: {
        invoiceType: string
        status: string
        invoiceNo: string
        customer: string
        jobNo: string
      }) => {
        const matchType =
          typeFilter === "all" || inv.invoiceType === typeFilter
        const matchStatus =
          statusFilter === "all" || inv.status === statusFilter
        const matchSearch =
          !searchTerm ||
          inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.jobNo.toLowerCase().includes(searchTerm.toLowerCase())
        return matchType && matchStatus && matchSearch
      }
    )
  }, [invoices, typeFilter, statusFilter, searchTerm])

  const totalValue = filtered.reduce(
    (sum: number, inv: { invValue: number }) => sum + (inv.invValue || 0),
    0
  )
  const openCount = filtered.filter(
    (inv: { status: string }) => inv.status === "Open"
  ).length
  const closedCount = filtered.filter(
    (inv: { status: string }) => inv.status === "Closed"
  ).length

  const statusPie = [
    { name: "Open", value: openCount, color: "oklch(0.448 0.202 25.1)" },
    { name: "Closed", value: closedCount, color: "oklch(0.55 0.14 150)" },
  ]

  const typeBar = [
    {
      name: "PI",
      count: filtered.filter(
        (inv: { invoiceType: string }) => inv.invoiceType === "PI"
      ).length,
      value: filtered
        .filter((inv: { invoiceType: string }) => inv.invoiceType === "PI")
        .reduce(
          (sum: number, inv: { invValue: number }) =>
            sum + (inv.invValue || 0),
          0
        ),
    },
    {
      name: "SI",
      count: filtered.filter(
        (inv: { invoiceType: string }) => inv.invoiceType === "SI"
      ).length,
      value: filtered
        .filter((inv: { invoiceType: string }) => inv.invoiceType === "SI")
        .reduce(
          (sum: number, inv: { invValue: number }) =>
            sum + (inv.invValue || 0),
          0
        ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Invoice Status Report
          </h1>
          <p className="text-sm text-muted-foreground">
            Filter and analyze invoice data by type, status, and more
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="size-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <Filter className="size-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label>Invoice Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PI">Proforma Invoice (PI)</SelectItem>
                  <SelectItem value="SI">Tax Invoice (SI)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label>Search by Job No. / Customer Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job number, customer name, or invoice no..."
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
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Filtered Results</p>
              <p className="text-xl font-bold text-foreground">
                {filtered.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <BarChart3 className="size-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <FileText className="size-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Open / Closed
              </p>
              <p className="text-xl font-bold text-foreground">
                {openCount} / {closedCount}
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
              Invoice Value by Type
            </CardTitle>
            <CardDescription>PI vs SI comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeBar}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Total Value",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                  />
                  <Bar
                    dataKey="value"
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
            <CardTitle className="text-base">Status Distribution</CardTitle>
            <CardDescription>Open vs Closed invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPie.map((entry, index) => (
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
              {statusPie.map((entry) => (
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
            <FileText className="size-4" />
            Invoice Data ({filtered.length} records)
          </CardTitle>
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
                  <TableHead className="text-right">Contract</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No matching invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(
                    (inv: {
                      _id: string
                      invoiceNo: string
                      invoiceType: string
                      invoiceDate: string
                      jobNo: string
                      customer: string
                      currency: string
                      invValue: number
                      contractValue: number
                      status: string
                    }) => (
                      <TableRow key={inv._id}>
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
                            {inv.invoiceType === "PI"
                              ? "Proforma"
                              : "Tax"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(inv.invoiceDate).toLocaleDateString(
                            "en-GB"
                          )}
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
                        <TableCell className="text-right font-mono">
                          {formatCurrency(inv.contractValue)}
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
    </div>
  )
}
