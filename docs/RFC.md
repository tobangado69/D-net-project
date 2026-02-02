# RFC – Frontend Architecture & Technical Design

## 1. Overview & Technical Goals

### Vision
Build a maintainable, scalable React frontend for an internet data e-commerce platform. The architecture prioritizes **clarity over cleverness**, **explicit data flow**, and **ease of testing**. This prototype serves both as a functional delivery and a reference implementation for future production work.

### Technical Goals
1. **Clarity**: Every component has a single responsibility; data flow is visible
2. **Maintainability**: New engineers can understand the codebase within 1 hour
3. **Scalability**: Structure supports adding features (analytics, A/B tests, new payment methods) without refactoring
4. **Testability**: Components are pure and composable; easy to unit test
5. **Performance**: No unnecessary re-renders; lazy-load where sensible
6. **Developer Experience**: Fast feedback loop; clear error messages

---

## 2. Assumptions & Technical Trade-offs

### Assumptions

| Assumption | Reason |
|-----------|--------|
| **Single Page Application (SPA)** | Faster navigation between pages; suited for data-driven interactions |
| **Client-side routing (React Router)** | No server-side rendering needed for prototype; reduces backend complexity |
| **localStorage for session** | No backend session store; acceptable for demo (would use secure HttpOnly cookies in production) |
| **Mock API with json-server** | Rapid iteration without real backend dependency; easy to swap for real API |
| **Functional components + hooks** | Modern React patterns; cleaner than class components |
| **No state management library (Redux, Zustand)** | Simple app scope; Context API + custom hooks sufficient; Redux adds overhead for current size |
| **CSS-in-JS avoided; vanilla CSS/BEM** | Lower bundle overhead; easier for designers to review; better browser compatibility |
| **No TypeScript in prototype** | Faster initial development; focus on product validation; would be first addition in production |
| **Minimal third-party dependencies** | Reduce bundle size and attack surface; use native APIs where practical |

### Technical Trade-offs

| Decision | Trade-off |
|----------|-----------|
| **Context API instead of Redux** | Simpler setup, but context can trigger unnecessary re-renders at scale. Acceptable for <10 screens. Would switch to Zustand or Jotai if app grows. |
| **json-server mock API** | Real-looking API calls, but loses validation/permission checks. In production, backend enforces these rules. |
| **No TypeScript** | Faster iteration, but less safety. Would add TypeScript in production for type safety and IDE support. |
| **Client-side authentication** | Simple to implement, but vulnerable to token theft. Production must use HttpOnly cookies + CSRF tokens. |
| **BEM CSS naming** | Verbose, but avoids CSS-in-JS complexity. Scales well to multiple engineers. |

---

## 3. Frontend Architecture

### 3.1 Folder Structure

```
src/
├── index.js                    # Entry point
├── App.js                      # Root component with routing
├── pages/                      # Page-level components (route handlers)
│   ├── LoginPage.jsx
│   ├── CatalogPage.jsx
│   ├── PackageDetailPage.jsx
│   ├── AccountPage.jsx
│   ├── TransactionHistoryPage.jsx
│   ├── CheckoutPage.jsx
│   └── ConfirmationPage.jsx
├── components/                 # Reusable components (dumb/presentational)
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── FormInput.jsx
│   ├── Header.jsx
│   ├── Navigation.jsx
│   ├── PackageCard.jsx
│   ├── TransactionRow.jsx
│   └── LoadingSpinner.jsx
├── hooks/                      # Custom hooks (reusable logic)
│   ├── useAuth.js              # Login/logout, session management
│   ├── useFetch.js             # Generic data fetching with loading/error states
│   ├── useCustomer.js          # Customer data & actions
│   ├── usePackages.js          # Package catalog & filtering
│   └── useTransaction.js       # Purchase logic & transaction creation
├── services/                   # API layer (request/response handling)
│   ├── api.js                  # Base API client with json-server config
│   ├── authService.js          # Login/logout API calls
│   ├── customerService.js      # Customer CRUD
│   ├── packageService.js       # Package catalog
│   └── transactionService.js   # Transaction creation & history
├── context/                    # React Context for global state
│   └── AuthContext.js          # Logged-in customer ID, user info
├── styles/                     # Global CSS
│   ├── variables.css           # Colors, spacing, typography
│   ├── base.css                # Resets, global styles
│   └── layout.css              # Grid, flexbox utilities
├── utils/                      # Helper functions
│   ├── currency.js             # Format price to IDR
│   ├── date.js                 # Format dates consistently
│   ├── validation.js           # Form validation helpers
│   └── constants.js            # App-wide constants
├── public/                     # Static assets
│   └── index.html
└── package.json
```

