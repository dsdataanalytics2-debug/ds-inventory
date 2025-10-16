# Inventory Management Dashboard - Run Instructions

## 📋 Project Overview
Complete Inventory Management Dashboard with Python FastAPI backend and Next.js frontend, exactly as specified in the original README.md.

## 🏗️ Architecture
- **Backend**: FastAPI + SQLite + SQLAlchemy
- **Frontend**: Next.js + TypeScript + Tailwind CSS + Chart.js
- **Database**: SQLite with auto-updating stock calculations
- **APIs**: REST endpoints for add, sell, and summary operations

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ and npm installed

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

The backend will be running at: **http://localhost:8000**

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at: **http://localhost:3000**

## 🔧 API Endpoints

### POST /add
Add new stock to a product
```json
{
  "product_name": "Paracetamol",
  "quantity": 10,
  "date": "2025-10-15"
}
```

### POST /sell
Sell product units
```json
{
  "product_name": "Paracetamol",
  "quantity": 3,
  "date": "2025-10-15"
}
```

### GET /summary
Get all products overview

### GET /summary?start=2025-10-01&end=2025-10-31
Get date range summary

### GET /products
Get list of all product names for dropdown

## 📊 Features Implemented

### ✅ Backend Features
- **SQLite Database** with 3 tables (products, add_history, sell_history)
- **Auto Stock Calculation**: `available_stock = total_added - total_sold`
- **Overselling Prevention**: Validation to prevent selling more than available
- **Product Auto-Creation**: New products created automatically when adding stock
- **Date Range Filtering**: Summary data filtered by date range
- **CORS Enabled** for frontend integration

### ✅ Frontend Features
- **Responsive Design** with Tailwind CSS
- **Add Product Page**: Form to add inventory with validation
- **Sell Product Page**: Dropdown selection with stock validation
- **Dashboard**: Complete overview with charts and tables
- **Real-time Updates**: Stock automatically updates after add/sell operations
- **Date Filtering**: Filter dashboard data by date range
- **Interactive Charts**: Bar and pie charts using Chart.js
- **Error Handling**: Proper error messages and loading states

### ✅ Business Logic
- **Stock Management**: Automatic calculation and updates
- **Data Validation**: Prevents negative quantities and invalid operations  
- **History Tracking**: Complete audit trail of all add/sell operations
- **Visual Indicators**: Color-coded stock levels (red/yellow/green)

## 🗂️ Folder Structure
```
inventory-dashboard/
│
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── database.py          # SQLite connection setup
│   ├── models.py            # ORM models (Product, AddHistory, SellHistory)
│   ├── schemas.py           # Pydantic validation schemas
│   ├── crud.py              # Database operations
│   ├── requirements.txt     # Python dependencies
│   └── inventory.db         # SQLite database (auto-created)
│
├── frontend/
│   ├── pages/
│   │   ├── index.tsx        # Dashboard view
│   │   ├── add.tsx          # Add product form
│   │   ├── sell.tsx         # Sell product form
│   │   └── _app.tsx         # Next.js app configuration
│   ├── components/
│   │   ├── ProductTable.tsx # Product data table
│   │   ├── SummaryChart.tsx # Charts component
│   │   └── Navbar.tsx       # Navigation bar
│   ├── styles/
│   │   └── globals.css      # Global styles with Tailwind
│   ├── package.json         # Node.js dependencies
│   └── [config files]       # Next.js, TypeScript, Tailwind configs
│
└── README.md                # Original specifications
└── RUN_INSTRUCTIONS.md      # This file
```

## 🧪 Testing the Application

### Test Scenario 1: Add Products
1. Go to "Add Product" page
2. Add "Paracetamol", quantity: 100, today's date
3. Verify success message shows "Available stock: 100"
4. Check dashboard shows the new product

### Test Scenario 2: Sell Products  
1. Go to "Sell Product" page
2. Select "Paracetamol", quantity: 30
3. Verify success message shows "Remaining stock: 70"
4. Check dashboard shows updated stock

### Test Scenario 3: Overselling Prevention
1. Try to sell 80 units of "Paracetamol" (only 70 available)
2. Verify error message: "Insufficient stock"

### Test Scenario 4: Date Filtering
1. On dashboard, set date range
2. Click "Apply Filter"
3. Verify summary shows filtered data

## 🔍 Database Schema Verification
The SQLite database will be automatically created with these tables:
- **products**: id, name, total_added, total_sold, available_stock
- **add_history**: id, product_id, quantity, date  
- **sell_history**: id, product_id, quantity, date

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 in use**: Change port in `main.py` or kill existing process
- **Database errors**: Delete `inventory.db` to reset database
- **Import errors**: Ensure virtual environment is activated

### Frontend Issues  
- **Port 3000 in use**: Next.js will automatically suggest port 3001
- **Module not found**: Run `npm install` to install dependencies
- **API connection errors**: Ensure backend is running on port 8000

### CORS Issues
- Backend already configured for `http://localhost:3000`
- If using different frontend port, update CORS in `main.py`

## 📈 Production Deployment

### Backend Production
```bash
# Use production ASGI server
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Production
```bash
npm run build
npm start
```

## 🎯 Key Implementation Details

1. **Stock Auto-Update Logic**: Implemented exactly as specified in README
2. **Overselling Prevention**: Server-side validation prevents negative stock
3. **API Design**: RESTful endpoints following the exact specification
4. **Frontend Integration**: All pages call correct backend endpoints
5. **Chart Visualization**: Interactive charts showing inventory analytics
6. **Responsive Design**: Works on desktop, tablet, and mobile devices

## ✅ Verification Checklist

- ✅ FastAPI backend with SQLite
- ✅ Next.js frontend with Tailwind CSS  
- ✅ All 3 database tables created correctly
- ✅ POST /add endpoint with stock auto-update
- ✅ POST /sell endpoint with overselling prevention
- ✅ GET /summary endpoint
- ✅ GET /summary with date range filtering
- ✅ Frontend pages calling correct endpoints
- ✅ Dashboard showing Product | Total Added | Total Sold | Available Stock
- ✅ Charts rendering with Chart.js
- ✅ Date filters working correctly
- ✅ Complete folder structure as specified

The application is now fully functional and ready to use! 🚀
