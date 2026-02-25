# Lesson Plan: Lessons 1-2
## Project Setup & Flask Basics

**Duration:** 2 lessons (2-4 hours total)
**Prerequisites:** Python 3.11+ installed, VS Code installed
**Goal:** Set up the development environment and create your first API endpoint

---

## Learning Objectives

By the end of these lessons, you will:
1. Set up a Python project with virtual environment
2. Understand how web APIs work (client-server model)
3. Create a Flask application with routes
4. Understand decorators and the `@app.route` syntax
5. Return JSON data from an API endpoint
6. Connect the pre-built frontend to your backend

---

## The Big Picture: What Are We Building?

Imagine you're building a smart kitchen. The kitchen has a fridge full of ingredients, a counter to work on, and a basket where you can drop ingredients to find recipes.

But here's the cool part: the kitchen (the **frontend**) doesn't actually know any recipes! It asks a chef (the **backend**) every time it needs information.

```
┌─────────────────┐          HTTP Request         ┌─────────────────┐
│                 │  ──────────────────────────►  │                 │
│    Frontend     │   "What recipes have tomato?" │    Backend      │
│  (HTML/JS/CSS)  │                               │    (Python)     │
│                 │  ◄──────────────────────────  │                 │
│                 │       JSON Response           │                 │
└─────────────────┘    [{name: "Pizza"}, ...]     └─────────────────┘
```

**You're building the chef (backend)!** The frontend is already built - you just need to make it work.

---

# LESSON 1: Hello Python & Project Setup (1-2 hours)

## Part 1: Python Refresher (15 minutes)

### Quick Python Check

Open a terminal and type `python3` to start the Python interpreter:

```python
# Variables and strings
name = "Recipe Kitchen"
print(name)

# Numbers
items = 5
total = items * 2
print(f"Total: {total}")

# Lists (we'll dive deeper into these in Lesson 3)
ingredients = ["tomato", "cheese", "basil"]
print(ingredients[0])  # "tomato"

# Dictionaries (we'll cover these in Lesson 6)
recipe = {"name": "Pizza", "time": "30 min"}
print(recipe["name"])  # "Pizza"
```

Type `exit()` to leave the Python interpreter.

### What's Different About Web Development?

In regular Python scripts, you run them once and they're done. Web applications are different:

- They **run continuously**, waiting for requests
- They **respond to HTTP requests** (like when you visit a website)
- They **return data** (usually JSON) instead of printing to console

---

## Part 2: Project Setup (20 minutes)

### Step 1: Create Project Folder

Open Terminal and run:

```bash
mkdir RecipeKitchenProject
cd RecipeKitchenProject
```

### Step 2: Create Virtual Environment

A virtual environment keeps your project's packages separate from other projects:

```bash
python3 -m venv venv
```

### Step 3: Activate Virtual Environment

**Mac/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` at the start of your terminal prompt.

### Step 4: Install Flask

```bash
pip install flask flask-cors
```

**What did we install?**
- `flask`: The web framework we'll use to build our API
- `flask-cors`: Allows our frontend to talk to our backend (Cross-Origin Resource Sharing)

### Step 5: Create Project Structure

```bash
mkdir recipes
touch app.py
```

Your project should look like:
```
RecipeKitchenProject/
├── venv/           # Virtual environment (don't edit!)
├── recipes/        # Recipe JSON files go here
└── app.py          # Our Flask application
```

---

## Part 3: Your First Flask Application (25 minutes)

### Understanding Flask

Flask is a **web framework** - it handles all the complicated stuff about receiving HTTP requests and sending responses. You just tell it what to do for each URL.

### Step-by-Step: Create app.py

Open `app.py` in VS Code and type:

```python
from flask import Flask, jsonify
from flask_cors import CORS

# Create the Flask application
app = Flask(__name__)
CORS(app)  # Allow frontend to make requests

# Define a route (URL endpoint)
@app.route('/api/health', methods=['GET'])
def health_check():
    """Return a simple health check response."""
    return jsonify({
        "status": "ok",
        "message": "Recipe API is running"
    })