### 3.2 Separation of Concerns

#### Pages
- **Responsibility**: Route handlers; orchestrate data fetching and layout
- **Example**: `CatalogPage` fetches all packages, passes them to `PackageCard` components, handles sort/filter state
- **Rule**: Pages call hooks for data; don't do API calls directly
- **Size**: 100–200 lines max; if larger, extract presentational logic to components

#### Components
- **Responsibility**: Receive props, render UI, emit events (onClick, onChange)
- **Example**: `PackageCard` receives a package object and an onClick handler; doesn't know about API
- **Rule**: Pure components; same props = same output
- **Size**: 30–80 lines max; if larger, break into smaller sub-components

#### Hooks
- **Responsibility**: Encapsulate stateful logic; manage side effects
- **Example**: `usePackages` fetches packages, filters them, handles loading/error states
- **Rule**: Can call other hooks; can manage state with useState
- **Size**: 50–150 lines; if larger, split into smaller hooks
- **Naming Convention**: Always start with `use`

#### Services
- **Responsibility**: API communication; request/response transformation
- **Example**: `packageService.getAll()` calls `GET /packages`, returns normalized data
- **Rule**: No UI code; pure functions; handles error formatting
- **Size**: 20–50 lines per function

#### Context
- **Responsibility**: Hold global state (e.g., current logged-in user, theme)
- **Rule**: Minimize context scope; avoid "God Context" with 10+ values
- **Pattern**: Separate contexts by domain (AuthContext, ThemeContext, NotificationContext)
- **Subscribers**: Only pages subscribe; components receive data via props

---

## 4. State Management Strategy

### 4.1 State Layers (By Scope)

#### Layer 1: Local Component State (`useState`)
- **Scope**: Single component
- **Example**: Form input values, modal open/close, dropdown active state
- **Rule**: Keep here unless multiple components need it

```javascript
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // ...
}
```

#### Layer 2: Custom Hook State
- **Scope**: Shared between multiple components; reusable logic
- **Example**: `useFetch` manages loading, error, data for any API call
- **Pattern**: Returns object with `{ data, loading, error, refetch }`

```javascript
function CatalogPage() {
  const { data: packages, loading, error } = usePackages();
  // Returned from hook; clean, predictable
}
```

#### Layer 3: Context State
- **Scope**: Global state needed by many pages
- **Example**: Logged-in customer ID, user profile
- **Rule**: Only authentication and user context at this level
- **Implementation**:
  ```javascript
  const AuthContext = createContext();
  
  export function AuthProvider({ children }) {
    const [customer, setCustomer] = useState(null);
    
    return (
      <AuthContext.Provider value={{ customer, setCustomer }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    return useContext(AuthContext);
  }
  ```

### 4.2 Data Fetching Approach

#### Pattern: `useFetch` Generic Hook

```javascript
// hooks/useFetch.js
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false; // Cleanup: prevent state updates after unmount
    };
  }, deps);

  return { data, loading, error };
}
```

#### Usage in Pages

```javascript
// pages/CatalogPage.jsx
import { usePackages } from '../hooks/usePackages';

export default function CatalogPage() {
  const { data: packages, loading, error } = usePackages();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="catalog">
      {packages.map(pkg => (
        <PackageCard key={pkg.id} package={pkg} />
      ))}
    </div>
  );
}
```

#### Custom Domain Hooks

```javascript
// hooks/usePackages.js
export function usePackages() {
  const [sort, setSort] = useState('price-asc');
  const [filter, setFilter] = useState('all');

  const { data, loading, error } = useFetch(async () => {
    const packages = await packageService.getAll();
    return applyFiltersAndSort(packages, filter, sort);
  }, [sort, filter]);

  return {
    packages: data || [],
    loading,
    error,
    setSort,
    setFilter,
  };
}
```

### 4.3 Mutation Handling (Create/Update)

For operations that change data (purchase, add phone line), use a simple async pattern:

