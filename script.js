
// User Unit
var userUnit = (function (){

    var dom = {
        input: '.inputField',
        addButton: '.addBtn',
        itemContainer: '.itemContainer',
        item: '.item',
        description: '.itemDescription',
        delete: '.itemDelete'

    };


    return {
        getInput: function () { 
            return {
                input: document.querySelector(dom.input).value
            };

        },  
        getDom: function () {
            return dom;

        },
        displayItem: function (item) {
            var html, newHtml, container;

            // Create a HTML element
            html = '<div class="item clearFix" id="item-%item.id%"><div class="itemDescription left">%item.des%</div><div class="itemDelete right">x</div> </div>'; 

            // Replace strings with actual values.
            newHtml = html.replace('%item.id%', item.id);
            newHtml = newHtml.replace('%item.des%', item.des);

            container = document.querySelector(dom.itemContainer);
            
            // Insert the element 
            container.insertAdjacentHTML('beforeend', newHtml);

        },

        clearField: function () {
            var field = document.querySelector(dom.input);
            field.value = '';
            field.focus();   
        },

        removeItem: function (itemIdIn) {
            var element;
            element = document.getElementById(itemIdIn);

            // Remove the element
            element.parentNode.removeChild(element);
        }

    };

})();



// Data Unit
var dataUnit = (function (){

    var Item = function (id, des) {
        this.id = id;
        this.des = des;
    };

    var data = {
        id: 0,
        items: []
    };

    return {
        addItem: function (inp) {
            var id, item;

            // Increment the id
            id = data.id++;
            item = new Item(id, inp);
            data.items.push(item);
            return item;       

        },
        
        deleteData: function (idIn) {
            var ids = [], idIndex;
           for (var i =0; i < data.items.length; i++) {
               ids.push(data.items[i].id);  // The id here are individual properties of data.items 
           }
           idIndex = ids.indexOf(idIn);

           // Delete
           data.items.splice(idIndex, 1);
        },
        
        // This function is for testing purpose in the console. Its existence does not
        // have any effect on the project functionality. It can be removed
        getData: function (){
            return {
                id: data.id,
                items: data.items

            };
        }

    };

})();


// Control Unit
var mainUnit = (function (usUnit, dtUnit){

    // set up event listener
    var events = function () {
        
        var mainDom = usUnit.getDom();

        // Event listener on the add button
        document.querySelector(mainDom.addButton).addEventListener('click', process);

        // Event for the return key (Keycode 13)
        document.addEventListener('keypress', function (event) {
            if(event.keyCode ==13 ) {
                process();
            }
        });

        // Event listener on the delete button
        document.querySelector(mainDom.itemContainer).addEventListener('click', deleteItem);

    };

   
    var process = function (){
        var input, addItem, displayItem;
        input = usUnit.getInput();

        if (input.input !== '' && input.input.length < 30) { 
            // Add item to data unit
             addItem = dtUnit.addItem(input.input);
             // display the item to the user interface
             displayItem = usUnit.displayItem(addItem);
             // Clear the field and regain focus
             usUnit.clearField();
        }      
    };

    var deleteItem = function () {
        var itemId, idArray, id;

        itemId = event.target.parentNode.id;
        idArray = itemId.split('-');
        id = parseInt(idArray[1]);

        // Delete from Data unit
        dtUnit.deleteData(id);  // Id here is the one declared at the beginning of this method

        // Delete from User interface
        usUnit.removeItem(itemId);  // itemId here is the one declared at the beginning of this method
    };


    return {
        start: function () {
            console.log('Application has started');
            events();


        }

    };

})(userUnit, dataUnit);

mainUnit.start();