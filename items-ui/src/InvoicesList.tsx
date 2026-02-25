import { useEffect, useState } from "react";
import "./InvoicesList.css";

// Base URL for the backend API. In production (Render), set VITE_API_BASE_URL.
// Locally, it falls back to your existing backend at http://localhost:3009.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3009";

// Type definitions
type Customer = {
  _id: string;
  customerName: string;
  email?: string;
  phone?: string;
};

type Item = {
  _id: string;
  name: string;
  rate: number;
  isTaxable?: boolean;
};

type InvoiceItem = {
  item: Item | string;
  quantity: number;
  rate: number;
  amount: number;
};

type Invoice = {
  _id: string;
  customer: Customer | string;
  items: InvoiceItem[];
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/invoices`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch invoices");
      }
      
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCustomerName = (customer: Customer | string): string => {
    if (typeof customer === "string") return "Unknown Customer";
    return customer.customerName || "Unknown Customer";
  };

  const getItemName = (item: Item | string): string => {
    if (typeof item === "string") return "Unknown Item";
    return item.name || "Unknown Item";
  };

  const getStatusLabel = (status?: string) => {
    const value = status || "draft";
    if (value === "draft") return "Created";
    if (value === "sent") return "Sent";
    if (value === "paid") return "Paid";
    return value;
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDetails = () => {
    setSelectedInvoice(null);
  };

  if (loading) {
    return (
      <div className="invoices-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invoices-container">
        <div className="error-state">
          <span className="error-icon">⚠</span>
          <p>{error}</p>
          <button onClick={fetchInvoices} className="btn-retry">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="invoices-container">
      <div className="invoices-header">
        <h2 className="invoices-title">All Invoices</h2>
        <button onClick={fetchInvoices} className="btn-refresh" title="Refresh">
          ↻ Refresh
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📄</span>
          <p>No invoices found</p>
          <p className="empty-subtitle">Create your first invoice to get started</p>
        </div>
      ) : (
        <>
          <div className="invoices-stats">
            <div className="stat-card">
              <span className="stat-label">Total Invoices</span>
              <span className="stat-value">{invoices.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">
                ₹{invoices.reduce((sum, inv) => sum + inv.grandTotal, 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="invoices-grid">
            {invoices.map((invoice) => (
              <div key={invoice._id} className="invoice-card">
                <div className="invoice-card-header">
                  <div className="invoice-id">
                    <span className="invoice-id-label">Invoice #</span>
                    <span className="invoice-id-value">
                      {invoice._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <span className={`invoice-status invoice-status-${invoice.status || "draft"}`}>
                    {getStatusLabel(invoice.status)}
                  </span>
                </div>

                <div className="invoice-card-body">
                  <div className="invoice-customer">
                    <span className="invoice-label">Customer:</span>
                    <span className="invoice-value">
                      {getCustomerName(invoice.customer)}
                    </span>
                  </div>

                  <div className="invoice-items-count">
                    <span className="invoice-label">Items:</span>
                    <span className="invoice-value">{invoice.items.length}</span>
                  </div>

                  <div className="invoice-date">
                    <span className="invoice-label">Date:</span>
                    <span className="invoice-value">{formatDate(invoice.createdAt)}</span>
                  </div>

                  <div className="invoice-totals">
                    <div className="invoice-total-row">
                      <span>Subtotal:</span>
                      <span>₹{invoice.subTotal.toLocaleString()}</span>
                    </div>
                    <div className="invoice-total-row">
                      <span>Tax:</span>
                      <span>₹{invoice.taxTotal.toLocaleString()}</span>
                    </div>
                    <div className="invoice-total-row invoice-total-grand">
                      <span>Total:</span>
                      <span>₹{invoice.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="invoice-card-footer">
                  <button
                    onClick={() => handleViewDetails(invoice)}
                    className="btn-view-details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Details</h3>
              <button onClick={handleCloseDetails} className="btn-close-modal">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="invoice-details-section">
                <h4>Invoice Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Invoice ID:</span>
                  <span className="detail-value">{selectedInvoice._id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value invoice-status-${selectedInvoice.status || "draft"}`}>
                    {getStatusLabel(selectedInvoice.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(selectedInvoice.createdAt)}</span>
                </div>
              </div>

              <div className="invoice-details-section">
                <h4>Customer Information</h4>
                {typeof selectedInvoice.customer === "object" ? (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedInvoice.customer.customerName}</span>
                    </div>
                    {selectedInvoice.customer.email && (
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{selectedInvoice.customer.email}</span>
                      </div>
                    )}
                    {selectedInvoice.customer.phone && (
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{selectedInvoice.customer.phone}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="detail-row">
                    <span className="detail-value">Customer information not available</span>
                  </div>
                )}
              </div>

              <div className="invoice-details-section">
                <h4>Items</h4>
                <table className="invoice-items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((lineItem, index) => (
                      <tr key={index}>
                        <td>{getItemName(lineItem.item)}</td>
                        <td>{lineItem.quantity}</td>
                        <td>₹{lineItem.rate.toLocaleString()}</td>
                        <td>₹{lineItem.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="invoice-details-section">
                <h4>Summary</h4>
                <div className="invoice-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoice.subTotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>₹{selectedInvoice.taxTotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row summary-grand">
                    <span>Grand Total:</span>
                    <span>₹{selectedInvoice.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleCloseDetails} className="btn-close">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoicesList;
