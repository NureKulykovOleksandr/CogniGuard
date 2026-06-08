import random
import time
from locust import HttpUser, task, between

class CogniGuardUser(HttpUser):
    # Think time between tasks: 1 to 3 seconds
    wait_time = between(1, 3)
    
    # Store token or session details if needed
    token = None
    user_id = None
    
    def on_start(self):
        # We perform login when a virtual user starts
        # Choose a user (soldier or admin) from the predefined list
        self.login_as_soldier()

    def login_as_soldier(self):
        # We will log in with 'petrenko1' or 'captain' or 'admin'
        login_credentials = [
            {"login": "petrenko1", "password": "password1234567"},
            {"login": "petrenko123", "password": "password12345"},
            {"login": "test", "password": "test"},
            {"login": "petrenko", "password": "password123"},
            {"login": "captain", "password": "123"}
        ]
        creds = random.choice(login_credentials)
        response = self.client.post("/api/auth/login", json=creds)
        if response.status_code == 200:
            data = response.json()
            self.token = data.get("token")
            user_info = data.get("user", {})
            self.user_id = user_info.get("login") or user_info.get("id")
        else:
            # Fallback if login fails
            self.user_id = "test_soldier"

    @task(3)
    def view_history(self):
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        
        # Get all test history (simulate soldier looking at their past tests)
        self.client.get(f"/api/tests/history?user_id={self.user_id}", headers=headers)

    @task(2)
    def submit_test_result(self):
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
            
        test_payload = {
            "user_id": self.user_id,
            "test_type": random.choice(["reaction", "n-back"]),
            "reaction_time_ms": random.randint(220, 680),
            "errors_count": random.randint(0, 4)
        }
        
        # Save a new test result
        self.client.post("/api/tests", json=test_payload, headers=headers)

    @task(1)
    def view_units(self):
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        
        # Fetch units list
        self.client.get("/api/units", headers=headers)

    @task(1)
    def view_all_users(self):
        # Simulate admin-like behavior of listing users
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        self.client.get("/api/users", headers=headers)
