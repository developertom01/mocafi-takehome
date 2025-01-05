#!/bin/bash

# Exit script if any command fails
set -e -o pipefail

# Update package list and upgrade system
echo "Updating package list and upgrading system..."
sudo apt update -y
sudo apt upgrade -y

# Install required dependencies
echo "Installing required dependencies..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common git ufw

# Install Docker
echo "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --batch --yes --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "Adding Docker repository..."
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update -y
sudo apt install -y docker-ce docker-ce-cli containerd.io
echo "Docker installed successfully!"

# Enable and start Docker service
echo "Enabling and starting Docker service..."
systemctl enable docker
systemctl start docker

# Add user to Docker group
echo "Adding user to Docker group..."
sudo usermod -aG docker $USER

# Allow ports 80 and 443 through the firewall
echo "Configuring firewall rules..."
sudo ufw allow 80
sudo ufw allow 3000 
sudo ufw --force enable

# Clone app repository
echo "Cloning app repository..."
git clone https://github.com/developertom01/mocafi-takehome
cd mocafi-takehome

# Setup environment variables
echo "Setting up environment variables..."
cat <<EOF >> ~/.bashrc
export DB_CONNECTION_STRING="$var.db_connection_string"
export DATABASE_NAME="$var.database_name"
export APP_SECRET="$var.app_secret"
export APP_PORT="$var.app_port"
export DATABASE_SECRET="$var.database_secret"
export MONGO_DB_KEY_VAULT_NAMESPACE="$var.mongo_vault_namespace"
EOF

# Apply environment variables
source ~/.bashrc

# Start up the app
echo "Starting up the app..."
docker compose up -d

echo "Setup complete!"
