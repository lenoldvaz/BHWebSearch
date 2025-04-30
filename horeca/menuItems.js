function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const menuItem_id = getUrlParameter('menuItem_id');
console.log("Extracted menuItem_id:", menuItem_id);

let menuItem_url;
let paired_url;

if (menuItem_id) {
    console.log('menuItem_id if statement works');
    // Construct the menu URL with the menuItem_id parameter
    menuItem_url = new URL(`https://node.discovery-kitchen.com/bh/horeca/menu_item?menuItem_id=${menuItem_id}`);
} else {
    console.error('Invalid menuItem_id:', menuItem_id);
    // Display error to user
    document.querySelector(".horeca_menuItemSection").innerHTML = '<p class="error">No menu item specified. Please check your URL.</p>';
}

function getMenuItem() {
    if (!menuItem_url) {
        console.error("Menu item URL is undefined. Cannot fetch menu item.");
        return;
    }

    console.log("Fetching menu item from:", menuItem_url.toString());

    // Show loading state
    const container = document.querySelector(".horeca_menuItemSection");
    if (container) container.innerHTML = '<p>Loading menu item...</p>';

    fetch(menuItem_url.toString(), {
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Menu Item Details:", data);
        displayDetails(data);
    })
    .catch(error => {
        console.error("Error:", error);
        if (container) container.innerHTML = `<p class="error">Error loading menu item: ${error.message}</p>`;
    });
}

function displayDetails(menuItems) {
    // Corrected class name to match your HTML
    const container = document.querySelector(".horeca_menuitemsection");

    if (!container) {
        console.error("Container '.horeca_menuItemSection' not found in the DOM.");
        return;
    }

    // Verify we have menu items
    if (!menuItems || !menuItems.length) {
        console.error("No menu items received");
        container.innerHTML = '<p class="error">No menu item data found</p>';
        return;
    }

    // Get the first menu item
    const menuItem = menuItems[0];
    console.log("Displaying menu item:", menuItem);

    // Get all the elements
    const itemName = document.querySelector(".mi-item_name");
    const itemDescription = document.querySelector(".mi-item_lines .description");
    const itemNutri = document.querySelector(".mi-item_lines.nutri");
    const itemServes = document.querySelector(".mi-item_lines.serving");
    const itemAllergens = document.querySelector(".horeca_menuitem-details.allergens");
    const itemIngredients = document.querySelector(".horeca_menuitem-details.ingredients");
    const cuisine = document.querySelector(".horeca_menuitem-details.cuisine");
    const vegNonVegIcon = document.querySelector(".horeca_vnvIcon-container");

    // Populate the data with null checks
    if (itemName) itemName.textContent = menuItem["Food Item Name"] || "Not Available";
    
    if (itemDescription) {
        itemDescription.textContent = menuItem.Description || "No description available";
    }

    if (itemNutri) {
        itemNutri.innerHTML = `
            <b>${menuItem["Per Serve Size"] || 'N/A'}</b>${menuItem["Unit of measures"] || ''} 
            | serves <b>${menuItem["no of servings"] || 'N/A'}</b> 
            | <b>${menuItem["Energy _kcal"] || 'N/A'}</b> calories per serving
        `;
    }

    if (itemServes) {
        itemServes.innerHTML = `
            <b>${menuItem["carbohydrate"] || '0'}g</b> Carbs | 
            <b>${menuItem["protein"] || '0'}g</b> Protein | 
            <b>${menuItem["Fats"] || '0'}g</b> Fats | 
            <b>${menuItem["Fiber_total dietary"] || '0'}g</b> Fibre
        `; 
    }
    
    if (itemAllergens) {
        itemAllergens.textContent = menuItem.Allergens ? 
            menuItem.Allergens.split(',').map(a => a.trim()).join(', ') : 
            "No allergens specified";
    }

    if (itemIngredients) {
        itemIngredients.textContent = menuItem["Main Ingredients"] || "Ingredients not specified";
    }

    if (cuisine) {
        cuisine.textContent = menuItem.Cuisine || "No Cuisine Specified";
    }

    if (vegNonVegIcon) {
        vegNonVegIcon.innerHTML = menuItem.Dietary_Preference === "veg" ?
            '<div class="veg-icon">VEG</div>' :
            '<div class="nonveg-icon">NON-VEG</div>';
    }

    // Call getPaired with the menuItem data
    if (menuItem.Pairing_regular) {
        console.log("Pairing found")
        getPaired(menuItem);
    }
}

function getPaired(menuItem) {
    if (!menuItem["Pairing_regular"]) {
        console.log("No pairing information available");
        return;
    }

    paired_url = new URL(`https://node.discovery-kitchen.com/bh/horeca/pairing?paired_foods=${encodeURIComponent(menuItem["Pairing_regular"])}`);

    console.log("Fetching paired items from:", paired_url.toString());

    fetch(paired_url.toString(), {
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Paired Items:", data);
        // Call function to display paired items
         displayPaired(data);
    })
    .catch(error => {
        console.error("Error fetching paired items:", error);
    });
}

function displayPaired(pairings){
    const pairedContainer = document.querySelector(".horeca_menuitem-frepaired");

    if (!pairedContainer) {
        console.error("Paired items container not found");
        return;
    }

     // Clear previous content
     pairedContainer.innerHTML = '';

     // Check if we have pairings data
    if (!pairings || !pairings.length) {
        pairedContainer.innerHTML = '<p class="no-pairings">No pairing suggestions available</p>';
        return;
    }


    pairings.forEach(element => {
        
        let pairingItem = document.createElement("div");
        pairingItem.classList.add("horeca_menuitem-frepaired-container")



        pairingItem.innerHTML = `
        <p class = "horeca_frepaired-name">${element["Food Item Name"] || "Pairing Item"}</p>
        <p class = "horeca_frepaired-cals">${element["Energy _kcal"]} calories per serving</p>
        <div class = "horeca_frepaired-pricebox">
            <div class = "horeca_frepaired-price">${element.Price_INR}</div>
            <div class="horeca_frepaired-addbtn">Add</div>

        </div>
        
        
        
        `

        // Append to the parent container
        pairedContainer.appendChild(pairingItem);
    
    });


}

// Call getMenuItem when DOM is ready
document.addEventListener('DOMContentLoaded', getMenuItem);