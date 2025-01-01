import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import AccountManagement from "./pages/account-management";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccountManagement />
    </QueryClientProvider>
  );
}

export default App;
