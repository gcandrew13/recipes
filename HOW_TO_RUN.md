# How to Run Recipe Kitchen

## Quick Start (3 Steps)

### Step 1: Install Python Dependencies

```bash
cd PythonBackend
pip install -r requirements.txt
```

### Step 2: Start the Flask Server

```bash
python app.py
```

You should see:
```
Starting Recipe Kitchen API server...
Server running on http://localhost:5000
```

**Keep this terminal window open!**

### Step 3: Open the Frontend

1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Open the file `Frontend/index.html`:
   - **Option A**: Double-click the file in Finder/Explorer
   - **Option B**: Drag the file into your browser window
   - **Option C**: Press `Cmd+O` (Mac) or `Ctrl+O` (Windows) in browser, then select the file

## What You Should See

```
┌─────────────────────────────────────────────────────────────────┐
│                     RECIPE KITCHEN                               │
├────────────────┬─────────────────────────┬──────────────────────┤
│                │                         │                      │
│    FRIDGE      │       COUNTER           │   RECIPES PANEL      │
│  (Ingredients) │    (Workspace)          │   (Results)          │
│                │                         │                      │
│   🍅 🧀 🥬     │                         │  Matching recipes    │
│   🥕 🥔 🌽     │        BASKET           │  appear here when    │
│                │       (Drop zone)       │  you add items to    │
│  ◀ Page 1 ▶   │                         │  the basket          │
│                │                         │                      │
└────────────────┴─────────────────────────┴──────────────────────┘
```

## Testing the Connection

### Test 1: API Health Check

Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","message":"Recipe API is running"}
```

### Test 2: Frontend Connection

1. Open `Frontend/index.html` in browser
2. Open browser developer tools (F12 or right-click → Inspect)
3. Go to Console tab
4. You should see: `Recipe Kitchen starting...` and `Kitchen ready!`
5. If you see CORS errors, make sure the Flask server is running

### Test 3: Recipe Search

1. In the kitchen interface, drag an ingredient from the fridge to the basket
2. Matching recipes should appear in the right panel
3. Click a recipe card to see full details

## Common Issues

### "Port 5000 already in use"

Another application is using port 5000. Either:
- Close the other application, or
- Edit `app.py` and change the port number:
  ```python
  app.run(debug=True, port=5001)
  ```
  Note: You'll also need to update `Frontend/app.js` line 11 to match:
  ```javascript
  API_BASE: 'http://localhost:5001/api',
  ```

### "ModuleNotFoundError: No module named 'flask'"

Run:
```bash
pip install -r requirements.txt
```

### "No recipes appearing"

1. Check Flask server is running (terminal should show server output)
2. Check browser console for errors (F12 → Console)
3. Make sure recipe JSON files exist in `PythonBackend/recipes/`

### Frontend shows but no ingredients

The ingredient data is built into the frontend. If the fridge is empty:
1. Hard refresh the page: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear browser cache if needed

## Development Tips

### Auto-Reload

Flask runs in debug mode by default, so Python code changes are applied automatically. Just refresh your browser to see changes.

### Browser Developer Tools

Press F12 to open developer tools:
- **Console**: See JavaScript errors and logs
- **Network**: See API requests/responses
- **Elements**: Inspect HTML structure

### Testing API Endpoints

Use curl or your browser:
```bash
# Get all recipes
curl http://localhost:5000/api/recipes

# Search for recipes with tomato and cheese
curl -X POST http://localhost:5000/api/recipes/search \
  -H "Content-Type: application/json" \
  -d '{"items": ["tomato", "cheese"]}'

# Get a specific recipe
curl http://localhost:5000/api/recipes/pizza
```

## Next Steps

Ready to start learning? Open `LESSON_01_02.md` and begin the course!
