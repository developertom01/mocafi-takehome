export type User = {
  firstName: string;
  lastName: string;
  phone: string;
};

export type Account = {
  cardNumber: string;
  expiration: string;
  balance: number;
};

export type UserAccount = {
  id: string;
  user: User;
  account: Account;
};
