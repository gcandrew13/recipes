# Lesson Plan: Lessons 6-7
## Python Dictionaries & Nested Data

**Duration:** 2 lessons (2-4 hours total)
**Prerequisites:** Completed Lessons 1-5 (Lists and API basics)
**Goal:** Master dictionaries and work with complex nested data structures

---

## Learning Objectives

By the end of these lessons, you will:
1. Create and manipulate Python dictionaries
2. Access values using keys
3. Work with nested dictionaries
4. Understand the relationship between dictionaries and JSON
5. Parse JSON files into Python objects
6. Model real-world data (recipes) with dictionaries

---

## The Big Picture: Why Dictionaries?

Lists are great for ordered collections, but what if you need to look things up by name instead of position?

**Lists:** Access by position
```python
ingredients[0]  # What's at position 0? Have to remember!
```

**Dictionaries:** Access by name
```python
recipe["name"]  # Clear and readable!
```

### Intuition Builder: Dictionaries Are Like... Dictionaries!

A real dictionary has:
- **Words** (keys) → **Definitions** (values)

A Python dictionary has:
- **Keys** → **Values**

```python
# Real dictionary
word_definitions = {
    "Python": "A programming language",
    "Flask": "A web framework",
    "API": "Application Programming Interface"
}

# Recipe dictionary
pizza = {
    "name": "Margherita Pizza",
    "time": 30,
    "difficulty": "easy"
}
```

---

# LESSON 6: Dictionary Basics (1-2 hours)

## Part 1: Creating Dictionaries (15 minutes)

### Empty Dictionaries

```python
# Two ways to create an empty dictionary
recipe = {}
recipe = dict()

print(recipe)  # {}
print(len(recipe))  # 0
```

### Dictionaries with Initial Data

```python
# Simple dictionary
recipe = {
    "name": "Margherita Pizza",
    "time": 30,
    "servings": 4
}

# Keys can be strings, numbers, or tuples
mixed_keys = {
    "name": "Test",
    1: "One",
    (0, 0): "Origin"
}

# Values can be anything
mixed_values = {
    "count": 42,
    "name": "Recipe",
    "ingredients": ["tomato", "cheese"],
    "active": True
}
```

### Dictionary vs List

| Feature | List | Dictionary |
|---------|------|------------|
| Access | By position `[0]` | By key `["name"]` |
| Order | Preserved | Preserved (Python 3.7+) |
| Syntax | `[item1, item2]` | `{key: value}` |
| Lookup | Slow (search all) | Fast (direct access) |

---

## Part 2: Accessing Dictionary Values (20 minutes)

### Basic Access with Square Brackets

```python
recipe = {
    "name": "Margherita Pizza",
    "time": 30,
    "difficulty": "easy"
}

# Access by key
name = recipe["name"]      # "Margherita Pizza"
time = recipe["time"]      # 30

# KeyError if key doesn't exist!
# rating = recipe["rating"]  # KeyError: 'rating'
```

### Safe Access with .get()

```python
recipe = {"name": "Pizza", "time": 30}

# .get() returns None if key doesn't exist
rating = recipe.get("rating")  # None (no error!)

# .get() with default value
rating = recipe.get("rating", 0)  # 0 (default)
difficulty = recipe.get("difficulty", "medium")  # "medium"
```

### When to Use Which

| Method | Use When |
|--------|----------|
| `dict["key"]` | Key MUST exist (error if not) |
| `dict.get("key")` | Key might not exist |
| `dict.get("key", default)` | Want a default value |

---

## Part 3: Modifying Dictionaries (20 minutes)

### Adding and Updating Values

```python
recipe = {"name": "Pizza"}

# Add new key-value pairs
recipe["time"] = 30
recipe["difficulty"] = "easy"

# Update existing values
recipe["time"] = 35  # Changed from 30 to 35

print(recipe)
# {"name": "Pizza", "time": 35, "difficulty": "easy"}
```

### Removing Values

```python
recipe = {
    "name": "Pizza",
    "time": 30,
    "difficulty": "easy",
    "temp_note": "delete me"
}

# Remove and get value
time = recipe.pop("time")
print(time)    # 30
print(recipe)  # {"name": "Pizza", "difficulty": "easy", "temp_note": "delete me"}

# Remove without getting value
del recipe["temp_note"]

# Remove with default (no error if missing)
note = recipe.pop("missing_key", None)  # None, no error

# Clear all
recipe.clear()  # {}
```

### Update Multiple Values

```python
recipe = {"name": "Pizza", "time": 30}

# Update multiple at once
recipe.update({
    "time": 35,
    "difficulty": "easy",
    "servings": 4
})

print(recipe)
# {"name": "Pizza", "time": 35, "difficulty": "easy", "servings": 4}
```

---

## Part 4: Dictionary Methods (15 minutes)

### Getting Keys, Values, and Items

```python
recipe = {
    "name": "Pizza",
    "time": 30,
    "difficulty": "easy"
}

# Get all keys
keys = recipe.keys()
print(list(keys))  # ["name", "time", "difficulty"]

# Get all values
values = recipe.values()
print(list(values))  # ["Pizza", 30, "easy"]

# Get all key-value pairs
items = recipe.items()
print(list(items))  # [("name", "Pizza"), ("time", 30), ("difficulty", "easy")]
```

