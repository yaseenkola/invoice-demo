# Quick Start Guide

## 🚀 Get Everything Running in 3 Steps

### Step 1: Seed the Database
```bash
npm run seed:all
```

This creates:
- ✅ **8 Customers** (with names, emails, phones, credit limits)
- ✅ **25 Items** (with names, rates, units, tax info)

### Step 2: Start Backend
```bash
npm run dev
```
Server runs on: `http://localhost:3000`

### Step 3: Start Frontend
```bash
cd items-ui
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 📊 Sample Data Overview

### Customers (8 total)
| Customer Name | Email | Phone | Credit Limit |
|--------------|-------|-------|--------------|
| Alpha Stores | alpha@example.com | 111-111-1111 | ₹8,000 |
| Beta Trading | beta@example.com | 222-222-2222 | ₹12,000 |
| Gamma Retail | gamma@example.com | 333-333-3333 | ₹25,000 |
| Delta Mart | delta@example.com | 444-444-4444 | ₹50,000 |
| Epsilon Supplies | epsilon@example.com | 555-555-5555 | ₹100,000 |
| Zeta Wholesale | zeta@example.com | 666-666-6666 | ₹250,000 |
| Tech Solutions Inc | tech@example.com | 777-777-7777 | ₹150,000 |
| Global Electronics | global@example.com | 888-888-8888 | ₹300,000 |

### Items (25 total)
Sample items include:
- USB Keyboard (₹750)
- USB Mouse (₹350)
- USB Cable (₹150)
- USB Flash Drive 16GB (₹450)
- USB Flash Drive 32GB (₹650)
- USB Hub (₹850)
- Wireless Mouse (₹550)
- Wireless Keyboard (₹1,200)
- HDMI Cable (₹300)
- Ethernet Cable (₹200)
- Laptop Stand (₹1,500)
- Monitor Stand (₹2,000)
- Webcam (₹2,500)
- Microphone (₹1,800)
- Headphones (₹2,200)
- USB-C Adapter (₹800)
- Power Bank (₹1,500)
- Phone Charger (₹400)
- Laptop Charger (₹2,500)
- USB Extension Cable (₹250)
- USB 3.0 Cable (₹350)
- USB-C Cable (₹500)
- USB OTG Cable (₹200)
- USB Sound Card (₹600)
- USB WiFi Adapter (₹900)

All items are taxable (18% tax applies).

---

## ✅ Verify Everything Works

1. **Check Backend:**
   - Open: http://localhost:3000/customers
   - Should see JSON with customer data

2. **Check Frontend:**
   - Open: http://localhost:5173
   - Should see "Create Invoice" form
   - Customer dropdown should have 8 options
   - Item dropdown should have 25 options

3. **Create Test Invoice:**
   - Select a customer
   - Add 2-3 items with quantities
   - Verify totals calculate correctly
   - Click "Create Invoice"
   - Should see success message

---

## 🔧 Troubleshooting

**"Failed to fetch" error?**
1. Make sure MongoDB is running
2. Run `npm run seed:all` again
3. Check backend is running on port 3000
4. Check browser console for errors

**No data showing?**
- Run: `npm run seed:all`
- Check MongoDB connection in backend logs

**Port already in use?**
- Change PORT in `.env` file
- Update frontend API URLs if needed
