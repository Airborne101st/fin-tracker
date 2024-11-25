def test_create_category(client):
    category_data = {
          "name": "Groceries",
          "monthly_target": 1000,
          "unit": "Rs.",
          "user_id": 1
        }

    response = client.post("/expenses/category", json=category_data)

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Groceries"
    assert data["monthly_target"] == 1000
    assert data["unit"] == "Rs."


def test_get_categories(client):
    client.post("/expenses/category", json={
          "name": "Transport",
          "monthly_target": 500,
          "unit": "Rs.",
          "user_id": 1
        })

    response = client.get("/expenses/category/1")

    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "Transport"