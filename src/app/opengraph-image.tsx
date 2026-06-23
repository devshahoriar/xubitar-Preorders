import { loadSearchParams } from "@/components/page/home/searchParams";
import { api } from "@/trpc/server";
import { ImageResponse } from "next/og";
import type { SearchParams } from "nuqs/server";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export const contentType = "image/png";

// Image generation
export default async function Image({ searchParams }: PageProps) {
  const { page, status, sortBY, sortDir } =
    await loadSearchParams(searchParams);

  const { preorders, totalCount } = await api.preorder.getAll({
    page,
    status: status ?? undefined,
    sortBY: sortBY ?? undefined,
    sortDir: sortDir ?? undefined,
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          color: "#111827",
          padding: "50px 70px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <span style={{ fontSize: "32px", fontWeight: "bold", color: "#4f46e5" }}>Xubitar Preorders</span>
          <span
            style={{
              fontSize: "18px",
              color: "#4b5563",
              backgroundColor: "#f3f4f6",
              padding: "6px 16px",
              borderRadius: "9999px",
              border: "1px solid #e5e7eb",
            }}
          >
            Dashboard Live Preview
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "20px",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "10px",
            }}
          >
            <div style={{ flex: 2, display: "flex", fontSize: "20px", color: "#4b5563", fontWeight: "600", padding: "0 10px" }}>Name</div>
            <div style={{ flex: 1, display: "flex", fontSize: "20px", color: "#4b5563", fontWeight: "600", padding: "0 10px" }}>Products</div>
            <div style={{ flex: 1, display: "flex", fontSize: "20px", color: "#4b5563", fontWeight: "600", padding: "0 10px" }}>Type</div>
            <div style={{ flex: 1, display: "flex", fontSize: "20px", color: "#4b5563", fontWeight: "600", padding: "0 10px" }}>Status</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {preorders.slice(0, 6).map((preorder) => (
              <div
                key={preorder.id}
                style={{
                  display: "flex",
                  width: "100%",
                  borderBottom: "1px solid #e5e7eb",
                  padding: "12px 0",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 2, display: "flex", fontSize: "18px", color: "#111827", fontWeight: "500", padding: "0 10px" }}>{preorder.name}</div>
                <div style={{ flex: 1, display: "flex", fontSize: "18px", color: "#374151", padding: "0 10px" }}>{preorder.products}</div>
                <div style={{ flex: 1, display: "flex", fontSize: "18px", color: "#374151", textTransform: "capitalize", padding: "0 10px" }}>{preorder.type.toLowerCase().replaceAll("_", " ")}</div>
                <div style={{ flex: 1, display: "flex", fontSize: "18px", padding: "0 10px" }}>
                  <span
                    style={{
                      color: preorder.isActive ? "#16a34a" : "#dc2626",
                      fontWeight: "600",
                    }}
                  >
                    {preorder.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "24px", color: "#4b5563" }}>Total Preorders:</span>
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", marginLeft: "8px" }}>{totalCount}</span>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", fontSize: "18px", color: "#9ca3af" }}>Xubitar OG Preview</div>
        </div>
      </div>
    ),
  );
}
