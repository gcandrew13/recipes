# Quick Start Guide

Get up and running with Recipe Kitchen in 2 minutes!

## Prerequisites Check

- [ ] Python 3.11+ installed
- [ ] Visual Studio Code installed
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)

## Step 1: Install Dependencies (30 seconds)

Open Terminal and run:
```bash
cd /path/to/RecipeKitchen/PythonBackend
pip install -r requirements.txt
```

## Step 2: Start the Server (10 seconds)

```bash
python app.py
```

You should see: "Server running on http://localhost:5000"

**Keep this terminal open!**

## Step 3: Open the Kitchen (10 seconds)

Open `Frontend/index.html` in your web browser:
- Double-click the file, OR
- Drag it into your browser window

## Step 4: Test It Works

1. You should see a kitchen with a fridge, counter, and basket
2. Drag an ingredient from the fridge to the basket
3. Matching recipes appear in the sidebar!

## Verify API Connection

Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
```

Expected: `{"status":"ok","message":"Recipe API is running"}`

## Next Steps

Open `LESSON_01_02.md` to start learning Python!

## Troubleshooting

### Server won't start
- Check if port 5000 is in use: `lsof -i :5000`
- Try a different port by editing `app.py`: `app.run(debug=True, port=5001)`

### No recipes appearing
- Make sure the Flask server is running
- Check browser console for errors (F12 → Console)

### Module not found
```bash
pip install -r requirements.txt
```

## Getting Help

- Check `README.md` for detailed documentation
- Review `HOW_TO_RUN.md` for step-by-step instructions
- See `SETUP_CHECKLIST.md` for complete setup verification
