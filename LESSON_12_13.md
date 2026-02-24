# Lesson Plan: Lessons 12-13
## Sorting with Python

**Duration:** 2 lessons (2-4 hours total)
**Prerequisites:** Completed Lessons 1-11 (Search algorithms)
**Goal:** Master Python sorting and implement sortable API endpoints

---

## Learning Objectives

By the end of these lessons, you will:
1. Use Python's `sorted()` function effectively
2. Write lambda functions for custom sorting
3. Sort by multiple criteria
4. Implement sort parameters in API endpoints
5. Understand sorting algorithm basics

---

## The Big Picture: Why Sorting Matters

Users expect to sort results:
- "Show recipes by name (A-Z)"
- "Show fastest recipes first"
- "Show recipes with fewest ingredients"

Sorting transforms raw data into useful, organized information!

### Intuition Builder: Organizing a Bookshelf

How would you organize books?
- **Alphabetically by title:** Easy to find specific book
- **By author:** Group books by the same author
- **By size:** Looks neat on the shelf
- **By how much you liked them:** Your favorites first!

Python lets you sort by ANY criteria!

---

# LESSON 12: Sorting Basics (1-2 hours)

## Part 1: The sorted() Function (20 minutes)

### Basic Sorting

```python
# Sort a list of numbers
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_numbers = sorted(numbers)
print(sorted_numbers)  # [1, 1, 2, 3, 4, 5, 6, 9]

# Original list is unchanged!
print(numbers)  # [3, 1, 4, 1, 5, 9, 2, 6]

# Sort strings alphabetically
names = ["Charlie", "Alice", "Bob"]
print(sorted(names))  # ["Alice", "Bob", "Charlie"]
```

### Reverse Sorting

```python
numbers = [3, 1, 4, 1, 5, 9]

# Ascending (default)
print(sorted(numbers))  # [1, 1, 3, 4, 5, 9]

# Descending
print(sorted(numbers, reverse=True))  # [9, 5, 4, 3, 1, 1]
```

### sorted() vs list.sort()

```python
numbers = [3, 1, 4, 1, 5]

# sorted() returns NEW list, original unchanged
new_list = sorted(numbers)

# list.sort() modifies original, returns None
numbers.sort()  # numbers is now sorted
```

| Method | Returns | Original List |
|--------|---------|---------------|
| `sorted(list)` | New sorted list | Unchanged |
| `list.sort()` | None | Modified in place |

---

## Part 2: Custom Sorting with key (25 minutes)

### The key Parameter

The `key` parameter specifies a function to extract a comparison key from each item.

```python
# Sort strings by length
words = ["apple", "pie", "banana", "kiwi"]
print(sorted(words))  # Alphabetical: ["apple", "banana", "kiwi", "pie"]
print(sorted(words, key=len))  # By length: ["pie", "kiwi", "apple", "banana"]
```

### Using Built-in Functions as Keys

```python
# Sort case-insensitively
names = ["Bob", "alice", "CHARLIE"]
print(sorted(names))  # ["Bob", "CHARLIE", "alice"] - uppercase first!
print(sorted(names, key=str.lower))  # ["alice", "Bob", "CHARLIE"]

# Sort by absolute value
numbers = [-5, 2, -3, 1, -4]
print(sorted(numbers))  # [-5, -4, -3, 1, 2]
print(sorted(numbers, key=abs))  # [1, 2, -3, -4, -5]
```

### Sorting Dictionaries

```python
recipes = [
    {"name": "Pizza", "time": 30},
    {"name": "Salad", "time": 10},
    {"name": "Pasta", "time": 25}
]

# Sort by time
by_time = sorted(recipes, key=lambda r: r["time"])
# [{"name": "Salad", "time": 10}, {"name": "Pasta", "time": 25}, {"name": "Pizza", "time": 30}]

# Sort by name
by_name = sorted(recipes, key=lambda r: r["name"])
# [{"name": "Pasta", ...}, {"name": "Pizza", ...}, {"name": "Salad", ...}]
```

---

## Part 3: Lambda Functions (20 minutes)

### What Are Lambda Functions?

Lambda functions are small, anonymous functions defined in one line.

