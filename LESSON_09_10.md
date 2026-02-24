# Lesson Plan: Lessons 9-10
## Python Sets & Recipe Matching

**Duration:** 2 lessons (2-4 hours total)
**Prerequisites:** Completed Lessons 1-8 (Dictionaries and CRUD API)
**Goal:** Master Python sets and implement efficient recipe matching

---

## Learning Objectives

By the end of these lessons, you will:
1. Understand Python sets and their unique properties
2. Create and manipulate sets
3. Use set operations (intersection, union, difference)
4. Implement efficient recipe matching with sets
5. Handle POST requests with JSON bodies
6. Build the `/api/recipes/search` endpoint

---

## The Big Picture: Why Sets?

When a user drops ingredients in the basket, we need to find matching recipes. This is a **set problem**!

- **User's basket:** `{tomato, cheese, basil}`
- **Recipe needs:** `{tomato, cheese, basil, dough}`
- **Question:** Does the recipe contain ALL basket items?

Sets make this comparison fast and elegant!

### Intuition Builder: Sets Are Like Unique Collections

Think of a set like a bag that:
- Only holds **unique items** (no duplicates)
- Doesn't care about **order**
- Can answer "is X in the bag?" instantly

```python
# List with duplicates
ingredients_list = ["tomato", "cheese", "tomato"]  # 3 items

# Set removes duplicates
ingredients_set = {"tomato", "cheese", "tomato"}   # 2 items!
print(ingredients_set)  # {"tomato", "cheese"}
```

---

# LESSON 9: Set Basics (1-2 hours)

## Part 1: Creating Sets (15 minutes)

### Empty Sets

```python
# Create empty set (must use set(), not {}!)
basket = set()
print(basket)  # set()

# {} creates an empty DICTIONARY, not a set!
not_a_set = {}
print(type(not_a_set))  # <class 'dict'>
```

### Sets with Initial Items

```python
# Create set with items
basket = {"tomato", "cheese", "basil"}
print(basket)  # {"tomato", "cheese", "basil"}

# Order is not preserved
numbers = {3, 1, 4, 1, 5, 9, 2, 6}
print(numbers)  # {1, 2, 3, 4, 5, 6, 9} - unique and may be reordered

# Create from list (removes duplicates!)
ingredients_list = ["tomato", "cheese", "tomato", "basil"]
ingredients_set = set(ingredients_list)
print(ingredients_set)  # {"tomato", "cheese", "basil"}
```

### Set vs List vs Dictionary

| Feature | List | Set | Dictionary |
|---------|------|-----|------------|
| Syntax | `[a, b]` | `{a, b}` | `{a: 1, b: 2}` |
| Duplicates | Yes | No | Keys: No |
| Order | Preserved | No | Preserved |
| Lookup | O(n) slow | O(1) fast | O(1) fast |
| Use case | Ordered items | Unique items | Key-value pairs |

---

## Part 2: Set Operations (25 minutes)

### Adding and Removing

```python
basket = {"tomato", "cheese"}

# Add one item
basket.add("basil")
print(basket)  # {"tomato", "cheese", "basil"}

# Add duplicate (no effect!)
basket.add("tomato")
print(basket)  # {"tomato", "cheese", "basil"} - still 3 items

# Remove item (raises KeyError if not found)
basket.remove("basil")

# Discard item (no error if not found)
basket.discard("onion")  # No error!

# Pop removes and returns arbitrary item
item = basket.pop()
print(f"Removed: {item}")

# Clear all items
basket.clear()
print(basket)  # set()
```

### Membership Testing

```python
basket = {"tomato", "cheese", "basil"}

# Check if item exists
has_tomato = "tomato" in basket     # True
has_onion = "onion" in basket       # False

# Use in conditions
if "cheese" in basket:
    print("Can make something cheesy!")

# This is FAST (O(1)) compared to lists (O(n))
```

---

## Part 3: Set Operations - The Magic (30 minutes)

This is where sets really shine!

### Intersection: Items in BOTH Sets

```python
recipe_needs = {"tomato", "cheese", "dough", "basil"}
user_has = {"tomato", "cheese", "onion", "garlic"}

# What ingredients do they share?
common = recipe_needs.intersection(user_has)
print(common)  # {"tomato", "cheese"}

# Shortcut with & operator
common = recipe_needs & user_has
print(common)  # {"tomato", "cheese"}
```

### Union: All Items from BOTH Sets

