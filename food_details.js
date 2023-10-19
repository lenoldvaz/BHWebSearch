// Define a function to get the value of a URL parameter by its name
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


// Retrieve the value from local storage
const servingType = localStorage.getItem('serving_type');



// Get the 'id' parameter value from the current page URL
const foodId = getUrlParameter('id');
let food_url; // Declare the food_url variable in the outer scope
let ingredient_url; 

// Check if 'foodId' is a valid integer
if (!isNaN(foodId) && Number.isInteger(parseFloat(foodId))) {
    // Construct the food_url with the extracted 'id' value
    food_url = new URL(`https://node.lenoldvaz.com/bh/search-food?id=${foodId}`);
    ingredient_url = new URL(`https://node.lenoldvaz.com/bh/ingredients?id=${foodId}`);
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




            function updateBasicDetails(){
            const foodName = document.getElementsByClassName('food-name')[0]
            foodName.textContent = data.food_name;


            const breadcrumbs = document.querySelector('.breadcrumbs.currentsearch');
            breadcrumbs.textContent = data.food_name;

            const foodDesc = document.getElementsByClassName('description')[0]
            foodDesc.textContent = data.food_description;



            // Assuming you have image URLs for veg and nonveg
            const vegImageUrl = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/64e4d43508527271a013fd3c_vegan.svg';
            const nonVegImageUrl = 'path-to-nonveg-image.jpg';

            // Get the element with the class 'food-type'
            const foodTypeElement = document.querySelector('.food-type');

            // Clean the value by removing curly braces
            if(data.food_tags.food_group) {
            const cleanedValue = data.food_tags.food_group.replace(/{|}/g, '');
            
            // Check the cleaned value and set the background image accordingly
            if (cleanedValue === 'veg') {
                foodTypeElement.style.backgroundImage = `url('${vegImageUrl}')`;
            } else if (cleanedValue === 'nonveg') {
                foodTypeElement.style.backgroundImage = `url('${nonVegImageUrl}')`;
            }
        }





            //Food tags 
            const foodTagsListDiv = document.querySelector('.pill-wrapper')
            const foodTagsToCheck = ['meal_type', 'cuisines'];

            //iterate through the tags 
            for (const tagKey of foodTagsToCheck) {
                const tagValue = data.food_tags[tagKey]



                if (tagValue) {
                    // Remove surrounding curly braces and split terms by comma
                    const foodtagTerms = tagValue.replace(/[{}]/g, '').split(',');
                    

                    for (const food_tags of foodtagTerms) {
                        const foodTagsPillDiv = document.createElement('div');
                        foodTagsPillDiv.classList.add('pill');
                        

                        const foodTagsText = document.createElement('div');
                        foodTagsText.classList.add('pill-text')
                        foodTagsText.textContent = food_tags

                        foodTagsListDiv.appendChild(foodTagsPillDiv);

                        foodTagsPillDiv.appendChild(foodTagsText)

                    }

                }   

            }



           
            
            
            
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
            //console.log('nutrient', nutrient)


            // Extract the 'measure' value for the nutrient
            const nutrientMeasure = nutrient ? nutrient.measure : 0;
                //console.log('nutrientMeasure', nutrientMeasure)

            // Find the element with the specified combo class
            
            const nutriTableCellText = document.querySelector(`.table_row_text.right.${nutrientClassName}`);
            

            if(nutriTableCellText) {
                // Calculate daily value as a percentage of RDA
                const dailyValue = (nutrientMeasure / rda_value) * 100;
                nutriTableCellText.textContent = `${dailyValue.toFixed(2)}%`; // Display as a percentage with 2 decimal places
            }




            }

            function updateFoodTime(mealTime, mealClassName) {
            const meal = data.food_timing[mealTime];
            const mealDiv = document.querySelector(`.meal-item.${mealClassName}`);
            
            if (meal=== 1) {
                mealDiv.style.backgroundColor = '#e5ecff';
            }
            }

            function processPreparationTags(tags) {
            const tagListDiv = document.querySelector('.food-tag-list');
        
            // Define the tags to check
            const tagsToCheck = ['searchable', 'recommendable', 'packaged_food', 'homemade', 'end_product'];
        
            // Iterate through the tags
            for (const tag of tagsToCheck) {
                const tagValue = tags[tag];
        
                if (tagValue === 't') {
                    // Create a div for the tag pill
                    const tagPillDiv = document.createElement('div');
                    tagPillDiv.classList.add('food-tag-pill');
        
                    // Convert tag name to sentence case (e.g., from "searchable" to "Searchable")
                    const tagName = tag.replace(/_/g, ' ').replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
        
                    // Add text and class to the tag pill
                    tagPillDiv.textContent = tagName;
                    tagPillDiv.classList.add('food-tag-text');
        
                    // Append the tag pill to the tag list
                    tagListDiv.appendChild(tagPillDiv);
                }
            }
            }
        
        


            function processHealthTags(healthTags) {
                const healthTagList = document.querySelector('.health-tag-list');
                //console.log ('healthTagList', healthTagList )


                //Define the tags to find 
                const healthTagsToCheck = ['positive_health', 'negative_health'];

                //iterate through the tags 
                for (const tagKey of healthTagsToCheck) {
                    const tagValue = healthTags[tagKey]
                    
                

                if (tagValue) {
                    // Remove surrounding curly braces and split terms by comma
                    const tagTerms = tagValue.replace(/[{}]/g, '').split(',');
                    
                    // Iterate through each term
                    for (const term of tagTerms) {
                        // Create a div for the health tag pill
                        const healthtagPillDiv = document.createElement('div');
                        healthtagPillDiv.classList.add('pill');
                        healthtagPillDiv.classList.add(tagKey === 'positive_health' ? 'positive-health' : 'negative-health');
        
                        // Create a div for the pill dot
                        const pillDotDiv = document.createElement('div');
                        pillDotDiv.classList.add('pill-dot');
                        pillDotDiv.classList.add(tagKey === 'positive_health' ? 'positive-health' : 'negative-health')
        
                        // Create a div for the pill text
                        const pillTextDiv = document.createElement('div');
                        pillTextDiv.classList.add('pill-text');
        
                        // Set the text content of the pill text div to the term in sentence case
                        pillTextDiv.textContent = term.charAt(0).toUpperCase() + term.slice(1);
        
                        // Append the pill dot and pill text to the health tag pill div
                        healthtagPillDiv.appendChild(pillDotDiv);
                        healthtagPillDiv.appendChild(pillTextDiv);
        
                        // Append the health tag pill div to the health tag list
                        healthTagList.appendChild(healthtagPillDiv);
                    }
                }
            }
            }

        
            function updateDisorders(disorders) {
            const disorderTable = document.querySelector('.card.disorders');
            //console.log('disorderTable', disorderTable);
            const disorderDivTitle = document.querySelector('.disorder-div-title')
            console.log(disorderTable)

            if (disorders.length === 0 ) {
                disorderTable.classList.add('Hide')
                disorderDivTitle.classList.add('Hide')
            } 
                disorderDivTitle.textContent = 'Health Tags for '+data.foodName
            
        
            for (const disorder of disorders) {
            // Create a new row for each disorder
            const disorderRow = document.createElement('div');
            disorderRow.classList.add('table_content_row');
        
            // Create the cells
        
            // Create name cell
            const disorderName = document.createElement('div');
            disorderName.classList.add('table_row_text', 'disorder-name');
            disorderName.textContent = disorder.disorder_name;
        
            // Create pill cell
            const disorderRiskLevel = document.createElement('div');
            disorderRiskLevel.classList.add('pill', 
                disorder.disorder_risk_factor === 1 ? 'red' :
                disorder.disorder_risk_factor === 2 ? 'orange' :
                'green'
            );
                


                const disorderPillBullet = document.createElement('div');
                disorderPillBullet.classList.add('pill-bullet', 
                disorder.disorder_risk_factor === 1 ? 'red' :
                disorder.disorder_risk_factor === 2 ? 'orange' :
                'green'
            );

            let riskText;
        
            switch (disorder.disorder_risk_factor) {
                case 1:
                riskText = 'Avoid this food';
                break;
                case 2:
                riskText = 'Consume in moderation';
                break;
                case 3:
                riskText = 'Can consume freely';
                break;
                default:
                riskText = 'Default risk text';
            }
        
            const disorderRisktext = document.createElement('div');
            disorderRisktext.classList.add('pill-text', 
                disorder.disorder_risk_factor === 1 ? 'red' :
                disorder.disorder_risk_factor === 2 ? 'orange' :
                'green'
            );
            disorderRisktext.textContent = riskText;
        


            //Create Risk reason 
            const disRiskReason = document.createElement('div')
            disRiskReason.classList.add('table_row_text','disorder-reason')
            disRiskReason.textContent = disorder.disorder_risk_reason;

            //Create alternatives

            let Alts = disorder.food_disorder_alts.map(a => a.food_name).join(',')

            const dAlts = document.createElement('div')
            dAlts.classList.add('table_row_text','disorder-alts')
            dAlts.textContent = Alts




            // Append pill items to pill
            
            disorderRiskLevel.appendChild(disorderPillBullet);
            disorderRiskLevel.appendChild(disorderRisktext);
        
            // Append cells to the disorder row
            disorderRow.appendChild(disorderName);
            disorderRow.appendChild(disorderRiskLevel);
            disorderRow.appendChild(disRiskReason);
            disorderRow.appendChild(dAlts);
        
            // Append the disorder row to the parent element
            disorderTable.appendChild(disorderRow);
            }
            }
            
            
            function updateFoodPairing(pairings) {
                const foodPairingWrapper = document.querySelector('.food-pairing-wrapping');
                let index = 1;
            
                for (const priorityKey in pairings) {
                    // Create a row 
                    const pairingRow = document.createElement('div');
                    pairingRow.classList.add('food-pairing-row');
            
                    if (pairings.hasOwnProperty(priorityKey)) {
                        const priorityFoods = pairings[priorityKey];
            
                        // Create a div for the priority
                        const priorityDiv = document.createElement('div');
                        priorityDiv.classList.add('food-pairing-priority-text');
                        priorityDiv.textContent = index.toString();
                        index++;
            
                        pairingRow.appendChild(priorityDiv);
            
                        // Iterate through the foods in this priority
                        priorityFoods.forEach((foodItem) => {
                            let pairedImageIcon; // Declare the variable here
            
                            switch (foodItem.toLowerCase()) {
                                case 'meat curry':
                                case 'curry':
                                case 'gravy':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/65038317dfdaeabff71b2956_meat%20curry.svg';
                                    break;
                                case 'rice':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/65038317dfdaeabff71b2956_meat%20curry.svg';
                                    break;
                                case 'dal':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/65038316f145b2e74599b0fe_dal.svg';
                                    break;
                                case 'sauce':
                                case 'dressing':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/65038317623861f66264e74a_sauce.svg';
                                    break;
                                case 'dip':
                                case 'condiment':
                                case 'dressing':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/650383179f830c92c94fbc56_condiment.svg';
                                    break;
                                case 'bread':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/65038317dfdaeabff71b2956_meat%20curry.svg';
                                    break;
                                case 'salad':
                                case 'veggies':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/65038317dfdaeabff71b2956_meat%20curry.svg';
                                    break;

                                case 'pickle':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978c0bbbe2ea725ffb9b_pickle.svg';
                                    break;
                                case 'milk':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978c96969ba5745b6731_milk.svg';
                                    break;
                                case 'nuts':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978c0bbbe2ea725ffb77_nut.svg';
                                    break;
                                case 'full meal':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/65000a185219862012ed8b55_dinner.svg';
                                    break;
                                case 'snack':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978ce3df317bd68f3498_snack.svg';
                                    break;
                                case 'fruit':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978c2feffa5e35e3e03a_fruit.svg';
                                    break;
                                case 'cheese':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/650398da85853dfb8c2fbff2_cheese.svg';
                                    break;
                                case 'side dish':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978c3ae81612c6565e20_side%20dish.svg';
                                    break;
                                case 'curd':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/650398bd6b5dac33a4984f96_curd.svg';
                                    break;
                                case 'roti':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978c6876380504a42795_roti.svg';
                                    break;
                                case 'meat':
                                    pairedImageIcon = 'https://uploads-ssl.webflow.com/649ee19d64485accdbd684b9/6503978cc284645ab4f956d3_meat.svg';
                                    break;

                                default:
                                    // Handle the case when none of the conditions match
                                    break;
                            }
            
                            const pairedFoodItem = document.createElement('div');
                            pairedFoodItem.classList.add('food-pairing-item');
            
                            const pairedFoodImage = document.createElement('div');
                            pairedFoodImage.classList.add('pairedfoodimage');
                            pairedFoodImage.style.backgroundImage = `url('${pairedImageIcon}')`;
            
                            const pairedFoodName = document.createElement('div');
                            pairedFoodName.classList.add('pairedFoodName');
                            pairedFoodName.textContent = foodItem;
            
                            pairedFoodItem.appendChild(pairedFoodImage);
                            pairedFoodItem.appendChild(pairedFoodName);
            
                            pairingRow.appendChild(pairedFoodItem);
                        });
            
                        // Append the priority and paired foods to the wrapper
                        foodPairingWrapper.appendChild(pairingRow);
                    }
                }
            }
            
            
            
            
            function showContainers() {
                const cardContainers = document.querySelectorAll('.sr-p-grid');
            
                cardContainers.forEach((container) => {
                    container.classList.remove('hide');
                    
                });
            }
            
            
           
            



        updateBasicDetails();
        // Update disorders
        updateDisorders(data.disorder_data);
            
        //Update food Pairing 
        updateFoodPairing(data.food_pairing);
        //update health tags
        processHealthTags(data.food_tags);
        
        // Update prep tags
        processPreparationTags(data.preparation_tags);
        
        
        //Update meal time 
        updateFoodTime('breakfast', 'bf');
        updateFoodTime('lunch', 'lunch');
        updateFoodTime('dinner', 'dinner');
        updateFoodTime('snack', 'snack');
        

        //Update Nutrition table. You can change the rda values here 
        updateNutriTableValues('FAT', 'fat', 55)
        updateNutriTableValues('FASAT', 'fasat', 20)
        updateNutriTableValues('FATRN', 'fatrn', 1)
        //updateNutriTableValues('FASAT', 'fat', 6)
        //updateNutriTableValues('FASAT', 'fat', 28)
        updateNutriTableValues('CHOLE', 'chole', 300)
        updateNutriTableValues('NA', 'na', 2000)
        //updateNutriTableValues('FASAT', 'fat', 30)


        // Update nutrient values for different nutrient types
        updateNutrientValues('PROCNT', 'protein');
        updateNutrientValues('CHOCDF', 'carbs');
        updateNutrientValues('FAT', 'fat');
        updateNutrientValuesAbs('Glycemic Index Estimate','gi')
            

        showContainers();
            //end

        }
    };

    // Send Restaurant request to API
    request.send();
}



// This fires all of the defined functions when the document is "ready" or loaded
//document.addEventListener("DOMContentLoaded", function() {
    getFoodDetails();
   
//});