```python
# Regular function
def get_name(recipe):
    return recipe["name"]

# Equivalent lambda
get_name = lambda recipe: recipe["name"]

# Used directly in sorted()
sorted(recipes, key=lambda r: r["name"])
```

### Lambda Syntax

```
lambda arguments: expression
```

```python
# One argument
square = lambda x: x ** 2
print(square(5))  # 25

# Multiple arguments
add = lambda a, b: a + b
print(add(3, 4))  # 7

# Used with sorted()
sorted(items, key=lambda x: x["field"])
```

### Lambda Examples

```python
recipes = [
    {"name": "Pizza", "time": 30, "difficulty": "medium"},
    {"name": "Salad", "time": 10, "difficulty": "easy"},
    {"name": "Pasta", "time": 25, "difficulty": "easy"}
]

# Sort by name (case-insensitive)
by_name = sorted(recipes, key=lambda r: r["name"].lower())

# Sort by time (descending)
by_time_desc = sorted(recipes, key=lambda r: r["time"], reverse=True)

# Sort by number of characters in name
by_name_length = sorted(recipes, key=lambda r: len(r["name"]))
```

---

# LESSON 13: Advanced Sorting & API Integration (1-2 hours)

## Part 4: Multiple Sort Criteria (20 minutes)

### Sorting by Multiple Fields

```python
recipes = [
    {"name": "Pizza", "difficulty": "medium", "time": 30},
    {"name": "Salad", "difficulty": "easy", "time": 10},
    {"name": "Toast", "difficulty": "easy", "time": 5},
    {"name": "Pasta", "difficulty": "medium", "time": 25}
]

# Sort by difficulty, then by time
# Return a tuple - Python compares tuples element by element
by_difficulty_then_time = sorted(
    recipes,
    key=lambda r: (r["difficulty"], r["time"])
)

# Result:
# easy + 5 (Toast)
# easy + 10 (Salad)
# medium + 25 (Pasta)
# medium + 30 (Pizza)
```

### Custom Sort Order

```python
# Define custom order for difficulty
difficulty_order = {"easy": 0, "medium": 1, "hard": 2}

recipes = [
    {"name": "Pizza", "difficulty": "medium"},
    {"name": "Salad", "difficulty": "easy"},
    {"name": "Souffle", "difficulty": "hard"}
]

# Sort by custom difficulty order
sorted_recipes = sorted(
    recipes,
    key=lambda r: difficulty_order.get(r["difficulty"], 99)
)
# [Salad (easy), Pizza (medium), Souffle (hard)]
```

### Mixed Ascending/Descending

```python
# Sort by difficulty (ascending) then time (descending)
# Use negative numbers for descending numeric sort

sorted_recipes = sorted(
    recipes,
    key=lambda r: (difficulty_order.get(r["difficulty"], 99), -r["time"])
)
```

---

## Part 5: Implementing Sort in the API (30 minutes)

### Sortable Recipes Endpoint

Add this to your `app.py`:

```python
@app.route('/api/recipes', methods=['GET'])
def get_all_recipes():
    """
    Get all recipes with optional sorting.

    Query Parameters:
        sort: Field to sort by (name, time, difficulty, ingredients)
        order: Sort order (asc, desc) - default: asc
        difficulty: Filter by difficulty level

    Examples:
        /api/recipes?sort=name&order=asc
        /api/recipes?sort=time&order=desc
        /api/recipes?sort=ingredients
    """
    recipes = load_recipes()

    # Get filter parameters
    difficulty_filter = request.args.get('difficulty')

    # Apply filters
    if difficulty_filter:
        recipes = [r for r in recipes if r.get('difficulty') == difficulty_filter]

    # Get sort parameters
    sort_field = request.args.get('sort', '').lower()
    sort_order = request.args.get('order', 'asc').lower()

    # Validate sort order
    if sort_order not in ['asc', 'desc']:
        sort_order = 'asc'

    reverse = sort_order == 'desc'

    # Define sort key functions
    sort_keys = {
        'name': lambda r: r.get('name', '').lower(),
        'time': lambda r: get_total_time(r),
        'difficulty': lambda r: get_difficulty_order(r.get('difficulty', 'medium')),
        'ingredients': lambda r: len(r.get('ingredients', {})),
        'servings': lambda r: r.get('servings', 0)
    }

    # Apply sorting
    if sort_field in sort_keys:
        try:
            recipes = sorted(recipes, key=sort_keys[sort_field], reverse=reverse)
        except (TypeError, KeyError):
            pass  # If sorting fails, return unsorted

    return jsonify({
        "recipes": recipes,
        "count": len(recipes),
        "sort": {
            "field": sort_field if sort_field in sort_keys else None,
            "order": sort_order
        }
    })


def get_difficulty_order(difficulty):
    """Convert difficulty to sortable number."""
    order = {"easy": 0, "medium": 1, "hard": 2}
    return order.get(difficulty.lower() if difficulty else "medium", 1)


def get_total_time(recipe):
    """Calculate total time from prep and cook times."""
    times = recipe.get("time", [])
    total = 0

    for t in times:
        if isinstance(t, str):
            try:
                minutes = int(t.split()[0])
                total += minutes
            except (ValueError, IndexError):
                pass
        elif isinstance(t, (int, float)):
            total += int(t)

    return total
```

