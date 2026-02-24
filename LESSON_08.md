# Lesson Plan: Lesson 8
## Recipe API with File I/O

**Duration:** 1-2 hours
**Prerequisites:** Completed Lessons 1-7 (Dictionaries and JSON)
**Goal:** Build a complete Recipe API with CRUD operations and file persistence

---

## Learning Objectives

By the end of this lesson, you will:
1. Implement full CRUD operations (Create, Read, Update, Delete)
2. Work with the file system using `pathlib`
3. Validate incoming data before saving
4. Handle file I/O errors gracefully
5. Build a production-ready Recipe API

---

## The Big Picture: CRUD Operations

Every data-driven application needs four basic operations:

| Operation | HTTP Method | What It Does |
|-----------|-------------|--------------|
| **C**reate | POST | Add new data |
| **R**ead | GET | Retrieve data |
| **U**pdate | PUT | Modify existing data |
| **D**elete | DELETE | Remove data |

Our Recipe API will support all four!

### Intuition Builder: File Cabinet

Think of our recipes folder as a file cabinet:
- **Create:** Add a new folder to the cabinet
- **Read:** Pull out a folder and look at it
- **Update:** Replace the contents of a folder
- **Delete:** Remove a folder entirely

---

## Part 1: File System Basics with pathlib (15 minutes)

### Why pathlib?

`pathlib` is Python's modern way to work with file paths. It's cleaner and more reliable than string manipulation.

```python
from pathlib import Path

# Create a path
recipes_dir = Path("recipes")

# Join paths (works on all operating systems!)
pizza_file = recipes_dir / "pizza.json"
print(pizza_file)  # recipes/pizza.json

# Check if path exists
if recipes_dir.exists():
    print("Recipes folder exists!")

# Check if it's a directory
if recipes_dir.is_dir():
    print("It's a directory!")

# Create directory if it doesn't exist
recipes_dir.mkdir(parents=True, exist_ok=True)
```

### Finding Files

```python
from pathlib import Path

recipes_dir = Path("recipes")

# Find all JSON files
json_files = list(recipes_dir.glob("*.json"))
print(json_files)  # [Path('recipes/pizza.json'), ...]

# Get just the filenames
for filepath in recipes_dir.glob("*.json"):
    print(filepath.stem)  # 'pizza' (filename without extension)
    print(filepath.name)  # 'pizza.json' (filename with extension)
```

### pathlib Cheat Sheet

| Method | What It Does |
|--------|--------------|
| `Path("folder")` | Create a path object |
| `path / "file.txt"` | Join paths |
| `path.exists()` | Check if exists |
| `path.is_dir()` | Check if directory |
| `path.is_file()` | Check if file |
| `path.glob("*.json")` | Find matching files |
| `path.stem` | Filename without extension |
| `path.name` | Filename with extension |
| `path.mkdir()` | Create directory |
| `path.unlink()` | Delete file |

---

## Part 2: Building the Complete Recipe API (40 minutes)

Let's build a full-featured Recipe API. Create or update `app.py`:

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Configuration
RECIPES_DIR = Path(__file__).parent / "recipes"

# Ensure recipes directory exists
RECIPES_DIR.mkdir(parents=True, exist_ok=True)


# ============================================
# Helper Functions
# ============================================

def load_recipes():
    """Load all recipes from JSON files."""
    recipes = []
    for recipe_file in RECIPES_DIR.glob("*.json"):
        try:
            with open(recipe_file, 'r', encoding='utf-8') as f:
                recipe = json.load(f)
                recipes.append(recipe)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Warning: Could not load {recipe_file}: {e}")
    return recipes


def load_recipe(recipe_id):
    """Load a single recipe by ID."""
    filepath = RECIPES_DIR / f"{recipe_id}.json"

    if not filepath.exists():
        return None

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return None


def save_recipe(recipe):
    """Save a recipe to a JSON file."""
    recipe_id = recipe.get("id")
    if not recipe_id:
        raise ValueError("Recipe must have an 'id' field")

    filepath = RECIPES_DIR / f"{recipe_id}.json"

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(recipe, f, indent=2, ensure_ascii=False)

    return filepath


def delete_recipe_file(recipe_id):
    """Delete a recipe file."""
    filepath = RECIPES_DIR / f"{recipe_id}.json"

    if not filepath.exists():
        return False

    filepath.unlink()
    return True


