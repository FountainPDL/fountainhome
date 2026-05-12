"use client";

import "./globals.css"; // keep your styles if you had them

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
