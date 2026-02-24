# Product Requirements Document: Interactive Recipe Kitchen - Web Edition

## Project Overview

**Product Name:** Interactive Recipe Kitchen
**Target User:** Students with some coding experience
**Course Duration:** 15 lessons (1-2 hours each)
**Technologies:** Python (80%+), Flask, JSON, pre-built HTML/CSS/JS frontend
**Primary Learning Goal:** Python data structures and algorithms through API development

---

## Product Vision

A web-based recipe kitchen application where students build the Python backend that powers an interactive kitchen interface:
- Browse ingredients stored in a paginated fridge
- Drag ingredients onto a counter workspace
- Place ingredients in a "recipe basket" to discover matching recipes
- View recipe details in a modal dialog
- Learn Python fundamentals through practical API development

**Key Design Decision:** The frontend is pre-built and provided. Students focus 100% on Python, copying the frontend files into their project without modification.

---

## Feature Summary

| Feature | Description | Lessons |
|---------|-------------|---------|
| F1: Project Setup | Python environment, Flask basics, first endpoint | 1-2 |
| F2: Lists & Ingredients | Ingredient storage, iteration, filtering | 3-5 |
| F3: Dictionaries & Recipes | Recipe data structure, nested JSON, file I/O | 6-8 |
| F4: Sets & Matching | Basket state, set operations, recipe search | 9-10 |
| F5: Search Algorithms | Linear search, query parameters | 11 |
| F6: Sorting | sorted(), lambda functions, sort endpoints | 12-13 |
| F7: Filtering | Complex conditions, filter endpoints | 14 |
| F8: Recommendations & Capstone | Jaccard similarity, final project | 15 |

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 PRE-BUILT WEB FRONTEND                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐   │
│  │  Fridge │  │ Counter │  │ Basket  │  │ Recipe Panel │   │
│  │ (Pages) │  │  Area   │  │  Zone   │  │   (Modal)    │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └──────┬───────┘   │
│       │            │            │               │           │
│       └────────────┴────────────┴───────────────┘           │
│                          │                                   │
│                    JavaScript                                │
│              (app.js - provided, not modified)              │
└─────────────────────────────────────────────────────────────┘
                           │
                      HTTP Requests
                           │
