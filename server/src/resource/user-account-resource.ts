import { UserAccount } from "../controller/user-accounts";
import { Resource } from "./resource";

export type UserType = {
  phone: string;
  firstName: string;
  lastName: string;
};

export type AccountType = {
  cardNumber: string;
  expiration: string;
  balance: number;
};

export type UserAccountType = {
  id: string;
  user: UserType;
  account: AccountType;
};

function formatExpiration(expiration: Date) {
  return `${expiration.getMonth() + 1}${expiration.getFullYear()}`; // MMYY, MM is 1-based
}

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
        expiration: formatExpiration(this.userAccount.account.expiration),
        balance: this.userAccount.account.balance,
      },
    };
  }
}

export default UserAccountResource;