# Start the server
if __name__ == '__main__':
    print("Starting Recipe Kitchen API...")
    print("Server running on http://localhost:5000")
    print("blah blah blah")
    app.run(debug=True, port=5000)
```

### Code Breakdown

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `from flask import Flask, jsonify` | Import Flask class and JSON helper |
| 2 | `from flask_cors import CORS` | Import CORS for cross-origin requests |
| 4 | `app = Flask(__name__)` | Create Flask app instance |
| 5 | `CORS(app)` | Enable CORS (so browser can call our API) |
| 7 | `@app.route('/api/health', ...)` | **Decorator**: attach this function to URL `/api/health` |
| 8 | `def health_check():` | Function that runs when URL is accessed |
| 10 | `return jsonify({...})` | Return a Python dict as JSON |
| 13 | `if __name__ == '__main__':` | Only run server if this file is executed directly |
| 15 | `app.run(debug=True, port=5000)` | Start server on port 5000 with auto-reload |

### Understanding Decorators

The `@app.route` syntax might look strange. It's called a **decorator**.

Think of it like a name tag on a function:
- Without decorator: The function exists but Flask doesn't know about it
- With decorator: Flask knows "when someone visits `/api/health`, run this function"

```python
@app.route('/api/health')  # "Register this function for /api/health"
def health_check():        # The actual function
    return jsonify(...)
```

---

## Part 4: Run and Test Your API (15 minutes)

### Step 1: Start the Server

In terminal (make sure you're in your project folder with venv activated):

```bash
python app.py
```

You should see:
```
Starting Recipe Kitchen API...
Server running on http://localhost:5000
 * Running on http://127.0.0.1:5000
 * Restarting with stat
 * Debugger is active!
```

**Keep this terminal open!** The server needs to keep running.

### Step 2: Test in Browser

Open your web browser and go to:
```
    http://localhost:5000/api/health
```

You should see:
```json
{
  "message": "Recipe API is running",
  "status": "ok"
}
```

### Step 3: Test with curl (Optional)

Open a **new** terminal window and run:

```bash
curl http://localhost:5000/api/health
```

Same response!

### Intuition Builder: What Just Happened?

1. You ran `python app.py` - this started a web server on your computer
2. The server listens on port 5000 for incoming requests
3. When you visited `/api/health` in the browser, it sent an HTTP GET request
4. Flask matched the URL to your `health_check()` function
5. The function returned JSON, which the browser displayed

---

# LESSON 2: Building Real Endpoints (1-2 hours)

## Part 5: Adding the Frontend (20 minutes)

Now let's add the pre-built kitchen interface!

### Step 1: Copy Frontend Files

Copy the entire `Frontend` folder from the course materials into your project:

```bash
cp -r /path/to/RecipeKitchen/Frontend ./
```

Your project should now look like:
```
RecipeKitchenProject/
├── venv/
├── recipes/
├── Frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── app.py
```

### Step 2: Test the Frontend

1. Make sure your Flask server is still running
2. Open `Frontend/index.html` in your web browser (double-click the file)
3. You should see the kitchen interface with:
   - A fridge with ingredients
   - A counter area
   - A basket for dropping ingredients
   - A recipes panel on the right

### Step 3: Check the Connection

Open your browser's developer console (F12 → Console tab). You should see:
```
Recipe Kitchen starting...
Kitchen ready!
```

If you see CORS errors, make sure your Flask server is running!

---

## Part 6: Adding a Recipes Endpoint (25 minutes)

The frontend expects a `/api/recipes` endpoint. Let's create it!

### Step 1: Create Sample Recipe File

Create `recipes/pizza.json`:

```json
{
    "id": "pizza",
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza with fresh ingredients",
    "ingredients": {
        "dough": {"amount": 1, "unit": "ball"},
        "tomato": {"amount": 3, "unit": "pieces"},
        "cheese": {"amount": 200, "unit": "grams"},
        "basil": {"amount": 10, "unit": "leaves"}
    },
    "steps": [
        "Preheat oven to 450°F (230°C)",
        "Roll out the dough into a circle",
        "Spread crushed tomatoes on the dough",
        "Add sliced cheese evenly",
        "Bake for 12-15 minutes until golden",
        "Add fresh basil leaves before serving"
    ],
    "time": ["15 min", "20 min"],
    "servings": 4,
    "materials": ["oven", "rolling pin", "baking sheet"]
}
```

### Step 2: Add Recipes Endpoint to app.py

Update your `app.py`:

```python
from flask import Flask, jsonify
from flask_cors import CORS
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Path to recipes directory
RECIPES_DIR = Path(__file__).parent / "recipes"

