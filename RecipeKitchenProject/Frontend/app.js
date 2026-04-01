/**
 * Recipe Kitchen - Interactive Kitchen Application
 * Drag ingredients from fridge to counter to basket
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Use API when running locally, null when hosted (use embedded data)
    API_BASE: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5001/api'
        : null,
    ITEMS_PER_PAGE: 9, // 3 shelves x 3 items
};

// ============================================
// EMBEDDED RECIPE DATA (for GitHub Pages fallback)
// ============================================

const EMBEDDED_RECIPES = [
    {
        "id": "salad",
        "name": "Garden Salad",
        "description": "Fresh and healthy vegetable salad",
        "ingredients": {
            "lettuce": {"amount": 1, "unit": "head"},
            "tomato": {"amount": 2, "unit": "pieces"},
            "cucumber": {"amount": 1, "unit": "piece"},
            "carrot": {"amount": 1, "unit": "piece"}
        },
        "steps": [
            "Wash all vegetables thoroughly",
            "Tear lettuce into bite-sized pieces",
            "Slice tomatoes into wedges",
            "Slice cucumber into rounds",
            "Shred or slice carrot",
            "Combine in a large bowl"
        ],
        "time": ["10 min", "0 min"],
        "servings": 2,
        "materials": ["cutting board", "knife", "salad bowl"]
    },
    {
        "id": "omelette",
        "name": "Classic Omelette",
        "description": "Fluffy omelette with cheese and vegetables",
        "ingredients": {
            "egg": {"amount": 3, "unit": "pieces"},
            "cheese": {"amount": 50, "unit": "grams"},
            "butter": {"amount": 1, "unit": "tablespoon"},
            "salt": {"amount": 1, "unit": "pinch"}
        },
        "steps": [
            "Crack eggs into a bowl and whisk well",
            "Add a pinch of salt",
            "Heat butter in a non-stick pan over medium heat",
            "Pour in the egg mixture",
            "As eggs set, gently lift edges to let uncooked egg flow underneath",
            "Add grated cheese to one half",
            "Fold omelette in half and serve"
        ],
        "time": ["5 min", "5 min"],
        "servings": 1,
        "materials": ["non-stick pan", "whisk", "spatula"]
    },
    {
        "id": "pizza",
        "name": "Margherita Pizza",
        "description": "Classic Italian pizza with fresh ingredients",
        "ingredients": {
            "dough": {"amount": 1, "unit": "ball"},
            "tomato": {"amount": 3, "unit": "pieces"},
            "cheese": {"amount": 200, "unit": "grams"},
            "basil": {"amount": 10, "unit": "leaves"}
        },
        "steps": [
            "Preheat oven to 450F (230C)",
            "Roll out the dough into a circle",
            "Spread crushed tomatoes on the dough",
            "Add sliced cheese evenly",
            "Bake for 12-15 minutes until golden",
            "Add fresh basil leaves before serving"
        ],
        "time": ["15 min", "20 min"],
        "servings": 4,
        "materials": ["oven", "rolling pin", "baking sheet"]
    },
    {
        "id": "vitamin_water",
        "name": "Vitamin Water",
        "description": "Healthy energizing thirst quencher",
        "ingredients": {
            "lemon": {"amount": 1, "unit": "piece"},
            "orange": {"amount": 1, "unit": "piece"},
            "honey": {"amount": 2, "unit": "tablespoons"}
        },
        "steps": [
            "Squeeze lemon and orange juice",
            "Mix with cold water",
            "Add honey and stir well",
            "Serve over ice"
        ],
        "time": ["5 min", "0 min"],
        "servings": 2,
        "materials": ["pitcher", "juicer", "spoon"]
    }
];

// All available ingredients with emoji icons
const INGREDIENTS = [
    // Vegetables
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'lettuce', name: 'Lettuce', icon: '🥬' },
    { id: 'onion', name: 'Onion', icon: '🧅' },
    { id: 'carrot', name: 'Carrot', icon: '🥕' },
    { id: 'potato', name: 'Potato', icon: '🥔' },
    { id: 'corn', name: 'Corn', icon: '🌽' },
    { id: 'broccoli', name: 'Broccoli', icon: '🥦' },
    { id: 'pepper', name: 'Pepper', icon: '🫑' },
    { id: 'mushroom', name: 'Mushroom', icon: '🍄' },
    { id: 'garlic', name: 'Garlic', icon: '🧄' },
    { id: 'cucumber', name: 'Cucumber', icon: '🥒' },
    { id: 'eggplant', name: 'Eggplant', icon: '🍆' },

    // Fruits
    { id: 'apple', name: 'Apple', icon: '🍎' },
    { id: 'banana', name: 'Banana', icon: '🍌' },
    { id: 'lemon', name: 'Lemon', icon: '🍋' },
    { id: 'avocado', name: 'Avocado', icon: '🥑' },
    { id: 'strawberry', name: 'Strawberry', icon: '🍓' },
    { id: 'orange', name: 'Orange', icon: '🍊' },
    { id: 'grapes', name: 'Grapes', icon: '🍇' },
    { id: 'watermelon', name: 'Watermelon', icon: '🍉' },
    { id: 'pineapple', name: 'Pineapple', icon: '🍍' },

    // Proteins
    { id: 'egg', name: 'Egg', icon: '🥚' },
    { id: 'chicken', name: 'Chicken', icon: '🍗' },
    { id: 'beef', name: 'Beef', icon: '🥩' },
    { id: 'bacon', name: 'Bacon', icon: '🥓' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
    { id: 'shrimp', name: 'Shrimp', icon: '🦐' },

    // Dairy
    { id: 'cheese', name: 'Cheese', icon: '🧀' },
    { id: 'milk', name: 'Milk', icon: '🥛' },
    { id: 'butter', name: 'Butter', icon: '🧈' },
    { id: 'yogurt', name: 'Yogurt', icon: '🫙' },

    // Grains
    { id: 'bread', name: 'Bread', icon: '🍞' },
    { id: 'rice', name: 'Rice', icon: '🍚' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'dough', name: 'Dough', icon: '🥟' },
    { id: 'tortilla', name: 'Tortilla', icon: '🫓' },
    { id: 'croissant', name: 'Croissant', icon: '🥐' },

    // Others
    { id: 'honey', name: 'Honey', icon: '🍯' },
    { id: 'salt', name: 'Salt', icon: '🧂' },
    { id: 'oil', name: 'Oil', icon: '🫒' },
    { id: 'basil', name: 'Basil', icon: '🌿' },
    { id: 'chocolate', name: 'Chocolate', icon: '🍫' },
    { id: 'ice_cream', name: 'Ice Cream', icon: '🍨' },
    { id: 'cookie', name: 'Cookie', icon: '🍪' },
    { id: 'cake', name: 'Cake', icon: '🍰' },
];

// Recipe icons
const RECIPE_ICONS = {
    pizza: '🍕', pasta: '🍝', salad: '🥗', burger: '🍔',
    sandwich: '🥪', soup: '🍲', omelette: '🍳', tacos: '🌮',
    stir_fry: '🥘', smoothie: '🥤', cake: '🎂', cookies: '🍪',
    sweet_potato_cake: '🍰', default: '🍽️'
};

// ============================================
// STATE
// ============================================

const state = {
    currentPage: 1,
    totalPages: Math.ceil(INGREDIENTS.length / CONFIG.ITEMS_PER_PAGE),
    basketItems: new Set(),
    counterItems: [],
    allRecipes: [],
    draggedElement: null,
    draggedIngredient: null,
    dragOffset: { x: 0, y: 0 },
};

// ============================================
// DOM ELEMENTS
// ============================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const elements = {
    fridgeInterior: $('#fridgeInterior'),
    fridgeShelves: $$('.fridge-shelf'),
    fridgePrev: $('#fridgePrev'),
    fridgeNext: $('#fridgeNext'),
    currentPage: $('#currentPage'),
    totalPages: $('#totalPages'),
    counterTop: $('#counterTop'),
    basketBowl: $('.basket-bowl'),
    basketInner: $('#basketInner'),
    basketStatus: $('#basketStatus'),
    clearAll: $('#clearAll'),
    selectedItems: $('#selectedItems'),
    recipeList: $('#recipeList'),
    recipeModal: $('#recipeModal'),
    modalClose: $('#modalClose'),
    modalBody: $('#modalBody'),
};

// ============================================
// UTILITIES
// ============================================

function getIngredient(id) {
    return INGREDIENTS.find(i => i.id === id);
}

function getRecipeIcon(id) {
    return RECIPE_ICONS[id] || RECIPE_ICONS.default;
}

function capitalize(str) {
    return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ============================================
// API FUNCTIONS
// ============================================

async function fetchRecipes() {
    // If no API configured (hosted environment), use embedded data
    if (!CONFIG.API_BASE) {
        console.log('📦 Using embedded recipe data (hosted mode)');
        state.allRecipes = EMBEDDED_RECIPES;
        return;
    }

    try {
        const res = await fetch(`${CONFIG.API_BASE}/recipes`);
        if (res.ok) {
            state.allRecipes = await res.json();
            console.log('✅ Loaded recipes from API');
            return;
        }
    } catch (e) {
        console.warn('Could not fetch recipes from API, using embedded data');
    }

    // Fallback to embedded data if API fails
    state.allRecipes = EMBEDDED_RECIPES;
}

async function searchRecipes(items) {
    if (items.length === 0) return [];

    // Try API only if configured and available
    if (CONFIG.API_BASE) {
        try {
            const res = await fetch(`${CONFIG.API_BASE}/recipes/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });
            if (res.ok) {
                const data = await res.json();
                return data.recipes || [];
            }
        } catch (e) {
            // Fallback to client-side search
        }
    }

    // Client-side search (works with embedded data)
    return state.allRecipes.filter(recipe => {
        const ingredients = recipe.ingredients || {};
        const recipeItems = typeof ingredients === 'object' && !Array.isArray(ingredients)
            ? Object.keys(ingredients).map(k => k.toLowerCase())
            : (Array.isArray(ingredients) ? ingredients.map(i => i.toLowerCase()) : []);
        return items.every(item => recipeItems.includes(item.toLowerCase()));
    });
}

// ============================================
// FRIDGE RENDERING
// ============================================

function renderFridge() {
    const startIdx = (state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
    const pageItems = INGREDIENTS.slice(startIdx, startIdx + CONFIG.ITEMS_PER_PAGE);

    // Clear shelves
    elements.fridgeShelves.forEach(shelf => shelf.innerHTML = '');

    // Distribute items across 3 shelves with staggered animation
    pageItems.forEach((ing, idx) => {
        const shelfIdx = Math.floor(idx / 3);
        const shelf = elements.fridgeShelves[shelfIdx];
        if (shelf) {
            const el = createIngredientElement(ing);
            // Add staggered entrance animation
            el.style.animationDelay = `${idx * 50}ms`;
            el.classList.add('animate-pop-in');
            shelf.appendChild(el);
        }
    });

    // Update pagination
    elements.currentPage.textContent = state.currentPage;
    elements.totalPages.textContent = state.totalPages;
    elements.fridgePrev.disabled = state.currentPage <= 1;
    elements.fridgeNext.disabled = state.currentPage >= state.totalPages;
}

function nextPage() {
    if (state.currentPage < state.totalPages) {
        state.currentPage++;
        renderFridge();
    }
}

function prevPage() {
    if (state.currentPage > 1) {
        state.currentPage--;
        renderFridge();
    }
}

// ============================================
// INGREDIENT ELEMENT
// ============================================

function createIngredientElement(ingredient, inBasketView = false) {
    const el = document.createElement('div');
    el.className = 'ingredient-item';
    el.dataset.id = ingredient.id;
    el.textContent = ingredient.icon;
    el.title = ingredient.name;

    if (state.basketItems.has(ingredient.id)) {
        el.classList.add('in-basket');
    }

    // Mouse events for dragging
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, { passive: false });

    return el;
}

// ============================================
// DRAG AND DROP SYSTEM
// ============================================

function startDrag(e) {
    e.preventDefault();

    const target = e.target.closest('.ingredient-item');
    if (!target) return;

    const id = target.dataset.id;
    const ingredient = getIngredient(id);
    if (!ingredient) return;

    // Create a floating clone for dragging
    const clone = target.cloneNode(true);
    clone.classList.add('dragging');
    clone.style.position = 'fixed';
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = '9999';
    clone.style.width = '48px';
    clone.style.height = '48px';
    clone.style.fontSize = '1.8rem';
    document.body.appendChild(clone);

    const rect = target.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    state.dragOffset = {
        x: clientX - rect.left - rect.width / 2,
        y: clientY - rect.top - rect.height / 2
    };

    state.draggedElement = clone;
    state.draggedIngredient = ingredient;
    state.dragSourceElement = target;

    // Position clone
    updateDragPosition(clientX, clientY);

    // Dim original
    target.style.opacity = '0.3';

    // Add move and end listeners
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', endDrag);
}

function onDrag(e) {
    if (!state.draggedElement) return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    updateDragPosition(clientX, clientY);

    // Check drop zones
    const counterRect = elements.counterTop.getBoundingClientRect();
    const basketRect = elements.basketBowl.getBoundingClientRect();

    // Visual feedback for drop zones
    if (isOverElement(clientX, clientY, counterRect)) {
        elements.counterTop.classList.add('drag-over');
    } else {
        elements.counterTop.classList.remove('drag-over');
    }

    if (isOverElement(clientX, clientY, basketRect)) {
        elements.basketBowl.classList.add('drag-over');
    } else {
        elements.basketBowl.classList.remove('drag-over');
    }
}

function endDrag(e) {
    if (!state.draggedElement) return;

    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    const counterRect = elements.counterTop.getBoundingClientRect();
    const basketRect = elements.basketBowl.getBoundingClientRect();

    // Check where we dropped
    if (isOverElement(clientX, clientY, basketRect)) {
        // Add to basket
        addToBasket(state.draggedIngredient);
    } else if (isOverElement(clientX, clientY, counterRect)) {
        // Add to counter
        addToCounter(state.draggedIngredient);
    }

    // Cleanup
    state.draggedElement.remove();
    if (state.dragSourceElement) {
        state.dragSourceElement.style.opacity = '';
    }

    elements.counterTop.classList.remove('drag-over');
    elements.basketBowl.classList.remove('drag-over');

    state.draggedElement = null;
    state.draggedIngredient = null;
    state.dragSourceElement = null;

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', endDrag);
}

function updateDragPosition(x, y) {
    if (!state.draggedElement) return;
    state.draggedElement.style.left = (x - 24) + 'px';
    state.draggedElement.style.top = (y - 24) + 'px';
}

function isOverElement(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

// ============================================
// COUNTER FUNCTIONS
// ============================================

function addToCounter(ingredient) {
    // Check if already on counter
    if (state.counterItems.find(i => i.id === ingredient.id)) return;

    state.counterItems.push(ingredient);
    renderCounter();
}

function removeFromCounter(ingredient) {
    state.counterItems = state.counterItems.filter(i => i.id !== ingredient.id);
    renderCounter();
}

function renderCounter() {
    elements.counterTop.innerHTML = '';

    state.counterItems.forEach(ing => {
        const el = createIngredientElement(ing);
        el.style.width = '48px';
        el.style.height = '48px';
        el.style.fontSize = '1.8rem';

        // Double-click to add to basket
        el.addEventListener('dblclick', () => {
            addToBasket(ing);
        });

        elements.counterTop.appendChild(el);
    });
}

// ============================================
// BASKET FUNCTIONS
// ============================================

function addToBasket(ingredient) {
    if (state.basketItems.has(ingredient.id)) return;

    state.basketItems.add(ingredient.id);

    // Trigger basket bounce animation
    elements.basketBowl.classList.add('animate-bounce');
    setTimeout(() => elements.basketBowl.classList.remove('animate-bounce'), 400);

    updateBasketUI();
    updateRecipes();
    markIngredientInBasket(ingredient.id, true);
}

function removeFromBasket(ingredient) {
    state.basketItems.delete(ingredient.id);
    updateBasketUI();
    updateRecipes();
    markIngredientInBasket(ingredient.id, false);
}

function clearBasket() {
    const items = [...state.basketItems];
    state.basketItems.clear();
    state.counterItems = [];
    renderCounter();
    updateBasketUI();
    updateRecipes();
    items.forEach(id => markIngredientInBasket(id, false));
}

function updateBasketUI() {
    // Update basket bowl
    elements.basketInner.innerHTML = '';
    state.basketItems.forEach(id => {
        const ing = getIngredient(id);
        if (ing) {
            const el = document.createElement('div');
            el.className = 'ingredient-item';
            el.textContent = ing.icon;
            el.title = `Click to remove ${ing.name}`;
            el.addEventListener('click', () => removeFromBasket(ing));
            elements.basketInner.appendChild(el);
        }
    });

    // Update header status
    const count = state.basketItems.size;
    elements.basketStatus.innerHTML = `<span class="basket-count">${count}</span> ingredient${count !== 1 ? 's' : ''} selected`;

    // Update sidebar selected items
    elements.selectedItems.innerHTML = '';
    if (count === 0) {
        elements.selectedItems.innerHTML = '<span style="color: #999; font-size: 0.85rem;">None selected</span>';
    } else {
        state.basketItems.forEach(id => {
            const ing = getIngredient(id);
            if (ing) {
                const tag = document.createElement('span');
                tag.className = 'selected-tag';
                tag.innerHTML = `<span class="tag-icon">${ing.icon}</span> ${ing.name}`;
                elements.selectedItems.appendChild(tag);
            }
        });
    }
}

function markIngredientInBasket(id, inBasket) {
    $$(`.ingredient-item[data-id="${id}"]`).forEach(el => {
        if (inBasket) {
            el.classList.add('in-basket');
        } else {
            el.classList.remove('in-basket');
        }
    });
}

// ============================================
// RECIPE DISPLAY
// ============================================

async function updateRecipes() {
    const items = [...state.basketItems];
    const recipes = await searchRecipes(items);
    renderRecipeList(recipes);
}

function renderRecipeList(recipes) {
    if (recipes.length === 0) {
        elements.recipeList.innerHTML = `
            <div class="recipe-placeholder animate-fade-in">
                <p>${state.basketItems.size === 0
                    ? 'Drag ingredients to the basket to find recipes'
                    : 'No recipes match these ingredients'}</p>
            </div>
        `;
        return;
    }

    elements.recipeList.innerHTML = recipes.map((recipe, idx) => {
        const ingredients = recipe.ingredients || {};
        const count = typeof ingredients === 'object' && !Array.isArray(ingredients)
            ? Object.keys(ingredients).length
            : (Array.isArray(ingredients) ? ingredients.length : 0);
        const time = Array.isArray(recipe.time) ? recipe.time[1] : (recipe.time || 'N/A');

        return `
            <div class="recipe-card animate-fade-in-up" style="animation-delay: ${idx * 80}ms" data-id="${recipe.id}">
                <div class="recipe-card-header">
                    <span class="recipe-card-icon">${getRecipeIcon(recipe.id)}</span>
                    <div>
                        <div class="recipe-card-title">${recipe.name}</div>
                        <div class="recipe-card-meta">${time} · ${recipe.servings || '?'} servings</div>
                    </div>
                </div>
                <div class="recipe-card-match">✓ ${state.basketItems.size} of ${count} ingredients</div>
            </div>
        `;
    }).join('');

    // Add click handlers
    elements.recipeList.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', () => {
            const recipe = recipes.find(r => r.id === card.dataset.id);
            if (recipe) openRecipeModal(recipe);
        });
    });
}

function openRecipeModal(recipe) {
    const ingredients = recipe.ingredients || {};
    const ingredientList = typeof ingredients === 'object' && !Array.isArray(ingredients)
        ? Object.entries(ingredients)
        : (Array.isArray(ingredients) ? ingredients.map(i => [i, {}]) : []);

    const prepTime = Array.isArray(recipe.time) ? recipe.time[0] : 'N/A';
    const cookTime = Array.isArray(recipe.time) ? recipe.time[1] : (recipe.time || 'N/A');

    elements.modalBody.innerHTML = `
        <div class="recipe-modal-header">
            <div class="recipe-modal-icon">${getRecipeIcon(recipe.id)}</div>
            <h2 class="recipe-modal-title">${recipe.name}</h2>
            <div class="recipe-modal-stats">
                <span>Prep: ${prepTime}</span>
                <span>Cook: ${cookTime}</span>
                <span>Serves: ${recipe.servings || 'N/A'}</span>
            </div>
        </div>
        <div class="recipe-modal-content">
            <div class="recipe-section">
                <h3 class="recipe-section-title">Ingredients</h3>
                <div class="ingredient-list">
                    ${ingredientList.map(([name, details]) => {
                        const ing = getIngredient(name.toLowerCase());
                        const icon = ing ? ing.icon : '🥄';
                        const matched = state.basketItems.has(name.toLowerCase());
                        const amount = details.amount ? `${details.amount} ${details.unit || ''}` : '';
                        return `
                            <div class="ingredient-row ${matched ? 'matched' : ''}">
                                <span class="ingredient-row-icon">${icon}</span>
                                <span class="ingredient-row-name">${capitalize(name)}</span>
                                <span class="ingredient-row-amount">${amount}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="recipe-section">
                <h3 class="recipe-section-title">Instructions</h3>
                <div class="step-list">
                    ${(recipe.steps || []).map((step, i) => `
                        <div class="step-item">
                            <span class="step-number">${i + 1}</span>
                            <p class="step-text">${step.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${recipe.materials && recipe.materials.length ? `
                <div class="recipe-section">
                    <h3 class="recipe-section-title">Equipment</h3>
                    <div class="materials-list">
                        ${recipe.materials.map(m => `<span class="material-tag">${capitalize(m)}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    elements.recipeModal.classList.add('active');
}

function closeRecipeModal() {
    // Add closing animation class
    elements.recipeModal.classList.add('closing');

    // Remove active class after animation completes
    setTimeout(() => {
        elements.recipeModal.classList.remove('active', 'closing');
    }, 200);
}

// ============================================
// COUNTER DROP ZONE STYLING
// ============================================

// Add CSS for drag-over state dynamically
const style = document.createElement('style');
style.textContent = `
    .counter-top.drag-over {
        background:
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 1px, transparent 1px),
            radial-gradient(circle at 80% 30%, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%) !important;
        box-shadow:
            inset 0 2px 4px rgba(255,255,255,0.1),
            0 -2px 10px rgba(0,0,0,0.3),
            inset 0 0 20px rgba(212, 168, 83, 0.2) !important;
    }
`;
document.head.appendChild(style);

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    // Fridge pagination
    elements.fridgePrev.addEventListener('click', prevPage);
    elements.fridgeNext.addEventListener('click', nextPage);

    // Clear all
    elements.clearAll.addEventListener('click', clearBasket);

    // Modal
    elements.modalClose.addEventListener('click', closeRecipeModal);
    elements.recipeModal.addEventListener('click', (e) => {
        if (e.target === elements.recipeModal) closeRecipeModal();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeRecipeModal();
        if (e.key === 'ArrowLeft') prevPage();
        if (e.key === 'ArrowRight') nextPage();
    });
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    console.log('🍳 Recipe Kitchen starting...');

    // Set total pages
    state.totalPages = Math.ceil(INGREDIENTS.length / CONFIG.ITEMS_PER_PAGE);

    // Render fridge
    renderFridge();

    // Initialize UI
    updateBasketUI();
    renderRecipeList([]);

    // Fetch recipes
    await fetchRecipes();

    // Set up events
    initEventListeners();

    console.log('✅ Kitchen ready!');
}

document.addEventListener('DOMContentLoaded', init);
