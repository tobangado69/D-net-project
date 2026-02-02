# Product Requirement Document – Internet Data Package E-Commerce Prototype

## 1. Problem Statement & Product Goals

### Current State
Our internet data package e-commerce website has a dated UI/UX that creates friction in the customer journey. While the core functionality exists (login, browsing packages, transactions), the experience doesn't reflect modern standards. This results in:
- Low page-per-visit metrics
- High drop-off rates during package selection
- Confusion around package differentiation and pricing
- Limited visibility into transaction history

### Product Goals
1. **Increase Engagement**: Improve page-per-visit by 30% through clearer navigation and better package discovery
2. **Reduce Friction**: Simplify the purchase flow from login to transaction confirmation
3. **Build Foundation**: Create a modern, maintainable frontend that supports future features (promos, recommendations, analytics)
4. **Demonstrate Value**: Validate that UI/UX improvements drive measurable behavioral changes

### Out-of-Scope for This Prototype
- Payment gateway integration (mock transactions only)
- Analytics instrumentation
- A/B testing infrastructure
- Multi-language support
- Mobile app
- Admin panel or seller dashboard

---

## 2. Target Users & Key Assumptions

### Primary User: Individual Consumer
- **Age**: 18–45, smartphone-primary user
- **Technical Literacy**: Comfortable with online shopping
- **Goal**: Purchase mobile data packages quickly with clear pricing and plan details
- **Pain Points**: Confusion about data allowances, hidden fees, slow loading

### Secondary User: Account Holder (Managing Multiple Lines)
- **Goal**: Purchase packages for multiple phone numbers under one account
- **Behavior**: Likely to purchase multiple times per billing cycle
- **Need**: Quick access to transaction history and reorder capability

### Key Business Assumptions

| Assumption | Rationale |
|-----------|-----------|
| **Customers log in once per session** | Mobile-first users expect session persistence; we'll use localStorage for demo purposes |
| **Package catalog is static during this sprint** | No real-time inventory; packages don't change mid-session |
| **Customers can own multiple phone lines** | Common pattern in emerging markets; enables family/business use cases |
| **Transaction finality is immediate** | After confirmation, the purchase is complete (no pending states) |
| **Price display is always prominent** | Customers prioritize cost; all pricing is in the local currency (IDR) |
| **Purchase history is customer-specific** | Customers only see their own transactions (privacy by default) |

---

## 3. User Journeys & Core Flows

### Journey 1: New Customer Discovery & First Purchase

```
Login → Browse Packages → Compare Plans → Select Package 
→ Choose Target Phone Line → Confirm Purchase → Transaction Success Screen
```

**Key Touchpoints**:
- Login page establishes identity
- Catalog page shows all packages with immediate price visibility
- Package detail view provides data allocation, validity, and pricing clarity
- Customer selection step prevents purchasing for wrong number
- Confirmation screen provides transaction reference and next steps

---

### Journey 2: Repeat Customer Quick Reorder

```
Login → My Transactions → Reorder Previous Package 
→ Confirm Phone Line → Purchase Confirmation
```

**Key Touchpoints**:
- Transaction history shows past purchases with reorder buttons
- Reduces friction for common repeat purchases
- Maintains customer context

---

### Journey 3: Account Management & Browse Owned Lines

```
Login → My Account → View Phone Lines → Browse Packages for Line 
→ Purchase Process
```

**Key Touchpoints**:
- Account page shows all phone lines associated with customer
- Customer can switch context to purchase for different lines
- Clear ownership and association

---

## 4. Functional Requirements

### 4.1 Authentication & Customer Identity
- **Dummy Login**: Accept username + password (no validation)
- **Session Persistence**: Store customer ID in localStorage for demo
- **Logout**: Clear session and redirect to login page
- **Default User**: For testing, provide a pre-seeded customer with sample phone lines and transaction history

### 4.2 Customer Management
- **View My Account**: Display logged-in customer name, email, registration date
- **Manage Phone Lines**: View all phone numbers associated with customer
  - Display: Number, current status (active/inactive), last purchase date
  - Add Phone Line: Allow customer to add a new phone number (mock only)
- **Transaction History**: Display all past purchases with filters
  - Display: Date, package name, phone line, amount paid, transaction ID, status
  - Sort: Most recent first
  - Filter: By phone line, by date range (optional for MVP)

### 4.3 Package Catalog & Discovery
- **List All Packages**: Display all internet data packages in grid or card format
  - Show: Package name, data quota (e.g., "5 GB"), validity period, price, CTA button
  - Sort: By price (low to high, high to low), by data quota
  - Filter: By validity period (7 days, 30 days, etc.)
- **Package Details**: Expand view for selected package
  - Show: Data quota, validity period, speed class (if applicable), price, device compatibility info
  - Provide comparison to similar packages
  - Clear "Choose" or "Buy Now" CTA

### 4.4 Transaction Flow
- **Customer Selection**: Confirm which phone line is purchasing
  - Must not allow purchase without explicit phone line selection
  - Display customer's owned phone lines for selection
- **Price Display**: Show:
  - Package price in IDR
  - No hidden fees (transparency)
  - Total to be charged before confirmation
- **Confirmation Page**: 
  - Display order summary (package name, phone line, price)
  - Require explicit checkbox or button confirmation
  - On success: Transaction ID, timestamp, status ("Completed")
  - Provide option to view transaction in history or browse more packages

