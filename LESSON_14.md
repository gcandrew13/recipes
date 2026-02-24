# Lesson Plan: Lesson 14
## Complex Filtering

**Duration:** 1-2 hours
**Prerequisites:** Completed Lessons 1-13 (Sorting)
**Goal:** Implement advanced filtering with multiple criteria

---

## Learning Objectives

By the end of this lesson, you will:
1. Use Python's `filter()` function
2. Combine multiple filter conditions
3. Build flexible filter endpoints
4. Chain filters for complex queries
5. Implement range-based filtering

---

## The Big Picture: Why Filtering?

Users want to narrow down results:
- "Show only easy recipes"
- "Show recipes that take less than 30 minutes"
- "Show vegetarian recipes with tomato"

Filtering removes items that don't match criteria, leaving only what the user wants!

### Intuition Builder: Sorting Mail

Imagine sorting through a pile of mail:
- First, remove junk mail (filter)
- Then, remove bills (another filter)
- What's left? Personal letters!

Each filter removes items that don't match the criteria.

---

## Part 1: The filter() Function (15 minutes)

### Basic Filter Usage

```python
# filter(function, iterable)
# Returns items where function returns True

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Filter even numbers
def is_even(n):
    return n % 2 == 0

evens = list(filter(is_even, numbers))
print(evens)  # [2, 4, 6, 8, 10]

# With lambda
evens = list(filter(lambda n: n % 2 == 0, numbers))
```

### Filter vs List Comprehension

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Using filter()
evens = list(filter(lambda n: n % 2 == 0, numbers))

# Using list comprehension (usually preferred)
evens = [n for n in numbers if n % 2 == 0]

# Both produce: [2, 4, 6, 8, 10]
```

### When to Use Each

| Approach | Best For |
|----------|----------|
| List comprehension | Most cases, more Pythonic |
| `filter()` | When you have an existing function |
| For loop | When you need complex logic or side effects |

---

## Part 2: Multiple Filter Conditions (20 minutes)

### Using AND Conditions

```python
recipes = [
    {"name": "Pizza", "time": 30, "difficulty": "medium"},
    {"name": "Salad", "time": 10, "difficulty": "easy"},
    {"name": "Pasta", "time": 25, "difficulty": "easy"},
    {"name": "Souffle", "time": 60, "difficulty": "hard"}
]

# Filter: easy AND quick (under 15 min)
easy_and_quick = [
    r for r in recipes
    if r["difficulty"] == "easy" and r["time"] < 15
]
# Result: [{"name": "Salad", ...}]
```

### Using OR Conditions

```python
# Filter: easy OR quick
easy_or_quick = [
    r for r in recipes
    if r["difficulty"] == "easy" or r["time"] < 15
]
# Result: [Salad, Pasta] - both are easy, Salad is also quick
```

### Complex Conditions

```python
# Filter: (easy AND quick) OR (medium AND under 30 min)
complex_filter = [
    r for r in recipes
    if (r["difficulty"] == "easy" and r["time"] < 15) or
       (r["difficulty"] == "medium" and r["time"] <= 30)
]
# Result: [Pizza, Salad]
```

---

## Part 3: Building Filter Functions (20 minutes)

### Reusable Filter Functions

```python
def filter_by_difficulty(recipes, difficulty):
    """Filter recipes by difficulty level."""
    if not difficulty:
        return recipes
    return [r for r in recipes if r.get("difficulty") == difficulty]


def filter_by_max_time(recipes, max_minutes):
    """Filter recipes that take at most max_minutes."""
    if max_minutes is None:
        return recipes
    return [r for r in recipes if get_total_time(r) <= max_minutes]


def filter_by_ingredients(recipes, required_ingredients):
    """Filter recipes containing all required ingredients."""
    if not required_ingredients:
        return recipes

    required_set = {ing.lower() for ing in required_ingredients}

    return [
        r for r in recipes
        if required_set.issubset({ing.lower() for ing in r.get("ingredients", {}).keys()})
    ]


def filter_by_servings(recipes, min_servings=None, max_servings=None):
    """Filter recipes by serving size range."""
    result = recipes

    if min_servings is not None:
        result = [r for r in result if r.get("servings", 0) >= min_servings]

    if max_servings is not None:
        result = [r for r in result if r.get("servings", 0) <= max_servings]

    return result
