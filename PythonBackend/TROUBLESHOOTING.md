# Troubleshooting Web Interface

## Issue: localhost:5000 not working in IDE browser

### Solution 1: Check if server is running
```bash
cd PythonBackend
python3 app.py
```

You should see:
```
Starting Recipe Kitchen API server...
Recipes directory: /path/to/recipes
Server running on http://localhost:5000
 * Running on http://127.0.0.1:5000
```

### Solution 2: Use external browser instead of IDE browser
Some IDE browsers have issues with localhost. Try:
1. Open your system browser (Chrome, Safari, Firefox)
2. Navigate to: `http://localhost:5000`
3. Or try: `http://127.0.0.1:5000`

### Solution 3: Check if port 5000 is already in use
```bash
lsof -i :5000
```

If something is using port 5000:
- Kill the process: `kill -9 <PID>`
- Or change port in `app.py` line 245: `app.run(debug=True, port=5001)`
- Then access: `http://localhost:5001`

### Solution 4: Verify files exist
```bash
cd PythonBackend
ls templates/index.html
ls static/css/style.css
ls static/js/app.js
```

All files should exist.

### Solution 5: Check for errors
Look at the terminal where Flask is running for any error messages.

Common errors:
- `TemplateNotFound`: Make sure `templates/` folder exists
- `ModuleNotFoundError`: Run `pip3 install -r requirements.txt`
- `Address already in use`: Port 5000 is taken (see Solution 3)

### Solution 6: Test API directly
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok","message":"Recipe API is running"}`

### Solution 7: Check firewall/security settings
Some systems block localhost connections. Try:
- `http://127.0.0.1:5000` instead of `localhost:5000`
- Check if your firewall is blocking port 5000

### Solution 8: Restart the server
1. Stop the server (Ctrl+C)
2. Start fresh: `python3 app.py`
3. Wait for "Running on..." message
4. Try browser again

## Quick Test Commands

```bash
# Test if server responds
curl http://localhost:5000/api/health

# Test if web page loads
curl http://localhost:5000/

# Check what's on port 5000
lsof -i :5000

# Verify Flask can import
python3 -c "from app import app; print('OK')"
```

## Still not working?

1. Check browser console (F12) for JavaScript errors
2. Check Flask terminal for Python errors
3. Try a different browser
4. Try a different port (5001, 8000, etc.)
5. Make sure you're in the PythonBackend directory when running