```javascript
// hooks/useTransaction.js
export function useTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTransaction = async (customerId, phoneLineId, packageId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await transactionService.create({
        customerId,
        phoneLineId,
        packageId,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTransaction, loading, error };
}
```

---

## 5. Mock API Design

### 5.1 json-server Setup

```bash
npm install json-server
```

**Directory**: `api/db.json` (in project root)

**Start mock server**:
```bash
npx json-server --watch api/db.json --port 3001
```

**In app**: All API calls target `http://localhost:3001`

### 5.2 API Endpoints

#### Authentication
- `POST /auth/login` – Validate credentials (dummy; no real validation)
- `POST /auth/logout` – Clear session (client-side only)

#### Customers
- `GET /customers/:id` – Get customer profile
- `PATCH /customers/:id` – Update customer (name, email)
- `GET /customers/:id/phoneLines` – Get customer's phone lines

#### Phone Lines
- `GET /phoneLines` – Get all phone lines for logged-in customer
- `POST /phoneLines` – Add a new phone line
- `PATCH /phoneLines/:id` – Update phone line status

#### Packages
- `GET /packages` – Get all packages (catalog)
- `GET /packages/:id` – Get package details

#### Transactions
- `POST /transactions` – Create a purchase transaction
- `GET /transactions` – Get all transactions (filtered by customer)
- `GET /transactions/:id` – Get transaction details

### 5.3 db.json Structure

```json
{
  "customers": [
    {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "registrationDate": "2024-01-15T10:00:00Z",
      "status": "active"
    }
  ],
  "phoneLines": [
    {
      "id": 1,
      "customerId": 1,
      "phoneNumber": "+6287812345678",
      "status": "active",
      "lastPurchaseDate": "2025-12-20T14:00:00Z"
    }
  ],
  "packages": [
    {
      "id": 1,
      "name": "Starter 1GB",
      "dataQuota": 1,
      "validityDays": 7,
      "price": 9999,
      "category": "starter",
      "description": "Perfect for light browsing"
    },
    {
      "id": 2,
      "name": "Regular 5GB",
      "dataQuota": 5,
      "validityDays": 30,
      "price": 49999,
      "category": "regular",
      "description": "Best value for daily use"
    }
  ],
  "transactions": [
    {
      "id": "TXN001",
      "customerId": 1,
      "phoneLineId": 1,
      "packageId": 2,
      "amountPaid": 49999,
      "purchaseDate": "2025-12-20T14:30:00Z",
      "status": "completed"
    }
  ]
}
```

### 5.4 Example Request/Response

**Request**: Purchase a package
```
POST /transactions
Content-Type: application/json

{
  "customerId": 1,
  "phoneLineId": 1,
  "packageId": 2
}
```

**Response** (201 Created):
```json
{
  "id": "TXN002",
  "customerId": 1,
  "phoneLineId": 1,
  "packageId": 2,
  "amountPaid": 49999,
  "purchaseDate": "2025-12-20T15:00:00Z",
  "status": "completed"
}
```

### 5.5 Error Handling

json-server returns standard HTTP error codes. Our `api.js` client normalizes them:

```javascript
// services/api.js
export async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
```

---

## 6. Data Models & Relationships (Technical Perspective)

### Entity-Relationship Diagram (Conceptual)

```
┌──────────────┐
│   Customer   │
├──────────────┤
│ id (PK)      │
│ name         │
│ email        │
│ regDate      │
│ status       │
└──────────────┘
       │ 1
       │
       ├─────── 1..* ──────┐
       │                   │
       │                   ▼
       │            ┌──────────────────┐
       │            │   Phone Line     │
       │            ├──────────────────┤
       │            │ id (PK)          │
       │            │ customerId (FK)  │
       │            │ phoneNumber      │
       │            │ status           │
       │            │ lastPurchaseDate │
       │            └──────────────────┘
       │                   │ 1
       │                   │
       │                   ├─────── 1..* ──────┐
       │                   │                   │
       │                   │                   ▼
       ├─────────── 1..* ─────────────────▶ ┌──────────────────┐
       │                                    │   Transaction    │
       │                                    ├──────────────────┤
       │                                    │ id (PK)          │
       │                                    │ customerId (FK)  │
       │                                    │ phoneLineId (FK) │
       │                                    │ packageId        │
       │                                    │ amountPaid       │
       │                                    │ purchaseDate     │
       │                                    │ status           │
       │                                    └──────────────────┘
       │                                            │
       │                                            │ FK ref
       │                                            ▼
       │                                    ┌──────────────────┐
       │                                    │   Package        │
       │                                    ├──────────────────┤
       │                                    │ id (PK)          │
       │                                    │ name             │
       │                                    │ dataQuota        │
       │                                    │ validityDays     │
       │                                    │ price            │
       │                                    │ category         │
       │                                    └──────────────────┘
       │
       │
       └─────────── 1..* ──────────────────▶ ┌──────────────────┐
                                             │   Package        │
                                             ├──────────────────┤
                                             (referenced in txn)
                                             └──────────────────┘
```

