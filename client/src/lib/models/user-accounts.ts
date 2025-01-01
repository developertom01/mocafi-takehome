export type User = {
  firstName: string;
  lastName: string;
  phone: string;
};

export type Account = {
  cardNumber: string;
  expiration: string; // Will be formatted to a string in the format MM/YY.
  balance: string; // Will be formatted as a string with 2 decimal places.
};

export type UserAccount = {
  id: string;
  user: User;
  account: Account;
};