### Checking if Key Exists

```python
recipe = {"name": "Pizza", "time": 30}

# Check for key
if "name" in recipe:
    print("Has name!")

if "rating" not in recipe:
    print("No rating yet")

# Don't do this (inefficient):
# if "name" in recipe.keys():  # Unnecessary
```

### Method Summary

| Method | Returns |
|--------|---------|
| `dict.keys()` | All keys |
| `dict.values()` | All values |
| `dict.items()` | All (key, value) pairs |
| `dict.get(key)` | Value or None |
| `dict.get(key, default)` | Value or default |
| `dict.pop(key)` | Remove and return value |
| `dict.update(other)` | Merge another dict |

---

## Part 5: Iterating Through Dictionaries (15 minutes)

### Iterate Over Keys (Default)

```python
recipe = {"name": "Pizza", "time": 30, "difficulty": "easy"}

for key in recipe:
    print(key)
# name
# time
# difficulty
```

### Iterate Over Values

```python
for value in recipe.values():
    print(value)
# Pizza
# 30
# easy
```

### Iterate Over Key-Value Pairs

```python
for key, value in recipe.items():
    print(f"{key}: {value}")
# name: Pizza
# time: 30
# difficulty: easy
```

### Dictionary Comprehensions

```python
# Transform values
recipe = {"name": "Pizza", "time": 30}
upper_recipe = {k: str(v).upper() for k, v in recipe.items()}
# {"name": "PIZZA", "time": "30"}

# Filter items
scores = {"alice": 85, "bob": 92, "charlie": 78}
passing = {k: v for k, v in scores.items() if v >= 80}
# {"alice": 85, "bob": 92}
```

---

# LESSON 7: Nested Data & JSON (1-2 hours)

## Part 6: Nested Dictionaries (25 minutes)

### What Are Nested Dictionaries?

Real-world data is often hierarchical. A recipe isn't just flat data:

```python
recipe = {
    "name": "Margherita Pizza",
    "time": {
        "prep": 15,
        "cook": 20
    },
    "ingredients": {
        "dough": {"amount": 1, "unit": "ball"},
        "tomato": {"amount": 3, "unit": "pieces"},
        "cheese": {"amount": 200, "unit": "grams"}
    },
    "nutrition": {
        "calories": 250,
        "protein": 12
    }
}
```

### Accessing Nested Data

```python
# Single level
name = recipe["name"]  # "Margherita Pizza"

# Two levels deep
prep_time = recipe["time"]["prep"]  # 15

# Three levels deep
tomato_amount = recipe["ingredients"]["tomato"]["amount"]  # 3

# Safe nested access
calories = recipe.get("nutrition", {}).get("calories", 0)  # 250
```

### Modifying Nested Data

```python
# Update nested value
recipe["time"]["prep"] = 20

# Add new nested key
recipe["ingredients"]["basil"] = {"amount": 10, "unit": "leaves"}

# Update nested dictionary
recipe["nutrition"].update({"fat": 8, "carbs": 30})
```

### Visual Representation

```
recipe
├── "name": "Margherita Pizza"
├── "time"
│   ├── "prep": 15
│   └── "cook": 20
├── "ingredients"
│   ├── "dough"
│   │   ├── "amount": 1
│   │   └── "unit": "ball"
│   ├── "tomato"
│   │   ├── "amount": 3
│   │   └── "unit": "pieces"
│   └── "cheese"
│       ├── "amount": 200
│       └── "unit": "grams"
└── "nutrition"
    ├── "calories": 250
    └── "protein": 12
```

---

## Part 7: JSON and Dictionaries (20 minutes)

### JSON = JavaScript Object Notation

JSON is the standard format for API data. It looks almost identical to Python dictionaries!

**JSON:**
```json
{
    "name": "Pizza",
    "time": 30,
    "ingredients": ["tomato", "cheese"]
}
```

**Python Dictionary:**
```python
{
    "name": "Pizza",
    "time": 30,
    "ingredients": ["tomato", "cheese"]
}
```

### Converting Between JSON and Python

```python
import json

# Python dict → JSON string
recipe = {"name": "Pizza", "time": 30}
json_string = json.dumps(recipe)
print(json_string)  # '{"name": "Pizza", "time": 30}'

# JSON string → Python dict
json_string = '{"name": "Pizza", "time": 30}'
recipe = json.loads(json_string)
print(recipe["name"])  # "Pizza"
```

### Reading JSON Files

```python
import json

# Read from file
with open("recipes/pizza.json", "r") as f:
    recipe = json.load(f)

print(recipe["name"])  # "Margherita Pizza"
```

### Writing JSON Files

```python
import json

recipe = {
    "id": "pasta",
    "name": "Spaghetti",
    "time": 25
}

# Write to file
with open("recipes/pasta.json", "w") as f:
    json.dump(recipe, f, indent=2)
```

### JSON Functions Summary

