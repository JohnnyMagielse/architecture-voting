#!/bin/bash

# Function to check if a command exists
command_exists () {
    command -v "$1" >/dev/null 2>&1
}

# Check if PostgreSQL is installed
if command_exists psql; then
    echo "PostgreSQL is installed"
else
    echo "PostgreSQL is not installed. Please install PostgreSQL and rerun this script."
    exit 1
fi

# Set up environment variables
DB_USER="postgres"
DB_PASSWORD="evoting"
DB_NAME="evoting"
DB_PORT="5432"

# Create database and tables, insert mock data
echo "Setting up PostgreSQL database..."

# Check if the database exists
DB_EXISTS=$(psql -U $DB_USER -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" = '1' ]; then
    echo "Database $DB_NAME exists, dropping database..."
    psql -U $DB_USER -c "DROP DATABASE $DB_NAME;"
else
    echo "Database $DB_NAME does not exist."
fi

# Create the database
echo "Creating database $DB_NAME..."
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

# Execute the mock data SQL file
psql -U $DB_USER -d $DB_NAME -a -f ./backend/db/db.sql

# Check if the database was created successfully
if [ $? -ne 0 ]; then
    echo "Error creating database or inserting mock data."
    exit 1
fi

cd backend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Run the backend server
echo "Starting the backend server..."
node server.js

# Check if the server started successfully
if [ $? -ne 0 ]; then
    echo "Error starting the backend server."
    exit 1
fi

echo "Setup completed successfully!"
