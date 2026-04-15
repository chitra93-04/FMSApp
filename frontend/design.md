# Acero Finance - Design System & Backend Integration Guide

This document describes the complete design system, data models, API contracts, and frontend structure for the **Acero Finance** application. It is intended to serve as a definitive reference for a backend developer or another agent to build or replace the backend.

---

## 1. Application Overview

**Acero Finance** is an invoice and receipt management system for **Acero Structural Steel Manufacturing Co. LLC**, a UAE-based structural steel fabrication company. The application manages:

1. **Invoice Voucher Entry** - Create, read, update, delete invoices (Proforma and Tax)
2. **Receipt Voucher Entry** - Record payments received against invoices (Auto/Manual modes)
3. **Invoice Status Report** - Filter and search invoices by type, status, job, customer
4. **Receipt Report** - Filter and search receipts by type, payment method, any criteria
5. **Dashboard** - KPI cards, charts (bar, pie, area), and recent activity

**Tech Stack (Frontend):**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui component library
- Recharts (for charts)
- SWR (client-side data fetching and caching)
- Sonner (toast notifications)

---

## 2. Color System & Design Tokens

The design uses a **deep crimson red** primary accent on a clean **white/light gray** background with a **dark charcoal sidebar**. Colors are defined as CSS custom properties in `app/globals.css` using OKLCH color space.

### 2.1 Core Palette

| Token                   | OKLCH Value               | Approximate Hex | Usage                                    |
|-------------------------|---------------------------|-----------------|------------------------------------------|
| `--background`          | `oklch(0.97 0.001 0)`    | `#f5f5f5`       | Page background, light gray              |
| `--foreground`          | `oklch(0.15 0.005 0)`    | `#1a1a1a`       | Primary text color, near black           |
| `--card`                | `oklch(1 0 0)`            | `#ffffff`       | Card/panel backgrounds, pure white       |
| `--card-foreground`     | `oklch(0.15 0.005 0)`    | `#1a1a1a`       | Text on cards                            |
| `--primary`             | `oklch(0.35 0.15 25)`    | `#8b1a1a`       | Deep crimson red, brand primary          |
| `--primary-foreground`  | `oklch(0.99 0 0)`        | `#ffffff`       | White text on primary backgrounds        |
| `--secondary`           | `oklch(0.96 0.003 0)`    | `#f0f0f0`       | Light gray for secondary elements        |
| `--secondary-foreground`| `oklch(0.25 0.01 0)`     | `#333333`       | Dark text on secondary backgrounds       |
| `--muted`               | `oklch(0.96 0.002 0)`    | `#f0f0f0`       | Muted backgrounds (table headers, etc.)  |
| `--muted-foreground`    | `oklch(0.55 0.01 0)`     | `#808080`       | Secondary/label text                     |
| `--accent`              | `oklch(0.35 0.15 25)`    | `#8b1a1a`       | Same as primary (crimson)                |
| `--accent-foreground`   | `oklch(0.99 0 0)`        | `#ffffff`       | White text on accent                     |
| `--destructive`         | `oklch(0.45 0.2 25)`     | `#a52a2a`       | Destructive/delete actions (darker red)  |
| `--border`              | `oklch(0.92 0.003 0)`    | `#e5e5e5`       | Borders, dividers                        |
| `--input`               | `oklch(0.92 0.003 0)`    | `#e5e5e5`       | Input field borders                      |
| `--ring`                | `oklch(0.35 0.15 25)`    | `#8b1a1a`       | Focus ring color (crimson)               |

### 2.2 Sidebar Palette

