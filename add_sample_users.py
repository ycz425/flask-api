#!/usr/bin/env python3
# add_sample_users.py - One-time script to add sample users to the MongoDB database

import pymongo
from pymongo import MongoClient
from bson import ObjectId
import random
import string
from datetime import datetime, timedelta
import os
import sys
from dotenv import load_dotenv
from pathlib import Path

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


def generate_random_string(length=8):
    """Generate a random string of fixed length"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))


def generate_random_email():
    """Generate a random email address"""
    domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "example.com"]
    username = generate_random_string(8)
    domain = random.choice(domains)
    return f"{username}@{domain}"


def generate_random_phone():
    """Generate a random phone number"""
    return f"+1{random.randint(100, 999)}{random.randint(100, 999)}{random.randint(1000, 9999)}"


def generate_random_date(start_date, end_date):
    """Generate a random date between start_date and end_date"""
    time_delta = end_date - start_date
    random_days = random.randint(0, time_delta.days)
    return start_date + timedelta(days=random_days)


def generate_sample_users(num_users=20):
    """Generate a list of sample user documents"""
    first_names = ["John", "Jane", "Michael", "Emma", "David", "Olivia", "James", "Sophia", 
                   "William", "Ava", "Benjamin", "Mia", "Daniel", "Charlotte", "Matthew", 
                   "Amelia", "Samuel", "Harper", "Joseph", "Evelyn"]
    
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                 "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
                 "Thomas", "Taylor", "Moore", "Jackson", "Martin"]
    
    universities = ["University of Toronto", "McGill University", "University of British Columbia",
                   "University of Waterloo", "McMaster University", "University of Alberta",
                   "Queen's University", "Western University", "University of Calgary",
                   "York University"]
    
    majors = ["Computer Science", "Engineering", "Business", "Psychology", "Biology",
             "Chemistry", "Physics", "Mathematics", "English", "History", "Art", "Music",
             "Medicine", "Law", "Economics", "Political Science", "Sociology", "Philosophy"]
    
    interests = ["Reading", "Sports", "Music", "Travel", "Cooking", "Gaming", "Photography",
                "Dancing", "Hiking", "Swimming", "Movies", "Art", "Fitness", "Technology",
                "Fashion", "Writing", "Yoga", "Meditation", "Volunteering", "Coding"]
    
    users = []
    
    for i in range(num_users):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        
        # Generate a random birth date for users between 18 and 30 years old
        today = datetime.now()
        start_date = today - timedelta(days=365 * 30)  # 30 years ago
        end_date = today - timedelta(days=365 * 18)    # 18 years ago
        birth_date = generate_random_date(start_date, end_date)
        
        # Generate a random join date within the last year
        join_start_date = today - timedelta(days=365)
        join_date = generate_random_date(join_start_date, today)
        
        # Generate a random set of 2-5 interests
        user_interests = random.sample(interests, random.randint(2, 5))
        
        user = {
            "_id": ObjectId(),
            "firstName": first_name,
            "lastName": last_name,
            "email": generate_random_email(),
            "user_id": generate_random_string(10),
        }
        
        users.append(user)
    
    return users


def insert_sample_users(users, collection_name):
    """
    Insert sample users into the MongoDB database
    
    Args:
        users (list): List of user documents to insert
        collection_name (str): Name of the collection to insert into
    """
    client = connect_to_mongodb()
    if not client:
        return False
    
    try:
        # Get database name from environment variable
        db_name = os.environ.get("MONGO_DB_NAME", "Prod")
        
        # Connect to the database and collection
        db = client[db_name]
        collection = db[collection_name]
        
        # Insert the users into the collection
        result = collection.insert_many(users)
        
        print(f"Successfully inserted {len(result.inserted_ids)} users into collection '{collection_name}'")
        return result.inserted_ids
    
    except Exception as e:
        print(f"Error inserting users: {e}")
        return False
    finally:
        client.close()


def list_collections():
    """List all collections in the database"""
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
    print("Sample User Generator")
    print("--------------------")
    
    # Get collection name from command line argument or prompt
    collection_name = "User"  # Default collection name
    
    if len(sys.argv) > 1:
        collection_name = sys.argv[1]
        print(f"Using collection name from command line: {collection_name}")
    else:
        # List existing collections
        collections = list_collections()
        
        if collections:
            print("\nExisting collections:")
            for i, coll in enumerate(collections):
                print(f"{i+1}. {coll}")
            
            # Prompt for collection name
            choice = input("\nEnter collection name or number to insert into (default is 'User'): ")
            
            try:
                # Try to convert to an integer index
                idx = int(choice) - 1
                if 0 <= idx < len(collections):
                    collection_name = collections[idx]
                    print(f"Selected collection: {collection_name}")
                else:
                    print(f"Using default collection: {collection_name}")
            except ValueError:
                # If not a valid integer, use the input as the collection name
                if choice:
                    collection_name = choice
                    print(f"Using specified collection: {collection_name}")
                else:
                    print(f"Using default collection: {collection_name}")
    
    # Ask for number of users to generate
    try:
        num_users_input = input(f"How many users to add to {collection_name} collection? (default: 20): ")
        num_users = int(num_users_input) if num_users_input else 20
    except ValueError:
        print("Invalid number, using default: 20")
        num_users = 20
    
    # Generate sample users
    sample_users = generate_sample_users(num_users)
    
    # Insert the users into the database
    if sample_users:
        print(f"Generated {len(sample_users)} sample users")
        confirm = input(f"Insert these users into '{collection_name}' collection? (y/n): ")
        
        if confirm.lower() in ['y', 'yes']:
            print("Inserting users into MongoDB...")
            inserted_ids = insert_sample_users(sample_users, collection_name)
            
            if inserted_ids:
                print("User insertion complete!")
                print(f"Inserted {len(inserted_ids)} users with IDs:")
                for i, user_id in enumerate(inserted_ids[:5]):
                    print(f" - {user_id}")
                if len(inserted_ids) > 5:
                    print(f" - ... and {len(inserted_ids) - 5} more")
            else:
                print("Failed to insert users into the database")
        else:
            print("Operation cancelled by user")
    else:
        print("Failed to generate sample users") 