import { useEffect, useState } from "react";

// Base URL for the backend API. In production (Render), set VITE_API_BASE_URL.
// Locally, it falls back to your existing backend at http://localhost:3009.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3009";

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 5;

  useEffect(() => {
    fetchItems();
  }, [name, sortBy, order, page]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        ...(name && { name }),
        sortBy,
        order,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${API_BASE_URL}/items?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }

      const data = await response.json();

      setItems(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Items</h2>

      {/* Filter and Sorting Controls */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Filter */}
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setPage(1); // Reset to first page when filtering
          }}
          style={{
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minWidth: "200px",
          }}
        />

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="createdAt">Newest</option>
          <option value="rate">Rate</option>
          <option value="name">Name</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          Error: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      )}

      {/* Table Layout */}
      {!loading && !error && (
        <>
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Rate</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Unit</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Taxable</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ padding: "20px", textAlign: "center" }}
                  >
                    No items found
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td style={{ padding: "12px" }}>{item.name}</td>
                    <td style={{ padding: "12px" }}>{item.rate}</td>
                    <td style={{ padding: "12px" }}>{item.unit}</td>
                    <td style={{ padding: "12px" }}>
                      {item.isTaxable ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              Showing {items.length} of {totalItems} items
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  backgroundColor: page === 1 ? "#ccc" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  cursor:
                    page === totalPages || totalPages === 0
                      ? "not-allowed"
                      : "pointer",
                  backgroundColor:
                    page === totalPages || totalPages === 0
                      ? "#ccc"
                      : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ItemsPage;
