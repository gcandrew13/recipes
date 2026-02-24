"""
Recipe Display Functions
Provides various display formats for recipes.
"""

import json
from pathlib import Path

def load_recipe(recipe_id):
    """Load a single recipe by ID."""
    recipes_dir = Path(__file__).parent / "recipes"
    
    # Search through all recipes for matching ID
    for recipe_file in recipes_dir.glob("*.json"):
        try:
            with open(recipe_file, 'r', encoding='utf-8') as f:
                recipe = json.load(f)
                # Match by ID (handle both string and int IDs)
                recipe_id_value = recipe.get("id")
                if recipe_id_value == recipe_id:
                    return recipe
                # Also try converting to int if recipe_id is numeric
                if isinstance(recipe_id, str) and recipe_id.isdigit():
                    if recipe_id_value == int(recipe_id):
                        return recipe
        except Exception as e:
            continue
    
    return None

def display_recipe_simple(recipe):
    """Display recipe in simple text format."""
    if not recipe:
        return "Recipe not found"
    
    output = []
    output.append(f"\n{'='*60}")
    output.append(f"Recipe: {recipe.get('name', 'Unknown').title()}")
    output.append(f"{'='*60}")
    
    if 'type' in recipe:
        output.append(f"Type: {recipe['type'].title()}")
    
    if 'servings' in recipe:
        output.append(f"Serves: {recipe['servings']}")
    
    if 'time' in recipe:
        if isinstance(recipe['time'], list):
            output.append(f"Prep Time: {recipe['time'][0]}")
            if len(recipe['time']) > 1:
                output.append(f"Total Time: {recipe['time'][1]}")
        else:
            output.append(f"Time: {recipe['time']}")
    
    return "\n".join(output)

def display_recipe_ingredients(recipe):
    """Display recipe ingredients in formatted way."""
    if not recipe:
        return "Recipe not found"
    
    output = []
    output.append(f"\n{'='*60}")
    output.append(f"Ingredients for {recipe.get('name', 'Unknown').title()}")
    output.append(f"{'='*60}")
    
    ingredients = recipe.get('ingredients', {})
    
    if isinstance(ingredients, dict):
        # New format with amounts and units
        for ingredient, details in ingredients.items():
            amount = details.get('amount', '')
            unit = details.get('unit', '')
            output.append(f"  • {ingredient.title()}: {amount} {unit}")
    elif isinstance(ingredients, list):
        # Old format - simple list
        for ingredient in ingredients:
            output.append(f"  • {ingredient.title()}")
    
    return "\n".join(output)

def display_recipe_steps(recipe):
    """Display recipe steps in formatted way."""
    if not recipe:
        return "Recipe not found"
    
    output = []
    output.append(f"\n{'='*60}")
    output.append(f"Steps for {recipe.get('name', 'Unknown').title()}")
    output.append(f"{'='*60}")
    
    steps = recipe.get('steps', [])
    for i, step in enumerate(steps, 1):
        # Remove numbering if already present
        step_text = step.lstrip('0123456789. ')
        output.append(f"{i}. {step_text}")
    
    return "\n".join(output)

def display_recipe_materials(recipe):
    """Display required materials/tools."""
    if not recipe:
        return "Recipe not found"
    
    output = []
    output.append(f"\n{'='*60}")
    output.append(f"Materials Needed for {recipe.get('name', 'Unknown').title()}")
    output.append(f"{'='*60}")
    
    materials = recipe.get('materials', [])
    for material in materials:
        output.append(f"  • {material.title()}")
    
    return "\n".join(output)

