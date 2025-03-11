// app/page.tsx
"use client";

import Layout from "@/app/custom-components/Layout";
import FinanceDashboard from "@/app/custom-components/dashboard";

export default function DashboardPage() {
  return (
    <Layout>
      <FinanceDashboard />
    </Layout>
  );
}
