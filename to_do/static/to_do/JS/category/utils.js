//Build and show create or update category form
export function displayCategoryForm(update=false,category){

    let title = $('<h2>').text('Add category');
    let name = '';
    let desc = '';
    let action_button = $('<button>').addClass('button-success').attr('id','save-category').text('Save');
    
    if (update){
        title = $('<h2>').text('Update category');
        name = category.name;
        desc = category.description;
        action_button = $('<button>').addClass('button-info').attr({id:'update-category', value:category.id}).text('Editar');
    }

    let dialog = $('<dialog open>').addClass('floating-category-form show').attr('id','floating-category-form');
    let header = $('<div>').addClass('floating-category-form-header');
    let content = $('<div>').addClass('floating-cateogry-form-content');
    let footer = $('<div>').addClass('floating-category-form-footer');

    //Header
    header.append(title);

    //Content
    let alert = $('<div>').addClass('floating-category-form-content-alert');

    //Content-name
    let name_div = $('<div>').addClass('floating-category-form-content-name');
    let name_label = $('<label>').attr({'for':'name'}).text('Name:')
    let name_input = $('<input>').addClass('input-text').attr({id:'title', type:'text', placeholder: 'Name', value:name});
    name_div.append(name_label, name_input);
    
    //Content-desc
    let desc_div = $('<div>').addClass('floating-category-form-content-desc');
    let desc_label = $('<label>').attr({'for':'desc'}).text('Description:')
    let desc_input = $('<textarea>').addClass('input-text').attr({ rows: '5', cols: '50', placeholder: 'Description', id: 'desc'}).text(desc);
    desc_div.append(desc_label, desc_input);
    
    content.append(alert, name_div, desc_div);

    let cancel_button = $('<button>').addClass('button-danger').attr('id','cancel-category').text('Cancel');
    footer.append(action_button,cancel_button);

    dialog.append(header, content, footer);

    $('body').append(dialog);
}

//Remove the dialog with the category form
export function deleteDialogForm(){
    let dialog = $('#floating-category-form');
    if(dialog.length != 0){
        dialog.removeClass('show').addClass('remove');
        setTimeout(function(){
            dialog.remove();
        }, 1000);
    }
}

//Show alert in the cateogory form, in case it doesn't exist show an alert
export function showCategoryFormAlert(danger, message, remove_dialog=false){
    let alert = $('.floating-category-form-content-alert');
    if (alert.length != 0){
        let text = $('<p>');    
        
        if (danger==true){
            text.addClass('text-danger');
        }else{
            text.addClass('text-success');
        }
        
        text.text(message);
        
        alert.append(text);
        setTimeout(function(){
            if(remove_dialog){
                deleteDialogForm();
            }else{
                alert.empty();
            }
        },3000);
    }else{
        alert(message);
    }

}