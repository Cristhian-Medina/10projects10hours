/**
 * esta funcion ordena un objeto a un formato el cual podemos manejar mas facilmente.
 * @param {Object} obj objeto que queremos dar formato.
 * @returns newObj nuevo objeto formateado.
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
const ID_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const cardsContainer = document.getElementById('cards-container'); // almacena las recetas
const modal = document.getElementById('container-hidden'); // almacena la ventana modal.
const favoritesList = document.getElementById('favorite-list'); // Lista de favoritos.
let favoriteElement = document.createDocumentFragment();
let recipesList = [];
let errorMsg = ` <div class="error-card">
    <div class="header-error">
        <h2>! Lo sentimos ¡</h2>
    </div>
    <div class="body-error">
        <p>Ha ocurrido un fallo en la carga de la app.</p>
        <h4>Intenta recargando la pagina</h4>
        <button class="btn-icon fav"  onclick="location.reload()"><i class="fas fa-redo-alt"></i></button>
    </div>
</div>`; // elemento html con mensaje de error.

/**
 * Esta funcion abre el modal y muestra la información de la receta seleccionada, activando la imagen de la receta.
 * @returns undefined
 */
const showModal = () => modal.classList.remove('hidden');

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

/**
 * Esta funcion crea la estructura del elemento favorito y la retorna.
 * @param {String|Number} id identificador de la receta.
 * @param {String} img imagen de la receta.
 * @param {String} title titulo de la receta.
 * @returns {} favoriteElement estructura del elemento favorito.
 */
const createFavElement = (id, img, title) => {
    favoriteElement = `
        <li id="fav-${id}">
            <img src="${img}" alt="${title}" onclick="createModalCard(${id})">
            <button class="btn-icon delete" onclick="deleteFav(${id})"><i class="fas fa-times"></i></button>
        </li>
    `;
    return favoriteElement;
}

/**
 * Esta funcion agrega o borra la receta de la lista de favoritos, muestra el estado de la receta modificando el color del icono.
 * @param {HTMLElement} element boton de la receta que se va a garegar a la lista de favoritos.
 * @param {String|Number} id identificador de la receta.
 */
const addFav = (element, id) => {
    element.classList.toggle('icon-purple-heart'); // modifica el color del icono.

    const mealCard = document.getElementById(`recipe-${id}`); // obtiiene la tarjeta seleccionada.
    const dataList = mealCard.innerHTML.split('"'); // separa la estructura de la tarjeta y la almacena en un array.

    if (favoritesList.contains(document.getElementById(`fav-${id}`))) { // verifica la existencia de la receta en favoritos.
        deleteFav(id);
    } else {
        favoriteElement = createFavElement(id, dataList[5], dataList[7]);
        favoritesList.innerHTML += favoriteElement;
    }
}

/**
 * Esta funcion crea el codigo HTML de la tarjeta usando los datos de la receta.
 * @param {Object} recipe datos de la receta.
 * @returns {} card estructura de tarjeta con datos de la receta. 
 */
const createCard = recipe => {
    let card = `
        <div class="card" id="recipe-${recipe.idMeal}">
            <div class="meal-card-image" onclick="createModalCard(${recipe.idMeal})">
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

/**
 * Esta funcion asincrona obtiene la receta desde la DB usando el id y la retorna.
 * @param {String|Number} id identificador de la receta.
 * @returns {Object} meal objeto con los datos de la receta.
 */
const getMealById = async id => {
    try {
        let data = await fetch(`${ID_URL}${id}`);
        let object = await data.json();
        let meal = formatJSON(object.meals[0]);
        
        return meal;
    } catch (error) {
        let msg = errorMsg;
        cardsContainer.innerHTML = msg;
        console.error(error);
    }
}

/**
 * Esta funcion asincrona busca la receta en una lista usando el id, si no existe, la obtiene de la DB, la agrega a la lista y la retorna.
 * @param {String|Number} id identificador de la receta.
 * @returns {Object} meal Objeto que contiene los datos de la receta.
 */
const findMealById = async id => {
    let idToFind = id;
    let meal = recipesList.find( ({idMeal}) => idMeal == idToFind );
    if (meal) {
        return meal;
    } else {
        let recipeToAdd = await getMealById(id);
        recipesList.push(recipeToAdd);
        let meal = recipesList.find( ({idMeal}) => idMeal == id );
        return meal;
    }
}

/**
 * Esta funcion asincrona recibe un id, busca la receta con dicho id, crea un modal co la informacion obtenida y lo muestra en pantalla.
 * @param {String|Number} id identificador de la receta.
 */
const createModalCard = async id => { // recipe => {
    let recipe = '';
    recipe = await findMealById(id); // busca la receta correspondiente.
    
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

    modal.innerHTML =  modalCard;
    showModal();
}

/**
 * Esta funcion obtiene una receta de forma aleatorea y la muestra en la app.
 */
const getRandomMeal = async () => {
    let meal;
    try {
        let data = await fetch(`${RANDOM_URL}`);
        let object = await data.json();
        meal = formatJSON(object.meals[0]);
        recipesList.push(meal);
        cardsContainer.innerHTML = createCard(meal);;
    } catch (error) {
        let msg = errorMsg;
        cardsContainer.innerHTML = msg;
        console.log(error);
    }
}

(getRandomMeal)(); // ejecutamos al iniciar la aplicacion.

/**
 * Esta funcion asincrona obtiene recetas utilizando un string y las muestra en la app.
 * @param {String} name dato obtenido del usuario por la barra de busqueda.
 */
const getMeals = async name => {
    let validChar = [];
    name = name.trim().split(' '); // borra espacios en blanco alrededor del string, separa el string en ' ' y lo convierte en un array.
    for (char of name) {
        if (char != '') {
            validChar.push(char); // almacena los string que contengan datos validos en un array.
        }
    }
    name = validChar.join('_'); // crea un string concatenandolos con un '_'.

    try {
        recipesList = []; // almacena las recetas obtenidas en cada busqueda.
        let data = await fetch(`${API_URL}${name}`);
        let meals = await data.json();

        /**
         * itera el objeto en busca de las recetas, les da formato y las almacena en la lista 'recipeList'.
         */
        for (let recipe in meals.meals) {
            let meal = formatJSON(meals.meals[recipe])
            recipesList.push(meal);
        }

        cardsContainer.innerHTML = ''; // limpia el contenedor.
        /**
         * itera en la lista de recetas y crea una tarjeta para cada receta.
         */
        for (let i = 0; i < recipesList.length; i++) {
            cardsContainer.innerHTML += createCard(recipesList[i]);
        }
    } catch (error) {
        let msg = errorMsg;
        cardsContainer.innerHTML = msg;
        console.error(error);
    }
}