import { UserAccount } from "../controller/user-accounts";
import { format } from "date-fns";
import { Resource } from "./resource";

export type UserType = {
  phone: string;
  firstName: string;
  lastName: string;
};

export type AccountType = {
  cardNumber: string;
  expiration: string;
  balance: string;
};

export type UserAccountType = {
  id: string;
  user: UserType;
  account: AccountType;
};

export class UserAccountResource implements Resource<UserAccountType> {
  constructor(private readonly userAccount: UserAccount) {}

  public toJSON(): UserAccountType {
    return {
      id: this.userAccount._id!.toHexString(),
      user: {
        phone: this.userAccount.user.phone,
        firstName: this.userAccount.user.firstName,
        lastName: this.userAccount.user.lastName,
      },
      account: {
        cardNumber: this.userAccount.account.cardNumber,
        expiration: format(this.userAccount.account.expiration, "MM/yy"),
        balance: this.userAccount.account.balance.toFixed(2),
      },
    };
  }
}

export default UserAccountResource;
