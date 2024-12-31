# MOCAFI TEST

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
