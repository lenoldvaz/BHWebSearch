function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const restaurant_id = getUrlParameter('restaurant_id');
console.log("Extracted restaurant_id:", restaurant_id);

let menu_url;

if (restaurant_id) {
    console.log('restaurant_id if statement works');
    // Construct the menu URL with the restaurant_id parameter
    menu_url = new URL(`https://node.discovery-kitchen.com/bh/horeca/menu?restaurant_id=${restaurant_id}`);
} else {
    console.error('Invalid restaurant_id:', restaurant_id);
}

// Function to fetch the menu
function getMenu() {
    if (!menu_url) {
        console.error("Menu URL is undefined. Cannot fetch menu.");
        return;
    }

    console.log("Fetching menu from:", menu_url.toString());

    let request = new XMLHttpRequest();
    request.open('GET', menu_url.toString(), true);
    request.setRequestHeader("Accept", "application/json");

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            try {
                let data = JSON.parse(this.response);
                console.log("Menu Data:", data);

                // Call function to display menu items
                displayMenuItems(data);
            } catch (error) {
                console.error("Error parsing JSON response:", error);
            }
        } else {
            console.error("Error fetching menu. Status:", request.status);
        }
    };

    request.onerror = function () {
        console.error("Network error occurred while fetching menu.");
    };

    request.send();
}

// Function to create and append divs for each menu item
function displayMenuItems(menuItems) {
    const container = document.querySelector(".mi_list");

    if (!container) {
        console.error("Container '.accordion-item-content' not found in the DOM.");
        return;
    }

    menuItems.forEach(item => {
        // Create main container
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("horeca_menuitem-pricontainer");

        // Create clickable link wrapper
            const itemLink = document.createElement("a");
            itemLink.href = `/horeca/menu-item?menuItem_id=${item.food_item_id}`; // Changed to match your URL pattern
            itemLink.classList.add("mi_link");
            itemLink.style.textDecoration = "none"; // Remove underline
            itemLink.style.color = "inherit"; // Inherit text color

        // Create Veg/Non-veg icon container 
        const vnvIconDiv = document.createElement("div");
        vnvIconDiv.classList.add("horeca_vnvIcon-container");
        
        // Add appropriate icon based on item type (you'll need to adjust this based on your data)
        if (item.isVegetarian) {  // Assuming you have this property
            vnvIconDiv.innerHTML = '<div class="veg-icon">V</div>';
        } else {
            vnvIconDiv.innerHTML = '<div class="nonveg-icon">NV</div>';
        }

        // Create main content container
        const mainContentDiv = document.createElement("div");
        mainContentDiv.classList.add("mi-item_mainContent");
        
        // Add the menu item details
        mainContentDiv.innerHTML = `
            <h4 class="mi-item_name">${item["Food Item Name"] || 'Unnamed Item'}</h4>
            ${item.Description ? `<p class="mi-item_lines">${item.Description}</p>` : ''}
            <p class = "mi-item_lines"><b>${item["Per Serve Size"]} </b>${item["Unit of measures"]} | serves <b>${item["no of servings"]}</b> | <b>${item["Energy _kcal"]} </b>calories per serving</p>
            <p class = "mi-item_lines"><b>${item["carbohydrate"]}g </b> Carbs | <b>${item["protein"]}g</b> Protein | <b>${item["Fats"]}g</b> Fats | <b>${item["Fiber_total dietary"]}g</b> Fibre</p>
            ${item.Price ? `<p class="mi-item_price">${item.Price} BHD</p>` : ''}
        `;

        // Append the inner divs to the main container
        itemDiv.appendChild(vnvIconDiv);
        itemDiv.appendChild(mainContentDiv);
        itemDiv.appendChild(itemLink);

        // Append to the parent container
        container.appendChild(itemDiv);
    });

    console.log("Menu items added to the page.");
}
// Call getMenu to fetch and display items
getMenu();
