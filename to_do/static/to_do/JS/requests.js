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
        const url = "/activities/category?category_id=${category}";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}