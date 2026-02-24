# Lesson Plan: Lesson 11
## Search Algorithms

**Duration:** 1-2 hours
**Prerequisites:** Completed Lessons 1-10 (Sets and recipe matching)
**Goal:** Implement text search functionality for recipes

---

## Learning Objectives

By the end of this lesson, you will:
1. Understand linear search algorithm
2. Implement case-insensitive text searching
3. Parse and validate query parameters
4. Search across multiple fields
5. Build a flexible search API endpoint

---

## The Big Picture: Why Search?

Our recipe matching finds recipes by ingredients. But users also want to:
- Search by recipe name: "Find pizza recipes"
- Search by description: "Find quick breakfast ideas"
- Search by multiple criteria: "Find easy pasta dishes"

### Intuition Builder: Finding a Book

Imagine searching for a book in a library:

**Without an index (Linear Search):**
- Start at first shelf
- Check each book until you find it
- Worst case: check every book

**With an index (Indexed Search):**
- Look up in catalog
- Go directly to location
- Much faster!

For our small recipe collection, linear search works fine!

---

## Part 1: Linear Search Algorithm (15 minutes)

### What is Linear Search?

Linear search checks each item one by one until it finds a match.

```python
def linear_search(items, target):
    """Find target in items using linear search."""
    for index, item in enumerate(items):
        if item == target:
            return index  # Found it!
    return -1  # Not found

# Example
recipes = ["pizza", "salad", "pasta", "soup", "burger"]
print(linear_search(recipes, "pasta"))  # 2
print(linear_search(recipes, "tacos"))  # -1
```

### Search with Partial Matching

Usually we want to find items that CONTAIN our search term:

```python
def search_contains(items, search_term):
    """Find all items containing the search term."""
    results = []
    search_lower = search_term.lower()

    for item in items:
        if search_lower in item.lower():
            results.append(item)

    return results

# Example
recipes = ["Margherita Pizza", "BBQ Pizza", "Greek Salad", "Pasta Primavera"]
print(search_contains(recipes, "pizza"))  # ["Margherita Pizza", "BBQ Pizza"]
```

### Algorithm Complexity

| Algorithm | Time Complexity | Description |
|-----------|----------------|-------------|
| Linear Search | O(n) | Check each item once |
| Binary Search | O(log n) | Only works on sorted data |
| Hash Lookup | O(1) | Direct access by key |

For recipe search with ~100 recipes, linear search is plenty fast.

---

## Part 2: Building the Search Endpoint (30 minutes)

### Query Parameter Handling

```python
from flask import request

@app.route('/api/search')
def search():
    # Get query parameters
    query = request.args.get('q', '')
    field = request.args.get('field', 'all')
    limit = request.args.get('limit', '10')

    # Parameters are always strings!
    # Convert limit to int
    try:
        limit = int(limit)
    except ValueError:
        limit = 10
```

### Complete Search Implementation

Add this to your `app.py`:

