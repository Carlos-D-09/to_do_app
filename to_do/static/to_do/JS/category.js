import { createCategory } from "./requests.js";

//Listener to display floating category form
export function category_add_click(){
    let category_link = document.getElementById('add-category');
    category_link.addEventListener('click', ()=>{
        let category_form = document.getElementById('floating-category-form');
        if (category_form.classList.contains('active') == false){
            category_form.classList.remove('hide');
            category_form.classList.add('active');
        }  
    });
}

//Listener to detect when the user cancel the category creation
export function category_cancel_click(){
    let category_cancel = document.getElementById('cancel-category');
    let category_form = document.getElementById('floating-category-form');
    category_cancel.addEventListener('click', ()=>{
        category_form.classList.remove('active');
        category_form.classList.add('hide');
    });
}

export function saveCategory(){
    document.getElementById('save-category').addEventListener('click', function(){
        // Get values from the form
        let title = document.getElementById('category-form-title').value;
        let desc = document.getElementById('category-form-description').value;

        //Validate values
        if(title == '' || desc == ''){
            alert('All inputs are required');
            return false;
        }
        
        //Request parameters
        let inputs = {
            title: title,
            desc: desc
        }

        //Request to create category
        createCategory(inputs).then(data => {
            if(data['success'] == true){
                //Delete form and confirm operation to the user
                alert('Category added succesfully');
                
                //Update filters
                addFilter(data['category']);
                addCategorySelectForm(data['category']);
                let category_form = document.getElementById('floating-category-form');
                category_form.classList.remove('active');
                category_form.classList.add('hide');

            }else{
                //Alert to the user that something went wrong
                alert(data['error']);
            }
        }).catch(error => console.log(error));

    });
}

function addFilter(category){
    if (category == null){
        alert('Your categorie is saved, but something went wrong trying to update the view, please reload the page to see it');
    }else{
        let filter = buildFilterElement(category);
        document.getElementById('custome-filters').append(filter);
    }
}

function buildFilterElement(category){
    let label = document.createElement('label');
    label.className = 'custome-checkmark';
    label.setAttribute('id',`label-category${category.id}}`);
    label.textContent = category.name;
    
    let input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'filter');
    input.setAttribute('id', `category${category.id}`);
    input.setAttribute('value',category.id);

    let span = document.createElement('span');
    span.className = "checkmark"; 
    
    label.append(input, span);

    return label;
}

function addCategorySelectForm(category){
    if(category == null){
        alert('Your categorie is saved, but something went wrong trying to update the view, please reload the page to see it');
    }else{
        let categories = document.getElementById('categories-dropdown');
        let newCategory = document.createElement('li');
        
        let categoryInput = document.createElement('input');
        categoryInput.setAttribute('type', 'radio');
        categoryInput.setAttribute('name','category');
        categoryInput.setAttribute('id',`category-${category.id}`);
        categoryInput.setAttribute('value',`category${category.id}`);
        
        let categoryLabel = document.createElement('label');
        categoryLabel.setAttribute('for',`category-${category.id}`);
        categoryLabel.setAttribute('id',`label-category-${category.id}`);
        categoryLabel.textContent = category.name;

        newCategory.append(categoryInput, categoryLabel);

        categories.append(newCategory);
    }
}