### Test Sorting

```bash
# Sort by name (A-Z)
curl "http://localhost:5000/api/recipes?sort=name&order=asc"

# Sort by name (Z-A)
curl "http://localhost:5000/api/recipes?sort=name&order=desc"

# Sort by cooking time (fastest first)
curl "http://localhost:5000/api/recipes?sort=time&order=asc"

# Sort by cooking time (slowest first)
curl "http://localhost:5000/api/recipes?sort=time&order=desc"

# Sort by difficulty
curl "http://localhost:5000/api/recipes?sort=difficulty"

# Sort by number of ingredients (fewest first)
curl "http://localhost:5000/api/recipes?sort=ingredients&order=asc"

# Filter and sort together
curl "http://localhost:5000/api/recipes?difficulty=easy&sort=time"
```

---

## Part 6: Stable Sorting (15 minutes)

### What is Stable Sorting?

A sort is "stable" if items with equal keys maintain their relative order.

```python
recipes = [
    {"name": "Pizza A", "difficulty": "easy"},
    {"name": "Pizza B", "difficulty": "easy"},
    {"name": "Salad", "difficulty": "easy"}
]

# Stable sort preserves order of equal items
# If we sort by difficulty, all "easy" items keep their original order
```

Python's `sorted()` is stable! This is useful for multi-level sorting:

```python
# First sort by time, then by difficulty
# Items with same difficulty maintain their time-based order
recipes.sort(key=lambda r: r["time"])
recipes.sort(key=lambda r: get_difficulty_order(r["difficulty"]))
```

---

## Challenge: Top Recipes Endpoint

Create a `/api/recipes/top` endpoint that returns the "best" recipes based on a scoring system:

1. Calculate a score for each recipe:
   - Quick recipes (< 20 min): +10 points
   - Easy difficulty: +5 points
   - Medium difficulty: +3 points
   - Few ingredients (< 5): +5 points

2. Return recipes sorted by score (highest first)

3. Add a `limit` parameter (default 5)

Example response:
```json
{
    "top_recipes": [
        {"name": "Toast", "score": 20, "time": 5, "difficulty": "easy"},
        {"name": "Salad", "score": 18, "time": 10, "difficulty": "easy"}
    ],
    "limit": 5
}
```

---

## What We Learned

### Lesson 12
- ✅ `sorted()` function basics
- ✅ Reverse sorting with `reverse=True`
- ✅ Custom sorting with `key` parameter
- ✅ Lambda functions

### Lesson 13
- ✅ Sorting by multiple criteria
- ✅ Custom sort orders
- ✅ API sort parameters
- ✅ Stable sorting

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **sorted()** | Built-in function that returns a sorted list |
| **key** | Function to extract comparison key from each item |
| **lambda** | Anonymous inline function |
| **Stable Sort** | Equal items maintain relative order |
| **Ascending** | Smallest to largest (A-Z) |
| **Descending** | Largest to smallest (Z-A) |

---

## Next Steps

In **Lesson 14**, we'll learn about **filtering**:
- Complex filter conditions
- The `filter()` function
- Combining filters and sorts

Your homework: Implement the Top Recipes endpoint challenge!
