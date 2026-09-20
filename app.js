
const addButton = document.querySelector(".add-button");
const recipeModal = document.querySelector("#recipeModal");
const closeModal = document.querySelector("#closeModal");
const saveRecipe = document.querySelector("#saveRecipe");
const recipesContainer = document.querySelector("#categoryRecipes");
const recipeDetail = document.querySelector("#recipeDetail");
const recipeDetailContent = document.querySelector("#recipeDetailContent");
const closeDetail = document.querySelector("#closeDetail");

// Открываем окно добавления рецепта
addButton.addEventListener("click", function () {
    recipeModal.style.display = "block";
});

// Закрываем окно добавления
closeModal.addEventListener("click", function () {
    recipeModal.style.display = "none";
});

// Закрываем окно при нажатии на фон
recipeModal.addEventListener("click", function (event) {
    if (event.target === recipeModal) {
        recipeModal.style.display = "none";
    }
});

// Сохраняем рецепт
saveRecipe.addEventListener("click", function () {

    const photoInput = document.querySelector("#recipePhoto");
    const file = photoInput.files[0];

    const recipe = {
        title: document.querySelector("#recipeTitle").value,
        category: document.querySelector("#recipeCategory").value,
        time: document.querySelector("#recipeTime").value,
        servings: document.querySelector("#recipeServings").value,
        ingredients: document.querySelector("#recipeIngredients").value,
        steps: document.querySelector("#recipeSteps").value,
        notes: document.querySelector("#recipeNotes").value,
        photo: ""
    };

    if (file) {

        const reader = new FileReader();

        reader.onload = function (event) {

            recipe.photo = event.target.result;

           
let recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];

recipes.push(recipe);

localStorage.setItem(
    "myRecipes",
    JSON.stringify(recipes)
);

            recipeModal.style.display = "none";

            showRecipes();
        };

        reader.readAsDataURL(file);

    } else {

        
let recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];

recipes.push(recipe);

localStorage.setItem(
    "myRecipes",
    JSON.stringify(recipes)
);

        recipeModal.style.display = "none";

        showRecipes();
    }
});

// Показываем рецепт

function showRecipes() {

    const savedRecipes = localStorage.getItem("myRecipes");

    if (!savedRecipes) {
        recipesContainer.innerHTML = "";
        return;
    }

    const recipes = JSON.parse(savedRecipes);

    recipesContainer.innerHTML = recipes.map(function (recipe, index) {

        return `
            <div class="recipe-card" data-index="${index}">
                
                ${
                    recipe.photo
                        ? `<img src="${recipe.photo}" class="recipe-photo">`
                        : `<div class="recipe-photo-placeholder">🍴</div>`
                }

                <h3>${recipe.title}</h3>

                <p>${recipe.category}</p>

                <p>
                    ⏱ ${recipe.time} минут
                    ·
                    🍽 ${recipe.servings} порций
                </p>

            </div>
        `;

    }).join("");

    const recipeCards = document.querySelectorAll(".recipe-card");

    recipeCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const index = card.getAttribute("data-index");

            openRecipe(Number(index));

        });

    });
}