def load_recipes():
    """Load all recipes from JSON files."""
    recipes = []
    if RECIPES_DIR.exists():
        for recipe_file in RECIPES_DIR.glob("*.json"):
            with open(recipe_file, 'r') as f:
                recipe = json.load(f)
                recipes.append(recipe)
    return recipes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "message": "Recipe API is running"
    })

@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    """Return all available recipes."""
    recipes = load_recipes()
    return jsonify(recipes)

if __name__ == '__main__':
    print("Starting Recipe Kitchen API...")
    print(f"Recipes directory: {RECIPES_DIR}")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
```

### Code Breakdown: New Additions

| Line | Code | Explanation |
|------|------|-------------|
| 3 | `import json` | Python's JSON parsing library |
| 4 | `from pathlib import Path` | Modern way to handle file paths |
| 9 | `RECIPES_DIR = Path(__file__).parent / "recipes"` | Path to recipes folder |
| 11 | `def load_recipes():` | Function to load all recipe JSON files |
| 15 | `RECIPES_DIR.glob("*.json")` | Find all .json files in the folder |
| 16-18 | `with open(...) as f:` | Open file, read JSON, add to list |
| 27 | `@app.route('/api/recipes', ...)` | New endpoint for recipes |
| 29 | `recipes = load_recipes()` | Call our function to get recipes |
| 30 | `return jsonify(recipes)` | Return the list as JSON |

### Step 3: Test the Recipes Endpoint

1. Save `app.py` (Flask auto-reloads!)
2. Visit `http://localhost:5000/api/recipes` in your browser
3. You should see your pizza recipe as JSON

---

## Part 7: The Search Endpoint (20 minutes)

The frontend needs to search for recipes by ingredients. Let's add that!

Add this to `app.py` (before the `if __name__ == '__main__':` line):

```python
from flask import Flask, jsonify, request
# ... (keep existing code) ...

@app.route('/api/recipes/search', methods=['POST'])
def search_recipes():
    """Search for recipes by selected ingredients."""
    data = request.get_json()
    selected_items = data.get("items", [])

    if not selected_items:
        return jsonify({"recipes": [], "count": 0})

    recipes = load_recipes()
    matching_recipes = []

    for recipe in recipes:
        ingredients = recipe.get("ingredients", {})
        recipe_ingredients = [ing.lower() for ing in ingredients.keys()]
        selected_lower = [item.lower() for item in selected_items]

        # Check if ALL selected items are in this recipe
        if all(item in recipe_ingredients for item in selected_lower):
            matching_recipes.append(recipe)

    return jsonify({
        "selected_items": selected_items,
        "recipes": matching_recipes,
        "count": len(matching_recipes)
    })
```

### Code Breakdown: Search Endpoint

| Line | Code | Explanation |
|------|------|-------------|
| 1 | `methods=['POST']` | This endpoint accepts POST requests (with data in body) |
| 3 | `request.get_json()` | Parse JSON from the request body |
| 4 | `data.get("items", [])` | Get items array, default to empty list |
| 11 | `recipe.get("ingredients", {})` | Get ingredients dict, default to empty |
| 12 | `[ing.lower() for ing in ...]` | List comprehension (Lesson 3 topic!) |
| 15 | `all(item in recipe_ingredients ...)` | Check if ALL items are found |

### Complete app.py

Your full `app.py` should now be:

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

RECIPES_DIR = Path(__file__).parent / "recipes"

def load_recipes():
    """Load all recipes from JSON files."""
    recipes = []
    if RECIPES_DIR.exists():
        for recipe_file in RECIPES_DIR.glob("*.json"):
            with open(recipe_file, 'r') as f:
                recipe = json.load(f)
                recipes.append(recipe)
    return recipes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "message": "Recipe API is running"
    })

