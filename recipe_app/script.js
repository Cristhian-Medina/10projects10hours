const recipes = [{
        name: "Kumpir",
        Image: "https://www.themealdb.com/images/media/meals/mlchx21564916997.jpg",
        recipe_ingredients: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
        category: `www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    },
    {
        name: "Pizza Express Margherita",
        Image: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
        recipe: "1 Preheat the oven to 230°C. 2 Add the sugar and crumble the fresh yeast into warm water. 3 Allow the mixture to stand for 10 – 15 minutes in a warm place (we find a windowsill on a sunny day works best) until froth develops on the surface. 4 Sift the flour and salt into a large mixing bowl, make a well in the middle and pour in the yeast mixture and olive oil. 5 Lightly flour your hands, and slowly mix the ingredients together until they bind. 6 Generously dust your surface with flour. 7 Throw down the dough and begin kneading for 10 minutes until smooth, silky and soft. 8 Place in a lightly oiled, non-stick baking tray (we use a round one, but any shape will do!) 9 Spread the passata on top making sure you go to the edge. 10 Evenly place the mozzarella (or other cheese) on top, season with the oregano and black pepper, then drizzle with a little olive oil. 11 Cook in the oven for 10 – 12 minutes until the cheese slightly colours. 12 When ready, place the basil leaf on top and tuck in!",
        ingredient: [
            "Water - 150ml",
            "Sugar - 1 tsp",
            "Yeast - 15g",
            "Plain flour - 225g",
            "Salt - 1 1/2 tsp",
            "Olive oil - drizzle",
            "passata - 80g",
            "mozzarella - 70g",
            "oregano - peeled and sliced",
            "basil - leaves",
            "black pepper - pinch"
        ]
    },
]

const API_URL = "https://www.themealdb.com/api.php";

const mealSelected = document.getElementsByClassName('');