def validate_recipe(recipe):
    """
    Validate recipe data.

    Returns:
        tuple: (is_valid, error_message)
    """
    required_fields = ["id", "name"]

    for field in required_fields:
        if field not in recipe:
            return False, f"Missing required field: {field}"

    # Validate ID format (alphanumeric and underscores only)
    recipe_id = recipe["id"]
    if not recipe_id.replace("_", "").isalnum():
        return False, "ID must contain only letters, numbers, and underscores"

    # Validate ingredients if present
    ingredients = recipe.get("ingredients")
    if ingredients is not None and not isinstance(ingredients, dict):
        return False, "Ingredients must be a dictionary"

    # Validate steps if present
    steps = recipe.get("steps")
    if steps is not None and not isinstance(steps, list):
        return False, "Steps must be a list"

    return True, None


# ============================================
# API Endpoints
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    recipe_count = len(list(RECIPES_DIR.glob("*.json")))
    return jsonify({
        "status": "ok",
        "message": "Recipe API is running",
        "recipe_count": recipe_count
    })


# READ - Get all recipes
@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    """Get all recipes with optional filtering."""
    recipes = load_recipes()

    # Optional query parameters
    difficulty = request.args.get('difficulty')
    max_time = request.args.get('max_time')

    if difficulty:
        recipes = [r for r in recipes if r.get('difficulty') == difficulty]

    if max_time:
        try:
            max_minutes = int(max_time)
            recipes = [r for r in recipes if get_total_time(r) <= max_minutes]
        except ValueError:
            pass  # Ignore invalid max_time

    return jsonify(recipes)


# READ - Get single recipe
@app.route('/api/recipes/<recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    """Get a specific recipe by ID."""
    recipe = load_recipe(recipe_id)

    if not recipe:
        return jsonify({
            "error": f"Recipe '{recipe_id}' not found"
        }), 404

    return jsonify(recipe)


# CREATE - Add new recipe
@app.route('/api/recipes', methods=['POST'])
def create_recipe():
    """Create a new recipe."""
    # Get JSON data
    recipe = request.get_json()

    if not recipe:
        return jsonify({"error": "No JSON data provided"}), 400

    # Validate
    is_valid, error = validate_recipe(recipe)
    if not is_valid:
        return jsonify({"error": error}), 400

    # Check if already exists
    recipe_id = recipe["id"]
    if load_recipe(recipe_id):
        return jsonify({
            "error": f"Recipe '{recipe_id}' already exists",
            "suggestion": "Use PUT to update or choose a different ID"
        }), 409  # 409 Conflict

    # Save
    try:
        save_recipe(recipe)
        return jsonify({
            "message": "Recipe created successfully",
            "recipe": recipe
        }), 201  # 201 Created
    except Exception as e:
        return jsonify({"error": f"Failed to save recipe: {str(e)}"}), 500


# UPDATE - Modify existing recipe
@app.route('/api/recipes/<recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    """Update an existing recipe."""
    # Check if exists
    existing = load_recipe(recipe_id)
    if not existing:
        return jsonify({"error": f"Recipe '{recipe_id}' not found"}), 404

    # Get new data
    recipe = request.get_json()
    if not recipe:
        return jsonify({"error": "No JSON data provided"}), 400

    # Ensure ID matches
    recipe["id"] = recipe_id

    # Validate
    is_valid, error = validate_recipe(recipe)
    if not is_valid:
        return jsonify({"error": error}), 400

    # Save
    try:
        save_recipe(recipe)
        return jsonify({
            "message": "Recipe updated successfully",
            "recipe": recipe
        })
    except Exception as e:
        return jsonify({"error": f"Failed to update recipe: {str(e)}"}), 500


# DELETE - Remove recipe
@app.route('/api/recipes/<recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    """Delete a recipe."""
    if not load_recipe(recipe_id):
        return jsonify({"error": f"Recipe '{recipe_id}' not found"}), 404

    if delete_recipe_file(recipe_id):
        return jsonify({"message": f"Recipe '{recipe_id}' deleted successfully"})
    else:
        return jsonify({"error": "Failed to delete recipe"}), 500


# SEARCH - Find recipes by ingredients
@app.route('/api/recipes/search', methods=['POST'])
def search_recipes():
    """Search for recipes by ingredients."""
    data = request.get_json()
    selected_items = data.get("items", []) if data else []

    if not selected_items:
        return jsonify({"recipes": [], "count": 0})

    recipes = load_recipes()
    matching = []

    for recipe in recipes:
        ingredients = recipe.get("ingredients", {})
        recipe_ingredients = [ing.lower() for ing in ingredients.keys()]
        selected_lower = [item.lower() for item in selected_items]

        if all(item in recipe_ingredients for item in selected_lower):
            matching.append(recipe)

    return jsonify({
        "selected_items": selected_items,
        "recipes": matching,
        "count": len(matching)
    })


# ============================================
# Helper for time calculation
# ============================================

def get_total_time(recipe):
    """Calculate total time from recipe."""
    times = recipe.get("time", [])
    total = 0

    for t in times:
        if isinstance(t, str):
            try:
                minutes = int(t.split()[0])
                total += minutes
            except (ValueError, IndexError):
                pass
        elif isinstance(t, (int, float)):
            total += int(t)

    return total


# ============================================
# Error Handlers
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


# ============================================
# Main
# ============================================

if __name__ == '__main__':
    print("Starting Recipe Kitchen API...")
    print(f"Recipes directory: {RECIPES_DIR}")
    print(f"Found {len(list(RECIPES_DIR.glob('*.json')))} recipes")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
```

---

## Part 3: Testing CRUD Operations (20 minutes)

### Test CREATE (POST)

```bash
# Create a new recipe
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_omelette",
    "name": "Simple Omelette",
    "description": "Quick breakfast recipe",
    "ingredients": {
      "egg": {"amount": 3, "unit": "pieces"},
      "butter": {"amount": 1, "unit": "tbsp"},
      "salt": {"amount": 1, "unit": "pinch"}
    },
    "steps": [
      "Crack eggs into a bowl",
      "Beat eggs with a fork",
      "Melt butter in pan",
      "Pour eggs into pan",
      "Cook until set"
    ],
    "time": ["5 min", "5 min"],
    "servings": 1,
    "difficulty": "easy"
  }'
```

### Test READ (GET)

```bash
# Get all recipes
curl http://localhost:5000/api/recipes

# Get single recipe
curl http://localhost:5000/api/recipes/test_omelette

# Filter by difficulty
curl "http://localhost:5000/api/recipes?difficulty=easy"
```

### Test UPDATE (PUT)

```bash
# Update the recipe
curl -X PUT http://localhost:5000/api/recipes/test_omelette \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_omelette",
    "name": "Cheese Omelette",
    "description": "Quick cheesy breakfast",
    "ingredients": {
      "egg": {"amount": 3, "unit": "pieces"},
      "butter": {"amount": 1, "unit": "tbsp"},
      "cheese": {"amount": 50, "unit": "grams"},
      "salt": {"amount": 1, "unit": "pinch"}
    },
    "steps": [
      "Crack eggs into a bowl",
      "Beat eggs with a fork",
      "Add grated cheese",
      "Melt butter in pan",
      "Pour mixture into pan",
      "Cook until set"
    ],
    "time": ["5 min", "5 min"],
    "servings": 1,
    "difficulty": "easy"
  }'
```

### Test DELETE

```bash
# Delete the recipe
curl -X DELETE http://localhost:5000/api/recipes/test_omelette

# Verify it's gone
curl http://localhost:5000/api/recipes/test_omelette
# Should return 404
```

### Test Error Cases

```bash
# Missing required field
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"name": "No ID Recipe"}'

