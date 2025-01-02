# MOCAFI Account Management

A simple application that allows Mocafi users to enter their credit card information to retrieve the account information.

## Key Considereation for the app

- Easy to use (Simplicity)
- Data security (To be PCI-DSS compliant)

## Direction of use

- Provide an account information (card number and PIN) and account information is provided

## Security Feature

- All credit card information are encrypted in the database, using [MongoDb Client Side Field encryption](https://www.mongodb.com/docs/manual/core/queryable-encryption/about-qe-csfle/)
- Pin has hashed on the server because they don't have to be decrypted but only compare to.

## PCI-DSS Compliant

Current Solution

- AES encrypt card number
- Hmac hash pin

### Issues

- Indexing encrypted card number is not efficient since it is a lookup field
- Issue with scalability (If we have to encode and decode 1M card info per sec), considering Nodejs single thread nature.

### Solution

a. Use tokenization, a better and efficient way to be PCI-DSS compliant (Requires external system - Cannot cover in this project)

### Compromised solution

- Encrypt AES with 256-bit key for card number and store in database
  To make lookup, encrypt plain card number.
- Even though making this lookup will be slow and not efficient at the db level, we can

### lOOKUP IN SEARCH STRING
