import React, { useEffect, useState } from "react";
import "./CreateInvoice.css";

// Base URL for the backend API. In production (Render), set VITE_API_BASE_URL.
// Locally, it falls back to your existing backend at http://localhost:3009`.
// We cast `import.meta` to `any` to avoid type issues in this TSX file.
// This does not affect runtime behavior.
const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:3009";

// Type definition for customer objects returned from the API
type Customer = {
  _id: string;
  customerName: string;
  email?: string;
  phone?: string;
};

// Type definition for item objects with pricing information
type Item = {
  _id: string;
  name: string;
  rate: number;
  unit: string;
  isTaxable: boolean;
};

// Type definition for invoice line items (selected items with quantities)
type InvoiceItem = {
  item: string; // ID of the selected item
  quantity: number; // Quantity ordered for this item
};

// Extended type for display with item details
type InvoiceItemDisplay = InvoiceItem & {
  itemData?: Item;
  amount?: number;
};

function CreateInvoice() {
  // State to store the list of available customers fetched from the API
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState<string | null>(null);

  // State to store the list of available items (products) that can be added to an invoice
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);

  // State to track which customer was selected for the invoice
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  // State to manage the line items added to the invoice (starts with one empty row)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { item: "", quantity: 1 },
  ]);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Tax percentage (default 18%)
  const TAX_PERCENTAGE = 18;

  // ===========================
  // Fetch Customers & Items
  // ===========================
  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  // Fetch the list of customers from the backend API
  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      setCustomersError(null);
      const res = await fetch(`${API_BASE_URL}/customers`);
      if (!res.ok) {
        throw new Error("Failed to fetch customers");
      }
      const responseData = await res.json();
      setCustomers(responseData.data || []);
    } catch (err) {
      setCustomersError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching customers:", err);
    } finally {
      setCustomersLoading(false);
    }
  };

  // Fetch the list of items (products) from the backend API
  const fetchItems = async () => {
    try {
      setItemsLoading(true);
      setItemsError(null);
      const res = await fetch(`${API_BASE_URL}/items`);
      if (!res.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      setItemsError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching items:", err);
    } finally {
      setItemsLoading(false);
    }
  };

  // ===========================
  // Calculate Totals
  // ===========================
  const calculateTotals = () => {
    let subTotal = 0;
    let taxTotal = 0;

    invoiceItems.forEach((line) => {
      if (line.item) {
        const itemData = items.find((item) => item._id === line.item);
        if (itemData) {
          const amount = line.quantity * itemData.rate;
          subTotal += amount;
          if (itemData.isTaxable) {
            taxTotal += (amount * TAX_PERCENTAGE) / 100;
          }
        }
      }
    });

    const grandTotal = subTotal + taxTotal;

    return { subTotal, taxTotal, grandTotal };
  };

  const { subTotal, taxTotal, grandTotal } = calculateTotals();

  // ===========================
  // Handle Item Row Changes
  // ===========================
  const handleItemChange = (index: number, field: string, value: unknown) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index][field as keyof InvoiceItem] = value as never;
    setInvoiceItems(updatedItems);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  // Add a new empty row to the invoice items table
  const addNewItemRow = () => {
    setInvoiceItems([...invoiceItems, { item: "", quantity: 1 }]);
  };

  // Remove a row from the invoice items table by index
  const removeItemRow = (index: number) => {
    if (invoiceItems.length > 1) {
      const updatedItems = invoiceItems.filter((item, i) => i !== index);
      setInvoiceItems(updatedItems);
    }
  };

  // Get item details for a line item
  const getItemDetails = (itemId: string): Item | undefined => {
    return items.find((item) => item._id === itemId);
  };

  // Calculate amount for a line item
  const getLineAmount = (itemId: string, quantity: number): number => {
    const itemData = getItemDetails(itemId);
    return itemData ? itemData.rate * quantity : 0;
  };

  // ===========================
  // Submit Invoice
  // ===========================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate that at least one item is selected
    const validItems = invoiceItems.filter((line) => line.item && line.quantity > 0);
    if (validItems.length === 0) {
      setSubmitError("Please add at least one item to the invoice");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        customer: selectedCustomer,
        items: validItems,
      };

      const res = await fetch(`${API_BASE_URL}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setSelectedCustomer("");
          setInvoiceItems([{ item: "", quantity: 1 }]);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError(data.message || "Error creating invoice");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setSelectedCustomer("");
    setInvoiceItems([{ item: "", quantity: 1 }]);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  return (
    <div className="invoice-container">
      <div className="invoice-card">
        <div className="invoice-header">
          <h2 className="invoice-title">Create Invoice</h2>
          <p className="invoice-subtitle">Fill in the details to create a new invoice</p>
        </div>

        <form onSubmit={handleSubmit} onReset={handleReset}>
          {/* Customer Selection */}
          <div className="form-section">
            <label className="form-label">
              Customer <span className="required">*</span>
            </label>
            {customersLoading ? (
              <div className="loading-text">Loading customers...</div>
            ) : customersError ? (
              <div className="error-message">{customersError}</div>
            ) : (
              <select
                className="form-select"
                value={selectedCustomer}
                onChange={(e) => {
                  setSelectedCustomer(e.target.value);
                  setSubmitError(null);
                }}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerName}
                    {customer.phone ? ` - ${customer.phone}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Invoice Items Section */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="section-title">Invoice Items</h3>
              <button
                type="button"
                className="btn-add-item"
                onClick={addNewItemRow}
                disabled={isSubmitting}
              >
                <span className="btn-icon">+</span> Add Item
              </button>
            </div>

            {itemsLoading ? (
              <div className="loading-text">Loading items...</div>
            ) : itemsError ? (
              <div className="error-message">{itemsError}</div>
            ) : (
              <div className="items-table-wrapper">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th className="col-item">Item</th>
                      <th className="col-rate">Rate</th>
                      <th className="col-quantity">Quantity</th>
                      <th className="col-amount">Amount</th>
                      <th className="col-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((line, index) => {
                      const itemData = getItemDetails(line.item);
                      const lineAmount = getLineAmount(line.item, line.quantity);

                      return (
                        <tr key={index}>
                          <td className="col-item">
                            <select
                              className="form-select-sm"
                              value={line.item}
                              onChange={(e) =>
                                handleItemChange(index, "item", e.target.value)
                              }
                              required
                              disabled={isSubmitting}
                            >
                              <option value="">Select Item</option>
                              {items.map((item) => (
                                <option key={item._id} value={item._id}>
                                  {item.name} ({item.unit})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="col-rate">
                            {itemData ? (
                              <span className="rate-display">
                                ₹{itemData.rate.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="col-quantity">
                            <input
                              type="number"
                              className="form-input-sm"
                              min="1"
                              step="1"
                              value={line.quantity}
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                handleItemChange(index, "quantity", val);
                              }}
                              required
                              disabled={isSubmitting}
                            />
                          </td>
                          <td className="col-amount">
                            {line.item ? (
                              <span className="amount-display">
                                ₹{lineAmount.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="col-action">
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => removeItemRow(index)}
                              disabled={isSubmitting || invoiceItems.length === 1}
                              title="Remove item"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="totals-section">
            <div className="totals-row">
              <span className="totals-label">Subtotal:</span>
              <span className="totals-value">₹{subTotal.toLocaleString()}</span>
            </div>
            <div className="totals-row">
              <span className="totals-label">
                Tax ({TAX_PERCENTAGE}%):
              </span>
              <span className="totals-value">₹{taxTotal.toLocaleString()}</span>
            </div>
            <div className="totals-row totals-row-grand">
              <span className="totals-label">Grand Total:</span>
              <span className="totals-value-grand">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Error/Success Messages */}
          {submitError && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠</span>
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              Invoice created successfully!
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="reset"
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !selectedCustomer || grandTotal === 0}
            >
              {isSubmitting ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInvoice;
