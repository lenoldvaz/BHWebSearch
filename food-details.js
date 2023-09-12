// Define a function to get the value of a URL parameter by its name
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the 'id' parameter value from the current page URL
const foodId = getUrlParameter('id');
let food_url; // Declare the food_url variable in the outer scope

// Check if 'foodId' is a valid integer
if (!isNaN(foodId) && Number.isInteger(parseFloat(foodId))) {
    // Construct the food_url with the extracted 'id' value
    food_url = new URL(`https://node.lenoldvaz.com/bh/search-food?id=${foodId}`);

    // The rest of your code to make the API request and process the response
    // ...
} else {
    // Handle the case where 'foodId' is not a valid integer
    console.error('Invalid foodId:', foodId);
}

// Define a function to get food details 
function getFoodDetails() {
    // Create a request variable and assign a new XMLHttpRequest object to it 
    let request = new XMLHttpRequest();

    // Define the url 
    let url = food_url.toString();

    // Open a request
    request.open('GET', url, true);

    // Set the Content-Type header for JSON data
    request.setRequestHeader("Accept", "application/json");

    // When the 'request' or API request loads, do the following...
    request.onload = function() {
        // Store what we get back from the Xano API as a variable called 'data' and convert it to a JavaScript object
        let data = JSON.parse(this.response);

        // Status 200 = Success. Status 400 = Problem. This says if it's successful and no problems, then execute 
        if (request.status >= 200 && request.status < 400) {
            const foodName = document.getElementsByClassName('food-name')[0]
            foodName.textContent = data.food_name;

            // Assuming you have image URLs for veg and nonveg
            const vegImageUrl = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/64e4d43508527271a013fd3c_vegan.svg';
            const nonVegImageUrl = 'path-to-nonveg-image.jpg';

            // Get the element with the class 'food-type'
            const foodTypeElement = document.querySelector('.food-type');

            // Clean the value by removing curly braces
            const cleanedValue = data.food_tags.food_group.replace(/{|}/g, '');

            // Check the cleaned value and set the background image accordingly
            if (cleanedValue === 'veg') {
                foodTypeElement.style.backgroundImage = `url('${vegImageUrl}')`;
            } else if (cleanedValue === 'nonveg') {
                foodTypeElement.style.backgroundImage = `url('${nonVegImageUrl}')`;
            }
            
            //Food tags 
            const mealType = document.querySelector('.meal-type');
            mealType.textContent = data.food_tags.meal_type

            const cuisine = document.querySelector('.food_tag_cuisine');
            cuisine.textContent = data.food_tags.cuisines
            
            
            
            // Serving size 
            const weight = document.querySelector('.serving-size-weight');

            if (data.calories_calculated_for === null) {
                if (weight) {
                    weight.classList.add('Hide');
                }
            } else {
                if (weight) {
                    // Show the div by removing the 'Hide' class
                    weight.classList.remove('Hide');

                    // Update the text content of the serving-size-weight-text element
                    const weightText = weight.querySelector('.serving-size-weight-text');
                    weightText.textContent = data.calories_calculated_for;
                }
            }
            
               //recipe link 
            const recipe_link = document.querySelector('.recipe-link');

            if (data.recipe_link === null) {
                if (recipe_link) {
                    recipe_link.classList.add('Hide');
                }
            } else {
                if (recipe_link) {
                    recipe_link.href = data.recipe_link;
                }
            }
            
            
            
            // Function to calculate and update nutrient values
            function updateNutrientValues(nutrientName, nutrientClassName) {


            // Find the nutrient in the 'data.nutrition' array
            const nutrient = data.nutrition.find(nutrient => nutrient.nutrient_tag_name === nutrientName);
               
            // Extract the 'measure' value for the nutrient
            const nutrientMeasure = nutrient ? nutrient.measure : 0;
                


            // Find the 'Energy_kcal' nutrient in the 'data.nutrition' array
            const energyKcalNutrient = data.nutrition.find(nutrient => nutrient.nutrient_name === 'Energy_kcal');
            // Extract the 'measure' value for 'Energy_kcal'
            const energyKcalMeasure = energyKcalNutrient ? energyKcalNutrient.measure : 0;

            // Calculate the total_calories
            const total_calories = energyKcalMeasure;





            // Find the element with the specified combo class
            const meterFillNutrient = document.querySelector(`.meter-fill.${nutrientClassName}`);
            const meterTextNutrient = document.querySelector(`.macro-title-count.left.${nutrientClassName}`);
               



            if (meterFillNutrient) {
                if (nutrient && energyKcalNutrient) {
                    // Calculate the width based on nutrient measure * 4 divided by total_calories
                    const widthValue = (nutrientMeasure * 4) / total_calories;
                    
                    // Set the width of the meter-fill element based on the calculated value
                    meterFillNutrient.style.width = `${widthValue * 100}%`; // Convert to percentage
                    meterTextNutrient.textContent = `${(widthValue *100).toFixed(2)}%`; // Round to 2 decimal places


                }
            }
        }

        function updateNutrientValuesAbs(nutrientName, nutrientClassName) {
             // Find the nutrient in the 'data.nutrition' array
             const nutrient = data.nutrition.find(nutrient => nutrient.nutrient_tag_name === nutrientName);
             
            // Extract the 'measure' value for the nutrient
            const nutrientMeasure = nutrient ? nutrient.measure : 0;
                


                // Find the element with the specified combo class
            const meterFillNutrient = document.querySelector(`.meter-fill.${nutrientClassName}`);
            const meterTextNutrient = document.querySelector(`.macro-title-count.${nutrientClassName}`);
               

                if (meterFillNutrient) {
                    if (nutrient) {
                        // Calculate the width based on nutrient measure * 4 divided by total_calories
                        const widthValue = nutrientMeasure ;
                        
                        // Set the width of the meter-fill element based on the calculated value
                        meterFillNutrient.style.width = `${widthValue}%`; // Convert to percentage
                        meterTextNutrient.textContent = `${Math.floor(widthValue)}`; //Rounds to the nearest integer
    
    
                    }
                }


        }


        //Construct a function to display nutrition values 
        function updateNutriTableValues(nutrientName, nutrientClassName, rda_value) {
            // Find the nutrient in the 'data.nutrition' array
            const nutrient = data.nutrition.find(nutrient => nutrient.nutrient_tag_name === nutrientName);
            console.log('nutrient', nutrient)


            // Extract the 'measure' value for the nutrient
            const nutrientMeasure = nutrient ? nutrient.measure : 0;
                console.log('nutrientMeasure', nutrientMeasure)

            // Find the element with the specified combo class
            
            const nutriTableCellText = document.querySelector(`.table_row_text.right.${nutrientClassName}`);
            

            if(nutriTableCellText) {
                // Calculate daily value as a percentage of RDA
                const dailyValue = (nutrientMeasure / rda_value) * 100;
                nutriTableCellText.textContent = `${dailyValue.toFixed(2)}%`; // Display as a percentage with 2 decimal places
            }




        }
        updateNutriTableValues('FAT', 'fat', 55)
        updateNutriTableValues('FASAT', 'FASAT', 20)
        updateNutriTableValues('FATRN', 'FATRN', 1)
        //updateNutriTableValues('FASAT', 'fat', 6)
        //updateNutriTableValues('FASAT', 'fat', 28)
        updateNutriTableValues('CHOLE', 'CHOLE', 300)
        updateNutriTableValues('NA', 'NA', 2000)
        //updateNutriTableValues('FASAT', 'fat', 30)


        // Update nutrient values for different nutrient types
        updateNutrientValues('PROCNT', 'protein');
        updateNutrientValues('CHOCDF', 'carbs');
        updateNutrientValues('FAT', 'fat');
        updateNutrientValuesAbs('Glycemic Index Estimate','gi')
            
            //end

        }
    };

    // Send Restaurant request to API
    request.send();
}

// This fires all of the defined functions when the document is "ready" or loaded
document.addEventListener("DOMContentLoaded", function() {
    getFoodDetails();
});