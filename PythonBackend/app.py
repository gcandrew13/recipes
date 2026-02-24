"""
Flask API server for Recipe Kitchen project.
Handles recipe database, search, and intersection logic.
Run with: python app.py
"""

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os
from pathlib import Path
from recipe_display import (
    display_recipe_simple,
    display_recipe_ingredients,
    display_recipe_steps,
    display_recipe_materials,
    display_recipe_full,
    display_recipe_card,
    display_recipe_json,
    load_recipe
)

app = Flask(__name__)
CORS(app)  # Allow Unity to make requests

# Path to recipes directory
RECIPES_DIR = Path(__file__).parent / "recipes"
DATA_DIR = Path(__file__).parent / "data"

def load_recipes():
    """Load all recipes from JSON files in recipes directory."""
    recipes = []
    if RECIPES_DIR.exists():
        for recipe_file in RECIPES_DIR.glob("*.json"):
            try:
                with open(recipe_file, 'r', encoding='utf-8') as f:
                    recipe = json.load(f)
                    recipes.append(recipe)
            except Exception as e:
                print(f"Error loading {recipe_file}: {e}")
    return recipes

def find_recipe_intersections(selected_items):
    """
    Find recipes that contain ALL selected items.
    Like a search algorithm showing intersection of recipes.
    
    Args:
        selected_items: List of item names (e.g., ["tomato", "cheese"])
    
    Returns:
        List of recipes that contain all selected items
    """
    recipes = load_recipes()
    matching_recipes = []
    
    for recipe in recipes:
        # Get recipe ingredients (handle both old array and new dict format)
        ingredients = recipe.get("ingredients", {})
        
        if isinstance(ingredients, dict):
            # New format: dictionary with ingredient names as keys
            recipe_ingredients = [ing.lower() for ing in ingredients.keys()]
        elif isinstance(ingredients, list):
            # Old format: simple list
            recipe_ingredients = [ing.lower() for ing in ingredients]
        else:
            recipe_ingredients = []
        
        selected_lower = [item.lower() for item in selected_items]
        
        # Check if ALL selected items are in recipe ingredients
        if all(item in recipe_ingredients for item in selected_lower):
            matching_recipes.append(recipe)
    
    return matching_recipes

@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    """Get all available recipes."""
    recipes = load_recipes()
    return jsonify(recipes)

@app.route('/api/recipes/search', methods=['POST'])
def search_recipes():
    """
    Search for recipes by selected items.
    Expects JSON: {"items": ["tomato", "cheese", ...]}
    """
    data = request.get_json()
    selected_items = data.get("items", [])
    
    matching_recipes = find_recipe_intersections(selected_items)
    
    return jsonify({
        "selected_items": selected_items,
        "recipes": matching_recipes,
        "count": len(matching_recipes)
    })

@app.route('/api/recipes/<recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    """Get a specific recipe by ID."""
    recipes = load_recipes()
    for recipe in recipes:
        if recipe.get("id") == recipe_id:
            return jsonify(recipe)
    return jsonify({"error": "Recipe not found"}), 404

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Recipe API is running"})

@app.route('/api/recipes/<recipe_id>/display/<display_format>', methods=['GET'])
def display_recipe_format(recipe_id, display_format):
    """
    Display recipe in various formats.
    Formats: simple, ingredients, steps, materials, full, card, json
    """
    recipe = load_recipe(recipe_id)
    
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    
    format_functions = {
        "simple": display_recipe_simple,
        "ingredients": display_recipe_ingredients,
        "steps": display_recipe_steps,
        "materials": display_recipe_materials,
        "full": display_recipe_full,
        "card": display_recipe_card,
        "json": lambda r: display_recipe_json(r)
    }
    
    if display_format not in format_functions:
        return jsonify({
            "error": "Invalid format",
            "available_formats": list(format_functions.keys())
        }), 400
    
    display_func = format_functions[display_format]
    display_text = display_func(recipe)
    
    return jsonify({
        "recipe_id": recipe_id,
        "format": display_format,
        "display": display_text
    })

@app.route('/api/recipes/<recipe_id>/display', methods=['GET'])
def display_recipe_all_formats(recipe_id):
    """Display recipe in all available formats."""
    recipe = load_recipe(recipe_id)
    
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    
    formats = {
        "simple": display_recipe_simple(recipe),
        "ingredients": display_recipe_ingredients(recipe),
        "steps": display_recipe_steps(recipe),
        "materials": display_recipe_materials(recipe),
        "full": display_recipe_full(recipe),
        "card": display_recipe_card(recipe),
        "json": display_recipe_json(recipe)
    }
    
    return jsonify({
        "recipe_id": recipe_id,
        "formats": formats
    })

# Web Interface Routes
@app.route('/')
def index():
    """Serve the main recipe management page."""
    return render_template('index.html')

@app.route('/api/recipes', methods=['POST'])
def create_recipe():
    """Create a new recipe."""
    try:
        recipe = request.get_json()
        recipe_id = recipe.get('id')
        
        if not recipe_id:
            return jsonify({"error": "Recipe ID is required"}), 400
        
        recipe_file = RECIPES_DIR / f"{recipe_id}.json"
        
        if recipe_file.exists():
            return jsonify({"error": "Recipe already exists"}), 400
        
        with open(recipe_file, 'w', encoding='utf-8') as f:
            json.dump(recipe, f, indent=2, ensure_ascii=False)
        
        return jsonify({"message": "Recipe created successfully", "recipe": recipe}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recipes/<recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    """Update an existing recipe."""
    try:
        recipe = request.get_json()
        recipe_file = RECIPES_DIR / f"{recipe_id}.json"
        
        if not recipe_file.exists():
            return jsonify({"error": "Recipe not found"}), 404
        
        # Ensure ID matches
        recipe['id'] = recipe_id
        
        with open(recipe_file, 'w', encoding='utf-8') as f:
            json.dump(recipe, f, indent=2, ensure_ascii=False)
        
        return jsonify({"message": "Recipe updated successfully", "recipe": recipe}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recipes/<recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    """Delete a recipe."""
    try:
        recipe_file = RECIPES_DIR / f"{recipe_id}.json"
        
        if not recipe_file.exists():
            return jsonify({"error": "Recipe not found"}), 404
        
        recipe_file.unlink()
        
        return jsonify({"message": "Recipe deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ensure directories exist
    RECIPES_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    print("Starting Recipe Kitchen API server...")
    print(f"Recipes directory: {RECIPES_DIR}")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