| Token                         | OKLCH Value             | Approximate Hex | Usage                          |
|-------------------------------|-------------------------|-----------------|--------------------------------|
| `--sidebar`                   | `oklch(0.15 0.005 0)`  | `#1a1a1a`       | Sidebar background (dark)      |
| `--sidebar-foreground`        | `oklch(0.92 0.003 0)`  | `#e5e5e5`       | Sidebar text color             |
| `--sidebar-primary`           | `oklch(0.35 0.15 25)`  | `#8b1a1a`       | Active nav item background     |
| `--sidebar-primary-foreground`| `oklch(0.99 0 0)`      | `#ffffff`       | Active nav item text           |
| `--sidebar-accent`            | `oklch(0.22 0.008 0)`  | `#2a2a2a`       | Hover state background         |
| `--sidebar-accent-foreground` | `oklch(0.92 0.003 0)`  | `#e5e5e5`       | Hover state text               |
| `--sidebar-border`            | `oklch(0.25 0.008 0)`  | `#333333`       | Sidebar dividers               |

### 2.3 Semantic Tokens

| Token                    | OKLCH Value              | Approximate Hex | Usage                           |
|--------------------------|--------------------------|-----------------|--------------------------------|
| `--success`              | `oklch(0.55 0.14 150)`  | `#22a55b`       | Success states, closed status   |
| `--success-foreground`   | `oklch(0.99 0 0)`       | `#ffffff`       | Text on success bg              |
| `--warning`              | `oklch(0.75 0.12 75)`   | `#d4a017`       | Warning states, open status     |
| `--warning-foreground`   | `oklch(0.30 0.05 75)`   | `#5c4a0a`       | Text on warning bg              |

### 2.4 Chart Colors

| Token       | OKLCH Value              | Approximate Hex | Usage                          |
|-------------|--------------------------|-----------------|--------------------------------|
| `--chart-1` | `oklch(0.35 0.15 25)`   | `#8b1a1a`       | Primary chart (crimson)        |
| `--chart-2` | `oklch(0.55 0.14 150)`  | `#22a55b`       | Secondary chart (green)        |
| `--chart-3` | `oklch(0.60 0.12 250)`  | `#4a7fb5`       | Tertiary chart (blue)          |
| `--chart-4` | `oklch(0.65 0.14 45)`   | `#c47a2e`       | Quaternary chart (amber)       |
| `--chart-5` | `oklch(0.50 0.10 0)`    | `#6b4c4c`       | Quinary chart (muted brown)    |

### 2.5 Border Radius

`--radius: 0.5rem` (8px). Derived sizes: `--radius-sm: 4px`, `--radius-md: 6px`, `--radius-lg: 8px`, `--radius-xl: 12px`.

---

## 3. Typography

| Role          | Font Family      | Google Font      | CSS Variable     | Usage                            |
|---------------|------------------|------------------|------------------|----------------------------------|
| Sans (body)   | Inter             | `Inter`          | `--font-sans`    | All body text, labels, headings  |
| Mono (data)   | JetBrains Mono    | `JetBrains_Mono` | `--font-mono`    | Invoice numbers, amounts, codes  |

### Usage Patterns:
- **Page titles**: `text-2xl font-bold tracking-tight text-foreground`
- **Section descriptions**: `text-sm text-muted-foreground`
- **Card section headers**: `text-sm font-semibold text-muted-foreground uppercase tracking-wider`
- **Form labels**: `<Label>` component (shadcn/ui)
- **Mono data**: `font-mono` class on invoice numbers, receipt numbers, amounts, job numbers
- **KPI values**: `text-2xl font-bold text-foreground`
- **Small text**: `text-xs text-muted-foreground`

---

## 4. Layout Architecture

### 4.1 App Shell Structure

```
<div class="flex h-screen overflow-hidden bg-background">
  <!-- Sidebar (dark, collapsible) -->
  <aside class="w-64 | w-16 (collapsed)">
    Logo (/ACERO)
    Navigation Items
    Collapse Toggle
  </aside>

  <div class="flex flex-1 flex-col overflow-hidden">
    <!-- Top Header Bar -->
    <header class="h-14 border-b bg-card">
      App Title | Search | Theme Toggle | Notifications | User Avatar
    </header>

    <!-- Main Content (scrollable) -->
    <main class="flex-1 overflow-y-auto p-6 lg:p-8">
      {page content}
    </main>
  </div>
</div>
```

