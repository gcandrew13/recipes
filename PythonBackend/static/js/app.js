let recipes = [];
let currentEditingId = null;

// Load recipes on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRecipes();
});

// Load all recipes
async function loadRecipes() {
    try {
        const response = await fetch('/api/recipes');
        recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
    }
}

// Display recipes in grid
function displayRecipes(recipesToShow) {
    const grid = document.getElementById('recipesGrid');
    grid.innerHTML = '';
    
    if (recipesToShow.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: white; grid-column: 1/-1;">No recipes found</p>';
        return;
    }
    
    recipesToShow.forEach(recipe => {
        const card = createRecipeCard(recipe);
        grid.appendChild(card);
    });
}

// Create recipe card element
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    const ingredients = recipe.ingredients || {};
    const ingredientNames = Object.keys(ingredients).slice(0, 5);
    
    const timeDisplay = Array.isArray(recipe.time) ? recipe.time[1] || recipe.time[0] : recipe.time;
    
    card.innerHTML = `
        <div class="recipe-card-header">
            <div>
                <h3>${capitalize(recipe.name)}</h3>
                <span class="recipe-type">${recipe.type || 'main'}</span>
            </div>
            <div class="recipe-actions">
                <button class="btn-icon edit" onclick="editRecipe('${recipe.id}')" title="Edit">✏️</button>
                <button class="btn-icon delete" onclick="deleteRecipe('${recipe.id}')" title="Delete">🗑️</button>
            </div>
        </div>
        <div class="recipe-info">
            <span>👥 ${recipe.servings || 1} servings</span>
            <span>⏱️ ${timeDisplay || 'N/A'}</span>
        </div>
        <div class="recipe-ingredients">
            <h4>Ingredients:</h4>
            ${ingredientNames.map(ing => {
                const details = ingredients[ing];
                const amount = details?.amount || '';
                const unit = details?.unit || '';
                return `<span class="ingredient-tag">${capitalize(ing)}${amount ? `: ${amount} ${unit}` : ''}</span>`;
            }).join('')}
            ${Object.keys(ingredients).length > 5 ? `<span class="ingredient-tag">+${Object.keys(ingredients).length - 5} more</span>` : ''}
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.recipe-actions')) {
            showRecipeDetails(recipe);
        }
    });
    
    return card;
}

// Show recipe details in modal
function showRecipeDetails(recipe) {
    const modal = document.getElementById('recipeModal');
    const details = document.getElementById('recipeDetails');
    
    const ingredients = recipe.ingredients || {};
    const steps = recipe.steps || [];
    const materials = recipe.materials || [];
    const time = Array.isArray(recipe.time) ? recipe.time : [recipe.time];
    
    details.innerHTML = `
        <div class="recipe-detail">
            <h2>${capitalize(recipe.name)}</h2>
            <div class="recipe-info">
                <span>Type: <strong>${capitalize(recipe.type || 'main')}</strong></span>
                <span>Servings: <strong>${recipe.servings || 1}</strong></span>
                <span>Prep: <strong>${time[0] || 'N/A'}</strong></span>
                <span>Total: <strong>${time[1] || time[0] || 'N/A'}</strong></span>
            </div>
            
            <div class="recipe-detail-section">
                <h3>Ingredients</h3>
                ${Object.entries(ingredients).map(([name, details]) => `
                    <div class="ingredient-item">
                        <span><strong>${capitalize(name)}</strong></span>
                        <span>${details.amount || ''} ${details.unit || ''}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="recipe-detail-section">
                <h3>Steps</h3>
                ${steps.map((step, index) => `
                    <div class="step-item">
                        <strong>${index + 1}.</strong> ${step.replace(/^\d+\.\s*/, '')}
                    </div>
                `).join('')}
            </div>
            
            ${materials.length > 0 ? `
            <div class="recipe-detail-section">
                <h3>Materials Needed</h3>
                ${materials.map(material => `
                    <span class="material-item">${capitalize(material)}</span>
                `).join('')}
            </div>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close recipe modal
function closeRecipeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

// Filter recipes
function filterRecipes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    
    const filtered = recipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
                            Object.keys(recipe.ingredients || {}).some(ing => 
                                ing.toLowerCase().includes(searchTerm)
                            );
        const matchesType = !typeFilter || recipe.type === typeFilter;
        return matchesSearch && matchesType;
    });
    
    displayRecipes(filtered);
}

// Open add recipe modal
function openAddRecipeModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Recipe';
    document.getElementById('recipeForm').reset();
    document.getElementById('ingredientsList').innerHTML = '';
    document.getElementById('stepsList').innerHTML = '';
    document.getElementById('materialsList').innerHTML = '';
    
    addIngredientField();
    addStepField();
    
    document.getElementById('editModal').style.display = 'block';
}

