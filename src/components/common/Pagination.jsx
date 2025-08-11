function Pagination({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => onPageChange(idx + 1)}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