### 4.5 Core CRUD Operations
| Entity | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| **Customer** | N/A (pre-seeded) | ✓ | Limited (name, email) | N/A |
| **Phone Line** | ✓ Add line | ✓ List | ✓ Update status | N/A |
| **Package** | N/A (static catalog) | ✓ List & detail | N/A | N/A |
| **Transaction** | ✓ Create on purchase | ✓ List & detail | N/A | N/A |

---

## 5. Non-Functional Requirements

### 5.1 User Experience (UX)
- **Clarity**: All information (price, data quota, validity) must be immediately scannable
- **Cognitive Load**: No more than 3 primary CTAs on any screen
- **Feedback**: Immediate confirmation for actions (buttons change state, loading indicators appear)
- **Accessibility**: 
  - WCAG 2.1 AA compliance (color contrast, keyboard navigation, semantic HTML)
  - Form labels properly associated with inputs
  - Error messages are specific and actionable
- **Mobile-First**: Responsive design works on 320px+ screens
- **Consistency**: Unified color palette, typography, spacing, button styles

### 5.2 Performance
- **Page Load**: Catalog page loads in <3 seconds (including mock API call)
- **Interaction Response**: UI responds to user action within 100ms (perceived responsiveness)
- **Bundle Size**: Keep core JS bundle under 250KB (gzip)
- **API Calls**: Batch requests where sensible; avoid waterfalls
- **No Blocking Renders**: Loading states prevent janky UX

### 5.3 Maintainability & Code Quality
- **Component Reusability**: Generic, well-composed components (Button, Card, Modal, Form)
- **Naming Conventions**: Clear, descriptive names for files, functions, and variables
- **Documentation**: README with setup instructions, folder structure explanation, API contract
- **Testing Mindset**: Write code that's easily testable (pure functions, separated concerns)
- **No Dead Code**: Remove commented code before delivery

---

## 6. High-Level Data Entities & Relationships (Product Perspective)

### Customer
- **Attributes**: ID, Name, Email, Registration Date, Status (active/inactive)
- **Relationships**: Owns many Phone Lines; Creates many Transactions

### Phone Line
- **Attributes**: ID, Phone Number, Status (active/inactive), Associated Customer ID, Last Purchase Date
- **Relationships**: Belongs to one Customer; Associated with many Transactions

### Internet Data Package
- **Attributes**: ID, Name, Data Quota (GB), Validity Period (days), Price (IDR), Category
- **Relationships**: Referenced by many Transactions (immutable)

### Transaction
- **Attributes**: ID, Customer ID, Phone Line ID, Package ID (immutable snapshot), Amount Paid (IDR), Purchase Date, Status (completed)
- **Relationships**: Belongs to one Customer; Belongs to one Phone Line; References one Package

### Data Integrity Rules
- A customer must exist before creating a phone line
- A transaction must reference a valid phone line owned by the customer
- Prices are immutable once a transaction is recorded
- Transactions are permanent and non-deletable

---

## 7. Out-of-Scope Items

### Explicitly NOT included in this prototype:
1. **Real Payment Processing**: No integration with payment gateways (Stripe, GCash, etc.)
2. **User Registration**: Only dummy login; no sign-up flow
3. **Email Notifications**: No transactional emails or notifications
4. **Referral or Loyalty Programs**: No promotional logic
5. **Real-Time Inventory**: Packages never run out; no stock management
6. **Multi-Currency Support**: Only IDR for simplicity
7. **Search Functionality**: Only sorting and filtering; no full-text search
8. **Analytics Tracking**: No event logging or heatmaps
9. **Admin Dashboard**: No way to manage customers or packages from UI
10. **Subscription Auto-Renewal**: One-time purchases only

---

## 8. Success Metrics

### Primary Metrics (Post-Launch)
1. **Page-Per-Visit**: Increase from baseline to 3.5+ pages per session
2. **Conversion Rate**: % of sessions that result in a completed transaction
3. **Time to Purchase**: Average seconds from login to transaction confirmation
4. **Task Completion Rate**: % of users who successfully complete a purchase without errors

### Secondary Metrics
1. **Drop-Off Points**: Where users abandon the flow (by page)
2. **Repeat Purchase Rate**: % of customers returning within 7 days
3. **Error Rate**: Frequency of validation errors, API failures, or UX friction
4. **Session Duration**: Time spent browsing vs. purchasing

### Prototype Success Criteria
1. **Usability**: Five test users can complete a purchase with zero guidance
2. **Code Quality**: Codebase is modular, readable, and extensible
3. **No Critical Bugs**: Core flows (login → purchase) work without errors
4. **Performance**: Pages load in <3 seconds on 4G connection
5. **Documentation**: Clear README and architectural decisions recorded

---

## Appendix: Terminology

- **Phone Line**: A mobile number associated with a customer; used as the target for data package purchases
- **Package**: A pre-defined internet data plan (e.g., "5GB/30 days")
- **Transaction**: A completed purchase of a package for a phone line
- **Session**: A customer's continuous interaction with the app between login and logout
- **Validity Period**: The duration (in days) that the purchased data is usable

---

**Document Version**: 1.0  
**Last Updated**: February 2, 2026  
**Status**: Approved for Development
