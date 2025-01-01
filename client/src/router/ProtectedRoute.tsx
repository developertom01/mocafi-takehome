import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
  Element: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ Element }) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  if (!queryClient.getQueryData(["user-account-info"])) {
    const nextPath = encodeURIComponent(location.pathname);
    return <Navigate to={`/?redirect=${nextPath}`} />;
  }

  return <React.Fragment>{Element}</React.Fragment>;
};

export default ProtectedRoute;
