import { Controller } from "../../controller";
import { UserAccount } from "../../controller/user-accounts";

export async function seedData(controller: Controller) {
  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);
  const userAccounts: UserAccount[] = [
    {
      user: {
        firstName: "James",
        lastName: "Smith",
        phone: "3129891233",
      },
      account: {
        pin: "1234",
        cardNumber: "0234567890724456",
        expiration,
        balance: 10077.0,
      },
    },
    {
      user: {
        firstName: "Tom",
        lastName: "Bruce",
        phone: "3129091234",
      },
      account: {
        pin: "1234",
        cardNumber: "1734567890103458",
        expiration,
        balance: 190.0,
      },
    },
    {
      user: {
        firstName: "Jane",
        lastName: "Doe",
        phone: "3129891235",
      },
      account: {
        pin: "1234",
        cardNumber: "1834567890103456",
        expiration,
        balance: 10000.0,
      },
    },
  ];

  const promises = userAccounts.map((userAccount) =>
    controller.userAccountController.createUserAccount(userAccount)
  );

  await Promise.allSettled(promises);
}
