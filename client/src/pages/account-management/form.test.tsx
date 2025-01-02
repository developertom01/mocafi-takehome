import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Form from "./form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

test("Should render form elements", () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Form />
    </QueryClientProvider>
  );

  const form = screen.getByTestId("account-info-form");
  expect(form).toBeInTheDocument();

  const cardNumberInput = screen.getByTestId("card-number");
  expect(cardNumberInput).toBeInTheDocument();

  const pinInput = screen.getByTestId("pin");
  expect(pinInput).toBeInTheDocument();

  const submitButton = screen.getByTestId("submit-form");
  expect(submitButton).toBeInTheDocument();
});