# Duplicate ID
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"id": "pizza", "name": "Another Pizza"}'

# Invalid ID format
curl -X POST http://localhost:5000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"id": "bad id!", "name": "Bad Recipe"}'
```

---

## Part 4: Testing with the Frontend (10 minutes)

1. Make sure your Flask server is running
2. Open `Frontend/index.html` in your browser
3. The kitchen should load with ingredients
4. Drag ingredients to the basket
5. Matching recipes should appear!

### Verify the Connection

Open browser console (F12) and check for:
- No CORS errors
- API requests succeeding
- Recipe data loading

---

## Challenge: Add Recipe Duplication

Add a new endpoint `POST /api/recipes/<recipe_id>/duplicate` that:

1. Loads the specified recipe
2. Creates a copy with a new ID (original_id + "_copy")
3. Updates the name (add " (Copy)" to the end)
4. Saves as a new recipe

Example:
```bash
curl -X POST http://localhost:5000/api/recipes/pizza/duplicate
```

Should create `pizza_copy.json` with name "Margherita Pizza (Copy)"

---

## What We Learned

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ File system operations with `pathlib`
- ✅ Input validation
- ✅ HTTP status codes for different operations
- ✅ Error handling for file operations
- ✅ Complete API implementation

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **CRUD** | Create, Read, Update, Delete operations |
| **pathlib** | Python's modern file path library |
| **201 Created** | HTTP status for successful creation |
| **409 Conflict** | HTTP status for duplicate/conflict |
| **Validation** | Checking data before saving |
| **Persistence** | Saving data to survive restarts |

---

## Next Steps

In **Lessons 9-10**, we'll learn about Python **sets** and implement:
- Efficient ingredient matching
- Set operations (intersection, union)
- The recipe search algorithm

Your homework: Implement the recipe duplication challenge!
