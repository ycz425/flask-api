#!/usr/bin/env python3
# delete_users.py - Script to delete all documents from a MongoDB collection

import sys
from pymongo import MongoClient
from pathlib import Path
import os
from dotenv import load_dotenv

# Find .env file relative to the script location
BASEDIR = Path(__file__).resolve().parent
env_path = BASEDIR / '.env'

# Load environment variables from .env file
load_dotenv(dotenv_path=env_path, verbose=True)


def connect_to_mongodb():
    """
    Connect to MongoDB using the connection string from environment variables
    """
    # Get connection details from environment variables
    username = os.environ.get("MONGO_USERNAME")
    password = os.environ.get("MONGO_PASSWORD")
    cluster = os.environ.get("MONGO_CLUSTER")
    options = os.environ.get("MONGO_OPTIONS", "retryWrites=true&w=majority")
    app_name = os.environ.get("MONGO_APP_NAME", "Cluster0")

    # Provide default values if environment variables are not set (for development only)
    if not username or not password or not cluster:
        print("Warning: Using default connection string as environment variables are not set.")
        connection_string = "mongodb+srv://bhavyajain364:uoftinder@cluster0.5nodi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    else:
        # Construct connection string from environment variables
        connection_string = f"mongodb+srv://{username}:{password}@{cluster}.mongodb.net/?{options}&appName={app_name}"
    
    try:
        # Connect to MongoDB
        client = MongoClient(connection_string)
        
        # Test connection
        client.admin.command('ping')
        print("Connected successfully to MongoDB!")
        
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None


def delete_all_documents(collection_name):
    """
    Delete all documents from the specified collection
    
    Args:
        collection_name (str): Name of the collection to delete from
    
    Returns:
        int: Number of documents deleted
    """
    client = connect_to_mongodb()
    if not client:
        return None
    
    try:
        # Get database name from environment variable
        db_name = os.environ.get("MONGO_DB_NAME", "Prod")
        
        # Connect to the database and collection
        db = client[db_name]
        collection = db[collection_name]
        
        # Count documents before deletion
        count_before = collection.count_documents({})
        print(f"Found {count_before} documents in collection '{collection_name}'")
        
        # Delete all documents
        result = collection.delete_many({})
        
        deleted_count = result.deleted_count
        print(f"Successfully deleted {deleted_count} documents from collection '{collection_name}'")
        
        return deleted_count
    
    except Exception as e:
        print(f"Error deleting documents: {e}")
        return None
    finally:
        client.close()


if __name__ == "__main__":
    print("MongoDB Document Deletion Tool")
    print("-----------------------------")
    
    # Default collection name
    collection_name = "User"
    
    # Check for command line arguments
    if len(sys.argv) > 1:
        collection_name = sys.argv[1]
    
    print(f"Target collection: {collection_name}")
    confirm = input(f"WARNING: This will delete ALL documents in the '{collection_name}' collection. Continue? (y/n): ")
    
    if confirm.lower() in ['y', 'yes']:
        deleted = delete_all_documents(collection_name)
        if deleted is not None:
            print("Operation completed successfully.")
    else:
        print("Operation cancelled.") 