// Открываем подробности рецепта
function openRecipe(index) {

    const savedRecipes = localStorage.getItem("myRecipes");

    if (!savedRecipes) {
        return;
    }

    const recipes = JSON.parse(savedRecipes);
    const recipe = recipes[index];

    if (!recipe) {
        return;
    }

    recipeDetailContent.innerHTML = `
        
        ${
            recipe.photo
                ? `<img src="${recipe.photo}" class="detail-photo">`
                : `<div class="detail-photo-placeholder">🍴</div>`
        }

        <h1>${recipe.title}</h1>

        <p class="detail-category">
            ${recipe.category}
        </p>

        <div class="detail-info">

            <span>
                ⏱ ${recipe.time} минут
            </span>

            <span>
                🍽 ${recipe.servings} порций
            </span>

        </div>

        <h2>🥕 Ингредиенты</h2>

        <div class="detail-text">
            ${recipe.ingredients}
        </div>

        <h2>👩‍🍳 Приготовление</h2>

        <div class="detail-text">
            ${recipe.steps}
        </div>

        ${
            recipe.notes
                ? `
                    <h2>📝 Заметки</h2>

                    <div class="detail-text">
                        ${recipe.notes}
                    </div>
                `
                : ""
        }
        <button class="delete-recipe" id="deleteRecipe">
            🗑 Удалить рецепт
        </button>
    `;

    recipesContainer.style.display = "none";

    recipeDetail.style.display = "block";
    
const deleteRecipe = document.querySelector("#deleteRecipe");

    deleteRecipe.addEventListener("click", function () {

        const confirmDelete = confirm("Удалить этот рецепт?");

        if (!confirmDelete) {
            return;
        }

        const recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];

        recipes.splice(index, 1);

        localStorage.setItem("myRecipes", JSON.stringify(recipes));

        recipeDetail.style.display = "none";
        recipesContainer.style.display = "block";

        showRecipes();
    });
}

// Назад к списку рецептов
closeDetail.addEventListener("click", function () {

    recipeDetail.style.display = "none";

    recipesContainer.style.display = "block";
});

// Показываем сохранённый рецепт при запуске
const oldRecipe = localStorage.getItem("myRecipe");

if (oldRecipe && !localStorage.getItem("myRecipes")) {
    const recipe = JSON.parse(oldRecipe);

    localStorage.setItem(
        "myRecipes",
        JSON.stringify([recipe])
    );
}
const categories = document.querySelectorAll(".category");

categories.forEach(function (category) {

    category.addEventListener("click", function () {

        const selectedCategory = category.getAttribute("data-category");

        showCategoryRecipes(selectedCategory);

    });

});

showRecipes();

recipesContainer.style.display = "none";

function showCategoryRecipes(selectedCategory) {

    const categoriesBlock = document.querySelector(".categories");
    const recipesTitle = document.querySelector("#recipesTitle");
    const backButton = document.querySelector("#backToCategories");

    categoriesBlock.style.display = "none";
    recipesTitle.textContent = selectedCategory;
    backButton.style.display = "block";

    const savedRecipes = localStorage.getItem("myRecipes");

    if (!savedRecipes) {
        recipesContainer.innerHTML = `
            <div class="recipe-card">
                <h3>Пока здесь пусто 🌷</h3>
                <p>Добавь свой первый рецепт в эту категорию.</p>
            </div>
        `;

        recipesContainer.style.display = "block";
        return;
    }

    const recipes = JSON.parse(savedRecipes);

    const filteredRecipes = recipes
        .map(function (recipe, index) {
            return {
                recipe: recipe,
                index: index
            };
        })
        .filter(function (item) {
            return item.recipe.category === selectedCategory;
        });

    if (filteredRecipes.length === 0) {

        recipesContainer.innerHTML = `
            <div class="recipe-card">
                <h3>Пока здесь пусто 🌷</h3>
                <p>Добавь свой первый рецепт в эту категорию.</p>
            </div>
        `;

    } else {

        recipesContainer.innerHTML = filteredRecipes.map(function (item) {

            const recipe = item.recipe;

            return `
                <div class="recipe-card" data-index="${item.index}">

                    ${
                        recipe.photo
                            ? `<img src="${recipe.photo}" class="recipe-photo">`
                            : `<div class="recipe-photo-placeholder">🍴</div>`
                    }

                    <h3>${recipe.title}</h3>

                    <p>${recipe.category}</p>

                    <p>
                        ⏱ ${recipe.time} минут
                        ·
                        🍽 ${recipe.servings} порций
                    </p>

                </div>
            `;

        }).join("");

        const categoryCards = recipesContainer.querySelectorAll(".recipe-card");

        categoryCards.forEach(function (card) {

            card.addEventListener("click", function () {

                const index = Number(card.getAttribute("data-index"));

                openRecipe(index);

            });

        });
    }

    recipesContainer.style.display = "block";
}


