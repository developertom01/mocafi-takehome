import React from "react";
import Input from "../../lib/atoms/Input";
import { useForm } from "react-hook-form";
import {
  getAccountInformation,
  GetUserAccountInformationPayload,
} from "../../services/user-account.services";
import { Button } from "../../lib/atoms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AccountInformationModal from "./modal";
import { handleHttpError } from "../../lib/utils/error-handler";

// 16 digits
const CARD_NUMBER_REGEX = /^\d{16}$/;
const PIN_REGEX = /^\d{4}$/;

const LoginForm = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<GetUserAccountInformationPayload>();

  const onSubmit = (data: GetUserAccountInformationPayload) => {
    mutate(data);
  };

  const { mutate, isPending, data } = useMutation({
    mutationFn: getAccountInformation,
    mutationKey: ["user-account-info"],
    onSuccess(data) {
      queryClient.setQueryData(["user-account-info"], data);
      setIsModalOpen(true);
      reset();
    },
    onError(error) {
      const errorData = handleHttpError(error);
      console.log(errorData);
      if (errorData.data) {
        setError("cardNumber", {
          type: "manual",
          message: errorData.data.cardNumber,
        });
        setError("pin", {
          type: "manual",
          message: errorData.data.pin,
        });
        if (errorData.data.message) {
          setError("root", {
            type: "manual",
            message: errorData.data.message,
          });
        }
      } else {
        setError("root", {
          type: "manual",
          message: errorData.message,
        });
      }
    },
  });

  return (
    <form
      data-testid="account-info-form"
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:w-[500px] flex flex-col px-4 gap-y-4"
    >
      {errors && (
        <p className="text-red-500 text-center">{errors.root?.message}</p>
      )}
      <Input
        label="Card Number"
        data-testId="card-number"
        type="password"
        className="rounded-md"
        placeholder="12345678991234567"
        error={errors.cardNumber?.message}
        {...register("cardNumber", {
          required: true,
          validate: (value) =>
            CARD_NUMBER_REGEX.test(value) || "Enter a valid card number",
        })}
      />
      <Input
        label="Pin"
        data-testId="pin"
        type="password"
        className="rounded-md"
        placeholder="xxxx"
        error={errors.pin?.message}
        {...register("pin", {
          required: true,
          validate: (value) => PIN_REGEX.test(value) || "Enter a valid pin",
        })}
      />
      <div className="flex w-full">
        <div className="w-[30%]"></div>
        <Button
          data-testId="submit-form"
          disabled={isPending}
          type="submit"
          className="w-full"
        >
          Submit
        </Button>
      </div>
      <AccountInformationModal
        key={data?.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userAccount={data}
      />
    </form>
  );
};

export default LoginForm;
