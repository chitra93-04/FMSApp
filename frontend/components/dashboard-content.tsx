"use client"

import useSWR from "swr"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ScrollText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
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
  AreaChart,
  Area,
} from "recharts"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function DashboardContent() {
  const { data: invoices = [] } = useSWR("/api/invoices", fetcher)
  const { data: receipts = [] } = useSWR("/api/receipts", fetcher)

  const totalInvoiceValue = invoices.reduce(
    (sum: number, inv: { invValue: number }) => sum + (inv.invValue || 0),
    0
  )
  const totalReceived = receipts.reduce(
    (sum: number, rec: { receivedAmount: number }) =>
      sum + (rec.receivedAmount || 0),
    0
  )
  const openInvoices = invoices.filter(
    (inv: { status: string }) => inv.status === "Open"
  ).length
  const closedInvoices = invoices.filter(
    (inv: { status: string }) => inv.status === "Closed"
  ).length

  const piInvoices = invoices.filter(
    (inv: { invoiceType: string }) => inv.invoiceType === "PI"
  ).length
  const siInvoices = invoices.filter(
    (inv: { invoiceType: string }) => inv.invoiceType === "SI"
  ).length

  const pieData = [
    { name: "Open", value: openInvoices, color: "oklch(0.448 0.202 25.1)" },
    { name: "Closed", value: closedInvoices, color: "oklch(0.55 0.14 150)" },
  ]

  const typeData = [
    { name: "Proforma (PI)", value: piInvoices, color: "oklch(0.65 0.14 45)" },
    { name: "Tax (SI)", value: siInvoices, color: "oklch(0.448 0.202 25.1)" },
  ]

  const monthlyData = receipts.reduce(
    (
      acc: Record<string, number>,
      rec: { receiptDate: string; receivedAmount: number }
    ) => {
      const date = new Date(rec.receiptDate)
      const month = date.toLocaleString("en-US", {
        month: "short",
        year: "2-digit",
      })
      acc[month] = (acc[month] || 0) + (rec.receivedAmount || 0)
      return acc
    },
    {} as Record<string, number>
  )

  const barData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }))

  const collectionTrend = receipts
    .sort(
      (a: { receiptDate: string }, b: { receiptDate: string }) =>
        new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime()
    )
    .reduce(
      (
        acc: { date: string; cumulative: number }[],
        rec: { receiptDate: string; receivedAmount: number }
      ) => {
        const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 0
        acc.push({
          date: new Date(rec.receiptDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          cumulative: prev + (rec.receivedAmount || 0),
        })
        return acc
      },
      [] as { date: string; cumulative: number }[]
    )

  const recentInvoices = [...invoices]
    .sort(
      (a: { createdAt: string }, b: { createdAt: string }) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Financial overview and activity summary
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 sm:gap-4 pt-0">
            <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="size-5 sm:size-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Total Invoices
              </p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {invoices.length}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-success font-medium flex items-center gap-0.5 truncate">
                  <ArrowUpRight className="size-3 flex-shrink-0" />
                  {openInvoices} open
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 sm:gap-4 pt-0">
            <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <FileText className="size-5 sm:size-6 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Invoice Value
              </p>
              <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {formatCurrency(totalInvoiceValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 sm:gap-4 pt-0">
            <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-success/10">
              <ScrollText className="size-5 sm:size-6 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Total Receipts
              </p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {receipts.length}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-success font-medium flex items-center gap-0.5 truncate">
                  <ArrowUpRight className="size-3 flex-shrink-0" />
                  {
                    receipts.filter(
                      (r: { receiptType: string }) =>
                        r.receiptType === "Auto"
                    ).length
                  }{" "}
                  auto
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 sm:gap-4 pt-0">
            <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-chart-3/10">
              <TrendingUp className="size-5 sm:size-6 text-chart-3" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Amount Collected
              </p>
              <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {formatCurrency(totalReceived)}
              </p>
              <div className="flex items-center gap-1 text-xs">
                {totalInvoiceValue > 0 ? (
                  <span className="flex items-center gap-0.5 truncate">
                    {totalReceived >= totalInvoiceValue * 0.5 ? (
                      <ArrowUpRight className="size-3 text-success flex-shrink-0" />
                    ) : (
                      <ArrowDownRight className="size-3 text-destructive flex-shrink-0" />
                    )}
                    <span className="text-muted-foreground truncate">
                      {Math.round((totalReceived / totalInvoiceValue) * 100)}% collected
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">No data</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Collections Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Collections by Month</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Receipt amounts grouped by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
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

        {/* Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Invoice Status</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Open vs Closed distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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
              {pieData.map((entry) => (
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Cumulative Collection Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">
              Cumulative Collection Trend
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Running total of received amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={collectionTrend}>
                  <defs>
                    <linearGradient
                      id="colorCumulative"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="oklch(0.55 0.14 150)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.55 0.14 150)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Cumulative",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="oklch(0.55 0.14 150)"
                    fillOpacity={1}
                    fill="url(#colorCumulative)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Recent Invoices</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest invoice activity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {recentInvoices.map(
              (inv: {
                _id: string
                invoiceNo: string
                customer: string
                invValue: number
                status: string
                invoiceType: string
              }) => (
                <div
                  key={inv._id}
                  className="flex items-center justify-between rounded-lg border border-border p-2 sm:p-3 gap-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs sm:text-sm font-medium text-foreground font-mono truncate">
                      {inv.invoiceNo}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-24 sm:max-w-40">
                      {inv.customer}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      {formatCurrency(inv.invValue)}
                    </span>
                    <Badge
                      variant={
                        inv.status === "Open" ? "secondary" : "default"
                      }
                      className={cn(
                        "text-xs",
                        inv.status === "Open"
                          ? "bg-warning/15 text-warning-foreground border-warning/30"
                          : "bg-success/15 text-success border-success/30"
                      )}
                    >
                      {inv.status}
                    </Badge>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Type Distribution */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
        {typeData.map((item) => (
          <Card key={item.name}>
            <CardContent className="flex items-center gap-3 sm:gap-4 pt-0">
              <div
                className="flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `color-mix(in oklch, ${item.color} 15%, transparent)` }}
              >
                <FileText className="size-5 sm:size-6" style={{ color: item.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {item.name}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">invoices</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
