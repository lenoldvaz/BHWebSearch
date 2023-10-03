
// Check if 'foodId' is a valid integer
if (!isNaN(foodId) && Number.isInteger(parseFloat(foodId))) {
    // Construct the food_url with the extracted 'id' value
    
    ingredient_url = new URL(`https://node.lenoldvaz.com/bh/ingredients?id=${foodId}`);
    // The rest of your code to make the API request and process the response
    // ...
} else {
    // Handle the case where 'foodId' is not a valid integer
    console.error('Invalid foodId:', foodId);
}


function getIngredients() {
    let request = new XMLHttpRequest();

    // Define the URL
    let url = ingredient_url.toString();

    // Open a request
    request.open('GET', url, true);

    // Set the Content-Type header for JSON data
    request.setRequestHeader("Accept", "application/json");

    // When the request or API request loads, do the following...
    request.onload = function() {
        // Check if the status code is in the 200-299 range, which indicates success
        if (request.status >= 200 && request.status < 300) {
            // Parse the response JSON into a JavaScript object
            let data = JSON.parse(this.response);
            //console.log(data);

            // Parse the response into categories
            let result = [];


         
                const ingredientsTable = document.getElementById('is_ingredients_div');
                //console.log(ingredientsTable);
            
                // Sort the data array by basic_unit_measure in ascending order
                data.sort((a, b) => b.basic_unit_measure - a.basic_unit_measure);
            
                data.forEach((ingredient, index) => {
                    const style = document.getElementById('ingredient_table_row');
                    const ingRow = style.cloneNode(true);
                    ingRow.classList.remove('hide');

                    // Remove the 'id' attribute to make each cloned row unique
                    ingRow.removeAttribute('id');

                    // Set a unique identifier for each row based on the index
                    ingRow.setAttribute('id', 'ingredient_row_' + index);

                    // Find the div elements within the cloned row
                    const ingredientNameDiv = ingRow.querySelector('.is_ingredient_name');
                    const ingredientValueDiv = ingRow.querySelector('.is_ingredient_value');

                    // Set the text content of the div elements based on ingredient properties
                    if (ingredientNameDiv) {
                        ingredientNameDiv.textContent = ingredient.ingredient_name;
                    }
                    
                    if (ingredientValueDiv) {
                        ingredientValueDiv.textContent = ingredient.basic_unit_measure.toFixed(2)+' g';
                    }

                    ingredientsTable.appendChild(ingRow);
                });

             

         
            function processCats(item, parentProportion = 1) {
                let id = item.food_category_id !== null ? Number(item.food_category_id) : null;
                let proportion = Number(item.proportion) * parentProportion;

                // Define existingCategory here to make it accessible
                let existingCategory = result.find((category) => category.food_category_id === id);

                if (id !== null) {
                    if (existingCategory) {
                        // If the category already exists, update the proportion
                        existingCategory.proportion += proportion;
                    } else {
                        // If the category doesn't exist, create a new one
                        result.push({
                            food_category_id: id,
                            name: item.category,
                            proportion: proportion,
                            parent_group: item.parent_group,
                            food_group: item.food_group
                        });
                    }
                }

                // Process sub_ingredients regardless of whether the parent item has a food_category_id or not
                if (item.sub_ingredients.length > 0) {
                    item.sub_ingredients.forEach((subItem) => processCats(subItem, proportion));
                }
            }

            // Assuming that 'input' is your data array to be processed
            data.forEach((item) => processCats(item));

            // Sort the result array by the proportion in descending order
            result.sort((a, b) => b.proportion - a.proportion);

            //console.log(result);

            //create function to populate food-groups
            function updateFoodGroups (foodGroups){
                let foodGroupDiv = document.querySelector('.food-groups-list');
                //console.log(foodGroupDiv)
                

                for (const group of foodGroups ) {
                    const foodGroupCard = document.createElement('div');
                    foodGroupCard.classList.add('card','food-group')
                    //console.log(group)

                    //Create card contents 
                    const foodGroupImageDiv = document.createElement('div')
                    foodGroupImageDiv.classList.add('food-group_img_div')

            
                    let parent_group = group.parent_group;
                    let foodGroupIcon; // Declare the variable here
                    //console.log(parent_group)

                    switch (parent_group) {
                        case 'meats':
                        case 'white lean meat':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/651b5dfd72b771d42c3aa487_Meats.svg';
                            break;
                        case 'grains and cereals':
                        case 'grains':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/651b5dfd616124d1aa8d2b24_Grains%20_%20cereals.svg';
                            break;
                        case 'veggies':
                        case 'vegetables':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/651b5dfe3336a3f0746550a5_veggies.svg';
                            break;
                        case 'oils and fats':
                        case 'dairy fats':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/651b5dfeea2f99f601bf3ebd_Oils%20_%20Fats.svg';
                            break;
                        case 'eggs':
                        case 'egg':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/651b5dfd00bf868edc1a756b_Eggs.svg';
                            break;
                        case 'fruit':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978c2feffa5e35e3e03a_fruit.svg';
                            break;
                        case 'dairy':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/651b5dfeb17bd622224c7b66_Dairy.svg';
                            break;
                        case 'dairy':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/651b5dfeb17bd622224c7b66_Dairy.svg';
                            break;
                        case 'spices and herbs':
                        case 'sugar':
                        case 'salt':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/651b5dfda2543e67c0328fcc_spices.svg';
                            break;
                        case 'vinegars':
                            foodGroupIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/650383179f830c92c94fbc56_condiment.svg';
                            break;
                        
                    }

                    const foodGroupImg = document.createElement('div');
                    foodGroupImg.classList.add('foodGroupImg')
                    foodGroupImg.style.backgroundImage = `url('${foodGroupIcon}')`;
                    // Set the width and height properties
                    foodGroupImg.style.width = '40px';
                    foodGroupImg.style.height = '40px';
                    foodGroupImg.style.backgroundPosition = '50%';
                    foodGroupImg.style.backgroundRepeat = 'no-repeat';
                    foodGroupImg.style.backgroundSize = 'auto';



                    const foodGroupDetDiv = document.createElement('div')
                    foodGroupDetDiv.classList.add('food-group-text-wrapper')

                        const foodGroupPropo = document.createElement('div');
                        foodGroupPropo.classList.add('food-group-measure');
                        foodGroupPropo.textContent = (group.proportion*100).toFixed(2)+'%';
                        //console.log(group.proportion)

                        const foodGroupName = document.createElement('div');
                        foodGroupName.classList.add('food-group-name')
                        foodGroupName.textContent = group.name




                    foodGroupCard.appendChild(foodGroupImageDiv)
                    foodGroupImageDiv.appendChild(foodGroupImg)
                    foodGroupCard.appendChild(foodGroupDetDiv)

                    foodGroupDetDiv.appendChild(foodGroupPropo)
                    foodGroupDetDiv.appendChild(foodGroupName)

                    foodGroupDiv.appendChild(foodGroupCard)



                }

            }
    
    
            updateFoodGroups(result)







        } else {
            // Handle the case where the request was not successful
            console.error('API request failed with status code:', request.status);
        }


        







    };

    // Handle network errors
    request.onerror = function() {
        console.error('Network error occurred while making the API request.');
    };

    // Send the request
    request.send();





    
}
    







// This fires all of the defined functions when the document is "ready" or loaded
//document.addEventListener("DOMContentLoaded", function() {
  
    getIngredients();
//});
