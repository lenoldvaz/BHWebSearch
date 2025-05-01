function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


// Function to convert string to Title Case
// This function converts the first letter of each word to uppercase and the rest to lowercase
function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}




// Function to convert string to camelCase
// This function removes special characters and converts the string to camelCase
function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '') // remove special characters
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '');
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
                renderFilterCheckboxes(data, "Dietary Preference", ".accordion-item.is-dietpref", ".filter-form.is-dietpref");
                renderFilterCheckboxes(data, "Cuisine", ".accordion-item.is-cuisine", ".filter-form.is-cuisine");
                renderFilterCheckboxes(data, "Texture", ".accordion-item.is-texture", ".filter-form.is-texture");

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
    const container = document.querySelector(".accordion-wrapper");


    if (!container) {
        console.error("Container '.accordion-item-content' not found in the DOM.");
        return;
    }



    // Group items by Menu_Category
    const groupedByCategory = {};
    menuItems.forEach(item => {
        const category = item["Menu_Category"] || "Uncategorized";
        if (!groupedByCategory[category]) {
            groupedByCategory[category] = [];
        }
        groupedByCategory[category].push(item);
    });

    // Clear container first
container.innerHTML = '';

// Loop through categories
for (const category in groupedByCategory) {
    const categoryItems = groupedByCategory[category];

    // Create Accordion item
    const accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");

    const accordionTrigger = document.createElement("div");
    accordionTrigger.classList.add("accordion-item-trigger");
    accordionTrigger.setAttribute("id", `q_${category.toLowerCase().replace(/\s+/g, "_")}`);
    accordionTrigger.innerHTML = `<h4 class="accordion-heading">${toTitleCase(category)}</h4>`;
   
    // Icon (use Material Symbols or similar)
    const icon = document.createElement("div");
    icon.classList.add("icon", "accordion-icon");
    icon.innerText = "keyboard_arrow_down";

    accordionTrigger.appendChild(icon);
    accordionItem.appendChild(accordionTrigger);
    

    // Create trigger for accordion
    

    // Content container
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("accordion-item-content");

    // Collapse all by default
    contentDiv.style.display = "none";

    // Expand the first category only
    if (Object.keys(groupedByCategory).indexOf(category) === 0) {
        contentDiv.style.display = "block";
    }

    // Now render items within this category
    categoryItems.forEach(item => {
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("horeca_menuitem-pricontainer");

        const itemLink = document.createElement("a");
        itemLink.href = `/horeca/menu-item?menuItem_id=${item.food_item_id}`;
        itemLink.classList.add("mi_link");
        itemLink.style.textDecoration = "none";
        itemLink.style.color = "inherit";

        const vnvIconDiv = document.createElement("div");
        vnvIconDiv.classList.add("horeca_vnvIcon-container");
        vnvIconDiv.innerHTML = item.isVegetarian
            ? '<div class="veg-icon">V</div>'
            : '<div class="nonveg-icon">NV</div>';

        const rightDiv = document.createElement("div");
        rightDiv.classList.add("mi-item_rightcontent");

        const priceDiv = document.createElement("div");
        priceDiv.classList.add("mi-item_price");
        priceDiv.innerHTML = `<p class="mi-item_price">${item.Price_INR}</p>`;

        const heartButton = document.createElement("img");
        heartButton.src = "https://cdn.prod.website-files.com/649ee19d64485accdbd684b9/68129bbbbb048ab4988db107_Frame%201000005834.png";
        heartButton.alt = "Heart Icon";
        heartButton.classList.add("mi-item_heartIcon");

        rightDiv.appendChild(priceDiv);
        rightDiv.appendChild(heartButton);

        const mainContentDiv = document.createElement("div");
        mainContentDiv.classList.add("mi-item_mainContent");
        mainContentDiv.innerHTML = `
            <h4 class="mi-item_name">${item["Food Item Name"] || 'Unnamed Item'}</h4>
            ${item.Description ? `<p class="mi-item_lines">${item.Description}</p>` : ''}
            <p class="mi-item_lines"><b>${item["Per Serve Size"]} </b>${item["Unit of measures"]} | serves <b>${item["no of servings"]}</b> | <b>${item["Energy _kcal"]}</b> calories per serving</p>
            <p class="mi-item_lines"><b>${item["carbohydrate"]}g</b> Carbs | <b>${item["protein"]}g</b> Protein | <b>${item["Fats"]}g</b> Fats | <b>${item["Fiber_total dietary"]}g</b> Fibre</p>
        `;

        // Primary Health Tags
        const healthTagsContainer = document.createElement("div");
        healthTagsContainer.classList.add("mi-item_prihealthtagcontainer");
        if (item["Primary Health Tag"]) {
            const tags = item["Primary Health Tag"].split(";");
            tags.forEach(tag => {
                const tagDiv = document.createElement("div");
                tagDiv.classList.add("mi-item_prihealthtag");
                const tagText = document.createElement("span");
                tagText.classList.add("mi-item_healthtagtext");
                tagText.textContent = tag.trim();
                tagDiv.appendChild(tagText);
                healthTagsContainer.appendChild(tagDiv);
            });
        }
        mainContentDiv.appendChild(healthTagsContainer);

        // Assemble item card
        itemDiv.appendChild(vnvIconDiv);
        itemDiv.appendChild(mainContentDiv);
        itemDiv.appendChild(itemLink);
        itemDiv.appendChild(rightDiv);

        contentDiv.appendChild(itemDiv);
    });

    // Add content to accordion item
    accordionItem.appendChild(contentDiv);

    // Append category to page
    container.appendChild(accordionItem);
}