```python
@app.route('/api/search', methods=['GET'])
def search_recipes_by_text():
    """
    Search recipes by text query.

    Query Parameters:
        q: Search query (required)
        field: Which field to search (name, description, ingredients, all)
        limit: Maximum results (default: 20, max: 100)
        case_sensitive: Whether to match case (default: false)

    Examples:
        /api/search?q=pizza
        /api/search?q=quick&field=description
        /api/search?q=tomato&field=ingredients
    """
    # Get and validate query
    query = request.args.get('q', '').strip()

    if not query:
        return jsonify({
            "error": "Missing required parameter 'q'",
            "example": "/api/search?q=pizza"
        }), 400

    if len(query) < 2:
        return jsonify({
            "error": "Query must be at least 2 characters"
        }), 400

    # Get other parameters
    field = request.args.get('field', 'all').lower()
    case_sensitive = request.args.get('case_sensitive', 'false').lower() == 'true'

    # Validate and parse limit
    try:
        limit = int(request.args.get('limit', '20'))
        limit = max(1, min(limit, 100))  # Between 1 and 100
    except ValueError:
        limit = 20

    # Validate field
    valid_fields = ['name', 'description', 'ingredients', 'all']
    if field not in valid_fields:
        return jsonify({
            "error": f"Invalid field '{field}'",
            "valid_fields": valid_fields
        }), 400

    # Perform search
    recipes = load_recipes()
    results = []

    # Prepare query for comparison
    search_query = query if case_sensitive else query.lower()

    for recipe in recipes:
        if matches_query(recipe, search_query, field, case_sensitive):
            results.append(recipe)

    # Apply limit
    total_matches = len(results)
    results = results[:limit]

    return jsonify({
        "query": query,
        "field": field,
        "results": results,
        "count": len(results),
        "total_matches": total_matches,
        "limit": limit
    })


def matches_query(recipe, query, field, case_sensitive):
    """
    Check if recipe matches the search query.

    Args:
        recipe: Recipe dictionary
        query: Search string (already lowercased if not case_sensitive)
        field: Which field to search
        case_sensitive: Whether to match case

    Returns:
        bool: True if recipe matches
    """
    def normalize(text):
        """Normalize text for comparison."""
        if text is None:
            return ""
        if not case_sensitive:
            return str(text).lower()
        return str(text)

    def check_field(value):
        """Check if query is in value."""
        return query in normalize(value)

    # Search specific field
    if field == 'name':
        return check_field(recipe.get('name', ''))

    elif field == 'description':
        return check_field(recipe.get('description', ''))

    elif field == 'ingredients':
        ingredients = recipe.get('ingredients', {})
        for ingredient_name in ingredients.keys():
            if check_field(ingredient_name):
                return True
        return False

    elif field == 'all':
        # Search all text fields
        if check_field(recipe.get('name', '')):
            return True
        if check_field(recipe.get('description', '')):
            return True

        # Check ingredients
        ingredients = recipe.get('ingredients', {})
        for ingredient_name in ingredients.keys():
            if check_field(ingredient_name):
                return True

        # Check steps
        steps = recipe.get('steps', [])
        for step in steps:
            if check_field(step):
                return True

        return False

    return False
```

---

## Part 3: Testing the Search API (15 minutes)

### Test Basic Searches

```bash
# Search by recipe name
curl "http://localhost:5000/api/search?q=pizza"

# Search in description
curl "http://localhost:5000/api/search?q=quick&field=description"

# Search ingredients
curl "http://localhost:5000/api/search?q=tomato&field=ingredients"

# Search everything
curl "http://localhost:5000/api/search?q=cheese&field=all"
```

### Test with Options

```bash
# Limit results
curl "http://localhost:5000/api/search?q=easy&limit=5"

# Case sensitive search
curl "http://localhost:5000/api/search?q=Pizza&case_sensitive=true"
```

### Test Error Cases

```bash
# Missing query
curl "http://localhost:5000/api/search"

# Query too short
curl "http://localhost:5000/api/search?q=a"

# Invalid field
curl "http://localhost:5000/api/search?q=pizza&field=invalid"
```

---

## Part 4: Advanced Search Features (20 minutes)

### Multi-Word Search

```python
def search_multi_word(text, query_words, match_all=True):
    """
    Search for multiple words in text.

    Args:
        text: Text to search in
        query_words: List of words to find
        match_all: If True, ALL words must match; if False, ANY word matches

    Returns:
        bool: Whether text matches
    """
    text_lower = text.lower()

    if match_all:
        # All words must be present
        return all(word.lower() in text_lower for word in query_words)
    else:
        # Any word can match
        return any(word.lower() in text_lower for word in query_words)

# Examples
text = "Delicious homemade pizza with fresh tomatoes"

print(search_multi_word(text, ["pizza", "tomato"], match_all=True))   # True
print(search_multi_word(text, ["pizza", "cheese"], match_all=True))   # False
print(search_multi_word(text, ["pizza", "cheese"], match_all=False))  # True
```

### Highlight Matches

