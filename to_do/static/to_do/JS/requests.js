//Request all to-do
export async function allTodo(){
    try {
        const url = "http://localhost/activities";
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
export function planned(){
    return new Promise((resolve, reject) => {
        let url = "/activities/planned";
        $.get(url, function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
        });
    });
}

//Request the to-do with today and undefined date
export function today(){
    return new Promise((resolve, reject) => {
        let url = "/activities/today";
        $.get(url, function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
        });
    });
}

//Requeste the important to-do
export function important(){
    return new Promise((resolve, reject) => {
        let url = "/activities/importants";
        $.get(url, function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
        });
    });
}

//Request the completed to-do
export function completed(){
    return new Promise((resolve, reject) => {
        let url = "/activities/completed";
        $.get(url, function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
        });
    });
}

//Request the to-do with the current category selected
export function filter(category){
    return new Promise((resolve, reject) => {
        let url = "/activities/category" ;
        $.get(url, {category_id:category}, function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
        });
    });
}