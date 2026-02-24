# Lesson Plan: Lessons 3-4
## Python Lists: The Foundation of Data

**Duration:** 2 lessons (2-4 hours total)
**Prerequisites:** Completed Lessons 1-2 (Flask app running)
**Goal:** Master Python lists and build a foundation for handling collections of data

---

## Learning Objectives

By the end of these lessons, you will:
1. Create and manipulate Python lists
2. Access elements using indexing and slicing
3. Use common list methods (`append`, `remove`, `len`, etc.)
4. Iterate through lists with `for` loops
5. Filter lists with the `in` operator
6. Write list comprehensions for efficient filtering

---

## The Big Picture: Why Lists Matter

In our Recipe Kitchen, we deal with **collections of things**:
- A collection of ingredients in the fridge
- A collection of steps in a recipe
- A collection of recipes that match your search

Lists are Python's way of storing ordered collections. They're everywhere in programming!

### Intuition Builder: Lists Are Like Shelves

Think of a list like a shelf with numbered slots:

```
Index:    0         1          2         3
       ┌─────────┬──────────┬─────────┬─────────┐
Shelf: │ tomato  │  cheese  │  basil  │  onion  │
       └─────────┴──────────┴─────────┴─────────┘
```

- Each item has a **position** (index), starting at 0
- You can add items to the end, remove items, or rearrange them
- You can ask "is tomato on the shelf?" (membership check)

---

# LESSON 3: List Basics (1-2 hours)

## Part 1: Creating Lists (15 minutes)

### Empty Lists

```python
# Two ways to create an empty list
ingredients = []
ingredients = list()

print(ingredients)  # []
print(len(ingredients))  # 0
```

### Lists with Initial Items

```python
# List of strings
vegetables = ["tomato", "lettuce", "onion", "carrot"]

# List of numbers
quantities = [2, 5, 1, 3]

# Mixed types (less common, but possible)
recipe_info = ["Pizza", 30, True, ["cheese", "tomato"]]
```

### Code Breakdown

| Code | What It Creates |
|------|-----------------|
| `[]` | Empty list |
| `["a", "b", "c"]` | List with 3 strings |
| `[1, 2, 3]` | List with 3 numbers |
| `list("abc")` | List from string: `['a', 'b', 'c']` |

---

## Part 2: Accessing List Elements (20 minutes)

### Indexing: Getting One Item

```python
ingredients = ["tomato", "cheese", "basil", "onion"]

# Positive indexing (from the start)
first = ingredients[0]    # "tomato"
second = ingredients[1]   # "cheese"
last = ingredients[3]     # "onion"

# Negative indexing (from the end)
last = ingredients[-1]    # "onion"
second_last = ingredients[-2]  # "basil"
```

### Visual Guide to Indexing

```
Positive:    0         1          2         3
          ┌─────────┬──────────┬─────────┬─────────┐
          │ tomato  │  cheese  │  basil  │  onion  │
          └─────────┴──────────┴─────────┴─────────┘
Negative:   -4        -3         -2        -1
```

### Slicing: Getting Multiple Items

```python
ingredients = ["tomato", "cheese", "basil", "onion", "garlic"]

# Get a range: [start:end] (end is exclusive!)
first_two = ingredients[0:2]      # ["tomato", "cheese"]
middle = ingredients[1:4]         # ["cheese", "basil", "onion"]

# Shortcuts
from_start = ingredients[:3]      # ["tomato", "cheese", "basil"]
to_end = ingredients[2:]          # ["basil", "onion", "garlic"]
copy = ingredients[:]             # Full copy of list

# With step
every_other = ingredients[::2]    # ["tomato", "basil", "garlic"]
reversed_list = ingredients[::-1] # Reverse the list!
```

### Slice Syntax: `[start:end:step]`

| Slice | Meaning |
|-------|---------|
| `[0:3]` | Items 0, 1, 2 (not 3!) |
| `[:3]` | From start to index 3 |
| `[2:]` | From index 2 to end |
| `[::2]` | Every 2nd item |
| `[::-1]` | Reversed |

---

## Part 3: Modifying Lists (20 minutes)

### Adding Items

```python
ingredients = ["tomato", "cheese"]

# Add to end
ingredients.append("basil")
print(ingredients)  # ["tomato", "cheese", "basil"]

# Add at specific position
ingredients.insert(1, "onion")
print(ingredients)  # ["tomato", "onion", "cheese", "basil"]

# Add multiple items
ingredients.extend(["garlic", "pepper"])
print(ingredients)  # ["tomato", "onion", "cheese", "basil", "garlic", "pepper"]
```

