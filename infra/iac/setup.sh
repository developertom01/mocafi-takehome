#!/bin/bash

# Exit script if any command fails
set -e

# Update package list and upgrade system
sudo apt update
sudo apt upgrade -y

# Install required dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

#   Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null\
    && sudo apt update -y \
    && sudo apt install -y docker-ce docker-ce-cli containerd.io
    && systemctl enable docker \
    && systemctl start docker \
    && sudo usermod -aG docker $USER
    && newgrp docker



# Install Docker Compose (latest version)
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d '"' -f 4)
sudo curl -L "https://github.com/docker/compose/releases/download/$COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && sudo chmod +x /usr/local/bin/docker-compose


# ALLOW PORT 80 AND 443
sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable

# Clone App repo
echo "Cloning app repo..."
git clone https://github.com/developertom01/mocafi-takehome
cd mocafi-takehome

// Setup environment variables
echo "Setting up environment variables..."
echo 'export DB_CONNECTION_STRING="$var.db_connection_string"' >> ~/.bashrc
echo 'export DATABASE_NAME="$var.database_name"' >> ~/.bashrc
echo 'export APP_SECRET="$var.app_secrete"' >> ~/.bashrc
echo 'export APP_PORT="$var.app_port"' >> ~/.bashrc
echo 'export DATABASE_SECRET="$var.database_secret"' >> ~/.bashrc
echo 'export MONGO_DB_KEY_VAULT_NAMESPACE="$var.mongo_vault_namespace"' >> ~/.bashrc

sources ~/.bashrc

# Start up the app
echo "Starting up the app..."
docker-compose up -d