┌─────────────────────────────────────────────────────────────┐
│              PYTHON BACKEND (Flask) - STUDENTS BUILD        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Recipe API  │  │ Health API  │  │  Search Algorithm   │  │
│  │  /recipes   │  │   /health   │  │  (Intersection)     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┴─────────────────────┘             │
│                          │                                   │
│                   JSON File Storage                          │
│                  (recipes/*.json)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Lesson Specifications

### Lessons 1-2: Project Setup & Flask Basics

**Learning Objectives:**
- Set up Python development environment
- Understand Flask routing and decorators
- Create first API endpoint
- Connect frontend to backend

**API Endpoints Built:**
- `GET /api/health` - Health check endpoint

**Acceptance Criteria:**
- [ ] Python environment configured
- [ ] Flask server runs on localhost:5000
- [ ] Health endpoint returns JSON response
- [ ] Frontend connects to backend

---

### Lessons 3-5: Lists & Ingredient API

**Learning Objectives:**
- Create and manipulate Python lists
- Iterate with for loops
- Filter lists with comprehensions
- Handle API errors

**API Endpoints Built:**
- `GET /api/ingredients` - Return all available ingredients

**Python Concepts:**
- List creation: `[]`, `list()`
- Indexing and slicing
- `append()`, `remove()`, `len()`
- `for item in list:`
- List comprehensions: `[x for x in list if condition]`
- `in` operator

**Acceptance Criteria:**
- [ ] Ingredients endpoint returns JSON array
- [ ] Error handling with try/except
- [ ] Status codes used correctly

---

### Lessons 6-8: Dictionaries & Recipe API

**Learning Objectives:**
- Work with Python dictionaries
- Access nested data structures
- Read JSON files
- Build CRUD operations

**API Endpoints Built:**
- `GET /api/recipes` - Return all recipes
- `GET /api/recipes/<id>` - Return specific recipe

**Python Concepts:**
- Dictionary creation: `{}`
- Key-value access: `dict[key]`, `dict.get(key)`
- `keys()`, `values()`, `items()`
- Nested dictionaries
- `json.load()` and `json.dumps()`
- `pathlib.Path` and `glob`

**Acceptance Criteria:**
- [ ] Recipes load from JSON files
- [ ] Individual recipe lookup works
- [ ] 404 returned for missing recipes

---

### Lessons 9-10: Sets & Recipe Matching

**Learning Objectives:**
- Understand Python sets
- Use set operations (intersection, subset)
- Implement recipe matching algorithm
- Handle POST requests with JSON body

**API Endpoints Built:**
- `POST /api/recipes/search` - Search recipes by ingredients

**Python Concepts:**
- Set creation: `set()`, `{item1, item2}`
- `add()`, `remove()`, `discard()`
- Membership: `item in set`
- `intersection()`, `union()`, `issubset()`
- Set comprehensions

**Acceptance Criteria:**
- [ ] Search endpoint accepts JSON body
- [ ] Returns recipes containing ALL selected ingredients
- [ ] Empty basket returns empty results

---

### Lesson 11: Search Algorithms

**Learning Objectives:**
- Implement linear search
- Parse query parameters
- Search by multiple criteria

**API Endpoints Built:**
- `GET /api/search?q=<term>` - Search recipes by name/description

**Python Concepts:**
- Linear search algorithm
- `request.args.get()`
- String methods: `lower()`, `find()`, `in`
- Algorithm complexity basics

**Acceptance Criteria:**
- [ ] Search by recipe name works
- [ ] Case-insensitive search
- [ ] Partial matches returned

---

### Lessons 12-13: Sorting

**Learning Objectives:**
- Use `sorted()` function
- Write lambda functions
- Sort by multiple criteria

**API Endpoints Enhanced:**
- `GET /api/recipes?sort=name&order=asc`
- `GET /api/recipes?sort=time&order=desc`

**Python Concepts:**
- `sorted()` vs `list.sort()`
- `key` parameter
- Lambda functions: `lambda x: x['field']`
- `reverse` parameter

**Acceptance Criteria:**
- [ ] Sort recipes by name (A-Z, Z-A)
- [ ] Sort recipes by prep time
- [ ] Sort recipes by number of ingredients

---

### Lesson 14: Filtering

**Learning Objectives:**
- Implement complex filtering
- Combine multiple filter conditions
- Use `filter()` function

**API Endpoints Built:**
- `GET /api/recipes/filter?difficulty=easy&max_time=30`

**Python Concepts:**
- `filter()` function
- Multiple conditions with `and`/`or`
- Combining filter and sort
- Query parameter handling

**Acceptance Criteria:**
- [ ] Filter by difficulty level
- [ ] Filter by maximum cook time
- [ ] Combine multiple filters

---

### Lesson 15: Recommendations & Capstone

**Learning Objectives:**
- Implement Jaccard similarity
- Build recommendation system
- Complete final project

**API Endpoints Built:**
- `GET /api/recipes/<id>/similar` - Find similar recipes

**Python Concepts:**
- Jaccard similarity: |A ∩ B| / |A ∪ B|
- Scoring and ranking
- Algorithm design

**Acceptance Criteria:**
- [ ] Similar recipes endpoint works
- [ ] Recommendations based on ingredient overlap
- [ ] Capstone project completed

---

## Data Structures Progression

```
Lessons 1-2:   Setup + Python/Flask Basics
               └── Variables, strings, functions, decorators

Lessons 3-5:   Lists
               └── [item1, item2, item3]
               └── Iteration, filtering, comprehensions

Lessons 6-8:   Dictionaries
               └── {"key": "value", "nested": {"data": 123}}
               └── JSON parsing, file I/O

Lessons 9-10:  Sets
               └── {item1, item2, item3}
               └── Intersection, subset, recipe matching

Lessons 11-15: Algorithms
               └── Search, sort, filter, recommend
```

---

## Frontend Integration

The pre-built frontend expects these endpoints:

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/api/health` | GET | - | `{"status": "ok"}` |
| `/api/recipes` | GET | - | `[{recipe}, ...]` |
| `/api/recipes/search` | POST | `{"items": [...]}` | `{"recipes": [...]}` |
| `/api/recipes/<id>` | GET | - | `{recipe}` |

Students copy the `Frontend/` folder to their project in Lesson 1-2 and never modify it.

---

## Success Metrics

1. **Completion:** Student completes all 15 lessons
2. **Understanding:** Student can explain each data structure and algorithm
3. **Independence:** Student can extend the API with new endpoints
4. **Portfolio:** Student has a working project to demonstrate

---

## Teaching Style

Each lesson includes:
- **Learning Objectives** (3-5 bullet points)
- **Intuition Builder** (real-world analogy)
- **Hands-On Code** (step-by-step with full code blocks)
- **Code Breakdown Table** (line-by-line explanation)
- **Challenge** (independent practice)
- **What We Learned** (summary)

---

## Lesson File Reference

- `LESSON_01_02.md` - Project Setup & Flask Basics
- `LESSON_03_04.md` - Lists: Creation, Iteration, Filtering
- `LESSON_05.md` - Complete Ingredient API
- `LESSON_06_07.md` - Dictionaries & Nested JSON
- `LESSON_08.md` - Recipe API with File I/O
- `LESSON_09_10.md` - Sets & Recipe Matching
- `LESSON_11.md` - Search Algorithms
- `LESSON_12_13.md` - Sorting with Lambdas
- `LESSON_14.md` - Complex Filtering
- `LESSON_15.md` - Recommendations & Capstone
