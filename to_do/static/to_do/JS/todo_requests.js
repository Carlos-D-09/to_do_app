//This file contains all the request for a to-do

//Request to create a todo
export function create(todo){
    return new Promise((resolve, reject) => {
        let url = "/create";
        $.post(url,todo,function(data){
            resolve(data);
        }).fail(function (error) { 
            reject(error);
         });
    });
}

//Request to update a todo
export function update(todo){
    return new Promise((resolve,reject) => {
        let url = "/" + todo.id +"/update";
        $.post(url,todo,function(data){
            if (data['success'] == false){
                reject(data['error']);
            }else if(data['success'] == true){
                resolve(data);
            }
        }).fail(function (error){
            reject(error);
        });
    })
}

//Request to update the tags important and completed 
export function updateTags(tags, todo_id){
    return new Promise((resolve,reject) =>{
        let url = "/"+ todo_id +"/update/tags";
        $.post(url,tags, function(data){
            resolve(data);
        }).fail(function (error) {
            reject(error);
        });
    });
}

//Request to get a specific to-do 
export function getTodo(id){
    return new Promise((resolve,reject) => {
        let url = '/activity/' + id;
        $.get(url,function(data){
            resolve(data);
        }).fail(function(error){
            reject(error);
        });
    });
}