# Recipe Display Functions

This module provides various display formats for recipes.

## Usage

### Command Line

Display a recipe in all formats:
```bash
python recipe_display.py sweet_potato_cake
```

### Python Code

```python
from recipe_display import (
    load_recipe,
    display_recipe_full,
    display_recipe_card,
    display_recipe_ingredients,
    display_recipe_steps,
    display_recipe_materials,
    display_recipe_simple,
    display_recipe_json
)

# Load a recipe
recipe = load_recipe("pizza")

# Display in different formats
print(display_recipe_full(recipe))
print(display_recipe_card(recipe))
print(display_recipe_ingredients(recipe))
```

## Available Display Formats

### 1. Simple Format
Basic recipe information (name, type, servings, time)
```python
display_recipe_simple(recipe)
```

### 2. Ingredients Only
Lists all ingredients with amounts and units
```python
display_recipe_ingredients(recipe)
```

### 3. Steps Only
Lists all cooking steps
```python
display_recipe_steps(recipe)
```

### 4. Materials Only
Lists required tools and equipment
```python
display_recipe_materials(recipe)
```

### 5. Full Recipe
Complete recipe with all sections
```python
display_recipe_full(recipe)
```

### 6. Card Format
Compact card-style display
```python
display_recipe_card(recipe)
```

### 7. JSON Format
Raw JSON representation
```python
display_recipe_json(recipe)
```

## API Endpoints

The Flask API also provides display endpoints:

### Get Recipe in Specific Format
```
GET /api/recipes/<recipe_id>/display/<format>
```

Formats: `simple`, `ingredients`, `steps`, `materials`, `full`, `card`, `json`

Example:
```bash
curl http://localhost:5000/api/recipes/pizza/display/full
```

### Get Recipe in All Formats
```
GET /api/recipes/<recipe_id>/display
```

Returns all formats in one response.

Example:
```bash
curl http://localhost:5000/api/recipes/pizza/display
```

## Recipe Format

All recipes follow this structure (matching `sweet_potato_cake.json`):

```json
{
  "id": "recipe_id",
  "name": "recipe name",
  "type": "main|dessert|side|breakfast|drink",
  "ingredients": {
    "ingredient_name": {
      "amount": 2,
      "unit": "cup"
    }
  },
  "steps": [
    "1. First step",
    "2. Second step"
  ],
  "time": ["prep time", "total time"],
  "servings": 4,
  "materials": ["tool1", "tool2"],
  "image": "image.jpg",
  "combos": []
}
```

## Examples

### Display Full Recipe
```python
from recipe_display import load_recipe, display_recipe_full

recipe = load_recipe("pizza")
print(display_recipe_full(recipe))
```

### Display Recipe Card
```python
from recipe_display import load_recipe, display_recipe_card

recipe = load_recipe("salad")
print(display_recipe_card(recipe))
```

### Display All Formats
```python
from recipe_display import display_all_formats

display_all_formats("burger")
```
