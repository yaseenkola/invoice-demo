# Customers using Credit Limit Range (MongoDB + Express)

Beginner-friendly API to **filter customers by `creditLimit` range** using MongoDB operators:

- `$gte` (greater than or equal)
- `$lte` (less than or equal)
- `$gt` / `$lt` (not needed here, but same idea)

## Requirements

- Node.js (LTS recommended)
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

1) Install dependencies:

```bash
npm install
```

2) Configure environment variables (optional)

This workspace blocks `.env` files, so use `env.sample.txt` as a reference.

- If you want, set environment variables in your shell:

```powershell
$env:PORT="3000"
$env:MONGODB_URI="mongodb://127.0.0.1:27017/credit_limit_range_demo"
```

## Seed sample data

```bash
npm run seed
```

## Run the server

### Dev (auto-reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

Server runs at `http://localhost:3000`

## API

### GET `/customers` (Filter by credit limit range)

Use query parameters:

- `minCredit` → minimum credit limit (inclusive)
- `maxCredit` → maximum credit limit (inclusive)

#### Examples

- Between 10,000 and 50,000:

`GET /customers?minCredit=10000&maxCredit=50000`

- Greater than or equal to 25,000:

`GET /customers?minCredit=25000`

- Less than or equal to 1,00,000:

`GET /customers?maxCredit=100000`

### POST `/customers` (Create a customer - helper endpoint)

```json
{
  "customerNumber": 99,
  "customerName": "My Customer",
  "phone": "999-999",
  "creditLimit": 45000
}
```

