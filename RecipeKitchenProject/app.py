from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from pathlib import Path


app = Flask(__name__)
CORS(app)

# add info load_recipes and directory
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
    """Return a simple health check response."""
    return jsonify({
        "status": "ok",
        "message": "Recipe API is running"
    })

@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    """Return all available recipes."""
    recipes = load_recipes()
    return jsonify(recipes)


@app.route('/api/recipes/search', methods=['GET', 'POST'])
def search_recipes():
    """Search for recipes by selected ingredients."""
    if request.method == 'POST':
        data = request.get_json()
        selected_items = data.get("items", [])
    else:
        # GET: parse items from query param (e.g., ?items=tomato,cheese)
        items_param = request.args.get("items", "")
        selected_items = [item.strip() for item in items_param.split(",") if item.strip()]

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






if __name__ == '__main__':
    print("Starting Recipe Kitchen API...")
    print(f"Recipes directory: {RECIPES_DIR}")
    print("Server running on http://localhost:5001")
    app.run(debug=True, port=5001)