// Enable toggling for all accordion triggers
document.querySelectorAll(".accordion-item-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector(".accordion-icon");
        const isOpen = content.style.display === "block";

        content.style.display = isOpen ? "none" : "block";
        icon.innerText = isOpen ? "keyboard_arrow_down" : "keyboard_arrow_up";
    });
});



    // menuItems.forEach(item => {
    //     // Create main container
    //     let itemDiv = document.createElement("div");
    //     itemDiv.classList.add("horeca_menuitem-pricontainer");

    //     // Create clickable link wrapper
    //         const itemLink = document.createElement("a");
    //         itemLink.href = `/horeca/menu-item?menuItem_id=${item.food_item_id}`; // Changed to match your URL pattern
    //         itemLink.classList.add("mi_link");
    //         itemLink.style.textDecoration = "none"; // Remove underline
    //         itemLink.style.color = "inherit"; // Inherit text color

    //     // Create Veg/Non-veg icon container 
    //     const vnvIconDiv = document.createElement("div");
    //     vnvIconDiv.classList.add("horeca_vnvIcon-container");


        
        
    //     // Add appropriate icon based on item type (you'll need to adjust this based on your data)
    //     if (item.isVegetarian) {  // Assuming you have this property
    //         vnvIconDiv.innerHTML = '<div class="veg-icon">V</div>';
    //     } else {
    //         vnvIconDiv.innerHTML = '<div class="nonveg-icon">NV</div>';
    //     }

    //     //Create right container
    //     const rightDiv = document.createElement("div");
    //     rightDiv.classList.add("mi-item_rightcontent");


    //     //Create price container 
    //     const priceDiv = document.createElement("div");
    //     priceDiv.classList.add("mi-item_price");
    //     priceDiv.innerHTML = `<p class="mi-item_price">${item.Price_INR}</p>`;

    //     //Create heart button
    //     const heartButton = document.createElement("img");
    //     heartButton.src = "https://cdn.prod.website-files.com/649ee19d64485accdbd684b9/68129bbbbb048ab4988db107_Frame%201000005834.png";
    //     heartButton.alt = "Heart Icon";
    //     heartButton.classList.add("mi-item_heartIcon");

    //     rightDiv.appendChild(priceDiv);
    //     rightDiv.appendChild(heartButton);

    //     // Create main content container
    //     const mainContentDiv = document.createElement("div");
    //     mainContentDiv.classList.add("mi-item_mainContent");
        
    //     // Add the menu item details
    //     mainContentDiv.innerHTML = `
    //         <h4 class="mi-item_name">${item["Food Item Name"] || 'Unnamed Item'}</h4>
    //         ${item.Description ? `<p class="mi-item_lines">${item.Description}</p>` : ''}
    //         <p class = "mi-item_lines"><b>${item["Per Serve Size"]} </b>${item["Unit of measures"]} | serves <b>${item["no of servings"]}</b> | <b>${item["Energy _kcal"]} </b>calories per serving</p>
    //         <p class = "mi-item_lines"><b>${item["carbohydrate"]}g </b> Carbs | <b>${item["protein"]}g</b> Protein | <b>${item["Fats"]}g</b> Fats | <b>${item["Fiber_total dietary"]}g</b> Fibre</p>
    //         ${item.Price ? `<p class="mi-item_price">${item.Price} BHD</p>` : ''}
    //     `;

    //     // Create container for Primary Health Tags
    //     const healthTagsContainer = document.createElement("div");
    //     healthTagsContainer.classList.add("mi-item_prihealthtagcontainer");

    //     // Split and create individual tags
    //     if (item["Primary Health Tag"]) {
    //         const tags = item["Primary Health Tag"].split(";");
    //         tags.forEach(tag => {
    //             const tagDiv = document.createElement("div");
    //             tagDiv.classList.add("mi-item_prihealthtag");

                
    //             const tagText = document.createElement("span");
    //             tagText.classList.add("mi-item_healthtagtext");
    //             tagText.textContent = tag.trim();
                

    //            tagDiv.appendChild(tagText);
    //             healthTagsContainer.appendChild(tagDiv);
    //         });
    //     }

    //     // Append the health tags below main content
    //     mainContentDiv.appendChild(healthTagsContainer);


    //     // Append the inner divs to the main container
    //     itemDiv.appendChild(vnvIconDiv);
    //     itemDiv.appendChild(mainContentDiv);
    //     itemDiv.appendChild(itemLink);
    //     itemDiv.appendChild(rightDiv);

    //     // Append to the parent container
    //     container.appendChild(itemDiv);
    // });

    console.log("Menu items added to the page.");
}



function renderFilterCheckboxes(menuItems, key, wrapperSelector, formSelector) {
    const container = document.querySelector(wrapperSelector);
    const filterForm = document.querySelector(formSelector);

    if (!container || !filterForm) {
        console.error(`Container or form not found for key: ${key}`);
        return;
    }

    const valueSet = new Set();

    menuItems.forEach(item => {
        const rawValue = item[key];
        if (rawValue) {
            rawValue
                .split(/[,;]+/) // split on comma or semicolon
                .map(val => val.trim())
                .filter(val => val.length > 0)
                .forEach(val => valueSet.add(val));
        }
    });

    const values = Array.from(valueSet).sort();
    filterForm.innerHTML = '';

    values.forEach(val => {
        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.classList.add("filter-checkboxcontainer");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = val;
        checkbox.name = `${key.toLowerCase().replace(/\s+/g, "-")}-filter`;
        checkbox.classList.add("filter-checkbox");

        const checkboxLabel = document.createElement("label");
        checkboxLabel.classList.add("filter-checkbox_label");
        checkboxLabel.textContent = val;

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(checkboxLabel);
        filterForm.appendChild(checkboxWrapper);
    });

    console.log(`${key} filters rendered:`, values);
}

// Call getMenu to fetch and display items
getMenu();
