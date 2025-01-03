#! /bin/bash

set -e

cd iac
# Run the infra setup script
terraform init
terraform apply -var-file=iac/dev.tfvars --chdir=./iac -auto-approve