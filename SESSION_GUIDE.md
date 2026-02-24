# Session-by-Session Guide

This document provides detailed instructions for each session of the Recipe Kitchen Python API course.

---

## Pre-Course Setup (Complete Before Session 1)

### Software Installation Checklist
- [ ] Python 3.11+ installed
- [ ] Visual Studio Code installed
- [ ] VSCode Extensions installed:
  - [ ] Python
  - [ ] Pylance
- [ ] Web browser (Chrome, Firefox, or Edge)

### Verify Python Installation
```bash
python --version   # Should show 3.11 or higher
pip --version      # Should work
```

### Project Structure
The project folders are set up as follows:
- `PythonBackend/` - Flask API server code
- `PythonBackend/recipes/` - Recipe JSON data files
- `Frontend/` - Pre-built web interface

---

## Course Overview

### Learning Path

| Sessions | Topic | Key Python Concepts |
|----------|-------|---------------------|
| 1-2 | Setup & Flask Basics | Variables, functions, routes, decorators |
| 3-4 | Python Lists | Indexing, iteration, list comprehensions |
| 5 | Ingredient API | Error handling, HTTP status codes |
| 6-7 | Dictionaries & JSON | Key-value pairs, nested data, file I/O |
| 8 | Recipe CRUD API | pathlib, file operations, validation |
| 9-10 | Sets & Matching | Set operations, recipe search algorithm |
| 11 | Search Algorithms | Linear search, query parameters |
| 12-13 | Sorting | sorted(), lambda functions, custom keys |
| 14 | Complex Filtering | filter(), multiple criteria, chaining |
| 15 | Recommendations & Capstone | Jaccard similarity, final project |

### API Endpoints Built

| Endpoint | Method | Session |
|----------|--------|---------|
| `/api/health` | GET | 2 |
| `/api/recipes` | GET | 2, 8 |
| `/api/recipes` | POST | 8 |
| `/api/recipes/<id>` | GET, PUT, DELETE | 8 |
| `/api/recipes/search` | POST | 10 |
| `/api/ingredients` | GET | 5 |
| `/api/ingredients/categories` | GET | 5 |
| `/api/search` | GET | 11 |
| `/api/recipes/filter` | GET | 14 |
| `/api/recipes/<id>/similar` | GET | 15 |

---

## Session 1-2: Project Setup & Flask Basics

### Learning Objectives
- Set up Python virtual environment
- Install Flask and dependencies
- Create first API endpoint
- Connect frontend to backend

### Session Outline

#### Part 1: Environment Setup (30 min)
1. Create project directory
2. Set up virtual environment:
   ```bash
   cd RecipeKitchen
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   # or: venv\Scripts\activate  # Windows
   ```
3. Install dependencies:
   ```bash
   pip install flask flask-cors
   ```

#### Part 2: First Flask App (45 min)
1. Create `app.py` with basic structure
2. Implement `/api/health` endpoint
3. Run server: `python app.py`
4. Test with browser/curl

#### Part 3: Frontend Integration (45 min)
1. Copy Frontend folder to project
2. Implement `/api/recipes` endpoint
3. Test drag-drop interface in browser
4. Verify CORS is working

### Checkpoint
- [ ] Server runs on http://localhost:5000
- [ ] Health endpoint returns JSON
- [ ] Frontend loads and displays recipes

### Key Concepts
- **Virtual Environment**: Isolated Python packages
- **Flask**: Web framework for APIs
- **Route Decorator**: `@app.route('/path')`
- **CORS**: Cross-Origin Resource Sharing

---

## Session 3-4: Python Lists

### Learning Objectives
- Create and manipulate lists
- Use indexing and slicing
- Iterate with for loops
- Write list comprehensions

### Session Outline

#### Part 1: List Basics (30 min)
1. Creating lists: `[]`, `list()`
2. Indexing: positive and negative
3. Modifying: `append()`, `remove()`, `pop()`

#### Part 2: Iteration (30 min)
1. For loops
2. `enumerate()` for index + value
3. `len()` and membership (`in`)

#### Part 3: List Comprehensions (45 min)
1. Basic syntax: `[x for x in items]`
2. Filtering: `[x for x in items if condition]`
3. Transforming: `[x.lower() for x in items]`

#### Part 4: Slicing (15 min)
1. Range slicing: `list[start:end]`
2. Step slicing: `list[::step]`

### Checkpoint
- [ ] Student can create/modify lists
- [ ] Student understands list comprehensions
- [ ] Student can iterate with for loops

### Practice Exercises
1. Create list of 5 ingredients
2. Add 2 more, remove 1
3. Use comprehension to filter items > 5 characters

---

## Session 5: Complete Ingredient API

### Learning Objectives
- Handle HTTP status codes
- Implement error handling with try/except
- Validate query parameters
- Build production-ready endpoint

### Session Outline

#### Part 1: HTTP Status Codes (20 min)
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Server Error

