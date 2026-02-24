# Pre-Course Setup Checklist

Complete this checklist before starting Lesson 1.

## Software Installation

### Visual Studio Code
- [ ] VSCode downloaded and installed from https://code.visualstudio.com/
- [ ] VSCode opens successfully

### Python Setup
- [ ] Python 3.11+ downloaded from https://www.python.org/downloads/
- [ ] Python installed successfully
- [ ] Verify installation:
  ```bash
  python3 --version
  ```
  Should show `Python 3.11.x` or higher
- [ ] pip is working:
  ```bash
  pip3 --version
  ```

### Web Browser
- [ ] Modern browser available (Chrome, Firefox, Safari, or Edge)
- [ ] Browser can open local HTML files

## VSCode Extensions

Install these extensions in VSCode (Extensions → Search → Install):

- [ ] **Python** (by Microsoft) - Python language support
- [ ] **Pylance** (by Microsoft) - Python IntelliSense

**How to install:**
1. Open VSCode
2. Click Extensions icon (left sidebar) or press `Cmd+Shift+X` (Mac) / `Ctrl+Shift+X` (Windows)
3. Search for extension name
4. Click "Install" button

## Project Setup

### Python Backend
- [ ] Open Terminal
- [ ] Navigate to PythonBackend folder:
  ```bash
  cd /path/to/RecipeKitchen/PythonBackend
  ```
- [ ] Install Python dependencies:
  ```bash
  pip3 install -r requirements.txt
  ```
- [ ] Verify installation (should see no errors)

## Verification Tests

### Test 1: Python Server
- [ ] Open terminal
- [ ] Navigate to PythonBackend:
  ```bash
  cd /path/to/RecipeKitchen/PythonBackend
  ```
- [ ] Start server:
  ```bash
  python3 app.py
  ```
- [ ] See message: "Server running on http://localhost:5000"
- [ ] Open new terminal window (keep server running)
- [ ] Test API:
  ```bash
  curl http://localhost:5000/api/health
  ```
- [ ] See response: `{"status":"ok","message":"Recipe API is running"}`
- [ ] Stop server with `Ctrl+C`

### Test 2: Frontend
- [ ] Open `Frontend/index.html` in web browser
- [ ] Kitchen interface loads with fridge, counter, and basket
- [ ] Ingredients visible in fridge (click arrows to navigate pages)

### Test 3: Full Connection
- [ ] Start Python server: `python3 PythonBackend/app.py`
- [ ] Open `Frontend/index.html` in browser
- [ ] Drag an ingredient from fridge to basket
- [ ] Verify recipes appear in sidebar (if ingredients match a recipe)

### Test 4: File Structure
Verify these folders and files exist:
- [ ] `Frontend/index.html`
- [ ] `Frontend/styles.css`
- [ ] `Frontend/app.js`
- [ ] `PythonBackend/app.py`
- [ ] `PythonBackend/requirements.txt`
- [ ] `PythonBackend/recipes/` (folder with JSON files)

**Check with:**
```bash
ls -la Frontend/
ls -la PythonBackend/
ls -la PythonBackend/recipes/
```

## Recipe Files Check

Verify sample recipes exist (should be 10+ files):
- [ ] pizza.json
- [ ] salad.json
- [ ] sandwich.json
- [ ] pasta.json
- [ ] soup.json
- [ ] omelette.json
- [ ] smoothie.json
- [ ] stir_fry.json
- [ ] burger.json
- [ ] tacos.json

**Check with:**
```bash
ls PythonBackend/recipes/
```

## Final Verification

- [ ] Python 3.11+ installed and working
- [ ] VSCode installed with Python extensions
- [ ] Python server starts without errors
- [ ] Frontend loads in browser
- [ ] API health check returns success
- [ ] All recipe files present

## Ready to Start!

Once all items are checked, you're ready for Lesson 1!

**Next Step:** Open `LESSON_01_02.md` and begin!

## Troubleshooting

### Python installation issues
- Mac: Python may already be installed, use `python3` instead of `python`
- If `pip` doesn't work, try `pip3`
- Verify: `python3 --version` should show 3.11.x or higher

### pip install fails
- Make sure you're in the PythonBackend folder
- Try: `python3 -m pip install -r requirements.txt`
- On Mac, you may need to install Command Line Tools: `xcode-select --install`

### Port 5000 in use
- Check what's using the port: `lsof -i :5000`
- Kill the process or use a different port in `app.py`

### Browser can't find recipes
- Make sure Flask server is running before opening the frontend
- Check browser console (F12) for error messages
- Verify API is responding: `curl http://localhost:5000/api/health`
