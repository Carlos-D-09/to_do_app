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

export function createCategory(){
    //Send request to the server
    $.post(url,inputs, function(data){
        //If the request is success
        if(data['success'] == true){
            //Delete form and confirm operation to the user
            $('#pop-up-form-category').remove();
            $('#success-transaction').append('Category added successfully');
            
            //Update filters
            updateFilter(data['category']);
            updateSelectForm(data['category']);

            //Confirm the operation to the user
            setTimeout(function (){
                $('#success-transaction').empty();
            }, 5000);
        }
        else{
            $('#error-category').append("Something went wrong");
        }
    });
}