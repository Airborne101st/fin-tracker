def test_user_register(client):
    # Register a User
    response = client.post("/auth/register", json={
        "username": "testuser",
        "hashed_password": "testpassword",
        "full_name": "Test User"
    })

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_user_login(client):
    # Register a User
    client.post("/auth/register", json={
        "username": "testuser",
        "hashed_password": "testpassword",
        "full_name": "Test User"
    })

    # Login
    response = client.post("/auth/login", json={
        "username": "testuser",
        "hashed_password": "testpassword"
    })

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"



