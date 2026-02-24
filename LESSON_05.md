# Lesson Plan: Lesson 5
## Building a Complete Ingredient API

**Duration:** 1-2 hours
**Prerequisites:** Completed Lessons 1-4 (Lists mastery)
**Goal:** Build a production-quality API with error handling and status codes

---

## Learning Objectives

By the end of this lesson, you will:
1. Handle API errors gracefully with try/except
2. Use HTTP status codes correctly (200, 400, 404, 500)
3. Parse and validate query parameters
4. Build a robust ingredient API endpoint
5. Understand defensive programming

---

## The Big Picture: Production-Quality Code

In Lessons 1-4, we built working code. Now we make it **bulletproof**.

Real-world APIs must handle:
- Invalid input (user sends garbage)
- Missing data (file doesn't exist)
- Unexpected errors (something we didn't anticipate)

### Intuition Builder: The Helpful Waiter

Imagine a restaurant API:

**Bad waiter (no error handling):**
- Customer: "I'd like a unicorn burger"
- Waiter: *crashes and walks away*

**Good waiter (proper error handling):**
- Customer: "I'd like a unicorn burger"
- Waiter: "I'm sorry, we don't have that. Here's what we do have..."

Our API should be the good waiter!

---

## Part 1: Understanding HTTP Status Codes (15 minutes)

### The Language of API Responses

HTTP status codes tell the client what happened:

| Code | Category | Meaning |
|------|----------|---------|
| **200** | Success | Everything worked! |
| **201** | Success | Created something new |
| **400** | Client Error | Your request was bad |
| **404** | Client Error | Resource not found |
| **500** | Server Error | Something broke on our end |

### Status Codes in Flask

```python
from flask import jsonify

# Success (200 is default)
return jsonify({"data": "here"})

# Success with explicit code
return jsonify({"data": "here"}), 200

# Created (201)
return jsonify({"message": "Recipe created"}), 201

# Bad request (400)
return jsonify({"error": "Invalid input"}), 400

# Not found (404)
return jsonify({"error": "Recipe not found"}), 404

# Server error (500)
return jsonify({"error": "Something went wrong"}), 500
```

---

## Part 2: Error Handling with try/except (20 minutes)

### The try/except Pattern

```python
try:
    # Code that might fail
    result = risky_operation()
except SomeError as e:
    # What to do if it fails
    handle_error(e)
```

### Common Error Types

| Exception | When It Happens |
|-----------|-----------------|
| `FileNotFoundError` | File doesn't exist |
| `json.JSONDecodeError` | Invalid JSON |
| `KeyError` | Dictionary key doesn't exist |
| `ValueError` | Wrong type of value |
| `Exception` | Catch-all for any error |

### Real Example: Safe File Loading

```python
import json

def load_recipe(recipe_id):
    """Load a recipe file safely."""
    filepath = f"recipes/{recipe_id}.json"

    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None  # Recipe doesn't exist
    except json.JSONDecodeError:
        print(f"Warning: {filepath} has invalid JSON")
        return None
```

### Multiple except Blocks

```python
def process_data(data):
    try:
        # Multiple things that could fail
        value = int(data['count'])
        result = 100 / value
        return result
    except KeyError:
        return {"error": "Missing 'count' field"}, 400
    except ValueError:
        return {"error": "'count' must be a number"}, 400
    except ZeroDivisionError:
        return {"error": "'count' cannot be zero"}, 400
    except Exception as e:
        # Catch anything else
        print(f"Unexpected error: {e}")
        return {"error": "Internal server error"}, 500
```

---

## Part 3: Query Parameter Validation (15 minutes)

### Getting Query Parameters

```python
from flask import request

@app.route('/api/ingredients')
def get_ingredients():
    # Get parameters with defaults
    category = request.args.get('category')  # None if not provided
    limit = request.args.get('limit', '10')  # Default: "10"
    search = request.args.get('search', '')
```

### Validating Parameters

```python
@app.route('/api/ingredients')
def get_ingredients():
    # Get and validate 'limit' parameter
    limit_str = request.args.get('limit', '50')

    try:
        limit = int(limit_str)
        if limit < 1:
            return jsonify({"error": "limit must be positive"}), 400
        if limit > 100:
            limit = 100  # Cap at 100
    except ValueError:
        return jsonify({"error": "limit must be a number"}), 400

    # Continue with valid limit...
```

### Validation Helper Function

```python
def validate_positive_int(value, name, default=10, max_value=100):
    """
    Validate and convert a string to a positive integer.

    Args:
        value: The string value to validate
        name: Parameter name (for error messages)
        default: Default if value is None
        max_value: Maximum allowed value

    Returns:
        tuple: (int_value, error_response)
               error_response is None if valid
    """
    if value is None:
        return default, None

    try:
        int_value = int(value)
        if int_value < 1:
            return None, ({"error": f"{name} must be positive"}, 400)
        if int_value > max_value:
            int_value = max_value
        return int_value, None
    except ValueError:
        return None, ({"error": f"{name} must be a number"}, 400)
```

---

## Part 4: Building the Complete Ingredient API (30 minutes)

Let's build a robust ingredient API. Update your `app.py`:

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

RECIPES_DIR = Path(__file__).parent / "recipes"

# All available ingredients organized by category
INGREDIENTS = {
    "vegetables": [
        "tomato", "lettuce", "onion", "carrot", "potato",
        "corn", "broccoli", "pepper", "mushroom", "garlic",
        "cucumber", "eggplant"
    ],
    "fruits": [
        "apple", "banana", "lemon", "avocado", "strawberry",
        "orange", "grapes", "watermelon", "pineapple"
    ],
    "proteins": [
        "egg", "chicken", "beef", "bacon", "fish", "shrimp"
    ],
    "dairy": [
        "cheese", "milk", "butter", "yogurt"
    ],
    "grains": [
        "bread", "rice", "pasta", "dough", "tortilla", "croissant"
    ],
    "other": [
        "honey", "salt", "oil", "basil", "chocolate",
        "ice_cream", "cookie", "cake"
    ]
}

def get_all_ingredients():
    """Get a flat list of all ingredients."""
    all_items = []
    for category_items in INGREDIENTS.values():
        all_items.extend(category_items)
    return all_items


@app.route('/api/ingredients', methods=['GET'])
def get_ingredients():
    """
    Get available ingredients with optional filtering.

    Query Parameters:
        category: Filter by category (vegetables, fruits, etc.)
        search: Search for ingredients containing this text
        limit: Maximum number of results (default: 50, max: 100)

    Returns:
        JSON with ingredients list and metadata
    """
    # Get query parameters
    category = request.args.get('category')
    search = request.args.get('search', '').lower().strip()
    limit_str = request.args.get('limit', '50')

    # Validate limit parameter
    try:
        limit = int(limit_str)
        if limit < 1:
            return jsonify({
                "error": "limit must be a positive number",
                "provided": limit_str
            }), 400
        limit = min(limit, 100)  # Cap at 100
    except ValueError:
        return jsonify({
            "error": "limit must be a valid number",
            "provided": limit_str
        }), 400

    # Get ingredients based on category
    if category:
        if category not in INGREDIENTS:
            return jsonify({
                "error": f"Unknown category: {category}",
                "available_categories": list(INGREDIENTS.keys())
            }), 400
        result = INGREDIENTS[category].copy()
    else:
        result = get_all_ingredients()

    # Apply search filter
    if search:
        result = [item for item in result if search in item.lower()]

    # Apply limit
    total_count = len(result)
    result = result[:limit]

    return jsonify({
        "ingredients": result,
        "count": len(result),
        "total_available": total_count,
        "filters": {
            "category": category,
            "search": search if search else None,
            "limit": limit
        }
    })


@app.route('/api/ingredients/categories', methods=['GET'])
def get_categories():
    """Get all ingredient categories with counts."""
    categories = {}
    for name, items in INGREDIENTS.items():
        categories[name] = {
            "count": len(items),
            "items": items
        }

    return jsonify({
        "categories": categories,
        "total_categories": len(INGREDIENTS),
        "total_ingredients": len(get_all_ingredients())
    })


@app.route('/api/ingredients/<ingredient_id>', methods=['GET'])
def get_ingredient(ingredient_id):
    """Get details about a specific ingredient."""
    ingredient_lower = ingredient_id.lower()

    # Find the ingredient and its category
    for category, items in INGREDIENTS.items():
        if ingredient_lower in items:
            return jsonify({
                "id": ingredient_lower,
                "name": ingredient_lower.replace('_', ' ').title(),
                "category": category
            })

    # Not found
    return jsonify({
        "error": f"Ingredient '{ingredient_id}' not found",
        "suggestion": "Use /api/ingredients to see available ingredients"
    }), 404


# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        "error": "Endpoint not found",
        "message": str(error)
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({
        "error": "Internal server error",
        "message": "Something went wrong on our end"
    }), 500


if __name__ == '__main__':
    print("Starting Recipe Kitchen API...")
    print(f"Loaded {len(get_all_ingredients())} ingredients")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
```

---

## Part 5: Testing Your API (15 minutes)

### Test All Endpoints

```bash
# 1. Get all ingredients
curl http://localhost:5000/api/ingredients

# 2. Filter by category
curl "http://localhost:5000/api/ingredients?category=vegetables"

# 3. Search for ingredients
curl "http://localhost:5000/api/ingredients?search=ch"

# 4. Combine filters
curl "http://localhost:5000/api/ingredients?category=dairy&search=ch"

# 5. Limit results
curl "http://localhost:5000/api/ingredients?limit=5"

# 6. Get categories
curl http://localhost:5000/api/ingredients/categories

# 7. Get specific ingredient
curl http://localhost:5000/api/ingredients/tomato

# 8. Test error handling - invalid category
curl "http://localhost:5000/api/ingredients?category=invalid"

# 9. Test error handling - invalid limit
curl "http://localhost:5000/api/ingredients?limit=abc"

# 10. Test error handling - not found
curl http://localhost:5000/api/ingredients/unicorn
```

### Expected Error Responses

**Invalid category:**
```json
{
  "error": "Unknown category: invalid",
  "available_categories": ["vegetables", "fruits", "proteins", "dairy", "grains", "other"]
}
```

**Invalid limit:**
```json
{
  "error": "limit must be a valid number",
  "provided": "abc"
}
```

**Ingredient not found:**
```json
{
  "error": "Ingredient 'unicorn' not found",
  "suggestion": "Use /api/ingredients to see available ingredients"
}
```

---

## Challenge: Add More Validation

Extend the API with these features:

1. **Add a `sort` parameter** to `/api/ingredients`:
   - `sort=asc` - Sort A to Z
   - `sort=desc` - Sort Z to A
   - Return error for invalid sort values

2. **Add a `random` parameter**:
   - `random=true` - Return ingredients in random order
   - Combine with limit: `random=true&limit=5` for 5 random ingredients

3. **Add `/api/ingredients/search` POST endpoint**:
   - Accept JSON body: `{"terms": ["tom", "ch"]}`
   - Return ingredients matching ANY of the search terms

---

## What We Learned

- ✅ HTTP status codes (200, 400, 404, 500)
- ✅ Error handling with try/except
- ✅ Query parameter validation
- ✅ Defensive programming
- ✅ Helpful error messages
- ✅ Flask error handlers

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **Status Code** | Number indicating success/failure (200, 404, etc.) |
| **try/except** | Catch and handle errors gracefully |
| **Validation** | Checking if input is valid before using it |
| **Query Parameter** | URL parameter after `?` (e.g., `?category=dairy`) |
| **Defensive Programming** | Writing code that handles unexpected situations |

---

## Next Steps

In **Lessons 6-7**, we'll master Python **dictionaries**:
- Key-value pairs
- Nested data structures
- Parsing JSON
- Recipe data modeling

Your homework: Complete the challenge above and test all edge cases!
