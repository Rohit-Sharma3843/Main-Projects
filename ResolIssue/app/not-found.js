export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
          fontFamily: "sans-serif"
        }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "48px" }}>404</h1>
            <p>Page not found</p>
          </div>
        </div>
      </body>
    </html>
  );
}