```

### Chaining Filters

```python
def apply_filters(recipes, filters):
    """
    Apply multiple filters to recipes.

    Args:
        recipes: List of recipe dictionaries
        filters: Dictionary of filter parameters

    Returns:
        Filtered list of recipes
    """
    result = recipes

    # Apply each filter
    if filters.get("difficulty"):
        result = filter_by_difficulty(result, filters["difficulty"])

    if filters.get("max_time"):
        result = filter_by_max_time(result, filters["max_time"])

    if filters.get("ingredients"):
        result = filter_by_ingredients(result, filters["ingredients"])

    if filters.get("min_servings") or filters.get("max_servings"):
        result = filter_by_servings(
            result,
            filters.get("min_servings"),
            filters.get("max_servings")
        )

    return result
```

---

## Part 4: The Filter Endpoint (30 minutes)

### Complete Filter Implementation

Add this to your `app.py`:

```python
@app.route('/api/recipes/filter', methods=['GET'])
def filter_recipes():
    """
    Filter recipes by multiple criteria.

    Query Parameters:
        difficulty: Filter by difficulty (easy, medium, hard)
        max_time: Maximum total time in minutes
        min_time: Minimum total time in minutes
        ingredients: Comma-separated required ingredients
        min_servings: Minimum serving size
        max_servings: Maximum serving size
        category: Recipe category
        sort: Field to sort by
        order: Sort order (asc, desc)

    Examples:
        /api/recipes/filter?difficulty=easy
        /api/recipes/filter?max_time=30&difficulty=easy
        /api/recipes/filter?ingredients=tomato,cheese
        /api/recipes/filter?min_servings=4&sort=time
    """
    recipes = load_recipes()

    # Parse filter parameters
    difficulty = request.args.get('difficulty')
    max_time = parse_int(request.args.get('max_time'))
    min_time = parse_int(request.args.get('min_time'))
    ingredients_str = request.args.get('ingredients', '')
    min_servings = parse_int(request.args.get('min_servings'))
    max_servings = parse_int(request.args.get('max_servings'))

    # Parse ingredients list
    ingredients = [i.strip() for i in ingredients_str.split(',') if i.strip()]

    # Apply filters
    filtered = recipes

    # Filter by difficulty
    if difficulty:
        valid_difficulties = ['easy', 'medium', 'hard']
        if difficulty.lower() not in valid_difficulties:
            return jsonify({
                "error": f"Invalid difficulty '{difficulty}'",
                "valid_values": valid_difficulties
            }), 400
        filtered = [r for r in filtered if r.get('difficulty', '').lower() == difficulty.lower()]

    # Filter by time range
    if max_time is not None:
        filtered = [r for r in filtered if get_total_time(r) <= max_time]

    if min_time is not None:
        filtered = [r for r in filtered if get_total_time(r) >= min_time]

    # Filter by ingredients
    if ingredients:
        ingredients_lower = {ing.lower() for ing in ingredients}
        filtered = [
            r for r in filtered
            if ingredients_lower.issubset({ing.lower() for ing in r.get('ingredients', {}).keys()})
        ]

    # Filter by servings range
    if min_servings is not None:
        filtered = [r for r in filtered if r.get('servings', 0) >= min_servings]

    if max_servings is not None:
        filtered = [r for r in filtered if r.get('servings', 0) <= max_servings]

    # Apply sorting
    sort_field = request.args.get('sort')
    sort_order = request.args.get('order', 'asc')

    if sort_field:
        reverse = sort_order.lower() == 'desc'
        sort_keys = {
            'name': lambda r: r.get('name', '').lower(),
            'time': lambda r: get_total_time(r),
            'difficulty': lambda r: get_difficulty_order(r.get('difficulty', 'medium')),
            'servings': lambda r: r.get('servings', 0),
            'ingredients': lambda r: len(r.get('ingredients', {}))
        }
        if sort_field in sort_keys:
            filtered = sorted(filtered, key=sort_keys[sort_field], reverse=reverse)

    # Build response
    return jsonify({
        "recipes": filtered,
        "count": len(filtered),
        "total_available": len(recipes),
        "filters_applied": {
            "difficulty": difficulty,
            "max_time": max_time,
            "min_time": min_time,
            "ingredients": ingredients if ingredients else None,
            "min_servings": min_servings,
            "max_servings": max_servings
        },
        "sort": {
            "field": sort_field,
            "order": sort_order
        } if sort_field else None
    })


