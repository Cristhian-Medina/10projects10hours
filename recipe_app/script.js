
/**
 * esta funcion ordena un objeto a un formato el cual podemos manejar mas facilmente.
 * @param {Object} obj objeto que queremos dar formato.
 * @returns nuevo objeto formateado.
 */
 const formatJSON = (obj) => {
    let newObj = {};
    for (let i in obj) { // itera las propiedades del objeto.
        if (obj[i] && obj[i] != " ") { // comprueba que la propiedad contenga información.
            newObj[i.replace('str', '')] = obj[i]; // formatea el nombre de la propiedad.
        }
    }
    return newObj;
}

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

const cardsContainer = document.getElementById('cards-container'); // almacena las recetas
const modal = document.getElementById('container-hidden'); // almacena la ventana modal.
const favoritesList = document.getElementById('favorite-list'); // Lista de favoritos.
let favoriteElement = document.createDocumentFragment();

/**
 * Esta funcion abre el modal y muestra la información de la receta seleccionada, activando la imagen de la receta.
 * @returns undefined
 */
 const showModal = (e) => {
    modal.classList.remove('hidden');
    //console.log(e.path[1]); // agregar informacion del card
}

/**
 * Esta funcion oculta el modal activando el boton close.
 * @returns undefined
 */
 const hideModal = () => modal.classList.add('hidden');

 /**
 * Elimina la receta de los favoritos
 * @param {String|Number} id es el identificador del elemento que activa el evento
 */
const deleteFav = id => {
    document.getElementById(`fav-${id}`).remove();
    const mealCard = document.getElementById(`recipe-${id}`);
    const favBtn = mealCard.getElementsByTagName('button');
    favBtn[0].classList.remove('icon-purple-heart');
}

const addFav = (element, id) => {
    element.classList.toggle('icon-purple-heart'); // modifica el color del icono.

    const mealCard = document.getElementById(`recipe-${id}`); // obtiiene la tarjeta seleccionada.
    const dataList = mealCard.innerHTML.split('"'); // separa la estructura de la tarjeta y la almacena en un array.

    if ( favoritesList.contains(document.getElementById(`fav-${id}`)) ) { // verifica la existencia de la receta en favoritos.
        deleteFav(id);
    } else {
        favoriteElement = createFavElement(id, dataList[5], dataList[7]);
        favoritesList.innerHTML = favoriteElement;
    }
}

const createCard = recipe => {
    let card = `
        <div class="card" id="recipe-${recipe.idMeal}">
            <div class="meal-card-image" onclick="showModal(${recipe.idMeal})">
                <img src="${recipe.MealThumb}" alt="${recipe.Meal}">
                <div class="tag">
                    <h4>${recipe.Category}</h4>
                </div>
            </div>
            <div class="meal-card-body">
                <h4>${recipe.Meal}</h4>
                <button class="btn-icon fav" onclick="addFav(this, ${recipe.idMeal})"><i class="fas fa-heart"></i></button>
            </div>
        </div>
    `;

    return card;
}

/**
 * FIltra los elementos de un array basado en un criterio de busqueda
 * @param {Array} arr array en el que se busca.
 * @param {String} query criterio de busqueda.
 * @returns {Array} valores que concuerdan con la busqueda.
 */
const filterItems = (arr, query) => arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  
const createModalCard = (recipe) => {
    let properties = Object.getOwnPropertyNames(recipe); // convierte las propiedades del objeto en array
    let validIngredient = filterItems(properties, 'Ingredient'); // valida las propiedades que contengan la palabra 'Ingredient'.
    let validMeasure = filterItems(properties, 'Measure'); // valida las propiedades que contengan la palabra 'Measure'.
    let listIngredients = ''; // almacena los elementos de la lista de ingredientes.

    /**
     * Valida las propiedades del objeto 'recipe' y crea la lista con dichas propiedades.
     */
    for (let i = 0; i < validIngredient.length; i++) {
        let ingredient = `${validIngredient[i]}`;
        let measure = `${validMeasure[i]}`;
        let li = `<li>${recipe[ingredient]} - ${recipe[measure]}</li>`;
        listIngredients = listIngredients + li;
    }

    let modalCard = `
        <div class="card-modal">
            <button class="btn-icon" id="close" onclick="hideModal()"><i class="fas fa-times"></i></button>
            <h1 class="title">${recipe.Meal}</h2>
            <img src="${recipe.MealThumb}" alt="${recipe.Meal}">
            <p class="description">${recipe.Instructions}</p>
            <h3 class="subtitle">Ingredients:</h3>
            <ul>
                ${listIngredients}
            </ul>
        </div>
    `;

    return modalCard;
}

const getRandomMeal = async () => {
    let meal;
    try {
        let data = await fetch(`${RANDOM_URL}`);
        let object = await data.json();
        meal = formatJSON(object.meals[0]);
        cardsContainer.innerHTML = createCard(meal);;
        modal.innerHTML = createModalCard(meal);
    } catch (error) {
        let msg = `
            <div class="error-card">
                <div class="header-error">
                    <h2>! Lo sentimos ¡</h2>
                </div>
                <div class="body-error">
                    <p>Ha ocurrido un fallo en la carga de la app.</p>
                    <h4>Intenta recargando la pagina</h4>
                    <button class="btn-icon fav"  onclick="location.reload()"><i class="fas fa-redo-alt"></i></button>
                </div>
            </div>
        `;
        cardsContainer.innerHTML = msg;
        console.log(error);
    }
}

(getRandomMeal)(); // ejecutamos al iniciar la aplicacion.

const getMeals = async (name) => {
    if (name === undefined || name === ' ') {
        name = 'Arrabiata';
    } else if (name) {
        name.split('_');
    }
    try {
        let recipes = [];
        let data = await fetch(`${API_URL}${name}`);
        let meals = await data.json();

        for (let recipe in meals.meals) {
            recipes.push( formatJSON(meals.meals[recipe]) );
        }
        
        // console.log(recipes);
        
        // let cardHTML = createCard(meals);
        // cardsContainer.innerHTML = cardHTML;
    } catch (error) {
        // let msg = `
        //     <div class="error-card">
        //         <div class="header-error">
        //             <h2>! Lo sentimos ¡</h2>
        //         </div>
        //         <div class="body-error">
        //             <p>Ha ocurrido un fallo en la carga de la app.</p>
        //             <h4>Intenta recargando la pagina</h4>
        //             <button class="btn-icon fav"  onclick="location.reload()"><i class="fas fa-redo-alt"></i></button>
        //         </div>
        //     </div>
        // `;
        // cardsContainer.innerHTML = msg;
        console.error(error);
    }
}

// (getMeals)('chicken marengo');

// const findMealById = (id) => {}

const createFavElement = (id, img, title) => {
    // findMealById(id);
    // iterar en la lista de comidas para encontar el id
    // crear el contenedor del elemento

    favoriteElement = `
        <li id="fav-${id}">
            <img src="${img}" alt="${title}" onclick="showModal(${id})">
            <button class="btn-icon delete" onclick="deleteFav(${id})"><i class="fas fa-times"></i></button>
        </li>
    `;
    return favoriteElement;
}