def display_recipe_full(recipe):
    """Display complete recipe in full format."""
    if not recipe:
        return "Recipe not found"
    
    output = []
    output.append(f"\n{'='*60}")
    output.append(f"{recipe.get('name', 'Unknown').title().center(60)}")
    output.append(f"{'='*60}")
    
    # Basic info
    if 'type' in recipe:
        output.append(f"Type: {recipe['type'].title()}")
    if 'servings' in recipe:
        output.append(f"Serves: {recipe['servings']}")
    if 'time' in recipe:
        if isinstance(recipe['time'], list):
            output.append(f"Prep Time: {recipe['time'][0]}")
            if len(recipe['time']) > 1:
                output.append(f"Total Time: {recipe['time'][1]}")
        else:
            output.append(f"Time: {recipe['time']}")
    
    output.append(f"\n{'─'*60}")
    output.append("INGREDIENTS:")
    output.append(f"{'─'*60}")
    
    # Ingredients
    ingredients = recipe.get('ingredients', {})
    if isinstance(ingredients, dict):
        for ingredient, details in ingredients.items():
            amount = details.get('amount', '')
            unit = details.get('unit', '')
            output.append(f"  • {ingredient.title()}: {amount} {unit}")
    elif isinstance(ingredients, list):
        for ingredient in ingredients:
            output.append(f"  • {ingredient.title()}")
    
    output.append(f"\n{'─'*60}")
    output.append("STEPS:")
    output.append(f"{'─'*60}")
    
    # Steps
    steps = recipe.get('steps', [])
    for i, step in enumerate(steps, 1):
        step_text = step.lstrip('0123456789. ')
        output.append(f"{i}. {step_text}")
    
    output.append(f"\n{'─'*60}")
    output.append("MATERIALS NEEDED:")
    output.append(f"{'─'*60}")
    
    # Materials
    materials = recipe.get('materials', [])
    for material in materials:
        output.append(f"  • {material.title()}")
    
    # Combos
    if 'combos' in recipe and recipe['combos']:
        output.append(f"\n{'─'*60}")
        output.append("GOES WELL WITH:")
        output.append(f"{'─'*60}")
        for combo in recipe['combos']:
            output.append(f"  • {combo}")
    
    return "\n".join(output)

def display_recipe_card(recipe):
    """Display recipe as a card format (compact)."""
    if not recipe:
        return "Recipe not found"
    
    output = []
    output.append(f"\n┌{'─'*58}┐")
    output.append(f"│ {recipe.get('name', 'Unknown').title():<56} │")
    output.append(f"├{'─'*58}┤")
    
    if 'type' in recipe:
        output.append(f"│ Type: {recipe['type'].title():<49} │")
    if 'servings' in recipe:
        output.append(f"│ Serves: {recipe['servings']:<48} │")
    if 'time' in recipe:
        if isinstance(recipe['time'], list):
            output.append(f"│ Time: {recipe['time'][1] if len(recipe['time']) > 1 else recipe['time'][0]:<49} │")
        else:
            output.append(f"│ Time: {recipe['time']:<49} │")
    
    output.append(f"├{'─'*58}┤")
    output.append(f"│ Ingredients: {' ' * 45} │")
    
    ingredients = recipe.get('ingredients', {})
    if isinstance(ingredients, dict):
        for ingredient, details in ingredients.items():
            amount = details.get('amount', '')
            unit = details.get('unit', '')
            ing_line = f"│   • {ingredient.title()}: {amount} {unit}"
            output.append(f"{ing_line:<59} │")
    elif isinstance(ingredients, list):
        for ingredient in ingredients[:5]:  # Limit to 5 for card
            output.append(f"│   • {ingredient.title():<52} │")
        if len(ingredients) > 5:
            output.append(f"│   ... and {len(ingredients) - 5} more{' ' * 38} │")
    
    output.append(f"└{'─'*58}┘")
    
    return "\n".join(output)

def display_recipe_json(recipe):
    """Display recipe as formatted JSON."""
    if not recipe:
        return "Recipe not found"
    
    return json.dumps(recipe, indent=2, ensure_ascii=False)

def display_all_formats(recipe_id):
    """Display a recipe in all available formats."""
    recipe = load_recipe(recipe_id)
    
    if not recipe:
        print(f"Recipe '{recipe_id}' not found")
        return
    
    print("\n" + "="*60)
    print("DISPLAYING RECIPE IN ALL FORMATS")
    print("="*60)
    
    print("\n1. SIMPLE FORMAT:")
    print(display_recipe_simple(recipe))
    
    print("\n2. INGREDIENTS ONLY:")
    print(display_recipe_ingredients(recipe))
    
    print("\n3. STEPS ONLY:")
    print(display_recipe_steps(recipe))
    
    print("\n4. MATERIALS ONLY:")
    print(display_recipe_materials(recipe))
    
    print("\n5. FULL RECIPE:")
    print(display_recipe_full(recipe))
    
    print("\n6. CARD FORMAT:")
    print(display_recipe_card(recipe))
    
    print("\n7. JSON FORMAT:")
    print(display_recipe_json(recipe))

if __name__ == "__main__":
    # Example usage
    import sys
    
    if len(sys.argv) > 1:
        recipe_id = sys.argv[1]
        display_all_formats(recipe_id)
    else:
        print("Usage: python recipe_display.py <recipe_id>")
        print("\nExample: python recipe_display.py sweet_potato_cake")
        print("\nOr use individual functions:")
        print("  from recipe_display import display_recipe_full, load_recipe")
        print("  recipe = load_recipe('sweet_potato_cake')")
        print("  print(display_recipe_full(recipe))")
