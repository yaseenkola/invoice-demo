# Setup Instructions for Invoice Application

## Prerequisites

1. **Node.js** (LTS version recommended)
2. **MongoDB** running locally or MongoDB Atlas connection string

## Step 1: Install Dependencies

### Backend
```bash
npm install
```

### Frontend
```bash
cd items-ui
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory (or set environment variables):

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/credit_limit_range_demo
```

**Note:** If you're using MongoDB Atlas, replace the `MONGODB_URI` with your Atlas connection string.

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:

- **Windows:** MongoDB should be running as a service
- **Mac/Linux:** Run `mongod` in a terminal
- **Docker:** `docker run -d -p 27017:27017 mongo`

## Step 4: Seed the Database

Run the seed script to populate the database with sample data:

```bash
npm run seed:all
```

This will create:
- **8 sample customers** with names, emails, phones, and credit limits
- **25 sample items** with names, rates, units, and tax information

### Alternative: Seed individually
```bash
# Seed only customers
npm run seed

# Seed only items
npm run seed:items
```

## Step 5: Start the Backend Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

You should see:
```
✅ Connected to MongoDB at mongodb://127.0.0.1:27017/credit_limit_range_demo
🚀 Server is running on http://localhost:3000
```

## Step 6: Start the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd items-ui
npm run dev
```

The frontend will start on `http://localhost:5173`

## Step 7: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

## Sample Data

### Customers
The seed script creates 8 customers:
- Alpha Stores
- Beta Trading
- Gamma Retail
- Delta Mart
- Epsilon Supplies
- Zeta Wholesale
- Tech Solutions Inc
- Global Electronics

### Items
The seed script creates 25 items including:
- USB devices (keyboards, mice, cables, flash drives)
- Computer accessories (chargers, adapters, stands)
- Audio equipment (headphones, microphones)
- Networking equipment (cables, adapters)

## Troubleshooting

### "Failed to fetch" errors in frontend

1. **Check if backend is running:**
   ```bash
   # In the root directory
   npm run dev
   ```

2. **Check MongoDB connection:**
   - Ensure MongoDB is running
   - Verify the connection string in `.env` file
   - Check if the database name is correct

3. **Check if data exists:**
   ```bash
   # Re-run the seed script
   npm run seed:all
   ```

4. **Check CORS settings:**
   - Backend should allow `http://localhost:5173`
   - This is already configured in `src/server.js`

### MongoDB Connection Issues

If you see MongoDB connection errors:

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

2. **Verify connection string:**
   - Default: `mongodb://127.0.0.1:27017/credit_limit_range_demo`
   - For Atlas: Use your Atlas connection string

3. **Test MongoDB connection:**
   ```bash
   mongosh mongodb://127.0.0.1:27017/credit_limit_range_demo
   ```

## API Endpoints

### Customers
- `GET /customers` - Get all customers (with filtering, sorting, pagination)
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create a new customer
- `PUT /customers/:id` - Update a customer
- `DELETE /customers/:id` - Delete a customer

### Items
- `GET /items` - Get all items (with filtering, sorting, pagination)
- `GET /items/:id` - Get item by ID
- `POST /items` - Create a new item
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

### Invoices
- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get invoice by ID
- `POST /invoices` - Create a new invoice

## Creating an Invoice

1. Select a customer from the dropdown
2. Add items to the invoice:
   - Click "+ Add Item" to add more rows
   - Select an item from the dropdown
   - Enter the quantity
3. Review the totals (calculated automatically):
   - Subtotal
   - Tax (18% on taxable items)
   - Grand Total
4. Click "Create Invoice" to submit

## Need Help?

If you encounter any issues:
1. Check the console logs in both backend and frontend terminals
2. Verify MongoDB is running and accessible
3. Ensure all dependencies are installed
4. Make sure ports 3000 and 5173 are not in use by other applications