```python
veggies = {"tomato", "onion", "pepper"}
fruits = {"apple", "banana", "tomato"}  # tomato appears in both

# All unique items
all_produce = veggies.union(fruits)
print(all_produce)  # {"tomato", "onion", "pepper", "apple", "banana"}

# Shortcut with | operator
all_produce = veggies | fruits
```

### Difference: Items in First, NOT in Second

```python
recipe_needs = {"tomato", "cheese", "dough", "basil"}
user_has = {"tomato", "cheese", "onion"}

# What is the user MISSING?
missing = recipe_needs.difference(user_has)
print(missing)  # {"dough", "basil"}

# Shortcut with - operator
missing = recipe_needs - user_has
```

### Subset: Is One Set Inside Another?

```python
recipe_needs = {"tomato", "cheese", "basil"}
user_has = {"tomato", "cheese", "basil", "onion", "garlic"}

# Does user have ALL recipe ingredients?
can_make = recipe_needs.issubset(user_has)
print(can_make)  # True

# Shortcut with <= operator
can_make = recipe_needs <= user_has
```

### Visual Guide to Set Operations

```
    recipe_needs                user_has
   ┌─────────────────┐     ┌─────────────────┐
   │                 │     │                 │
   │  dough   basil  │     │  onion   garlic │
   │         ┌──────┴──────┴──────┐         │
   │         │ tomato    cheese  │          │
   │         └──────┬──────┬──────┘         │
   │                 │     │                 │
   └─────────────────┘     └─────────────────┘

Intersection (& ): {tomato, cheese}
Union (|):         {dough, basil, tomato, cheese, onion, garlic}
Difference (-):    {dough, basil}  (in recipe, not user)
```

### Operation Summary

| Operation | Symbol | Returns |
|-----------|--------|---------|
| `A.intersection(B)` | `A & B` | Items in both A and B |
| `A.union(B)` | `A \| B` | Items in A or B or both |
| `A.difference(B)` | `A - B` | Items in A but not B |
| `A.issubset(B)` | `A <= B` | True if all A items are in B |
| `A.issuperset(B)` | `A >= B` | True if A contains all B items |

---

# LESSON 10: Recipe Matching Algorithm (1-2 hours)

## Part 4: The Recipe Matching Problem (15 minutes)

### Understanding the Problem

User selects: `["tomato", "cheese"]`

We have recipes:
1. Pizza: needs `["dough", "tomato", "cheese", "basil"]`
2. Salad: needs `["lettuce", "tomato", "cucumber"]`
3. Grilled Cheese: needs `["bread", "cheese", "butter"]`

**Which recipes contain ALL selected ingredients?**

- Pizza: Has tomato ✓ and cheese ✓ → **MATCH**
- Salad: Has tomato ✓ but no cheese ✗ → No match
- Grilled Cheese: Has cheese ✓ but no tomato ✗ → No match

### The Algorithm with Sets

```python
def recipe_matches(recipe_ingredients, selected_items):
    """Check if recipe contains ALL selected items."""
    recipe_set = set(recipe_ingredients)
    selected_set = set(selected_items)

    # Does selected_set fit entirely inside recipe_set?
    return selected_set.issubset(recipe_set)

# Test
pizza_ingredients = ["dough", "tomato", "cheese", "basil"]
selected = ["tomato", "cheese"]

print(recipe_matches(pizza_ingredients, selected))  # True
```

---

## Part 5: Building the Search Endpoint (30 minutes)

### The Complete Search Implementation

Add or update this in your `app.py`:

```python
@app.route('/api/recipes/search', methods=['POST'])
def search_recipes():
    """
    Search for recipes that contain ALL selected ingredients.

    Request Body:
        {"items": ["tomato", "cheese"]}

    Response:
        {
            "selected_items": ["tomato", "cheese"],
            "recipes": [...],
            "count": 2,
            "partial_matches": [...]
        }
    """
    # Get and validate input
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No JSON data provided",
            "example": {"items": ["tomato", "cheese"]}
        }), 400

    selected_items = data.get("items", [])

    if not selected_items:
        return jsonify({
            "selected_items": [],
            "recipes": [],
            "count": 0,
            "message": "No items selected"
        })

    # Convert to lowercase set for comparison
    selected_set = {item.lower() for item in selected_items}

    recipes = load_recipes()
    perfect_matches = []
    partial_matches = []

    for recipe in recipes:
        # Get recipe ingredients as lowercase set
        ingredients = recipe.get("ingredients", {})
        recipe_set = {ing.lower() for ing in ingredients.keys()}

        if not recipe_set:
            continue

        # Check if ALL selected items are in recipe
        if selected_set.issubset(recipe_set):
            # Calculate match percentage
            match_count = len(selected_set)
            total_ingredients = len(recipe_set)

            perfect_matches.append({
                **recipe,
                "match_info": {
                    "matched_ingredients": list(selected_set),
                    "total_recipe_ingredients": total_ingredients,
                    "match_percentage": round(match_count / total_ingredients * 100, 1)
                }
            })
        else:
            # Calculate partial match info
            matched = selected_set & recipe_set
            missing = selected_set - recipe_set

            if matched:  # At least some match
                partial_matches.append({
                    "id": recipe.get("id"),
                    "name": recipe.get("name"),
                    "matched": list(matched),
                    "missing": list(missing),
                    "match_percentage": round(len(matched) / len(selected_set) * 100, 1)
                })

    # Sort partial matches by match percentage
    partial_matches.sort(key=lambda x: x["match_percentage"], reverse=True)

    return jsonify({
        "selected_items": list(selected_items),
        "recipes": perfect_matches,
        "count": len(perfect_matches),
        "partial_matches": partial_matches[:5]  # Top 5 partial matches
    })
```

