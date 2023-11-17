//File with the request for the each filter

//Request and show all todo
export function allTodo(){
    return new Promise((resolve, reject) => {
        let url = "/activities";
        $.get(url, function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
        });
    });
}

//Request and show all todo planned
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