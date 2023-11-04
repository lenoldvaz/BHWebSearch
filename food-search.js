var input = document.querySelector('input[name="searchInput"]');
let bhUrl = new URL("https://api.bonhappetee.com/search");
let hasResults = false; // Flag to track whether getFoodSearchResults has run successfully before

let lastAppendedElements = []; // Create an array to keep track of the last appended elements

function clearPrevious() {
    // Iterate through the last appended elements and remove them
    lastAppendedElements.forEach(child => {
        child.remove();
    });

    // Clear the array of last appended elements
    lastAppendedElements = [];
}


// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function getFoodSearchResults() {
   // console.log('getfood');
     // Clear previous results only if getFoodSearchResults has run successfully before

     // Get the search term from the input field
    const searchTerm = input.value;



    // Create a request variable and assign a new XMLHttpRequest object to it.
    let request = new XMLHttpRequest();

    
    // Append the search term as a URL parameter
    const apiUrl = `${bhUrl}?value=${encodeURIComponent(searchTerm)}&limit=10&confidence=.3`;

    // Define the URL from the bhUrl variable
    //let url = bhUrl.toString();

    // Prepare the payload for the POST request
    //let payload = {
      //  "searchTerm": input.value,
       // "origin": window.location.href // Use the current webpage URL as the origin
    //};

    // Convert the payload to JSON
    //let jsonPayload = JSON.stringify(payload);

    // Open a POST request to the URL
    request.open('GET', apiUrl, true);

    // Set the Content-Type header for JSON data
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader("x-api-key", "06220486a7216a9ead5fa6a9a5f4f82c");


    // When the request loads, do the following...
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);

            if (hasResults) {
                clearPrevious();
               // console.log(hasResults)
            }

            // Map a variable called cardContainer to the Webflow element called "sr-container"
            const cardContainer = document.getElementById("sr-container");

           
            

            // Iterate through the food results
            data.items.forEach(food => {
                const style = document.getElementById('sr-result-bar');
                const card = style.cloneNode(true);
                card.classList.remove('hide')

                card.setAttribute('id', '')
                card.style.display = 'flex';

                // Update card content with food details
                const foodName = card.getElementsByClassName('sr-food-name')[0];
                const servingType = food.serving_type == 'number' ? '1' : food.serving_type
                const servingDetails = food.serving_size ? ` ${servingType}, ${food.calories_calculated_for.toFixed(0)}g` : `${servingType}, ${food.calories_calculated_for.toFixed(0)}g` ;

                foodName.innerHTML = `<span style="font-weight: bold;">${capitalizeFirstLetter(food.food_name)}</span>, ${servingDetails}`;


                const carbs = card.getElementsByClassName('sr-macro carbs')[0];
                carbs.textContent = "Carbs " + food.nutrients.carbs.toFixed(0) + "g";

                const protein = card.getElementsByClassName('sr-macro protein')[0];
                protein.textContent = "Protein " + food.nutrients.protein.toFixed(0) + "g";

                const fats = card.getElementsByClassName('sr-macro fat')[0];
                fats.textContent = "Fat " + food.nutrients.fats.toFixed(0) + "g";

                const calories = card.getElementsByClassName('sr-cal-value')[0];
                calories.textContent = food.nutrients.calories.toFixed(0);

                // Add a click event to the card to navigate to the item page
                card.addEventListener('click', function () {
                   

                // Save a value to local storage
                localStorage.setItem('serving_type', servingType);

                // Retrieve the saved value from local storage
                const servingType = localStorage.getItem('serving_type');
                console.log(servingType); // This will log the retrieved value


                document.location.href = "/food-search/search-results?id=" + food.food_id;
                });

                // Append the card to the card container
                cardContainer.appendChild(card);
            

                	// Add the appended card to the lastAppendedElements array
                lastAppendedElements.push(card);
             });

            // After populating the card container, hide page content
            hidePageContent();

            // Set the flag to true indicating that getFoodSearchResults has run successfully
            hasResults = true;
        }
    };

    // Send the POST request with the JSON payload
    request.send();
}

function hidePageContent() {
    const srpagecontent = document.querySelector('.srpagecontent')
    srpagecontent.classList.add('hide')
}

document.addEventListener("DOMContentLoaded", function () {
   // console.log('event')
    // Find the form element by its ID
    //const searchForm = document.getElementById("searchForm");

    // Add a submit event listener to the form
   searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        //getFoodSearchResults(); // Call your function to handle the form submission
        //console.log('prevented default')

   });

    // You can also find the button element by its ID and add a click event listener
    //const searchButton = document.getElementById("searchfood_button");
    //searchButton.addEventListener("click", function(event) {
    //  event.preventDefault(); // Prevent the default button click behavior
    //  getFoodSearchResults(); // Call your function to handle the button click

    //});

    // Listen for the Enter key press in the input field
    input.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            //console.log('key up')
            event.preventDefault(); // Prevent the default form submission behavior
           // clearPrevious();
            getFoodSearchResults(); // Call your function when Enter is pressed

        }
    });
});
