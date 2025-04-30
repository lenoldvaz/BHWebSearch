// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//function to check for empty objects
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// Define a function to get the value of a URL parameter by its name
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the 'id' parameter value from the current page URL
const foodId = getUrlParameter('id');
console.log(foodId)
let food_disorder_url; // Declare the food_url variable in the outer scope


// Check if 'foodId' is a valid integer
if (foodId) {
    console.log('foodId if statement works')
    // Construct the food_url with the extracted 'id' value
    //food_url = new URL(`https://node.lenoldvaz.com/bh/search-food?id=${foodId}`);
    food_url = new URL(`https://qiouzfzdc1.execute-api.ap-south-1.amazonaws.com/bh/food/disorder?food_item_id=${foodId}`); //URL(`https://bh.bonhappetee.com/food?food_item_id=${foodId}`);//
    
    // The rest of your code to make the API request and process the response
    // ...
} else {
    // Handle the case where 'foodId' is not a valid integer
    console.error('Invalid foodId:', foodId);
}


function getFoodDetails() {
    // Create a request variable and assign a new XMLHttpRequest object to it 
    let request = new XMLHttpRequest();

    // Define the url 
    let url = food_disorder_url.toString();

    // Open a request
    request.open('GET', url, true);

    // Set the Content-Type header for JSON data
    request.setRequestHeader("Accept", "application/json");
  //  request.setRequestHeader("x-api-key", "9J2igc2Ta327zufqESYkA4lf0mkUyvtX57zTglFW");

    // When the 'request' or API request loads, do the following...
    request.onload = function() {
        // Store what we get back from the Xano API as a variable called 'data' and convert it to a JavaScript object
        let data = JSON.parse(this.response);

        // Status 200 = Success. Status 400 = Problem. This says if it's successful and no problems, then execute 
        if (request.status >= 200 && request.status < 400) {


        function updateDisorders(disorders) {
            const disorderTable = document.querySelector('.card.disorders');
            // console.log('disorderTable', disorderTable);
            const disorderDivTitle = document.querySelector('.disorder-div-title')
            // console.log(disorderTable)
            // console.log("disorders",disorders)

            if (!disorders || disorders.length === 0 ) {
                disorderTable.classList.add('Hide');
                disorderDivTitle.classList.add('Hide');
                return; // Exit the function early if there are no disorders
            } 
            disorderDivTitle.classList.remove('Hide');
            disorderTable.classList.remove('Hide');
            disorderDivTitle.textContent = 'Health Tags for ' + capitalizeFirstLetter(data.common_names);
            
            //Clear existing rows
            while (disorderTable.firstChild) {
                disorderTable.removeChild(disorderTable.firstChild);
            }

            for (const disorder of disorders) {
            // Create a new row for each disorder
            const disorderRow = document.createElement('div');
            disorderRow.classList.add('table_content_row','is_disorders');

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
            disRiskReason.textContent = "Disorder Risk Reason"+disorder.disorder_risk_reason;

            //Create alternatives

            let Alts = disorder.food_disorder_alts
                        .map(a => a.food_name.charAt(0).toUpperCase() + a.food_name.slice(1))
                        .join(', ');

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

        updateDisorders(data.disorder_data);

    }

};

// Send Restaurant request to API
request.send();
}

// This fires all of the defined functions when the document is "ready" or loaded
//document.addEventListener("DOMContentLoaded", function() {
    getFoodDetails();