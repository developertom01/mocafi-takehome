import React from "react";
import { render, screen } from "@testing-library/react";
import Modal from "./modal";
import { UserAccount } from "../../lib/models";

test("Should render account information", () => {
  const account: UserAccount = {
    id: "1",
    account: {
      balance: "100.00",
      cardNumber: "1234507890123456",
      expiration: "12/24",
    },
    user: {
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
    },
  };
  render(<Modal isOpen onClose={() => {}} userAccount={account} />);
  const cardName = screen.getByText(/1234507890123456/i);
  expect(cardName).toBeInTheDocument();

  const cardExpiration = screen.getByText(/12\/24/i);
  expect(cardExpiration).toBeInTheDocument();

  const cardBalance = screen.getByText(/100.00/i);
  expect(cardBalance).toBeInTheDocument();

  const userName = screen.getByText(/John Doe/i);
  expect(userName).toBeInTheDocument();

  const userPhone = screen.getByText(/1234567890/i);
  expect(userPhone).toBeInTheDocument();
});