### Test the Endpoint

```bash
# Search with matching ingredients
curl -X POST http://localhost:5000/api/recipes/search \
  -H "Content-Type: application/json" \
  -d '{"items": ["tomato", "cheese"]}'

# Search with no matches
curl -X POST http://localhost:5000/api/recipes/search \
  -H "Content-Type: application/json" \
  -d '{"items": ["unicorn", "rainbow"]}'

# Empty search
curl -X POST http://localhost:5000/api/recipes/search \
  -H "Content-Type: application/json" \
  -d '{"items": []}'
```

---

## Part 6: Advanced Set Usage (20 minutes)

### Set Comprehensions

```python
# Like list comprehensions, but create sets
ingredients = ["tomato", "CHEESE", "Basil"]

# Normalize to lowercase
normalized = {item.lower() for item in ingredients}
print(normalized)  # {"tomato", "cheese", "basil"}

# Filter while creating
long_names = {item.lower() for item in ingredients if len(item) > 5}
print(long_names)  # {"tomato", "cheese"}
```

### Frozen Sets (Immutable Sets)

```python
# Normal sets are mutable
basket = {"tomato", "cheese"}
basket.add("basil")  # OK

# Frozen sets can't be changed
fixed = frozenset(["tomato", "cheese"])
# fixed.add("basil")  # Error!

# Useful as dictionary keys
recipe_combinations = {
    frozenset(["tomato", "cheese"]): "Pizza or Salad",
    frozenset(["bread", "butter"]): "Toast"
}
```

### Performance Comparison

```python
import time

# Create large collections
large_list = list(range(100000))
large_set = set(range(100000))

# Find item in list - SLOW
start = time.time()
99999 in large_list
list_time = time.time() - start

# Find item in set - FAST
start = time.time()
99999 in large_set
set_time = time.time() - start

print(f"List lookup: {list_time:.6f}s")
print(f"Set lookup: {set_time:.6f}s")
# Set is typically 1000x faster!
```

---

## Challenge: Ingredient Similarity Finder

Create an endpoint `/api/ingredients/similar` that finds ingredients often used together.

```python
# When user searches for "tomato"
# Return ingredients that commonly appear in recipes with tomato

# Example response:
{
    "ingredient": "tomato",
    "commonly_paired_with": [
        {"name": "cheese", "co_occurrence": 5},
        {"name": "basil", "co_occurrence": 4},
        {"name": "onion", "co_occurrence": 3}
    ]
}
```

Hint: For each recipe containing the target ingredient, add all other ingredients to a counter.

---

## What We Learned

### Lesson 9
- ✅ Creating sets: `set()`, `{a, b, c}`
- ✅ Adding/removing: `add()`, `remove()`, `discard()`
- ✅ Membership: `item in set`
- ✅ Set operations: intersection, union, difference
- ✅ Subset checking: `issubset()`

### Lesson 10
- ✅ Recipe matching algorithm
- ✅ POST endpoint with JSON body
- ✅ Calculating match percentages
- ✅ Partial match handling
- ✅ Set comprehensions

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **Set** | Unordered collection of unique items |
| **Intersection** | Items in both sets |
| **Union** | Items in either set |
| **Difference** | Items in first set but not second |
| **Subset** | All items of A are in B |
| **Membership** | Checking if item is in set |

---

## Next Steps

In **Lesson 11**, we'll implement search algorithms:
- Linear search
- Query parameter handling
- Case-insensitive searching

Your homework: Complete the ingredient similarity challenge!
