#!/usr/bin/env python3
"""
Test script to demonstrate all recipe display formats.
Run with: python test_display.py <recipe_id>
"""

import sys
from recipe_display import (
    load_recipe,
    display_recipe_simple,
    display_recipe_ingredients,
    display_recipe_steps,
    display_recipe_materials,
    display_recipe_full,
    display_recipe_card,
    display_recipe_json
)

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_display.py <recipe_id>")
        print("\nAvailable recipes:")
        print("  - pizza")
        print("  - salad")
        print("  - sandwich")
        print("  - pasta")
        print("  - soup")
        print("  - omelette")
        print("  - smoothie")
        print("  - stir_fry")
        print("  - burger")
        print("  - tacos")
        print("  - cake")
        print("  - cookies")
        print("  - sweet_potato_cake")
        sys.exit(1)
    
    recipe_id = sys.argv[1]
    recipe = load_recipe(recipe_id)
    
    if not recipe:
        print(f"Recipe '{recipe_id}' not found!")
        sys.exit(1)
    
    print("\n" + "="*60)
    print(f"DISPLAYING RECIPE: {recipe.get('name', 'Unknown').title()}")
    print("="*60)
    
    print("\n1. SIMPLE FORMAT:")
    print(display_recipe_simple(recipe))
    
    print("\n2. CARD FORMAT:")
    print(display_recipe_card(recipe))
    
    print("\n3. INGREDIENTS ONLY:")
    print(display_recipe_ingredients(recipe))
    
    print("\n4. STEPS ONLY:")
    print(display_recipe_steps(recipe))
    
    print("\n5. MATERIALS ONLY:")
    print(display_recipe_materials(recipe))
    
    print("\n6. FULL RECIPE:")
    print(display_recipe_full(recipe))
    
    print("\n7. JSON FORMAT:")
    print(display_recipe_json(recipe))

if __name__ == "__main__":
    main()
