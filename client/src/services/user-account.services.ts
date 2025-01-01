import { UserAccount } from "../lib/models";
import apiClient from "../lib/utils/http-client";

export type GetUserAccountInformationPayload = {
  cardNumber: string;
  pin: string;
};

export async function getAccountInformation(
  payload: GetUserAccountInformationPayload
): Promise<UserAccount> {
  const response = await apiClient.post<
    GetUserAccountInformationPayload,
    UserAccount
  >("/api/user-accounts/info", payload);
  return response.data;
}
