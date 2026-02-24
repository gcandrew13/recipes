# Lesson Plan: Lesson 15
## Recommendations & Capstone Project

**Duration:** 2 hours
**Prerequisites:** Completed Lessons 1-14 (All previous content)
**Goal:** Implement recipe recommendations and complete the final project

---

## Learning Objectives

By the end of this lesson, you will:
1. Understand similarity algorithms (Jaccard similarity)
2. Implement a "similar recipes" recommendation system
3. Build the complete Recipe Kitchen API
4. Test and validate the full system
5. Explore extension ideas for further learning

---

## The Big Picture: Recommendations

When users view a recipe, we want to suggest similar ones:
- "You might also like..."
- "Recipes similar to Pizza"
- "Other quick Italian dishes"

This requires calculating how "similar" two recipes are!

### Intuition Builder: Finding Similar Books

How would you find books similar to one you like?
- Same author? (one criterion)
- Same genre? (another criterion)
- Similar themes? (yet another)
- Similar length? (another)

We combine multiple factors to calculate overall similarity!

---

## Part 1: Jaccard Similarity (20 minutes)

### What is Jaccard Similarity?

Jaccard similarity measures how similar two sets are:

```
Jaccard = |A ∩ B| / |A ∪ B|
        = (items in both) / (all unique items)
```

### Example

```python
# Pizza ingredients
pizza = {"tomato", "cheese", "dough", "basil"}

# Pasta ingredients
pasta = {"tomato", "cheese", "pasta", "garlic", "basil"}

# Intersection (items in both)
intersection = pizza & pasta  # {"tomato", "cheese", "basil"}
# = 3 items

# Union (all unique items)
union = pizza | pasta  # {"tomato", "cheese", "dough", "basil", "pasta", "garlic"}
# = 6 items

# Jaccard similarity
similarity = len(intersection) / len(union)  # 3/6 = 0.5 = 50%
```

### Python Implementation

```python
def jaccard_similarity(set_a, set_b):
    """
    Calculate Jaccard similarity between two sets.

    Args:
        set_a: First set
        set_b: Second set

    Returns:
        float: Similarity score between 0 and 1
    """
    if not set_a and not set_b:
        return 1.0  # Both empty = identical

    if not set_a or not set_b:
        return 0.0  # One empty = no similarity

    intersection = len(set_a & set_b)
    union = len(set_a | set_b)

    return intersection / union


# Test
pizza = {"tomato", "cheese", "dough", "basil"}
pasta = {"tomato", "cheese", "pasta", "garlic", "basil"}
salad = {"lettuce", "tomato", "cucumber", "onion"}

print(f"Pizza vs Pasta: {jaccard_similarity(pizza, pasta):.2%}")  # 50%
print(f"Pizza vs Salad: {jaccard_similarity(pizza, salad):.2%}")  # ~14%
print(f"Pasta vs Salad: {jaccard_similarity(pasta, salad):.2%}")  # ~11%
```

---

## Part 2: Recipe Similarity (25 minutes)

### Similarity Based on Ingredients

```python
def calculate_recipe_similarity(recipe_a, recipe_b):
    """
    Calculate similarity between two recipes based on ingredients.

    Returns:
        float: Similarity score between 0 and 1
    """
    # Get ingredient sets
    ingredients_a = set(recipe_a.get("ingredients", {}).keys())
    ingredients_b = set(recipe_b.get("ingredients", {}).keys())

    # Normalize to lowercase
    ingredients_a = {ing.lower() for ing in ingredients_a}
    ingredients_b = {ing.lower() for ing in ingredients_b}

    return jaccard_similarity(ingredients_a, ingredients_b)
```

### Multi-Factor Similarity

```python
def calculate_weighted_similarity(recipe_a, recipe_b):
    """
    Calculate similarity using multiple factors with weights.

    Factors:
        - Ingredients (60% weight)
        - Difficulty match (20% weight)
        - Similar cooking time (20% weight)
    """
    scores = {}

    # Ingredient similarity (60%)
    ing_a = {i.lower() for i in recipe_a.get("ingredients", {}).keys()}
    ing_b = {i.lower() for i in recipe_b.get("ingredients", {}).keys()}
    scores["ingredients"] = jaccard_similarity(ing_a, ing_b) * 0.6

    # Difficulty match (20%)
    diff_a = recipe_a.get("difficulty", "medium")
    diff_b = recipe_b.get("difficulty", "medium")
    if diff_a == diff_b:
        scores["difficulty"] = 0.2
    elif abs(get_difficulty_order(diff_a) - get_difficulty_order(diff_b)) == 1:
        scores["difficulty"] = 0.1  # Adjacent difficulty
    else:
        scores["difficulty"] = 0.0

    # Time similarity (20%)
    time_a = get_total_time(recipe_a)
    time_b = get_total_time(recipe_b)

    if time_a > 0 and time_b > 0:
        # Calculate time ratio (smaller / larger)
        time_ratio = min(time_a, time_b) / max(time_a, time_b)
        scores["time"] = time_ratio * 0.2
    else:
        scores["time"] = 0.0

    total = sum(scores.values())

    return {
        "total": round(total, 3),
        "breakdown": {k: round(v, 3) for k, v in scores.items()}
    }
```