### 4.2 Sidebar Navigation Items

| Path                | Label            | Icon (Lucide)    |
|---------------------|------------------|------------------|
| `/`                 | Dashboard        | `LayoutDashboard` |
| `/invoices`         | Invoice Voucher  | `FileText`        |
| `/receipts`         | Receipt Voucher  | `Receipt`         |
| `/reports/invoices` | Invoice Report   | `BarChart3`       |
| `/reports/receipts` | Receipt Report   | `ClipboardList`   |

Active state: `bg-sidebar-primary text-sidebar-primary-foreground` (crimson bg, white text)
Inactive state: `text-sidebar-foreground/70 hover:bg-sidebar-accent`

### 4.3 Top Header Bar

- Left: App name "Acero Finance" + subtitle "ERP System"
- Right: Search input (hidden on mobile), Moon icon (theme toggle placeholder), Bell icon with red notification dot, User avatar circle (crimson bg with initials "SA")

---

## 5. Data Models (Mongoose Schemas)

### 5.1 Invoice Model

**Collection:** `invoices`
**File:** `lib/models/invoice.ts`

| Field           | Type     | Required | Default   | Constraints / Notes                       |
|-----------------|----------|----------|-----------|-------------------------------------------|
| `_id`           | ObjectId | auto     | auto      | MongoDB auto-generated                    |
| `invoiceType`   | String   | Yes      | `"PI"`    | Enum: `"PI"` (Proforma), `"SI"` (Tax)    |
| `invoiceNo`     | String   | Yes      | -         | Unique. Format: `PI-XXXX-XXXXX` or `SI-XXXX-XXXXX` |
| `invoiceDate`   | Date     | Yes      | `Date.now`| ISO date                                  |
| `jobNo`         | String   | Yes      | -         | Format: `AE-A0341`, `OM-A1215`, `QA-D0123` |
| `quoteNo`       | String   | No       | `""`      | Format: `AE-23-00789`                     |
| `quoteDate`     | Date     | No       | -         | ISO date                                  |
| `status`        | String   | Yes      | `"Open"`  | Enum: `"Open"`, `"Closed"`               |
| `revNo`         | String   | No       | `""`      | Revision number, e.g. `"R07"`             |
| `currency`      | String   | No       | `"AED"`   | One of: `AED`, `USD`, `EUR`, `QAR`, `SAR`, `OMR` |
| `invValue`      | Number   | No       | `0`       | Invoice monetary value                    |
| `weightKgs`     | Number   | No       | `0`       | Weight in kilograms                       |
| `contractValue` | Number   | No       | `0`       | Total contract value                      |
| `paymentType`   | String   | No       | `""`      | One of: `Cheque`, `Bank Transfer`, `CDC/TT`, `LC`, `Cash` |
| `customer`      | String   | Yes      | -         | Full company name                         |
| `address`       | String   | No       | `""`      | Full postal address                       |
| `trn`           | String   | No       | `""`      | Tax Registration Number (15-digit)        |
| `invoiceDetails`| String   | No       | `""`      | Description of goods/services             |
| `invoiceTerms`  | String   | No       | `""`      | Payment terms description                 |
| `chequeInfo`    | String   | No       | `""`      | Cheque payee information                  |
| `contractInfo`  | String   | No       | `""`      | Contract value summary line               |
| `bankAccount`   | String   | No       | `""`      | Bank name. Options: `Emirates NBD`, `Abu Dhabi Commercial Bank`, `HSBC Middle East`, `Qatar National Bank` |
| `bankDetails`   | String   | No       | `""`      | Account/IBAN/Swift details (multiline)    |
| `fobValue`      | Number   | No       | `0`       | FOB value                                 |
| `freightCost`   | Number   | No       | `0`       | Freight cost                              |
| `accountPrint`  | String   | No       | `"Yes"`   | Enum: `"Yes"`, `"No"`                    |
| `vatPrint`      | String   | No       | `""`      | Enum: `"Yes"`, `"No"`, or empty          |
| `printSign`     | String   | No       | `""`      | Enum: `"Yes"`, `"No"`, or empty          |
| `createdAt`     | Date     | auto     | auto      | Mongoose timestamps                       |
| `updatedAt`     | Date     | auto     | auto      | Mongoose timestamps                       |

