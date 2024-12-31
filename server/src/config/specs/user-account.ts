const CreateUserPayload = {
  type: "object",
  properties: {
    lastName: { type: "string" },
    firstName: { type: "string" },
    phone: { type: "string" },
  },
};

const CreateAccountPayload = {
  type: "object",
  properties: {
    cardNumber: { type: "string" },
    expiration: { type: "date" },
    pin: { type: "string" },
    balance: { type: "number" },
  },
};

const CreateUserAccountPayload = {
  type: "object",
  properties: {
    user: CreateUserPayload,
    account: CreateAccountPayload,
  },
};

const GetUserCardInfoPayload = {
  type: "object",
  properties: {
    cardNumber: { type: "string" },
    pin: { type: "string" },
  },
};

export default {
  CreateUserAccountPayload,
  GetUserCardInfoPayload,
};