```python
def highlight_matches(text, query, highlight_start="**", highlight_end="**"):
    """
    Highlight search matches in text.

    Example:
        highlight_matches("Tomato Pizza", "pizza")
        Returns: "Tomato **Pizza**"
    """
    import re

    if not query:
        return text

    # Case-insensitive replacement
    pattern = re.compile(re.escape(query), re.IGNORECASE)

    def replace_with_highlight(match):
        return f"{highlight_start}{match.group()}{highlight_end}"

    return pattern.sub(replace_with_highlight, text)

# Example
print(highlight_matches("Margherita Pizza Recipe", "pizza"))
# "Margherita **Pizza** Recipe"
```

### Search Scoring

```python
def calculate_search_score(recipe, query):
    """
    Calculate relevance score for a recipe.

    Higher score = more relevant match.
    """
    score = 0
    query_lower = query.lower()

    # Name match is most important
    name = recipe.get('name', '').lower()
    if query_lower == name:
        score += 100  # Exact match
    elif query_lower in name:
        score += 50   # Partial match in name

    # Description match
    description = recipe.get('description', '').lower()
    if query_lower in description:
        score += 25

    # Ingredient match
    ingredients = recipe.get('ingredients', {})
    for ingredient in ingredients.keys():
        if query_lower in ingredient.lower():
            score += 10

    return score
```

---

## Part 5: Putting It Together (10 minutes)

### Enhanced Search Endpoint

```python
@app.route('/api/search/advanced', methods=['GET'])
def advanced_search():
    """
    Advanced recipe search with scoring and highlighting.

    Query Parameters:
        q: Search query
        highlight: Whether to highlight matches (default: false)
        sort: Sort by 'relevance' or 'name' (default: relevance)
    """
    query = request.args.get('q', '').strip()

    if not query:
        return jsonify({"error": "Missing query parameter 'q'"}), 400

    highlight = request.args.get('highlight', 'false').lower() == 'true'
    sort_by = request.args.get('sort', 'relevance')

    recipes = load_recipes()
    results = []

    for recipe in recipes:
        score = calculate_search_score(recipe, query)

        if score > 0:
            result = {**recipe, "search_score": score}

            if highlight:
                result["name_highlighted"] = highlight_matches(
                    recipe.get("name", ""), query
                )

            results.append(result)

    # Sort results
    if sort_by == 'relevance':
        results.sort(key=lambda x: x["search_score"], reverse=True)
    elif sort_by == 'name':
        results.sort(key=lambda x: x.get("name", "").lower())

    return jsonify({
        "query": query,
        "results": results,
        "count": len(results)
    })
```

---

## Challenge: Fuzzy Search

Implement a "fuzzy" search that finds near-matches. For example:
- "piza" should match "pizza"
- "tometo" should match "tomato"

Hint: Use the Levenshtein distance (edit distance) algorithm:

```python
def levenshtein_distance(s1, s2):
    """Calculate the minimum edits to transform s1 into s2."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)

    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

# Example
print(levenshtein_distance("pizza", "piza"))   # 1 (missing 'z')
print(levenshtein_distance("tomato", "tometo")) # 1 (wrong letter)
```

Create an endpoint that accepts a `fuzzy=true` parameter and returns results where the edit distance is ≤ 2.

---

## What We Learned

- ✅ Linear search algorithm
- ✅ Case-insensitive searching
- ✅ Query parameter parsing
- ✅ Multi-field searching
- ✅ Search scoring for relevance
- ✅ Match highlighting

---

## Key Vocabulary

| Term | Definition |
|------|------------|
| **Linear Search** | Check each item one by one |
| **Query Parameter** | URL parameter after `?` |
| **Case-Insensitive** | Matching regardless of upper/lowercase |
| **Relevance Score** | Number indicating match quality |
| **Fuzzy Search** | Finding near-matches with typos |

---

## Next Steps

In **Lessons 12-13**, we'll learn about **sorting**:
- The `sorted()` function
- Lambda functions for custom sorting
- Sorting API results

Your homework: Implement the fuzzy search challenge!
