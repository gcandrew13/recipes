# Recipe Kitchen Web Interface

A beautiful, easy-to-use web interface for managing and viewing recipes.

## Features

- 🎨 **Modern, Responsive Design** - Beautiful gradient UI that works on all devices
- 📋 **Recipe Cards** - Visual recipe cards with all key information
- 🔍 **Search & Filter** - Search by name/ingredients and filter by type
- ✏️ **Edit Recipes** - Full CRUD (Create, Read, Update, Delete) functionality
- 📱 **Mobile Friendly** - Responsive design for phones and tablets
- 🎯 **Easy Navigation** - Click cards to view full details

## Quick Start

1. **Start the Flask server:**
   ```bash
   cd PythonBackend
   python3 app.py
   ```

2. **Open your browser:**
   Navigate to: `http://localhost:5000`

3. **Start managing recipes!**
   - Click "+ Add New Recipe" to create a new recipe
   - Click on any recipe card to view full details
   - Click ✏️ to edit a recipe
   - Click 🗑️ to delete a recipe

## Usage Guide

### Viewing Recipes
- All recipes are displayed as cards in a grid
- Click any card to see full recipe details
- Use the search bar to find recipes by name or ingredient
- Use the type filter to show only specific recipe types

### Adding a Recipe
1. Click "+ Add New Recipe" button
2. Fill in the form:
   - Recipe name (required)
   - Type (main, dessert, side, breakfast, drink)
   - Servings (required)
   - Prep time and Total time (required)
   - Ingredients (click "+ Add Ingredient" for each)
   - Steps (click "+ Add Step" for each)
   - Materials/Tools (optional)
   - Image filename (optional)
3. Click "Save Recipe"

### Editing a Recipe
1. Click the ✏️ button on any recipe card
2. Modify the fields as needed
3. Click "Save Recipe"

### Deleting a Recipe
1. Click the 🗑️ button on any recipe card
2. Confirm deletion in the popup

## File Structure

```
PythonBackend/
├── app.py                 # Flask server with API endpoints
├── templates/
│   └── index.html        # Main web page
├── static/
│   ├── css/
│   │   └── style.css     # Styling
│   └── js/
│       └── app.js        # Frontend logic
└── recipes/              # Recipe JSON files
```

## API Endpoints

### Web Interface
- `GET /` - Main recipe management page

### Recipe Management
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/<id>` - Get specific recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/<id>` - Update recipe
- `DELETE /api/recipes/<id>` - Delete recipe

### Search
- `POST /api/recipes/search` - Search recipes by ingredients

## Customization

### Changing Colors
Edit `static/css/style.css`:
- Main gradient: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`
- Primary color: `#667eea` (used for buttons, accents)
- Search for color values and modify as needed

### Adding Recipe Types
1. Edit `templates/index.html` - Add option to type filter dropdown
2. Edit `static/js/app.js` - Add option to recipe type select in form

### Modifying Layout
- Grid columns: Edit `.recipes-grid` in `style.css`
- Card size: Adjust `minmax(300px, 1fr)` in grid-template-columns
- Modal size: Modify `.modal-content` max-width

## Troubleshooting

### Recipes not loading
- Check browser console for errors (F12)
- Verify Flask server is running
- Check that recipes exist in `recipes/` folder

### Can't save recipes
- Check browser console for API errors
- Verify Flask server is running
- Check file permissions on `recipes/` folder

### Styling looks broken
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
- Check that `static/css/style.css` exists
- Verify Flask is serving static files correctly

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

## Next Steps

- Add image upload functionality
- Add recipe export (PDF, JSON)
- Add recipe sharing features
- Add user authentication
- Add recipe ratings/reviews
