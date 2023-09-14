
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


                    //Create card contents 
                    const foodGroupImage = document.createElement('div')
                    foodGroupImage.classList.add('food-group_img_div')

                    const foodGroupDetDiv = document.createElement('div')
                    foodGroupDetDiv.classList.add('food-group-text-wrapper')

                        const foodGroupPropo = document.createElement('div');
                        foodGroupPropo.classList.add('food-group-measure');
                        foodGroupPropo.textContent = (group.proportion*100).toFixed(2)+'%';
                        //console.log(group.proportion)

                        const foodGroupName = document.createElement('div');
                        foodGroupName.classList.add('food-group-name')
                        foodGroupName.textContent = group.name




                    foodGroupCard.appendChild(foodGroupImage)
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