const backToCategories = document.querySelector("#backToCategories");

backToCategories.addEventListener("click", function () {

    const categoriesBlock = document.querySelector(".categories");
    const recipesTitle = document.querySelector("#recipesTitle");

    categoriesBlock.style.display = "grid";
    recipesTitle.textContent = "Мои рецепты";

    recipesContainer.style.display = "none";
    backToCategories.style.display = "none";
});


const searchInput = document.querySelector("#searchInput");

searchInput.addEventListener("input", function () {

    const searchText = searchInput.value.toLowerCase().trim();
    
if (searchText === "") {
    recipesContainer.innerHTML = "";
    recipesContainer.style.display = "none";
    return;
}

    const savedRecipes = localStorage.getItem("myRecipes");

    if (!savedRecipes) {
        return;
    }

    const recipes = JSON.parse(savedRecipes);

    const foundRecipes = recipes
        .map(function (recipe, index) {
            return {
                recipe: recipe,
                index: index
            };
        })
        .filter(function (item) {

            return item.recipe.title
                .toLowerCase()
                .includes(searchText);

        });

    recipesContainer.innerHTML = foundRecipes.map(function (item) {

        const recipe = item.recipe;

        return `
            <div class="recipe-card" data-index="${item.index}">

                ${
                    recipe.photo
                        ? `<img src="${recipe.photo}" class="recipe-photo">`
                        : `<div class="recipe-photo-placeholder">🍴</div>`
                }

                <h3>${recipe.title}</h3>

                <p>${recipe.category}</p>

                <p>
                    ⏱ ${recipe.time} минут
                    ·
                    🍽 ${recipe.servings} порций
                </p>

            </div>
        `;

    }).join("");

    recipesContainer.style.display = "block";

    const searchCards = recipesContainer.querySelectorAll(".recipe-card");

    searchCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const index = Number(card.getAttribute("data-index"));

            openRecipe(index);

        });

    });

});

// 🎲 Рулетка с выбором категории

const rouletteButton = document.querySelector("#rouletteButton");
const rouletteText = document.querySelector("#rouletteText");
const rouletteCategory = document.querySelector("#rouletteCategory");

rouletteButton.addEventListener("click", function () {

    const savedRecipes = localStorage.getItem("myRecipes");

    if (!savedRecipes) {
        rouletteText.textContent =
            "Сначала добавь хотя бы один рецепт 🌷";
        return;
    }

    const recipes = JSON.parse(savedRecipes);

    if (recipes.length === 0) {
        rouletteText.textContent =
            "Сначала добавь хотя бы один рецепт 🌷";
        return;
    }

    const selectedCategory = rouletteCategory.value;

    let availableRecipes = recipes;

    if (selectedCategory !== "all") {

        availableRecipes = recipes.filter(function (recipe) {

            return recipe.category === selectedCategory;

        });

    }

    if (availableRecipes.length === 0) {

        rouletteText.textContent =
            "В этой категории пока нет рецептов 🌷";

        return;
    }

    rouletteButton.disabled = true;

    let counter = 0;

    const animation = setInterval(function () {

        const randomIndex =
            Math.floor(Math.random() * availableRecipes.length);

        rouletteText.textContent =
            "🍴 " + availableRecipes[randomIndex].title;

        counter++;

        if (counter >= 10) {

            clearInterval(animation);

            const finalIndex =
                Math.floor(Math.random() * availableRecipes.length);

            const selectedRecipe =
                availableRecipes[finalIndex];

            rouletteText.textContent =
                "✨ " + selectedRecipe.title;

            rouletteButton.disabled = false;

            const originalIndex =
                recipes.indexOf(selectedRecipe);

            setTimeout(function () {

                openRecipe(originalIndex);

            }, 700);

        }

    }, 100);

});