### Removing Items

```python
ingredients = ["tomato", "cheese", "basil", "onion"]

# Remove by value
ingredients.remove("basil")
print(ingredients)  # ["tomato", "cheese", "onion"]

# Remove by index (and get the value)
removed = ingredients.pop(1)
print(removed)       # "cheese"
print(ingredients)   # ["tomato", "onion"]

# Remove last item
last = ingredients.pop()
print(last)          # "onion"
print(ingredients)   # ["tomato"]

# Clear all items
ingredients.clear()
print(ingredients)   # []
```

### Modifying Items

```python
ingredients = ["tomato", "cheese", "basil"]

# Change by index
ingredients[1] = "mozzarella"
print(ingredients)  # ["tomato", "mozzarella", "basil"]

# Change a slice
ingredients[0:2] = ["cherry tomato", "cheddar"]
print(ingredients)  # ["cherry tomato", "cheddar", "basil"]
```

### Method Summary Table

| Method | What It Does | Returns |
|--------|--------------|---------|
| `append(item)` | Add to end | None |
| `insert(i, item)` | Insert at index i | None |
| `extend([items])` | Add multiple items | None |
| `remove(item)` | Remove first occurrence | None |
| `pop(i)` | Remove at index, return it | The item |
| `pop()` | Remove last, return it | The item |
| `clear()` | Remove all items | None |

---

## Part 4: Checking List Contents (15 minutes)

### The `in` Operator

```python
ingredients = ["tomato", "cheese", "basil"]

# Check if item exists
has_tomato = "tomato" in ingredients    # True
has_onion = "onion" in ingredients      # False

# Use in conditions
if "cheese" in ingredients:
    print("We can make something cheesy!")

# Check if NOT in list
if "meat" not in ingredients:
    print("This could be vegetarian!")
```

### Finding Items

```python
ingredients = ["tomato", "cheese", "basil", "tomato"]

# Find index of item
idx = ingredients.index("cheese")  # 1

# Count occurrences
count = ingredients.count("tomato")  # 2
```

### Getting List Info

```python
ingredients = ["tomato", "cheese", "basil"]

length = len(ingredients)  # 3

# Check if empty
if len(ingredients) == 0:
    print("No ingredients!")

# Or more pythonically:
if not ingredients:
    print("No ingredients!")
```

---

## Hands-On Exercise: Building an Ingredient Manager

Create a new file `ingredient_manager.py`:

```python
"""Simple ingredient management using lists."""

# Start with some ingredients
basket = []

def show_basket():
    """Display all items in the basket."""
    if not basket:
        print("Basket is empty!")
    else:
        print(f"Basket contains {len(basket)} items:")
        for i, item in enumerate(basket):
            print(f"  {i + 1}. {item}")

def add_ingredient(item):
    """Add an ingredient to the basket."""
    if item in basket:
        print(f"{item} is already in the basket!")
    else:
        basket.append(item)
        print(f"Added {item} to basket")

def remove_ingredient(item):
    """Remove an ingredient from the basket."""
    if item in basket:
        basket.remove(item)
        print(f"Removed {item} from basket")
    else:
        print(f"{item} is not in the basket!")

# Test it out
add_ingredient("tomato")
add_ingredient("cheese")
add_ingredient("basil")
show_basket()

add_ingredient("tomato")  # Should say "already in basket"

remove_ingredient("cheese")
show_basket()
```

Run it:
```bash
python ingredient_manager.py
```

---

# LESSON 4: Iterating and Filtering (1-2 hours)

## Part 5: Iterating Through Lists (20 minutes)

### Basic For Loop

```python
ingredients = ["tomato", "cheese", "basil"]

# Iterate through items
for ingredient in ingredients:
    print(f"Processing: {ingredient}")
```

Output:
```
Processing: tomato
Processing: cheese
Processing: basil
```

### With Index Using enumerate()

```python
ingredients = ["tomato", "cheese", "basil"]

for index, ingredient in enumerate(ingredients):
    print(f"{index}: {ingredient}")
```

Output:
```
0: tomato
1: cheese
2: basil
```

### Building New Lists from Old

```python
ingredients = ["tomato", "cheese", "basil"]

# Create new list with modified items
upper_case = []
for ingredient in ingredients:
    upper_case.append(ingredient.upper())

print(upper_case)  # ["TOMATO", "CHEESE", "BASIL"]
```

---

## Part 6: List Comprehensions (25 minutes)

### The Power of Comprehensions

List comprehensions let you create new lists in a single line!