### Frontend Data Representation

```javascript
// Customer object (from /customers/:id)
{
  id: 1,
  name: "Budi Santoso",
  email: "budi@example.com",
  registrationDate: "2024-01-15T10:00:00Z",
  status: "active"
}

// Package object (from /packages)
{
  id: 1,
  name: "Starter 1GB",
  dataQuota: 1,         // GB
  validityDays: 7,
  price: 9999,          // IDR
  category: "starter",
  description: "Perfect for light browsing"
}

// Transaction object (from /transactions/:id)
{
  id: "TXN001",
  customerId: 1,
  phoneLineId: 1,
  packageId: 2,         // Immutable reference to package at time of purchase
  amountPaid: 49999,    // IDR; locked in at purchase time
  purchaseDate: "2025-12-20T14:30:00Z",
  status: "completed"
}

// Phone Line object (from /phoneLines)
{
  id: 1,
  customerId: 1,
  phoneNumber: "+6287812345678",
  status: "active",
  lastPurchaseDate: "2025-12-20T14:00:00Z"
}
```

### Normalization Notes

- **Transactions store only `packageId`**, not full package object. This allows prices to change without affecting historical records.
- **Phone lines include `customerId` for relational integrity**. Frontend ensures no cross-customer access.
- **No nested populations** from json-server. Frontend joins data in memory if needed.

---

## 7. UI Architecture

### 7.1 Page-Level Components

#### LoginPage
```
LoginPage
├── Form
│   ├── FormInput (username)
│   ├── FormInput (password)
│   └── Button (Login)
├── ErrorAlert (on failure)
└── Redirect to /catalog (on success)
```

**Data**: Dummy login; no real validation  
**State**: username, password (local), loading, error  
**Actions**: Submit form → call `authService.login()` → store customerId in Context & localStorage

---

#### CatalogPage
```
CatalogPage
├── Header (breadcrumb: Home)
├── Filters & Sort Controls
│   ├── Select (sort by price/quota)
│   └── Chips (filter by validity)
├── Grid of PackageCard
│   └── PackageCard (repeating)
│       ├── Package details
│       └── Button (Select/Buy)
└── [On PackageCard click] → Navigate to PackageDetailPage
```

**Data**: All packages from `usePackages()`  
**State**: sort, filter (local), loading/error (from hook)  
**Actions**: Sort/filter updates trigger re-fetch; card click navigates to detail

---

#### PackageDetailPage
```
PackageDetailPage
├── Header (back button)
├── Package Details Card
│   ├── Name, quota, validity, price
│   ├── Description & benefits
│   └── Button (Choose This Plan)
├── Related Packages (similar plans)
└── [On button click] → Navigate to CheckoutPage (with packageId in state)
```

**Data**: Single package detail + related packages  
**State**: None (read-only view)  
**Actions**: Button click navigates to checkout with package context

---

#### CheckoutPage
```
CheckoutPage
├── Header (back button)
├── Order Summary
│   ├── Package name, price
│   └── Display total
├── Phone Line Selection
│   └── RadioGroup or Dropdown (customer's phone lines)
├── Confirmation Checkbox
├── Button (Confirm Purchase)
└── [On confirm] → Call transactionService.create() → Navigate to ConfirmationPage
```

**Data**: Selected package (from router state), customer's phone lines (from `useAuth()` + `useFetch()`)  
**State**: selectedPhoneLineId, confirmChecked (local)  
**Actions**: Validate phone line selection, submit transaction, handle errors

---

