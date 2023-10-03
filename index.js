import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-af098-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", () => submitForm())

function submitForm() {
    let inputValue = inputFieldEl.value.trim();
    let sanitizedValue = inputValue.replace(/[^a-z0-9]/gi, '').toLowerCase();

    if (sanitizedValue !== "") {
        const itemRef = ref(database, `shoppingList/${sanitizedValue}`);
        onValue(itemRef, (snapshot) => {
            if (!snapshot.exists()) {
                set(itemRef, true)
                clearInputFieldEl()
            }
        })
    }
}

onValue(shoppingListInDB, (snapshot) => {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearShoppingListEl();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "<li>No items here... yet</li>";
    }
});

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemValue = item[0]

    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    newEl.addEventListener("dblclick", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemValue}`)
        remove(exactLocationOfItemInDB)
    });
    shoppingListEl.append(newEl)
}