//Request all to-do
export async function allTodo(){
    try {
        const url = "/activities";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Request all to-do planned
export async function planned(){
    try {
        const url = "/activities/planned";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Request the to-do with today and undefined date
export async function today(){
    try {
        const url = "/activities/today";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Requeste the important to-do
export async function important(){
    try {
        const url = "/activities/importants";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Request the completed to-do
export async function completed(){
    try {
        const url = "/activities/completed";
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Request the to-do with the current category selected
export async function filter(category){
    try {
        const url = `/activities/category?category_id=${category}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Get specific category
export async function getCategory(category_id){
    try {
        const url = `/category/${category_id}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Get all the categories 
export function getCategories(){
    return new Promise((resolve, reject) => {
        let url = "/category";
        $.get(url, function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
        });
    });
}

//Create a category
export async function createCategory(inputs){
    try {
        const url = `/category/create`;
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Delete a category
export function deleteCategory(category_id){
    return new Promise((resolve, reject) => {
        let url = "/category/" + category_id + "/delete";
        $.post(url,function(data){
            resolve(data);
        }).fail(function(error){ 
            reject(error);
        });
    });
}

//Update a category
export function updateCategory(category){
    return new Promise((resolve, reject) => {
        let url = "/category/" + category['id'] + "/update";
        $.post(url, category, function(data){
            resolve(data);
        }).fail(function(error){
            reject(error);
        });
    });
}

//Create a todo
export async function createTodo(todo){
    try {
        const url = "/create";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Get a specific to-do 
export async function getTodo(id){
    try{
        const url = '/activity/' + id;
        const response = await fetch(url);
        
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${respone.status}`)
        }

        return await response.json();
    }catch(error){
        throw new Error(error.message);
    }
}

//Update a todo
export async function updateTodo(todo){
    try {
        const url = `/${todo.id}/update`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Update the tags important and completed 
export async function updateTags(tags, todo_id){
    try {
        const url = `/${todo_id}/update/tags`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tags)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

//Delete todo
export async function deleteTodo(todo_id){
    try {
        const url = `/${todo_id}/delete`;
        const response = await fetch(url, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}