### 5.2 Receipt Model

**Collection:** `receipts`
**File:** `lib/models/receipt.ts`

| Field            | Type     | Required | Default   | Constraints / Notes                          |
|------------------|----------|----------|-----------|----------------------------------------------|
| `_id`            | ObjectId | auto     | auto      | MongoDB auto-generated                       |
| `receiptType`    | String   | Yes      | `"Auto"`  | Enum: `"Auto"`, `"Manual"`                   |
| `invoiceNo`      | String   | Yes      | -         | References an invoice's `invoiceNo`          |
| `receiptDate`    | Date     | Yes      | `Date.now`| ISO date                                     |
| `receiptNo`      | String   | Yes      | -         | Unique. Format: `RV0098/2026-AE-OM-A1215`   |
| `jobNo`          | String   | No       | `""`      | Auto-filled from invoice in Auto mode        |
| `invoiceAmount`  | Number   | No       | `0`       | Auto-filled from invoice in Auto mode        |
| `invoiceStatus`  | String   | No       | `"Open"`  | Enum: `"Open"`, `"Closed"` - from invoice   |
| `receivedAmount` | Number   | Yes      | -         | Amount actually received                     |
| `receivedFrom`   | String   | Yes      | -         | Customer/company name                        |
| `paymentType`    | String   | No       | `""`      | One of: `Cheque`, `Bank Transfer`, `CDC/TT`, `LC`, `Cash` |
| `accountantName` | String   | No       | `""`      | Options: `Ahmed Al Rashid`, `Fatima Hassan`, `Mohammed Khan` |
| `details`        | String   | No       | `""`      | Free-text payment details                    |
| `currency`       | String   | No       | `"AED"`   | One of: `AED`, `USD`, `EUR`, `QAR`, `SAR`, `OMR` |
| `createdAt`      | Date     | auto     | auto      | Mongoose timestamps                          |
| `updatedAt`      | Date     | auto     | auto      | Mongoose timestamps                          |

---

## 6. API Contracts (REST Endpoints)

All endpoints are under `/api/`. All request/response bodies are JSON. Dates are ISO 8601 strings.

### 6.1 Invoices

#### `GET /api/invoices`
- **Description:** Fetch all invoices sorted by `createdAt` descending
- **Response:** `200` - Array of Invoice objects
- **Response Format:**
```json
[
  {
    "_id": "string",
    "invoiceType": "PI" | "SI",
    "invoiceNo": "string",
    "invoiceDate": "ISO date string",
    "jobNo": "string",
    "quoteNo": "string",
    "quoteDate": "ISO date string",
    "status": "Open" | "Closed",
    "revNo": "string",
    "currency": "string",
    "invValue": 0,
    "weightKgs": 0,
    "contractValue": 0,
    "paymentType": "string",
    "customer": "string",
    "address": "string",
    "trn": "string",
    "invoiceDetails": "string",
    "invoiceTerms": "string",
    "chequeInfo": "string",
    "contractInfo": "string",
    "bankAccount": "string",
    "bankDetails": "string",
    "fobValue": 0,
    "freightCost": 0,
    "accountPrint": "string",
    "vatPrint": "string",
    "printSign": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
]
```

#### `POST /api/invoices`
- **Description:** Create a new invoice
- **Request Body:** Invoice object (all fields except `_id`, `createdAt`, `updatedAt`)
- **Validation (frontend):** `invoiceNo`, `customer`, `jobNo` are required
- **Response:** `201` - Created Invoice object
- **Error:** `500` - `{ "error": "Failed to create invoice" }`

