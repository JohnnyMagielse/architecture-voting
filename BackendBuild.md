# Project Setup and Installation Guide

This guide will walk you through setting up and running a Node.js backend server with PostgreSQL database using a setup script and Node.js dependencies.

## Prerequisites

1. **PostgreSQL**: Make sure PostgreSQL is installed and running on your machine.
   
2. **Node.js and npm**: Ensure Node.js and npm (Node Package Manager) are installed.

## Step-by-Step Setup Guide

#### **BackendBuild Script (backendBuild.sh)**
The backend build script (backendBuild.sh) automates the installation and configuration process. Everything can be run by executing 

```bash
bash backendBuild.sh
```

where the file is located.


**It performs the following tasks:**

#### **a. Check PostgreSQL Installation**
The script checks if PostgreSQL is installed on your system:

```bash
if command_exists psql; then
    echo "PostgreSQL is installed"
else
    echo "PostgreSQL is not installed. Please install PostgreSQL and rerun this script."
    exit 1
fi
```
#### **b. Define Database Credentials and Name**

Set up environment variables for PostgreSQL database credentials:

```bash
Copy code
DB_USER="postgres"
DB_PASSWORD="evoting"
DB_NAME="evoting"
DB_PORT="5432"
```

#### **c. Database Creation and Setup**
The script checks if the specified database already exists. If it does, it drops and recreates it:

```bash
DB_EXISTS=$(psql -U $DB_USER -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" = '1' ]; then
    echo "Database $DB_NAME exists, dropping database..."
    psql -U $DB_USER -c "DROP DATABASE $DB_NAME;"
else
    echo "Database $DB_NAME does not exist."
fi

echo "Creating database $DB_NAME..."
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
```

#### **d. Execute SQL Script**
The script executes an SQL script (db.sql) to create tables and insert mock data into the database:


```bash
psql -U $DB_USER -d $DB_NAME -a -f ./backend/db/db.sql
```
#### **e. Install Node.js Dependencies**
Navigate to the backend directory, install Node.js dependencies using npm:

```bash
cd backend
npm install
```

#### **f. Start the Backend Server**
Start the Node.js backend server:

``` bash
npm run dev
```

#### **g. Check Setup Completion**
The script checks if the server started successfully:

```bash
if [ $? -ne 0 ]; then
    echo "Error starting the backend server."
    exit 1
fi

echo "Setup completed successfully!"
````
