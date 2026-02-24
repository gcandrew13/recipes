# Interactive Recipe Kitchen - Web Edition

A 15-lesson Python course teaching data structures and algorithms through building a recipe matching API with a pre-built web frontend.

## Project Structure

```
RecipeKitchen/
├── Frontend/              # Pre-built web interface (HTML/CSS/JS)
│   ├── index.html        # Kitchen UI
│   ├── styles.css        # Styling
│   └── app.js            # Frontend logic
├── PythonBackend/        # Flask API server (students build this!)
│   ├── app.py           # Main Flask application
│   ├── recipes/         # Recipe JSON files
│   └── requirements.txt # Python dependencies
├── LESSON_*.md          # Course lesson files
└── Resources/           # Shared resources
```

## Prerequisites

### Software Installation

1. **Visual Studio Code** - https://code.visualstudio.com/
   - Install extensions:
     - Python
     - Pylance

2. **Python 3.11+** - https://www.python.org/downloads/

3. **A modern web browser** (Chrome, Firefox, Safari, Edge)

### Python Dependencies

Install Python packages:

```bash
cd PythonBackend
pip install -r requirements.txt
```

## Quick Start

### 1. Start the Python Backend

```bash
cd PythonBackend
python app.py
```

Server runs on `http://localhost:5000`

### 2. Open the Frontend

Open `Frontend/index.html` in your web browser (double-click the file or drag it into your browser).

### 3. Test the Connection

- The kitchen interface should load with a fridge, counter, and basket
- Drag ingredients from the fridge to the basket
- Matching recipes appear in the sidebar

## Course Overview

This course teaches Python fundamentals through building a recipe matching system:

| Lessons | Topic | Key Concepts |
|---------|-------|--------------|
| 1-2 | Setup & Flask Basics | Python syntax, routes, decorators |
| 3-5 | Lists | Creation, iteration, filtering, comprehensions |
| 6-8 | Dictionaries | Key-value pairs, nested data, JSON |
| 9-10 | Sets | Membership, intersection, recipe matching |
| 11-13 | Algorithms | Search, sort, filter |
| 14-15 | Recommendations & Capstone | Jaccard similarity, final project |

## API Endpoints

The Flask backend serves these endpoints:

- `GET /api/health` - Health check
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes/search` - Search recipes by ingredients
  - Body: `{"items": ["tomato", "cheese"]}`
- `GET /api/recipes/<id>` - Get specific recipe

## Recipe Data Format

Recipes are stored as JSON files in `PythonBackend/recipes/`:

```json
{
  "id": "recipe_id",
  "name": "Recipe Name",
  "description": "Description",
  "ingredients": {
    "tomato": {"amount": 2, "unit": "pieces"},
    "cheese": {"amount": 100, "unit": "grams"}
  },
  "steps": ["Step 1", "Step 2"],
  "time": ["10 min", "20 min"],
  "servings": 4,
  "materials": ["pan", "knife"]
}
```

## Development Workflow

1. Start Python backend: `python PythonBackend/app.py`
2. Open `Frontend/index.html` in browser
3. Make changes to Python code
4. Refresh browser to test changes

## Troubleshooting

### Python API Not Responding
- Ensure Flask server is running (`python app.py`)
- Check that port 5000 is not in use
- Verify CORS is enabled in `app.py`

### Frontend Not Connecting
- Make sure the Flask server is running on http://localhost:5000
- Check browser console for errors (F12 → Console)
- Verify you're opening the HTML file in a browser

### Module Not Found Errors
- Run `pip install -r requirements.txt` in the PythonBackend folder
- Make sure you're using Python 3.11+

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Python JSON Documentation](https://docs.python.org/3/library/json.html)
- [Python Sets Documentation](https://docs.python.org/3/tutorial/datastructures.html#sets)