def parse_int(value):
    """Safely parse an integer from a string."""
    if value is None:
        return None
    try:
        return int(value)
    except ValueError:
        return None
```

### Test the Filter Endpoint

```bash
# Filter by difficulty
curl "http://localhost:5000/api/recipes/filter?difficulty=easy"

# Filter by time
curl "http://localhost:5000/api/recipes/filter?max_time=30"

# Filter by time range
curl "http://localhost:5000/api/recipes/filter?min_time=15&max_time=45"

# Filter by ingredients
curl "http://localhost:5000/api/recipes/filter?ingredients=tomato,cheese"

# Filter by servings
curl "http://localhost:5000/api/recipes/filter?min_servings=2&max_servings=6"

# Combine filters
curl "http://localhost:5000/api/recipes/filter?difficulty=easy&max_time=20"

# Filter and sort
curl "http://localhost:5000/api/recipes/filter?difficulty=easy&sort=time&order=asc"

# Complex query
curl "http://localhost:5000/api/recipes/filter?difficulty=easy&max_time=30&ingredients=tomato&sort=time"
```

---

## Part 5: Advanced Filter Patterns (15 minutes)

### Negative Filters (Exclude)

```python
def filter_exclude_ingredients(recipes, excluded):
    """Filter OUT recipes containing any excluded ingredients."""
    if not excluded:
        return recipes

    excluded_lower = {ing.lower() for ing in excluded}

    return [
        r for r in recipes
        if not excluded_lower.intersection({ing.lower() for ing in r.get('ingredients', {}).keys()})
    ]

# Example: Find recipes without meat
vegetarian = filter_exclude_ingredients(recipes, ["chicken", "beef", "bacon", "fish"])
```

### Range Filters

```python
def filter_by_range(recipes, field, min_val=None, max_val=None):
    """Generic range filter for numeric fields."""
    result = recipes

    if min_val is not None:
        result = [r for r in result if r.get(field, 0) >= min_val]

    if max_val is not None:
        result = [r for r in result if r.get(field, 0) <= max_val]

    return result

# Example
recipes_medium_servings = filter_by_range(recipes, "servings", min_val=2, max_val=6)
```

### Text Search Filter

```python
def filter_by_text(recipes, search_text, fields=None):
    """Filter recipes containing search text in specified fields."""
    if not search_text:
        return recipes

    search_lower = search_text.lower()
    fields = fields or ['name', 'description']

    def matches(recipe):
        for field in fields:
            value = recipe.get(field, '')
            if value and search_lower in str(value).lower():
                return True
        return False

    return [r for r in recipes if matches(r)]
```

---

## Challenge: Smart Recipe Finder

Create a `/api/recipes/suggest` endpoint that suggests recipes based on:

1. **What you have**: Ingredients the user has available
2. **Time available**: How much time they have to cook
3. **Difficulty preference**: Their skill level

The endpoint should:
- Return recipes ranked by how many of the user's ingredients they use
- Filter by time and difficulty constraints
- Show what additional ingredients are needed

Example request:
```
POST /api/recipes/suggest
{
    "have_ingredients": ["tomato", "cheese", "bread", "butter"],
    "max_time": 30,
    "difficulty": "easy"
}
```

Example response:
```json
{
    "suggestions": [
        {
            "recipe": {"name": "Grilled Cheese", ...},
            "match_score": 100,
            "have": ["cheese", "bread", "butter"],
            "need": []
        },
        {
            "recipe": {"name": "Pizza", ...},
            "match_score": 75,
            "have": ["tomato", "cheese"],
            "need": ["dough", "basil"]
        }
    ]
}
```

---

## What We Learned

- ✅ Python's `filter()` function
- ✅ List comprehensions for filtering
- ✅ Multiple filter conditions (AND, OR)
- ✅ Reusable filter functions
- ✅ Chaining filters
- ✅ Range-based filtering
- ✅ Building flexible filter endpoints

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **filter()** | Built-in function that keeps items passing a test |
| **Predicate** | Function that returns True/False |
| **Chain** | Apply multiple filters in sequence |
| **Range Filter** | Filter by min/max values |
| **Exclude Filter** | Remove items matching criteria |

---

## Next Steps

In **Lesson 15**, we'll build the **capstone project**:
- Jaccard similarity for recommendations
- "Similar recipes" feature
- Final project wrap-up

Your homework: Implement the Smart Recipe Finder challenge!
