import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  Element: React.ReactNode;
};

const UnprotectedRoute: React.FC<Props> = ({ Element }) => {
  const queryClient = useQueryClient();

  if (queryClient.getQueryData(["user-account-info"])) {
    return <Navigate to={`/dashboard`} />;
  }

  return <React.Fragment>{Element}</React.Fragment>;
};

export default UnprotectedRoute;