#### ConfirmationPage
```
ConfirmationPage
├── Success Icon/Message
├── Transaction Details
│   ├── Transaction ID
│   ├── Package purchased
│   ├── Phone line
│   ├── Amount
│   └── Purchase date
├── Button (View Transaction History)
└── Button (Browse More Packages)
```

**Data**: Transaction object (from API response)  
**State**: None (display-only)  
**Actions**: Navigation to /transactions or /catalog

---

#### AccountPage
```
AccountPage
├── Header (breadcrumb: My Account)
├── Customer Info Card
│   ├── Name, email, registration date
│   └── Button (Edit Profile) [future]
├── Phone Lines Section
│   ├── List of Phone Line Cards
│   │   ├── Number, status, last purchase
│   │   └── Button (Purchase for this line)
│   └── Button (Add Phone Line)
└── [On purchase button] → Navigate to /catalog with phone line context
```

**Data**: Customer profile + phone lines (from `useAuth()` + `useFetch()`)  
**State**: None (read-only for MVP)  
**Actions**: Add phone line (mock), purchase button pre-selects line

---

#### TransactionHistoryPage
```
TransactionHistoryPage
├── Header (breadcrumb: Transaction History)
├── Filters
│   └── Select (filter by phone line, date range)
├── Transaction Table/List
│   ├── TransactionRow (repeating)
│   │   ├── Date, package, phone line, amount, status
│   │   └── Button (Reorder)
│   └── Pagination [optional for MVP]
└── [On Reorder button] → Navigate to /checkout with package pre-selected
```

**Data**: Customer's transactions (from `useTransaction()`)  
**State**: filter (local)  
**Actions**: Reorder opens checkout with package pre-filled; reduces friction for repeat purchases

---

### 7.2 Reusable Components

#### Button.jsx
```javascript
export function Button({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  onClick,
  className = ''
}) {
  return (
    <button 
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

#### Card.jsx
```javascript
export function Card({ 
  title, 
  children, 
  footer = null, 
  className = '' 
}) {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card__header">{title}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
```

#### FormInput.jsx
```javascript
export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error = null,
  required = false
}) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`form-control ${error ? 'form-control--error' : ''}`}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
```

#### LoadingSpinner.jsx
```javascript
export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}
```

#### PackageCard.jsx
```javascript
export function PackageCard({ package: pkg, onClick }) {
  return (
    <Card className="package-card">
      <h3 className="package-card__name">{pkg.name}</h3>
      <p className="package-card__quota">
        <strong>{pkg.dataQuota}GB</strong> data
      </p>
      <p className="package-card__validity">
        Valid for {pkg.validityDays} days
      </p>
      <div className="package-card__price">
        Rp {formatCurrency(pkg.price)}
      </div>
      <Button 
        variant="primary" 
        onClick={() => onClick(pkg)}
        className="package-card__action"
      >
        Select
      </Button>
    </Card>
  );
}
```

#### ErrorAlert.jsx
```javascript
export function ErrorAlert({ message, onDismiss = () => {} }) {
  return (
    <div className="alert alert--error">
      <span className="alert__icon">⚠️</span>
      <div className="alert__content">
        <strong>Error</strong>
        <p>{message}</p>
      </div>
      <button 
        className="alert__close" 
        onClick={onDismiss}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
```

---

## 8. Error Handling & Loading States

### 8.1 API Error Handling

All API calls go through `services/api.js`:

```javascript
// services/api.js
async function request(method, endpoint, body = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (err) {
    // Re-throw with consistent error shape
    throw {
      code: err.code || 'UNKNOWN_ERROR',
      message: err.message || 'An unexpected error occurred',
      timestamp: new Date()
    };
  }
}
```

### 8.2 Hook-Level Error Handling

```javascript
// hooks/useFetch.js
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);  // Clear previous error
        const result = await fetchFn();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error };
}
```

### 8.3 Component-Level Error Display

```javascript
// pages/CatalogPage.jsx
export default function CatalogPage() {
  const { packages, loading, error } = usePackages();

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading packages..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorAlert 
        message="Failed to load packages. Please try again."
        onDismiss={() => window.location.reload()}
      />
    );
  }

  // Success state
  return (
    <div className="catalog">
      {packages.map(pkg => (
        <PackageCard key={pkg.id} package={pkg} />
      ))}
    </div>
  );
}
```

### 8.4 Form Validation Errors

```javascript
// pages/LoginPage.jsx
function LoginForm() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        required
      />
      <FormInput
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />
      {errors.submit && <ErrorAlert message={errors.submit} />}
      <Button variant="primary" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