// Edit recipe
async function editRecipe(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    currentEditingId = recipeId;
    document.getElementById('modalTitle').textContent = 'Edit Recipe';
    
    // Fill form
    document.getElementById('recipeName').value = recipe.name;
    document.getElementById('recipeType').value = recipe.type || 'main';
    document.getElementById('recipeServings').value = recipe.servings || 1;
    
    const time = Array.isArray(recipe.time) ? recipe.time : [recipe.time, recipe.time];
    document.getElementById('prepTime').value = time[0] || '';
    document.getElementById('totalTime').value = time[1] || time[0] || '';
    document.getElementById('recipeImage').value = recipe.image || '';
    
    // Fill ingredients
    document.getElementById('ingredientsList').innerHTML = '';
    Object.entries(recipe.ingredients || {}).forEach(([name, details]) => {
        addIngredientField(name, details.amount, details.unit);
    });
    
    // Fill steps
    document.getElementById('stepsList').innerHTML = '';
    (recipe.steps || []).forEach(step => {
        addStepField(step.replace(/^\d+\.\s*/, ''));
    });
    
    // Fill materials
    document.getElementById('materialsList').innerHTML = '';
    (recipe.materials || []).forEach(material => {
        addMaterialField(material);
    });
    
    document.getElementById('editModal').style.display = 'block';
}

// Add ingredient field
function addIngredientField(name = '', amount = '', unit = '') {
    const list = document.getElementById('ingredientsList');
    const div = document.createElement('div');
    div.className = 'ingredient-field';
    div.innerHTML = `
        <input type="text" placeholder="Ingredient name" value="${name}" class="ingredient-name" required>
        <input type="text" placeholder="Amount" value="${amount}" class="ingredient-amount">
        <input type="text" placeholder="Unit" value="${unit}" class="ingredient-unit">
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    list.appendChild(div);
}

// Add step field
function addStepField(step = '') {
    const list = document.getElementById('stepsList');
    const div = document.createElement('div');
    div.className = 'step-field';
    div.innerHTML = `
        <input type="text" placeholder="Step description" value="${step}" class="step-text" required>
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    list.appendChild(div);
}

// Add material field
function addMaterialField(material = '') {
    const list = document.getElementById('materialsList');
    const div = document.createElement('div');
    div.className = 'material-field';
    div.innerHTML = `
        <input type="text" placeholder="Material/tool name" value="${material}" class="material-name">
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    list.appendChild(div);
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingId = null;
}

// Save recipe
async function saveRecipe(event) {
    event.preventDefault();
    
    // Collect form data
    const name = document.getElementById('recipeName').value;
    const type = document.getElementById('recipeType').value;
    const servings = parseInt(document.getElementById('recipeServings').value);
    const prepTime = document.getElementById('prepTime').value;
    const totalTime = document.getElementById('totalTime').value;
    const image = document.getElementById('recipeImage').value;
    
    // Collect ingredients
    const ingredients = {};
    document.querySelectorAll('.ingredient-field').forEach(field => {
        const name = field.querySelector('.ingredient-name').value.trim();
        const amount = field.querySelector('.ingredient-amount').value.trim();
        const unit = field.querySelector('.ingredient-unit').value.trim();
        if (name) {
            ingredients[name.toLowerCase()] = {
                amount: amount || '',
                unit: unit || ''
            };
        }
    });
    
    // Collect steps
    const steps = [];
    document.querySelectorAll('.step-field').forEach((field, index) => {
        const step = field.querySelector('.step-text').value.trim();
        if (step) {
            steps.push(`${index + 1}. ${step}`);
        }
    });
    
    // Collect materials
    const materials = [];
    document.querySelectorAll('.material-field').forEach(field => {
        const material = field.querySelector('.material-name').value.trim();
        if (material) {
            materials.push(material.toLowerCase());
        }
    });
    
    // Create recipe object
    const recipe = {
        id: currentEditingId || name.toLowerCase().replace(/\s+/g, '_'),
        name: name.toLowerCase(),
        type: type,
        ingredients: ingredients,
        steps: steps,
        time: [prepTime, totalTime],
        servings: servings,
        materials: materials,
        image: image || `${name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        combos: []
    };
    
    try {
        const url = currentEditingId 
            ? `/api/recipes/${currentEditingId}`
            : '/api/recipes';
        const method = currentEditingId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        });
        
        if (response.ok) {
            closeEditModal();
            loadRecipes();
        } else {
            const error = await response.json();
            alert('Error saving recipe: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Error saving recipe. Please try again.');
    }
}

// Delete recipe
async function deleteRecipe(recipeId) {
    if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadRecipes();
        } else {
            const error = await response.json();
            alert('Error deleting recipe: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Error deleting recipe. Please try again.');
    }
}

// Utility function
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const recipeModal = document.getElementById('recipeModal');
    const editModal = document.getElementById('editModal');
    if (event.target === recipeModal) {
        closeRecipeModal();
    }
    if (event.target === editModal) {
        closeEditModal();
    }
}