#### `GET /api/invoices/[id]`
- **Description:** Fetch a single invoice by `_id`
- **Response:** `200` - Invoice object
- **Error:** `404` - `{ "error": "Invoice not found" }`

#### `PUT /api/invoices/[id]`
- **Description:** Update an existing invoice
- **Request Body:** Partial Invoice object (fields to update)
- **Response:** `200` - Updated Invoice object
- **Error:** `404` - `{ "error": "Invoice not found" }`

#### `DELETE /api/invoices/[id]`
- **Description:** Delete an invoice by `_id`
- **Response:** `200` - `{ "success": true }`
- **Error:** `404` - `{ "error": "Invoice not found" }`

### 6.2 Receipts

#### `GET /api/receipts`
- **Description:** Fetch all receipts sorted by `createdAt` descending
- **Response:** `200` - Array of Receipt objects
- **Response Format:**
```json
[
  {
    "_id": "string",
    "receiptType": "Auto" | "Manual",
    "invoiceNo": "string",
    "receiptDate": "ISO date string",
    "receiptNo": "string",
    "jobNo": "string",
    "invoiceAmount": 0,
    "invoiceStatus": "Open" | "Closed",
    "receivedAmount": 0,
    "receivedFrom": "string",
    "paymentType": "string",
    "accountantName": "string",
    "details": "string",
    "currency": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
]
```

#### `POST /api/receipts`
- **Description:** Create a new receipt
- **Request Body:** Receipt object (all fields except `_id`, `createdAt`, `updatedAt`)
- **Validation (frontend):** `receiptNo`, `receivedFrom`, `invoiceNo` are required
- **Response:** `201` - Created Receipt object
- **Error:** `500` - `{ "error": "Failed to create receipt" }`

#### `GET /api/receipts/[id]`
- **Description:** Fetch a single receipt by `_id`
- **Response:** `200` - Receipt object
- **Error:** `404` - `{ "error": "Receipt not found" }`

#### `PUT /api/receipts/[id]`
- **Description:** Update an existing receipt
- **Request Body:** Partial Receipt object (fields to update)
- **Response:** `200` - Updated Receipt object
- **Error:** `404` - `{ "error": "Receipt not found" }`

#### `DELETE /api/receipts/[id]`
- **Description:** Delete a receipt by `_id`
- **Response:** `200` - `{ "success": true }`
- **Error:** `404` - `{ "error": "Receipt not found" }`

---

## 7. Frontend Page Structure

### 7.1 Dashboard (`/` -> `app/page.tsx`)

**Component:** `components/dashboard-content.tsx`

**Data Fetched:**
- `GET /api/invoices` (via SWR)
- `GET /api/receipts` (via SWR)

**KPI Cards (4 cards, grid):**
1. Total Invoices - count + open count indicator
2. Invoice Value - sum of all `invValue` (formatted as AED currency)
3. Total Receipts - count + auto-type count indicator
4. Amount Collected - sum of all `receivedAmount` + percentage collected

**Charts:**
- **Collections by Month** (Bar Chart) - receipts grouped by month, Y = `receivedAmount`
- **Invoice Status** (Donut/Pie) - Open vs Closed count
- **Cumulative Collection Trend** (Area Chart) - running total sorted by date
- **Recent Invoices** (Card list) - last 5 invoices with status badges

**Invoice Type Distribution** (2 summary cards) - PI count, SI count

### 7.2 Invoice Voucher Entry (`/invoices` -> `app/invoices/page.tsx`)

**Component:** `components/invoice-voucher-entry.tsx`

**Data Fetched:**
- `GET /api/invoices` (via SWR, with `mutate` for revalidation)

**Layout:** Two main sections:
1. **Form** (top) - 3-column grid on XL, 2-column on smaller
2. **Table** (bottom) - Searchable list of all invoices