**Basic syntax:** `[expression for item in list]`

```python
ingredients = ["tomato", "cheese", "basil"]

# Old way (3 lines)
upper_case = []
for ingredient in ingredients:
    upper_case.append(ingredient.upper())

# Comprehension way (1 line!)
upper_case = [ingredient.upper() for ingredient in ingredients]

print(upper_case)  # ["TOMATO", "CHEESE", "BASIL"]
```

### Comprehension Anatomy

```python
[ingredient.upper() for ingredient in ingredients]
 │                   │                   │
 │                   │                   └── Source list
 │                   └── Loop variable
 └── Expression (what to put in new list)
```

### Filtering with Conditions

**Syntax:** `[expression for item in list if condition]`

```python
ingredients = ["tomato", "cheese", "basil", "butter", "bacon"]

# Only items starting with 'b'
b_items = [item for item in ingredients if item.startswith('b')]
print(b_items)  # ["basil", "butter", "bacon"]

# Only items with more than 5 characters
long_items = [item for item in ingredients if len(item) > 5]
print(long_items)  # ["tomato", "cheese", "butter"]
```

### Combining Transform and Filter

```python
ingredients = ["tomato", "cheese", "basil", "butter"]

# Uppercase items that start with 'b'
b_upper = [item.upper() for item in ingredients if item.startswith('b')]
print(b_upper)  # ["BASIL", "BUTTER"]
```

### Comprehension Examples Table

| Goal | Comprehension |
|------|---------------|
| Double all numbers | `[x * 2 for x in numbers]` |
| Lowercase all strings | `[s.lower() for s in strings]` |
| Filter even numbers | `[x for x in numbers if x % 2 == 0]` |
| Get lengths of strings | `[len(s) for s in strings]` |
| Filter and transform | `[s.upper() for s in strings if len(s) > 3]` |

---

## Part 7: Real-World Application (20 minutes)

Let's apply what we learned to our Recipe Kitchen!

### Filtering Ingredients in the API

Add this endpoint to your `app.py`:

```python
@app.route('/api/ingredients', methods=['GET'])
def get_ingredients():
    """Return available ingredients, optionally filtered."""
    # All available ingredients (matching the frontend)
    all_ingredients = [
        "tomato", "lettuce", "onion", "carrot", "potato",
        "corn", "broccoli", "pepper", "mushroom", "garlic",
        "cucumber", "eggplant", "apple", "banana", "lemon",
        "avocado", "strawberry", "orange", "grapes", "watermelon",
        "pineapple", "egg", "chicken", "beef", "bacon",
        "fish", "shrimp", "cheese", "milk", "butter",
        "yogurt", "bread", "rice", "pasta", "dough",
        "tortilla", "croissant", "honey", "salt", "oil",
        "basil", "chocolate", "ice_cream", "cookie", "cake"
    ]

    # Get optional filter from query string
    category = request.args.get('category')
    search = request.args.get('search')

    # Start with all ingredients
    result = all_ingredients

    # Filter by category if provided
    categories = {
        "vegetables": ["tomato", "lettuce", "onion", "carrot", "potato",
                      "corn", "broccoli", "pepper", "mushroom", "garlic",
                      "cucumber", "eggplant"],
        "fruits": ["apple", "banana", "lemon", "avocado", "strawberry",
                  "orange", "grapes", "watermelon", "pineapple"],
        "proteins": ["egg", "chicken", "beef", "bacon", "fish", "shrimp"],
        "dairy": ["cheese", "milk", "butter", "yogurt"],
        "grains": ["bread", "rice", "pasta", "dough", "tortilla", "croissant"]
    }

    if category and category in categories:
        result = categories[category]

    # Filter by search term if provided
    if search:
        search_lower = search.lower()
        result = [item for item in result if search_lower in item.lower()]

    return jsonify({
        "ingredients": result,
        "count": len(result)
    })
```

### Test the New Endpoint

```bash
# Get all ingredients
curl http://localhost:5000/api/ingredients

# Filter by category
curl "http://localhost:5000/api/ingredients?category=vegetables"

# Search for ingredients
curl "http://localhost:5000/api/ingredients?search=ch"

# Combine filters
curl "http://localhost:5000/api/ingredients?category=dairy&search=ch"
```

---

## Part 8: Understanding the Search Logic (15 minutes)

Remember the search function from Lesson 2? Let's break it down:

```python
for recipe in recipes:
    ingredients = recipe.get("ingredients", {})
    recipe_ingredients = [ing.lower() for ing in ingredients.keys()]
    selected_lower = [item.lower() for item in selected_items]

    if all(item in recipe_ingredients for item in selected_lower):
        matching_recipes.append(recipe)
```