---

## Part 3: The Similar Recipes Endpoint (25 minutes)

### Complete Implementation

Add this to your `app.py`:

```python
@app.route('/api/recipes/<recipe_id>/similar', methods=['GET'])
def get_similar_recipes(recipe_id):
    """
    Find recipes similar to the specified recipe.

    Path Parameters:
        recipe_id: ID of the base recipe

    Query Parameters:
        limit: Maximum number of results (default: 5, max: 20)
        min_similarity: Minimum similarity score (default: 0.1)

    Returns:
        List of similar recipes with similarity scores
    """
    # Load the target recipe
    target = load_recipe(recipe_id)

    if not target:
        return jsonify({
            "error": f"Recipe '{recipe_id}' not found"
        }), 404

    # Parse parameters
    limit = min(int(request.args.get('limit', 5)), 20)
    min_similarity = float(request.args.get('min_similarity', 0.1))

    # Get all recipes and calculate similarities
    all_recipes = load_recipes()
    similarities = []

    for recipe in all_recipes:
        # Skip the target recipe itself
        if recipe.get("id") == recipe_id:
            continue

        similarity = calculate_weighted_similarity(target, recipe)

        if similarity["total"] >= min_similarity:
            similarities.append({
                "recipe": recipe,
                "similarity": similarity
            })

    # Sort by similarity (highest first)
    similarities.sort(key=lambda x: x["similarity"]["total"], reverse=True)

    # Apply limit
    results = similarities[:limit]

    # Get shared ingredients for each result
    target_ingredients = {i.lower() for i in target.get("ingredients", {}).keys()}

    for item in results:
        recipe_ingredients = {i.lower() for i in item["recipe"].get("ingredients", {}).keys()}
        item["shared_ingredients"] = list(target_ingredients & recipe_ingredients)
        item["unique_ingredients"] = list(recipe_ingredients - target_ingredients)

    return jsonify({
        "base_recipe": {
            "id": recipe_id,
            "name": target.get("name")
        },
        "similar_recipes": results,
        "count": len(results)
    })


def jaccard_similarity(set_a, set_b):
    """Calculate Jaccard similarity between two sets."""
    if not set_a and not set_b:
        return 1.0
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a & set_b)
    union = len(set_a | set_b)
    return intersection / union


def calculate_weighted_similarity(recipe_a, recipe_b):
    """Calculate multi-factor similarity between recipes."""
    scores = {}

    # Ingredient similarity (60%)
    ing_a = {i.lower() for i in recipe_a.get("ingredients", {}).keys()}
    ing_b = {i.lower() for i in recipe_b.get("ingredients", {}).keys()}
    scores["ingredients"] = jaccard_similarity(ing_a, ing_b) * 0.6

    # Difficulty match (20%)
    diff_a = recipe_a.get("difficulty", "medium")
    diff_b = recipe_b.get("difficulty", "medium")
    if diff_a == diff_b:
        scores["difficulty"] = 0.2
    elif abs(get_difficulty_order(diff_a) - get_difficulty_order(diff_b)) == 1:
        scores["difficulty"] = 0.1
    else:
        scores["difficulty"] = 0.0

    # Time similarity (20%)
    time_a = get_total_time(recipe_a)
    time_b = get_total_time(recipe_b)
    if time_a > 0 and time_b > 0:
        time_ratio = min(time_a, time_b) / max(time_a, time_b)
        scores["time"] = time_ratio * 0.2
    else:
        scores["time"] = 0.0

    return {
        "total": round(sum(scores.values()), 3),
        "breakdown": {k: round(v, 3) for k, v in scores.items()}
    }
```

### Test the Endpoint

```bash
# Get similar recipes
curl "http://localhost:5000/api/recipes/pizza/similar"

# Limit results
curl "http://localhost:5000/api/recipes/pizza/similar?limit=3"

# Higher similarity threshold
curl "http://localhost:5000/api/recipes/pizza/similar?min_similarity=0.3"
```

---

## Part 4: Capstone Project (30 minutes)

### Your Mission

Build a complete, working Recipe Kitchen that:

1. **Serves the Frontend**: Connect to the pre-built web interface
2. **Provides All Endpoints**: Implement every API endpoint we've built
3. **Handles Errors Gracefully**: No crashes, helpful error messages
4. **Includes Documentation**: Comment your code