| Function | Purpose |
|----------|---------|
| `json.dumps(dict)` | Dict → JSON string |
| `json.loads(string)` | JSON string → Dict |
| `json.dump(dict, file)` | Dict → JSON file |
| `json.load(file)` | JSON file → Dict |

---

## Part 8: Building a Recipe Data Model (25 minutes)

### Define the Recipe Structure

```python
# Recipe schema
recipe_schema = {
    "id": "string (unique identifier)",
    "name": "string (display name)",
    "description": "string (brief description)",
    "ingredients": {
        "ingredient_name": {
            "amount": "number",
            "unit": "string"
        }
    },
    "steps": ["string (instruction)"],
    "time": ["string (prep time)", "string (cook time)"],
    "servings": "number",
    "difficulty": "string (easy/medium/hard)",
    "materials": ["string (equipment needed)"]
}
```

### Create a Recipe Helper Module

Create `recipe_helpers.py`:

```python
"""Helper functions for working with recipe data."""

import json
from pathlib import Path

RECIPES_DIR = Path(__file__).parent / "recipes"


def load_recipe(recipe_id):
    """Load a single recipe by ID."""
    filepath = RECIPES_DIR / f"{recipe_id}.json"

    if not filepath.exists():
        return None

    with open(filepath, "r") as f:
        return json.load(f)


def load_all_recipes():
    """Load all recipes from the recipes directory."""
    recipes = []

    for filepath in RECIPES_DIR.glob("*.json"):
        with open(filepath, "r") as f:
            recipes.append(json.load(f))

    return recipes


def get_recipe_ingredients(recipe):
    """Get a list of ingredient names from a recipe."""
    ingredients = recipe.get("ingredients", {})
    return list(ingredients.keys())


def get_total_time(recipe):
    """Calculate total time from prep and cook times."""
    times = recipe.get("time", [])

    if len(times) >= 2:
        # Parse "15 min" → 15
        prep = int(times[0].split()[0])
        cook = int(times[1].split()[0])
        return prep + cook

    return 0


def format_recipe_summary(recipe):
    """Create a brief summary of a recipe."""
    name = recipe.get("name", "Unknown")
    servings = recipe.get("servings", "?")
    total_time = get_total_time(recipe)
    ingredient_count = len(get_recipe_ingredients(recipe))

    return f"{name} - {total_time} min, serves {servings}, {ingredient_count} ingredients"


# Test the functions
if __name__ == "__main__":
    recipes = load_all_recipes()

    print(f"Loaded {len(recipes)} recipes:\n")

    for recipe in recipes:
        print(format_recipe_summary(recipe))
```

---

## Part 9: API Integration (15 minutes)

### Update app.py with Dictionary Knowledge

```python
@app.route('/api/recipes/<recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    """Get a specific recipe by ID with formatted response."""
    recipes = load_recipes()

    # Find recipe by ID
    recipe = None
    for r in recipes:
        if r.get("id") == recipe_id:
            recipe = r
            break

    if not recipe:
        return jsonify({
            "error": f"Recipe '{recipe_id}' not found"
        }), 404

    # Add computed fields
    ingredients = recipe.get("ingredients", {})
    times = recipe.get("time", [])

    response = {
        **recipe,  # Spread all existing fields
        "ingredient_count": len(ingredients),
        "ingredient_names": list(ingredients.keys()),
        "total_time": f"{sum_times(times)} min" if times else "Unknown"
    }

    return jsonify(response)


def sum_times(times):
    """Sum prep and cook times."""
    total = 0
    for t in times:
        try:
            minutes = int(t.split()[0])
            total += minutes
        except (ValueError, IndexError):
            pass
    return total
```

---

## Challenge: Recipe Statistics Endpoint

Create a `/api/recipes/stats` endpoint that returns:

```json
{
    "total_recipes": 10,
    "average_time": 25,
    "difficulty_breakdown": {
        "easy": 4,
        "medium": 5,
        "hard": 1
    },
    "most_common_ingredients": [
        {"name": "tomato", "count": 5},
        {"name": "cheese", "count": 4},
        {"name": "onion", "count": 3}
    ],
    "average_ingredients_per_recipe": 6.5
}
```

---

## What We Learned

### Lesson 6
- ✅ Creating dictionaries: `{}`
- ✅ Accessing values: `dict["key"]` and `dict.get("key")`
- ✅ Modifying: add, update, delete
- ✅ Methods: `keys()`, `values()`, `items()`
- ✅ Iterating through dictionaries

### Lesson 7
- ✅ Nested dictionaries
- ✅ JSON format and parsing
- ✅ `json.load()` and `json.dump()`
- ✅ Recipe data modeling
- ✅ Dictionary comprehensions

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **Dictionary** | Key-value data structure |
| **Key** | The lookup name (must be unique) |
| **Value** | The data stored for a key |
| **Nested** | Dictionaries inside dictionaries |
| **JSON** | Text format for structured data |
| **Schema** | Definition of data structure |

---

## Next Steps

In **Lesson 8**, we'll build a complete Recipe API with:
- Full CRUD operations (Create, Read, Update, Delete)
- File-based persistence
- Recipe validation

Your homework: Complete the statistics endpoint challenge!