### Line-by-Line Breakdown

| Line | What It Does |
|------|--------------|
| `for recipe in recipes:` | Loop through each recipe |
| `recipe.get("ingredients", {})` | Get ingredients dict (we'll cover dicts in Lesson 6) |
| `[ing.lower() for ing in ingredients.keys()]` | List comprehension: lowercase all ingredient names |
| `[item.lower() for item in selected_items]` | List comprehension: lowercase all selected items |
| `all(item in recipe_ingredients for item in selected_lower)` | Check if ALL selected items are in recipe |

### The `all()` Function

`all()` returns `True` only if EVERY item passes the check:

```python
# all() examples
all([True, True, True])   # True
all([True, False, True])  # False

# With generator expression
numbers = [2, 4, 6, 8]
all_even = all(n % 2 == 0 for n in numbers)  # True

# In our recipe search
selected = ["tomato", "cheese"]
recipe_has = ["tomato", "cheese", "basil"]

all(item in recipe_has for item in selected)  # True (both are present)
```

---

## Challenge: Build a Recipe Matcher

Create `recipe_matcher.py`:

```python
"""
Challenge: Implement a recipe matching system using lists.

Requirements:
1. Store available recipes as a list of dictionaries
2. Allow user to input available ingredients
3. Find all recipes where user has ALL required ingredients
4. Show how many ingredients are missing for partial matches
"""

# Sample recipes (simplified - just names and ingredients)
recipes = [
    {"name": "Cheese Sandwich", "ingredients": ["bread", "cheese", "butter"]},
    {"name": "Tomato Salad", "ingredients": ["tomato", "lettuce", "onion", "oil"]},
    {"name": "Omelette", "ingredients": ["egg", "cheese", "butter", "salt"]},
    {"name": "Pasta", "ingredients": ["pasta", "tomato", "garlic", "oil", "basil"]},
]

def find_recipes(available_ingredients):
    """
    Find recipes that can be made with available ingredients.

    Args:
        available_ingredients: List of ingredient names (strings)

    Returns:
        Tuple of (perfect_matches, partial_matches)
        - perfect_matches: List of recipe names where we have ALL ingredients
        - partial_matches: List of (recipe_name, missing_count, missing_items)
    """
    # YOUR CODE HERE
    # Hint: Use list comprehensions and the 'in' operator

    perfect_matches = []
    partial_matches = []

    # Loop through recipes
    # For each recipe, check which ingredients are available
    # Categorize as perfect match or partial match

    return perfect_matches, partial_matches

# Test your function
my_ingredients = ["bread", "cheese", "butter", "egg", "salt"]
perfect, partial = find_recipes(my_ingredients)

print("Perfect matches (can make right now):")
for recipe in perfect:
    print(f"  - {recipe}")

print("\nPartial matches:")
for recipe_name, missing_count, missing in partial:
    print(f"  - {recipe_name} (missing {missing_count}: {', '.join(missing)})")
```

**Expected output:**
```
Perfect matches (can make right now):
  - Cheese Sandwich
  - Omelette

Partial matches:
  - Tomato Salad (missing 4: tomato, lettuce, onion, oil)
  - Pasta (missing 5: pasta, tomato, garlic, oil, basil)
```

---

## What We Learned

### Lesson 3
- ✅ Creating lists: `[]`, `list()`
- ✅ Indexing: `list[0]`, `list[-1]`
- ✅ Slicing: `list[1:3]`, `list[::-1]`
- ✅ Methods: `append()`, `remove()`, `pop()`, `insert()`
- ✅ Checking membership: `item in list`

### Lesson 4
- ✅ For loops: `for item in list:`
- ✅ Enumerate: `for i, item in enumerate(list):`
- ✅ List comprehensions: `[x for x in list]`
- ✅ Filtering: `[x for x in list if condition]`
- ✅ The `all()` function

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **List** | Ordered collection of items |
| **Index** | Position of item in list (starts at 0) |
| **Slice** | A portion of a list `[start:end]` |
| **Append** | Add item to end of list |
| **Iterate** | Go through items one by one |
| **Comprehension** | One-line syntax for creating lists |
| **Filter** | Select items matching a condition |

---

## Next Steps

In **Lesson 5**, we'll build a complete Ingredient API with:
- Error handling with try/except
- HTTP status codes
- Query parameter parsing
- A more sophisticated filtering system

Your homework: Complete the recipe matcher challenge above!