### Complete API Checklist

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/health` | GET | ✅ |
| `/api/recipes` | GET | ✅ |
| `/api/recipes` | POST | ✅ |
| `/api/recipes/<id>` | GET | ✅ |
| `/api/recipes/<id>` | PUT | ✅ |
| `/api/recipes/<id>` | DELETE | ✅ |
| `/api/recipes/search` | POST | ✅ |
| `/api/ingredients` | GET | ✅ |
| `/api/ingredients/categories` | GET | ✅ |
| `/api/search` | GET | ✅ |
| `/api/recipes/filter` | GET | ✅ |
| `/api/recipes/<id>/similar` | GET | ✅ |

### Final Testing

```bash
# 1. Start your server
python app.py

# 2. Test health endpoint
curl http://localhost:5000/api/health

# 3. Test the full flow:
# - Get all recipes
curl http://localhost:5000/api/recipes

# - Search by ingredients
curl -X POST http://localhost:5000/api/recipes/search \
  -H "Content-Type: application/json" \
  -d '{"items": ["tomato", "cheese"]}'

# - Filter recipes
curl "http://localhost:5000/api/recipes/filter?difficulty=easy&sort=time"

# - Get similar recipes
curl http://localhost:5000/api/recipes/pizza/similar

# 4. Open Frontend/index.html and test the UI
```

---

## Part 5: Extension Ideas (10 minutes)

### Take It Further

Now that you've completed the course, here are ideas to extend your project:

1. **User Accounts**
   - Add user registration/login
   - Save favorite recipes
   - Track cooking history

2. **Ratings & Reviews**
   - Let users rate recipes
   - Calculate average ratings
   - Sort by popularity

3. **Shopping List**
   - Generate shopping list from selected recipes
   - Track what user already has
   - Calculate costs

4. **Meal Planning**
   - Plan meals for the week
   - Balance nutrition
   - Minimize ingredient waste

5. **Recipe Scaling**
   - Adjust serving sizes
   - Recalculate ingredient amounts
   - Handle unit conversions

6. **Advanced Search**
   - Full-text search with ElasticSearch
   - Filter by nutrition
   - Dietary restrictions

7. **Image Upload**
   - Allow recipe photos
   - Generate thumbnails
   - Store in cloud storage

---

## What We Built: Complete Data Structures Journey

### Data Structures Mastered

| Data Structure | Use Case |
|----------------|----------|
| **Lists** | Storing recipes, steps, ingredients |
| **Dictionaries** | Recipe data, JSON parsing, configs |
| **Sets** | Ingredient matching, deduplication |

### Algorithms Implemented

| Algorithm | Use Case |
|-----------|----------|
| **Linear Search** | Text search, recipe lookup |
| **Sorting** | Order by name, time, difficulty |
| **Filtering** | Complex query conditions |
| **Jaccard Similarity** | Recipe recommendations |

### API Skills Learned

| Skill | Application |
|-------|-------------|
| **Flask Routing** | URL endpoints |
| **HTTP Methods** | GET, POST, PUT, DELETE |
| **JSON Parsing** | Request/response data |
| **Query Parameters** | Filtering, sorting, pagination |
| **Error Handling** | Status codes, try/except |
| **CORS** | Frontend communication |

---

## Congratulations!

You've completed the Recipe Kitchen curriculum!

### You Can Now:

- ✅ Build Python APIs from scratch
- ✅ Work with lists, dictionaries, and sets
- ✅ Implement search, sort, and filter algorithms
- ✅ Handle HTTP requests and responses
- ✅ Parse and validate JSON data
- ✅ Write clean, documented code
- ✅ Build recommendation systems

### What's Next?

1. **Add your own features** to Recipe Kitchen
2. **Build a new project** using these skills
3. **Learn databases** (SQLite, PostgreSQL)
4. **Explore frontend** (React, Vue, or vanilla JS)
5. **Deploy your API** (Heroku, Railway, or AWS)

---

## Final Challenge: Make It Yours

Customize Recipe Kitchen to reflect your interests:

- Add recipes from your culture
- Implement dietary restriction filters
- Create a "random recipe" feature
- Add seasonal recipe suggestions
- Build a grocery price estimator

The possibilities are endless. The skills you've learned will serve you in any programming path you choose!

---

## Key Vocabulary Summary

| Term | Definition |
|------|------------|
| **Jaccard Similarity** | Measure of set overlap |
| **Recommendation** | Suggesting similar items |
| **Weighted Score** | Combining multiple factors |
| **Capstone** | Final comprehensive project |
| **Extension** | Adding features beyond requirements |

---

## Thank You!

Thank you for completing the Recipe Kitchen course. You've built something real and learned fundamental programming concepts that will serve you throughout your career.

Happy coding!
