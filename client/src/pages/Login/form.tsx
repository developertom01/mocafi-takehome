import React from "react";
import Input from "../../lib/atoms/Input";
import { useForm } from "react-hook-form";
import { getAccountInformation, GetUserAccountInformationPayload } from "../../services/user-account.services";
import { Button } from "../../lib/atoms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

// 16 digits
const CARD_NUMBER_REGEX = /^\d{16}$/;
const PIN_REGEX = /^\d{4}$/;

const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const {mutate, isSuccess, isPending } = useMutation({
    mutationFn: getAccountInformation,
    mutationKey: ["user-account-info"],
    onSuccess(data) {
      queryClient.setQueryData(["user-account-info"], data);
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GetUserAccountInformationPayload>();

  const onSubmit = (data: GetUserAccountInformationPayload) => {
    mutate(data)

  }

  if (isSuccess) {

    const redirectUrl = searchParams.get("redirect") ??`/dashboard/
    `;
    navigate(redirectUrl);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full md:w-[500px] flex flex-col px-4 gap-y-4"
    >
      <Input
        label="Account Number"
        type="password"
        className="rounded-md"
        placeholder="tom@email.com"
        error={errors.cardNumber?.message}
        {...register("cardNumber", {
          required: true,
          validate: (value) => CARD_NUMBER_REGEX.test(value) || "Enter a valid card number",
        })}
      />
        <Input
        label="Pin"
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
        <Button disabled={isPending} type="submit" className="w-full">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
