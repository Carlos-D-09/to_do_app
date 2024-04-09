//File with the request for the CRUD of category

export function getCategory(category_id){
    return new Promise((resolve, reject) => {
        let url = "/category/" + category_id;
        $.get(url, function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
        });
    });
}

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

export function createCategory(inputs){
    return new Promise((resolve, reject) => {
        let url = "/category/create";
        //Send request to the server
        $.post(url,inputs, function(data){
            resolve(data);
        }).fail(function(error){
            reject(error);
        });

    });
}

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