**Form Sections:**

*Invoice Information Card:*
- Invoice Type (Select: PI/SI)
- Invoice No. (Input, font-mono)
- Invoice Date (Date input)
- Job No. (Input, font-mono)
- Quote No. (Input, font-mono)
- Quote Date (Date input)
- Status (Select: Open/Closed)
- Rev No. (Input)
- Currency (Select: AED/USD/EUR/QAR/SAR/OMR)
- Inv Value (Number input)
- Weight (Kgs) (Number input)
- Contract Value (Number input)
- Payment Type (Select: Cheque/Bank Transfer/CDC-TT/LC/Cash)

*Customer Details Card:*
- Customer (Input, full width)
- Address (Input, full width)
- TRN (Input, font-mono)

*Invoice Details Card:*
- Description (Textarea, 3 rows)
- Payment Terms (Textarea, 2 rows)
- Cheque Information (Textarea, 2 rows)
- Contract Information (Textarea, 2 rows)

*Bank Details Card (right column):*
- Bank Account (Select: Emirates NBD / ADCB / HSBC / QNB)
- Bank Details (Textarea, 4 rows)
- FOB Value (Number)
- Freight Cost (Number)

*Print Options Card (right column):*
- Account Print (Select: Yes/No)
- VAT Print (Select: Yes/No)
- Print Sign (Select: Yes/No)

**Action Buttons (top-right):**
- **New** (outline) - Resets form, clears selection
- **Save** (primary) - POST new invoice (disabled when editing existing)
- **Update** (secondary) - PUT update (disabled when no selection)
- **Delete** (destructive) - Opens confirm dialog, then DELETE
- **Print** (outline) - Placeholder for print functionality

**Table Columns:** Invoice No., Type, Date, Job No., Customer, Value, Status
- Clicking a row selects it and fills the form for editing
- Selected row has `bg-primary/5 border-l-2 border-l-primary`
- Search bar filters by invoice no, customer, or job no

### 7.3 Receipt Voucher Entry (`/receipts` -> `app/receipts/page.tsx`)

**Component:** `components/receipt-voucher-entry.tsx`

**Data Fetched:**
- `GET /api/receipts` (via SWR, with `mutate`)
- `GET /api/invoices` (via SWR - for Auto mode invoice selection)

**Key Behavior:**
- **Auto mode:** Selecting an invoice auto-fills: `jobNo`, `invoiceAmount`, `invoiceStatus`, `receivedFrom`, `currency` from the selected invoice
- **Manual mode:** All fields are freely editable; invoice selection is a text input instead of dropdown

**Form Sections:**

*Receipt Type Card:*
- Receipt Type (Radio: Auto/Manual)
- Invoice No. (Select dropdown in Auto mode / Text input in Manual mode)
- Receipt Date (Date input)
- Receipt No. (Input, font-mono)
- Job No. (Input, readonly in Auto mode)
- Invoice Amount (Number, readonly in Auto mode)
- Invoice Status (Input, always readonly, bg-muted)

*Receipt Voucher Details Card:*
- Received Amount (Number input)
- Received From (Input, readonly in Auto mode)
- Payment Type (Select: Cheque/Bank Transfer/CDC-TT/LC/Cash)
- Accountant Name (Select: Ahmed Al Rashid / Fatima Hassan / Mohammed Khan)
- Details (Textarea, 4 rows)

*Currency Card (right column):*
- Currency (Select: AED/USD/EUR/QAR/SAR/OMR)

*Payment Summary Card (right column, shown when invoice selected):*
- Invoice Amount (formatted)
- Received Amount (formatted, green/success color)
- Divider
- Balance (invoiceAmount - receivedAmount, bold)
- Card has `border-primary/20 bg-primary/5` styling

**Action Buttons:** Same as Invoice (New, Save, Update, Delete, Print)

**Table Columns:** Receipt No., Type, Date, Invoice No., Received From, Amount, Payment
- Same selection/search behavior as Invoice table