#### Part 2: Error Handling (30 min)
1. try/except blocks
2. Returning error JSON with status codes
3. Input validation

#### Part 3: Ingredient Endpoint (40 min)
1. Load ingredients from JSON
2. Implement `/api/ingredients` with filtering
3. Add category filter
4. Add search filter

#### Part 4: Testing (30 min)
1. Test with curl
2. Test edge cases (empty results, invalid params)
3. Test error conditions

### Checkpoint
- [ ] `/api/ingredients` returns ingredient list
- [ ] Category filtering works
- [ ] Search filtering works
- [ ] Error handling is in place

---

## Session 6-7: Dictionaries & JSON

### Learning Objectives
- Create and access dictionaries
- Work with nested data structures
- Read/write JSON files
- Parse recipe data

### Session Outline

#### Part 1: Dictionary Basics (30 min)
1. Creating: `{}`, `dict()`
2. Accessing: `d[key]`, `d.get(key)`
3. Modifying: assignment, `update()`

#### Part 2: Dictionary Methods (30 min)
1. `.keys()`, `.values()`, `.items()`
2. Iteration patterns
3. Membership testing

#### Part 3: Nested Structures (45 min)
1. Dictionaries inside dictionaries
2. Lists inside dictionaries
3. Real recipe data structure

#### Part 4: JSON File Operations (45 min)
1. `json.load()` - read file
2. `json.dump()` - write file
3. Working with recipe files

### Checkpoint
- [ ] Student can navigate nested dicts
- [ ] Student can read/write JSON files
- [ ] Student understands recipe data structure

---

## Session 8: Recipe CRUD API

### Learning Objectives
- Implement full CRUD operations
- Use pathlib for file operations
- Validate input data
- Handle all HTTP methods

### Session Outline

#### Part 1: pathlib Introduction (20 min)
1. `Path()` objects
2. `.exists()`, `.glob()`
3. Reading/writing files

#### Part 2: GET Operations (30 min)
1. List all recipes
2. Get single recipe by ID
3. Handle not found

#### Part 3: POST/PUT Operations (40 min)
1. Create new recipe
2. Update existing recipe
3. Input validation

#### Part 4: DELETE Operation (15 min)
1. Delete recipe file
2. Handle errors

#### Part 5: Testing Full CRUD (15 min)
1. Test create → read → update → delete flow
2. Verify with frontend

### Checkpoint
- [ ] All CRUD endpoints working
- [ ] Proper status codes returned
- [ ] Input validation in place

---

## Session 9-10: Sets & Recipe Matching

### Learning Objectives
- Understand set properties
- Use set operations
- Implement recipe matching algorithm
- Build search endpoint

### Session Outline

#### Part 1: Set Basics (30 min)
1. Creating sets: `set()`, `{a, b, c}`
2. Properties: unique, unordered
3. `add()`, `remove()`, `discard()`

#### Part 2: Set Operations (45 min)
1. Intersection: `&` (items in both)
2. Union: `|` (items in either)
3. Difference: `-` (items in first only)
4. Subset: `issubset()` (A fits in B)

#### Part 3: Recipe Matching Algorithm (45 min)
1. Problem: Find recipes containing ALL selected ingredients
2. Convert ingredient lists to sets
3. Use `issubset()` for matching

#### Part 4: Search Endpoint (30 min)
1. Implement `/api/recipes/search`
2. Handle POST with JSON body
3. Return matching recipes with match info

### Checkpoint
- [ ] Student understands set operations
- [ ] Recipe matching algorithm works
- [ ] Search endpoint integrated with frontend

### Visual Guide
```
    Recipe Ingredients          User's Basket
   ┌─────────────────┐     ┌─────────────────┐
   │  dough   basil  │     │  onion   garlic │
   │         ┌──────┴──────┴──────┐          │
   │         │ tomato    cheese   │          │
   │         └──────┬──────┬──────┘          │
   └─────────────────┘     └─────────────────┘

   Intersection: {tomato, cheese}
   Match: basket.issubset(recipe) → True if all basket items in recipe
```

---

## Session 11: Search Algorithms

### Learning Objectives
- Implement linear search
- Parse query parameters
- Search across multiple fields
- Handle case-insensitive matching

### Session Outline

#### Part 1: Linear Search (20 min)
1. Algorithm explanation
2. Step through each item
3. Time complexity: O(n)

#### Part 2: Query Parameters (25 min)
1. `request.args.get()`
2. Validation and defaults
3. Type conversion

#### Part 3: Multi-Field Search (45 min)
1. Search by name
2. Search by description
3. Search by ingredients
4. Search all fields

#### Part 4: Search Endpoint (30 min)
1. Implement `/api/search`
2. Add `field` parameter
3. Add `limit` parameter

### Checkpoint
- [ ] Search finds matching recipes
- [ ] Multiple fields searchable
- [ ] Case-insensitive by default

---

## Session 12-13: Sorting

