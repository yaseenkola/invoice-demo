import { useState } from "react";
import CreateInvoice from "./CreateInvoice";
import InvoicesList from "./InvoicesList";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="App">
      <div className="app-tabs">
        <button
          className={`tab-button ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          ➕ Create Invoice
        </button>
        <button
          className={`tab-button ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          📋 View Invoices
        </button>
      </div>

      <div className="app-content">
        {activeTab === "create" ? <CreateInvoice /> : <InvoicesList />}
      </div>
    </div>
  );
}

export default App;