---

## 9. Deliberate Simplifications

### What We're Skipping (and Why)

| Feature | Reason for Skipping |
|---------|-------------------|
| **Input validation library** | Native `required`, `type`, `pattern` attributes sufficient; form validation done with simple utility functions |
| **Routing library (React Router)** | For this prototype scope, inline conditional rendering is clearer than routing abstraction. In production, add React Router. |
| **State management library** | App is too small for Redux/Zustand overhead. Context API works. |
| **TypeScript** | Adds complexity; prototype focuses on product validation. Would add in production. |
| **Internationalization** | Only Indonesian/IDR for this prototype. |
| **Real authentication** | Dummy login with no validation. Production must use OAuth2/JWT + secure storage. |
| **Server-side rendering** | Not needed for this SPA. |
| **Testing framework** | Code is structured to be testable (pure functions, hooks, separated concerns), but tests not included in prototype. Would use Jest + React Testing Library in production. |
| **API caching/persistence** | Every call re-fetches data. In production, add React Query or SWR for intelligent caching. |
| **Analytics** | No event tracking. Production would integrate Segment/Mixpanel. |

---

## 10. Future Improvements for Production Readiness

### Phase 2: Stability & Scale
1. **Add TypeScript**: Type safety catches bugs; improves IDE support
2. **Unit Tests**: Jest + React Testing Library for core hooks and components
3. **API Caching**: React Query or SWR to avoid redundant API calls
4. **Logging & Monitoring**: Sentry for error tracking; datadog for performance
5. **Real Authentication**: OAuth2 + JWT; HttpOnly cookies for session; CSRF protection

### Phase 3: Feature Expansion
1. **Promos & Discounts**: Add promo code logic; update transaction schema
2. **Wallet / Credit System**: Balance tracking per customer
3. **Push Notifications**: Notify customers of successful purchases
4. **Recommendation Engine**: "Popular packages," "Your saved packages"
5. **Admin Dashboard**: Manage inventory, view analytics, customer support
6. **Payment Gateway**: Stripe, GCash, OVO, Gopay integration

### Phase 4: Performance & UX
1. **Code Splitting**: Lazy-load pages with React.lazy()
2. **Optimistic Updates**: UI updates before API confirmation (for faster feel)
3. **Infinite Scroll**: For transaction history at scale
4. **Offline Support**: Service workers for offline access to cached data
5. **Advanced Filtering**: Full-text search, price ranges, data quotas
6. **Dark Mode**: Implement with CSS variables and user preference detection

### Phase 5: DevOps & Operations
1. **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
2. **Environment Management**: Separate configs for dev/staging/production
3. **API Versioning**: Future-proof API contracts
4. **Database Backups**: Automated snapshots of transaction data
5. **Support Tools**: Customer ticket system, refund processing

### Phase 6: Accessibility & Compliance
1. **WCAG 2.1 AA Audit**: Comprehensive accessibility review
2. **Performance Budget**: Enforce <200KB bundle, <3s load time
3. **SEO**: Meta tags, Open Graph, structured data
4. **Privacy Compliance**: GDPR, data retention policies
5. **Security Audit**: Penetration testing, code security scanning

---

## Glossary

- **json-server**: Mock REST API server that reads/writes from a JSON file
- **Context API**: React's built-in global state management
- **Hook**: Reusable function that manages state and side effects in functional components
- **Service**: Pure function that handles API communication and data transformation
- **isMounted flag**: Prevents React state updates after component unmounts (avoids memory leaks)
- **Normalization**: Storing related data separately to avoid duplication
- **CRUD**: Create, Read, Update, Delete operations

---

**Document Version**: 1.0  
**Last Updated**: February 2, 2026  
**Status**: Ready for Engineering Review

---

## Appendix: Quick Start Commands

```bash
# Install dependencies
npm install

# Start mock API server (in separate terminal)
npx json-server --watch api/db.json --port 3001

# Start React dev server
npm start

# Login with any username/password (dummy auth)
# Example: username "demo", password "demo"

# Default test customer has ID 1
# Pre-seeded with 2 phone lines and 3 transactions
```