### Learning Objectives
- Use `sorted()` function
- Write lambda functions
- Sort by custom criteria
- Add sort parameters to API

### Session Outline

#### Part 1: sorted() Basics (30 min)
1. Basic sorting
2. `reverse=True`
3. `sorted()` vs `list.sort()`

#### Part 2: Lambda Functions (45 min)
1. Syntax: `lambda x: expression`
2. Use with `key` parameter
3. Sorting dictionaries

#### Part 3: Multi-Criteria Sorting (30 min)
1. Tuple keys
2. Custom sort orders
3. Mixed ascending/descending

#### Part 4: API Sort Parameters (45 min)
1. Add `sort` parameter
2. Add `order` parameter
3. Define sort key functions

### Checkpoint
- [ ] Recipes sortable by name, time, difficulty
- [ ] Ascending and descending work
- [ ] Student understands lambda syntax

---

## Session 14: Complex Filtering

### Learning Objectives
- Use `filter()` function
- Combine multiple conditions
- Build flexible filter endpoint
- Chain filters

### Session Outline

#### Part 1: Filter Basics (20 min)
1. `filter(function, iterable)`
2. Compare to list comprehensions
3. When to use each

#### Part 2: Multiple Conditions (30 min)
1. AND conditions
2. OR conditions
3. Complex combinations

#### Part 3: Filter Functions (30 min)
1. Reusable filter functions
2. Chaining filters
3. Range-based filtering

#### Part 4: Filter Endpoint (40 min)
1. Implement `/api/recipes/filter`
2. Add multiple filter parameters
3. Combine with sorting

### Checkpoint
- [ ] Filter endpoint works
- [ ] Multiple criteria supported
- [ ] Combined with sorting

### Filter Parameters
- `difficulty`: easy, medium, hard
- `max_time`: Maximum cooking time
- `min_time`: Minimum cooking time
- `ingredients`: Required ingredients
- `sort`: Field to sort by
- `order`: asc or desc

---

## Session 15: Recommendations & Capstone

### Learning Objectives
- Understand Jaccard similarity
- Implement recommendation system
- Complete full Recipe Kitchen API
- Test and validate all endpoints

### Session Outline

#### Part 1: Jaccard Similarity (30 min)
1. Formula: |A ∩ B| / |A ∪ B|
2. Python implementation
3. Multi-factor similarity

#### Part 2: Similar Recipes Endpoint (40 min)
1. Implement `/api/recipes/<id>/similar`
2. Calculate similarity scores
3. Return ranked results

#### Part 3: Final Testing (30 min)
1. Test all endpoints
2. Verify frontend integration
3. Fix any remaining issues

#### Part 4: Capstone Review (20 min)
1. Review complete API
2. Discuss extension ideas
3. Next steps for learning

### Checkpoint
- [ ] Similar recipes endpoint works
- [ ] All 12 endpoints functional
- [ ] Frontend fully integrated

### Extension Ideas
1. User accounts and favorites
2. Ratings and reviews
3. Shopping list generation
4. Meal planning
5. Recipe scaling

---

## Troubleshooting Guide

### Flask Server Issues

**Server won't start:**
```bash
# Check Python version
python --version

# Check Flask installed
pip list | grep Flask

# Check port in use
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows
```

**CORS errors in browser:**
- Verify `flask-cors` is installed
- Check `CORS(app)` is in app.py
- Clear browser cache

### Common Python Errors

**ModuleNotFoundError:**
```bash
# Activate virtual environment
source venv/bin/activate

# Reinstall packages
pip install -r requirements.txt
```

**JSON parsing errors:**
- Check JSON file syntax
- Verify file exists at path
- Use proper encoding

### Frontend Issues

**Recipes not loading:**
1. Check Flask server is running
2. Open browser console (F12)
3. Look for network errors
4. Verify endpoint returns JSON

**Drag and drop not working:**
- Check browser console for errors
- Verify CORS is enabled
- Test endpoint directly with curl

---

## Assessment Checklist

### Mid-Course (After Session 8)
- [ ] Can create Flask endpoints
- [ ] Understands lists and dictionaries
- [ ] Can read/write JSON files
- [ ] CRUD operations working

### End of Course (After Session 15)
- [ ] Understands all three data structures
- [ ] Can implement search/sort/filter
- [ ] Recipe matching algorithm works
- [ ] Similar recipes recommendation works
- [ ] All API endpoints functional
- [ ] Frontend fully integrated

---

## Resources

### Python Documentation
- [Python Tutorial](https://docs.python.org/3/tutorial/)
- [Flask Quickstart](https://flask.palletsprojects.com/en/2.0.x/quickstart/)

### Helpful Tools
- [Postman](https://www.postman.com/) - API testing
- [curl](https://curl.se/) - Command line HTTP client
- [JSON Formatter](https://jsonformatter.org/) - Validate JSON

### Practice
- Create additional recipe files
- Add new ingredients
- Implement custom endpoints
- Extend the frontend (optional)
