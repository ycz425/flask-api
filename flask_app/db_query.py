#!/usr/bin/env python3
# db_query.py - Sample MongoDB database query

import pymongo
from pymongo import MongoClient
from pprint import pprint
import sys
import os
from dotenv import load_dotenv
from pathlib import Path


# Find .env file relative to the script location
BASEDIR = Path(__file__).resolve().parent
env_path = BASEDIR / '.env'

# Load environment variables from .env file with verbose output
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


def query_users(collection_name="User", limit=5):
    """
    Query the users collection and return results
    
    Args:
        collection_name (str): Name of the collection to query
        limit (int): Maximum number of records to return
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
        
        # Perform a simple query to get users
        users = collection.find().limit(limit)
        
        result = list(users)
        print(f"Found {len(result)} users in collection '{collection_name}'")
        return result
    
    except Exception as e:
        print(f"Error querying database: {e}")
        return None
    finally:
        client.close()


def find_user_by_id(user_id, collection_name="User"):
    """
    Find a specific user by their ID
    
    Args:
        user_id: The ID of the user to find
        collection_name (str): Name of the collection to query
    """
    client = connect_to_mongodb()
    if not client:
        return None
    
    try:
        db_name = os.environ.get("MONGO_DB_NAME", "Prod")
        
        db = client[db_name]
        collection = db[collection_name]
        
        user = collection.find_one({"_id": user_id})
        return user
    
    except Exception as e:
        print(f"Error finding user: {e}")
        return None
    finally:
        client.close()


def find_users_by_criteria(criteria, collection_name="User", limit=10):
    """
    Find users matching specific criteria
    
    Args:
        criteria (dict): Query criteria to match documents
        collection_name (str): Name of the collection to query
        limit (int): Maximum number of records to return
    """
    client = connect_to_mongodb()
    if not client:
        return None
    
    try:
        db_name = os.environ.get("MONGO_DB_NAME", "Prod")
        
        db = client[db_name]
        collection = db[collection_name]
        
        users = collection.find(criteria).limit(limit)
        return list(users)
    
    except Exception as e:
        print(f"Error finding users by criteria: {e}")
        return None
    finally:
        client.close()


def list_collections():
    """
    List all collections in the database
    """
    client = connect_to_mongodb()
    if not client:
        return None
    
    try:
        db_name = os.environ.get("MONGO_DB_NAME", "Prod")
        db = client[db_name]
        
        collections = db.list_collection_names()
        print(f"Collections in database '{db_name}':")
        for collection in collections:
            print(f" - {collection}")
        
        return collections
    
    except Exception as e:
        print(f"Error listing collections: {e}")
        return None
    finally:
        client.close()


if __name__ == "__main__":
    print("MongoDB Query Tool")
    print("-----------------")
    
    # Debugging information for environment variables
    print(f"Environment variables loaded: {os.environ.get('MONGO_USERNAME') is not None}")
    print(f".env file path: {env_path}")
    print(f".env file exists: {env_path.exists()}")
    
    # List available collections
    collections = list_collections()
    
    if collections:
        # Ask which collection to query
        print("\nWhich collection would you like to query?")
        for i, collection in enumerate(collections):
            print(f"{i+1}. {collection}")
        
        choice = input("\nEnter collection number or name (default is 'User'): ")
        
        try:
            # Try to convert to an integer index
            idx = int(choice) - 1
            if 0 <= idx < len(collections):
                collection_name = collections[idx]
            else:
                collection_name = "User"
        except ValueError:
            # If not a valid integer, use the input as the collection name
            collection_name = choice if choice else "User"
        
        # Sample query - get users from selected collection
        users = query_users(collection_name)
        if users:
            print(f"\nSample data from collection '{collection_name}':")
            for i, user in enumerate(users):
                print(f"\nItem {i+1}:")
                pprint(user)
    else:
        print("No collections found or couldn't list collections.") 