### 7.4 Invoice Status Report (`/reports/invoices` -> `app/reports/invoices/page.tsx`)

**Component:** `components/invoice-status-report.tsx`

**Data Fetched:**
- `GET /api/invoices` (via SWR)

**Filter Controls (Card):**
- Invoice Type (Select: All/PI/SI)
- Status (Select: All/Open/Closed)
- Search (Text input with Search icon, searches: jobNo, customer, invoiceNo)

**Summary Cards (3):**
1. Filtered Results - count of matching invoices
2. Total Value - sum of `invValue` for filtered results
3. Open / Closed - counts displayed as `X / Y`

**Charts (2-column grid):**
- Invoice Value by Type (Bar Chart) - PI vs SI value comparison
- Status Distribution (Donut/Pie) - Open vs Closed

**Data Table Columns:**
Invoice No., Type (Badge), Date, Job No., Customer, Currency, Value, Contract Value, Status (Badge)

- Type Badge: PI = `border-chart-3/40 text-chart-3` ("Proforma"), SI = `border-primary/40 text-primary` ("Tax")
- Status Badge: Open = `bg-warning/15 text-warning-foreground`, Closed = `bg-success/15 text-success`

**Export Button:** Placeholder for CSV/PDF export

### 7.5 Receipt Report (`/reports/receipts` -> `app/reports/receipts/page.tsx`)

**Component:** `components/receipt-report.tsx`

**Data Fetched:**
- `GET /api/receipts` (via SWR)

**Filter Controls (Card):**
- Receipt Type (Select: All/Auto/Manual)
- Search (Text input, searches: receiptNo, receivedFrom, invoiceNo, jobNo, paymentType, accountantName)

**Summary Cards (3):**
1. Total Receipts - count
2. Total Received - sum of `receivedAmount`
3. Auto / Manual - counts as `X / Y`

**Charts (2-column grid):**
- Amount by Payment Method (Bar Chart) - grouped by paymentType
- Receipt Type Split (Donut/Pie) - Auto vs Manual

**Data Table Columns:**
Receipt No., Type (Badge), Date, Invoice No., Job No., Received From, Payment (Badge), Accountant, Amount

---

## 8. Component Patterns & Styling

### 8.1 Card Pattern
All form sections and data displays use the `<Card>` component:
```
<Card>
  <CardHeader className="pb-4">
    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
      Section Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {content}
  </CardContent>
</Card>
```

### 8.2 Form Field Pattern
```
<div className="flex flex-col gap-1.5">
  <Label htmlFor="fieldId">Field Label</Label>
  <Input id="fieldId" value={} onChange={} />
</div>
```

### 8.3 Badge Styling

| Context       | Style Classes                                              |
|---------------|-----------------------------------------------------------|
| Open status   | `bg-warning/15 text-warning-foreground border-warning/30` |
| Closed status | `bg-success/15 text-success border-success/30`           |
| PI type       | `border-chart-3/40 text-chart-3` (outline variant)       |
| SI type       | `border-primary/40 text-primary` (outline variant)       |
| Auto receipt  | `border-primary/40 text-primary` (outline variant)       |
| Manual receipt| `border-chart-3/40 text-chart-3` (outline variant)       |
| Payment type  | `variant="secondary"` (default secondary badge)          |

### 8.4 Table Row Selection
Selected row: `bg-primary/5 border-l-2 border-l-primary`
Table header row: `bg-muted/50`

### 8.5 KPI Card Pattern
```
<Card>
  <CardContent className="flex items-center gap-4 pt-0">
    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-{color}/10">
      <Icon className="size-6 text-{color}" />
    </div>
    <div>
      <p className="text-xs font-medium text-muted-foreground">Label</p>
      <p className="text-2xl font-bold text-foreground">Value</p>
      <span className="text-xs">Sub info</span>
    </div>
  </CardContent>
</Card>
```

