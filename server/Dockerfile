# Base image with Python
FROM python:3.11-slim

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    libssl-dev \
    openssl \
    build-essential \
    libmongocrypt-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose a port if needed
EXPOSE 5000

# Run the Python application
CMD ["python3", "server.py"]
