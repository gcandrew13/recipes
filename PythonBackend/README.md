# Python Backend - Recipe Kitchen API

Flask API server for managing recipes and handling recipe search/intersection logic.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   python app.py
   ```

3. Server runs on `http://localhost:5000`

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Get All Recipes
```bash
GET /api/recipes
```

### Search Recipes by Items
```bash
POST /api/recipes/search
Content-Type: application/json

{
  "items": ["tomato", "cheese", "dough"]
}
```

Returns recipes that contain ALL specified items.

### Get Specific Recipe
```bash
GET /api/recipes/<recipe_id>
```

## Adding New Recipes

Create a new JSON file in the `recipes/` directory following this format:

```json
{
  "id": "unique_id",
  "name": "Recipe Name",
  "description": "Description",
  "ingredients": ["item1", "item2"],
  "steps": ["step1", "step2"],
  "time": "30 minutes",
  "materials": ["tool1", "tool2"],
  "image": "image.jpg",
  "difficulty": "easy"
}
```

The API will automatically load all JSON files from the `recipes/` directory.

## Recipe Search Algorithm

The search uses an intersection algorithm:
- Takes a list of selected items
- Finds recipes where ALL selected items are in the recipe's ingredients
- Returns matching recipes sorted by relevance

Example:
- Selected: ["tomato", "cheese"]
- Returns: Pizza (has both), Sandwich (has both)
- Does NOT return: Salad (missing cheese)