### 8.6 Chart Tooltip Style
```
contentStyle={{
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--card)",
}}
```

### 8.7 Delete Confirmation Dialog
All delete operations show a confirmation dialog:
```
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this {entity}? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 9. Data Fetching Pattern

All client components use **SWR** for data fetching:

```tsx
const fetcher = (url: string) => fetch(url).then((r) => r.json())
const { data: items = [], mutate } = useSWR("/api/endpoint", fetcher)
```

After mutations (POST/PUT/DELETE), `mutate()` is called to revalidate the cache.

Toast notifications (Sonner) are used for success/error feedback:
```tsx
toast.success("Item saved successfully")
toast.error("Failed to save item")
```

---

## 10. Currency Formatting

All monetary values use:
```tsx
new Intl.NumberFormat("en-AE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(value)
```

Dashboard KPI values use `minimumFractionDigits: 0` for cleaner display.

---

## 11. File Structure

```
app/
  layout.tsx                      # Root layout (Inter + JetBrains Mono fonts, Toaster)
  globals.css                     # Tailwind CSS v4 + design tokens
  page.tsx                        # Dashboard page
  invoices/page.tsx               # Invoice voucher entry page
  receipts/page.tsx               # Receipt voucher entry page
  reports/invoices/page.tsx       # Invoice status report page
  reports/receipts/page.tsx       # Receipt report page
  api/
    invoices/route.ts             # GET (list), POST (create)
    invoices/[id]/route.ts        # GET (by id), PUT (update), DELETE
    receipts/route.ts             # GET (list), POST (create)
    receipts/[id]/route.ts        # GET (by id), PUT (update), DELETE

components/
  app-sidebar.tsx                 # Collapsible sidebar navigation
  app-shell.tsx                   # Layout shell (sidebar + header + content)
  dashboard-content.tsx           # Dashboard KPIs + charts
  invoice-voucher-entry.tsx       # Invoice CRUD form + table
  receipt-voucher-entry.tsx       # Receipt CRUD form + table
  invoice-status-report.tsx       # Invoice report with filters + charts
  receipt-report.tsx              # Receipt report with filters + charts
  ui/                             # shadcn/ui primitives (button, card, input, etc.)

lib/
  mongodb.ts                      # MongoDB connection singleton
  utils.ts                        # cn() utility (clsx + tailwind-merge)
  seed-data.ts                    # In-memory fallback data + CRUD functions
  models/
    invoice.ts                    # Mongoose Invoice schema
    receipt.ts                    # Mongoose Receipt schema
```

---

## 12. Environment Variables

| Variable      | Required | Description                                      |
|---------------|----------|--------------------------------------------------|
| `MONGODB_URI` | No*      | MongoDB connection string (Atlas or self-hosted)  |

*When `MONGODB_URI` is not set, the application uses in-memory fallback data from `lib/seed-data.ts`. This is suitable for development/preview but data is not persisted across server restarts.

---

## 13. Backend Integration Notes

When replacing or building a separate backend:

1. **Maintain the same API contract** as described in Section 6. The frontend expects JSON responses with the exact field names listed in the models.
2. **The `_id` field** is used as the unique identifier. If using a different database, ensure `_id` is returned as a string in JSON responses.
3. **Sorting:** GET list endpoints return data sorted by `createdAt` descending (newest first).
4. **Timestamps:** `createdAt` and `updatedAt` should be auto-managed. Return them as ISO 8601 strings.
5. **Validation:** Frontend validates required fields before submission, but the backend should also validate.
6. **CORS:** If the backend is on a different origin, configure CORS headers to allow the frontend origin.
7. **Receipt Auto-fill:** In Auto mode, the frontend fetches invoice data from `/api/invoices` and fills receipt fields client-side. The backend does not need to handle this logic.
8. **No authentication** is currently implemented. Add auth middleware as needed.
9. **Unique constraints:** `invoiceNo` must be unique across invoices; `receiptNo` must be unique across receipts.
