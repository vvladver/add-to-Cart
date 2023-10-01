import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove,set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-71549-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")


/* Create a new item and push it to the firebase */
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    if(inputValue == "" ){
        alert(" Enter a new product ")
    }else{
        push(shoppingListInDB, inputValue)
        
    }
    
    clearInputFieldEl()
}
)


/* Updates a shopping list element in the HTML*/
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet";
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}


/* Create new elements in HTML*/
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    let newEl = document.createElement("li");
    let editIcon = document.createElement("i");
    let deltBtn = document.createElement("i")

    deltBtn.className = "fa-solid fa-xmark close-btn";
    editIcon.className = "fa-solid fa-ellipsis change-btn";

    newEl.textContent = itemValue
    newEl.appendChild(editIcon);
    newEl.appendChild(deltBtn);

    let editMode = false
    
    deltBtn.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })

editIcon.addEventListener("click",function(){

    const previousValue = itemValue
    
   if (!editMode ){
    const inputField = document.createElement("input");
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";

    newEl.appendChild(inputField);
    newEl.appendChild(saveButton);
    editMode = true 



saveButton.addEventListener("click",function(){
    let newValue = inputField.value 
    if(newValue == ""){
        newValue = previousValue
        newEl.removeChild(inputField);
        newEl.removeChild(saveButton);
        editMode = false;
    }else {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        set(exactLocationOfItemInDB,newValue)
    }
})
   }else {
    return ; 
   }
})
    shoppingListEl.append(newEl)
}






//Сделать так,чтобы оно подсчитывало, сколько сделано за сегодня и по истечению дня ресетнулось 

