import React from "react";
import Modal from "../../lib/components/Modal";
import { UserAccount } from "../../lib/models";
import logo from "../../lib/images/logo.jpg";

type Props = {
  userAccount?: UserAccount;
  isOpen: boolean;
  onClose: () => void;
};
const AccountInformationModal: React.FC<Props> = ({
  isOpen,
  userAccount,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} setIsClosed={onClose}>
      <div className="min-w-[350px] flex flex-col gap-y-4 p-x-4">
        <div>
          <img src={logo} alt="Logo" className="w-40 mx-auto" />
          <h1 className="text-center text-gray-600 text-xl font-semibold">
            Account Information
          </h1>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-x-6">
            <p className="text-gray-600"> Name:</p>
            <p>
              {userAccount?.user.firstName} {userAccount?.user.lastName}
            </p>
          </div>
          <div className="flex gap-x-6">
            <p className="text-gray-600"> Phone:</p>
            <p>{userAccount?.user.phone}</p>
          </div>
          <div className="flex gap-x-6">
            <p className="text-gray-600"> Card Number:</p>
            <p>{userAccount?.account.cardNumber}</p>
          </div>
          <div className="flex gap-x-6">
            <p className="text-gray-600"> Balance</p>
            <p>$ {userAccount?.account.balance}</p>
          </div>
          <div className="flex gap-x-6">
            <p className="text-gray-600"> Expiration:</p>
            <p>{userAccount?.account.cardNumber}</p>
          </div>
          <div className="flex gap-x-6">
            <p className="text-gray-600"> Expiration</p>
            <p>{userAccount?.account.expiration}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountInformationModal;
