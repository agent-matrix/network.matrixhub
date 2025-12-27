#!/usr/bin/env python3
"""Test authentication endpoints.

This script tests all authentication methods:
- User registration
- User login
- Guest login
- Logout

Usage:
    python test_auth.py
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8000"

def print_header(title):
    """Print a formatted header."""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_health_check():
    """Test the health check endpoint."""
    print_header("Testing Health Check")

    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("✅ Health check passed!")
            return True
        else:
            print("❌ Health check failed!")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_register():
    """Test user registration."""
    print_header("Testing User Registration")

    data = {
        "agent_id": "TestAgent-001",
        "email": "[email protected]",
        "password": "testpass123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 201:
            print("✅ Registration successful!")
            return response.json()
        elif response.status_code == 409:
            print("⚠️  User already exists, trying to login instead...")
            return test_login_with_credentials(data["agent_id"], data["password"])
        else:
            print("❌ Registration failed!")
            return None

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_login():
    """Test user login with default credentials."""
    print_header("Testing User Login")

    data = {
        "username": "Unit-734",
        "password": "password123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json()
        else:
            print("❌ Login failed!")
            return None

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_login_with_credentials(username, password):
    """Test login with specific credentials."""
    data = {
        "username": username,
        "password": password
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_guest_login():
    """Test guest login."""
    print_header("Testing Guest Login")

    try:
        response = requests.post(f"{BASE_URL}/api/auth/guest", json={})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("✅ Guest login successful!")
            return response.json()
        else:
            print("❌ Guest login failed!")
            return None

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_get_profile(user_id, token):
    """Test getting user profile."""
    print_header(f"Testing Get Profile: {user_id}")

    try:
        response = requests.get(
            f"{BASE_URL}/api/auth/profile/{user_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("✅ Profile retrieval successful!")
            return True
        else:
            print("❌ Profile retrieval failed!")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_logout(token):
    """Test logout."""
    print_header("Testing Logout")

    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/logout",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print("✅ Logout successful!")
            return True
        else:
            print("❌ Logout failed!")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_get_entities():
    """Test getting entities list."""
    print_header("Testing Get Entities")

    try:
        response = requests.get(f"{BASE_URL}/api/entities?limit=5")
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            entities = response.json()
            print(f"Found {len(entities)} entities:")
            for entity in entities:
                print(f"  - {entity['name']} ({entity['type']}): {entity['summary'][:50]}...")
            print("✅ Entity retrieval successful!")
            return True
        else:
            print("❌ Entity retrieval failed!")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def run_all_tests():
    """Run all authentication tests."""
    print("\n" + "="*60)
    print("  AGENTLINK AUTHENTICATION TEST SUITE")
    print("="*60)
    print(f"\nBase URL: {BASE_URL}")
    print("Ensure the backend server is running before testing!")

    results = []

    # Test 1: Health Check
    results.append(("Health Check", test_health_check()))

    # Test 2: User Registration
    register_result = test_register()
    results.append(("User Registration", register_result is not None))

    # Test 3: User Login
    login_result = test_login()
    results.append(("User Login", login_result is not None))

    # Test 4: Guest Login
    guest_result = test_guest_login()
    results.append(("Guest Login", guest_result is not None))

    # Test 5: Get Profile (if login successful)
    if login_result:
        profile_success = test_get_profile(login_result['user_id'], login_result['access_token'])
        results.append(("Get Profile", profile_success))

    # Test 6: Logout (if login successful)
    if login_result:
        logout_success = test_logout(login_result['access_token'])
        results.append(("Logout", logout_success))

    # Test 7: Get Entities
    results.append(("Get Entities", test_get_entities()))

    # Print summary
    print_header("TEST SUMMARY")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:12} {test_name}")

    print(f"\n{'='*60}")
    print(f"Results: {passed}/{total} tests passed")
    print(f"{'='*60}\n")

    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