@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    """Return all available recipes."""
    recipes = load_recipes()
    return jsonify(recipes)

@app.route('/api/recipes/search', methods=['POST'])
def search_recipes():
    """Search for recipes by selected ingredients."""
    data = request.get_json()
    selected_items = data.get("items", [])

    if not selected_items:
        return jsonify({"recipes": [], "count": 0})

    recipes = load_recipes()
    matching_recipes = []

    for recipe in recipes:
        ingredients = recipe.get("ingredients", {})
        recipe_ingredients = [ing.lower() for ing in ingredients.keys()]
        selected_lower = [item.lower() for item in selected_items]

        if all(item in recipe_ingredients for item in selected_lower):
            matching_recipes.append(recipe)

    return jsonify({
        "selected_items": selected_items,
        "recipes": matching_recipes,
        "count": len(matching_recipes)
    })

if __name__ == '__main__':
    print("Starting Recipe Kitchen API...")
    print(f"Recipes directory: {RECIPES_DIR}")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
```

---

## Part 8: Testing the Complete System (10 minutes)

1. Make sure Flask server is running
2. Open `Frontend/index.html` in your browser
3. Try dragging ingredients to the basket:
   - Drag tomato, cheese, and basil
   - The pizza recipe should appear!

### Test with curl

```bash
curl -X POST http://localhost:5000/api/recipes/search \
  -H "Content-Type: application/json" \
  -d '{"items": ["tomato", "cheese"]}'
```

---

## Challenge: Add More Recipes

Create at least 2 more recipe JSON files in your `recipes/` folder. Make sure they:
1. Have a unique `id`
2. Include ingredients that match items in the fridge (see `Frontend/app.js` for the full list)
3. Follow the same JSON structure as `pizza.json`

**Example: `salad.json`**
```json
{
    "id": "salad",
    "name": "Garden Salad",
    "description": "Fresh and healthy vegetable salad",
    "ingredients": {
        "lettuce": {"amount": 1, "unit": "head"},
        "tomato": {"amount": 2, "unit": "pieces"},
        "cucumber": {"amount": 1, "unit": "piece"},
        "carrot": {"amount": 1, "unit": "piece"}
    },
    "steps": [
        "Wash all vegetables thoroughly",
        "Tear lettuce into bite-sized pieces",
        "Slice tomatoes into wedges",
        "Slice cucumber into rounds",
        "Shred or slice carrot",
        "Combine in a large bowl"
    ],
    "time": ["10 min", "0 min"],
    "servings": 2,
    "materials": ["cutting board", "knife", "salad bowl"]
}
```

---

## What We Learned

### Lesson 1
- ✅ Set up a Python virtual environment
- ✅ Installed Flask and flask-cors
- ✅ Created a Flask application
- ✅ Understood decorators (`@app.route`)
- ✅ Built a health check endpoint
- ✅ Tested with browser and curl

### Lesson 2
- ✅ Added the pre-built frontend
- ✅ Created recipe JSON files
- ✅ Built `/api/recipes` endpoint
- ✅ Built `/api/recipes/search` endpoint
- ✅ Connected frontend to backend

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **Flask** | A Python web framework for building APIs |
| **API** | Application Programming Interface - how programs talk to each other |
| **Endpoint** | A specific URL that accepts requests and returns responses |
| **Route** | The URL path for an endpoint (e.g., `/api/recipes`) |
| **Decorator** | `@app.route` - attaches a function to a URL |
| **JSON** | JavaScript Object Notation - data format for APIs |
| **GET** | HTTP method for retrieving data |
| **POST** | HTTP method for sending data |
| **CORS** | Cross-Origin Resource Sharing - allows frontend to call backend |

---

## Next Steps

In **Lessons 3-4**, we'll dive deep into Python **lists**:
- How lists work under the hood
- Iterating through lists
- Filtering with list comprehensions
- Building a proper ingredients API

Your homework: Add at least 3 more recipes to test your search functionality!
