import random
import time
from locust import HttpUser, task, between

class CogniGuardUser(HttpUser):
    wait_time = between(1, 3)
    
    token = None
    user_id = None
    
    def on_start(self):
        self.login_as_soldier()

    def login_as_soldier(self):
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
            self.user_id = user_info.get("id")
        else:
            self.user_id = "test_soldier"

    @task(3)
    def view_history(self):
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        
        self.client.get(f"/api/tests/history?user_id={self.user_id}", headers=headers)

    @task(2)
    def submit_test_result(self):
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
            
        test_payload = {
            "user_id": self.user_id,
            "test_type": random.choice(["PVT", "n-back"]),
            "reaction_time_ms": random.randint(220, 680),
            "errors_count": random.randint(0, 4)
        }
        
        self.client.post("/api/tests", json=test_payload, headers=headers)

    @task(1)
    def view_units(self):
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        
        self.client.get("/api/units", headers=headers)

    @task(1)
    def view_all_users(self):
        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        self.client.get("/api/users", headers=headers)
