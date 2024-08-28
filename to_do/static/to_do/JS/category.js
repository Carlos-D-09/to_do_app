import { refreshFilterContent, refreshFilterElement } from "./filters.js";
import { createCategory, deleteCategory, getCategory, updateCategory } from "./requests.js";
import { addFilter, addCategorySelectForm, hideCategoryForm, refreshDescription, updateCategorySelectForm, deleteFloatingDialog, clearCategoryForm } from "./utils.js"
import { selectFirstFilter } from './filters.js'

//Listener to display floating category form
export function categoryAddClick(){
    let category_link = document.getElementById('add-category');
    category_link.addEventListener('click', ()=>{
        let category_form = document.getElementById('floating-category-form');
        if (category_form.classList.contains('active') == false){
            category_form.classList.remove('hide');
            category_form.classList.add('active');
        }  
    });

    let category_movil = document.getElementById('movil-add-category');
    category_movil.addEventListener('click', ()=>{
        let category_form = document.getElementById('floating-category-form');
        if (category_form.classList.contains('active') == false){
            category_form.classList.remove('hide');
            category_form.classList.add('active');
        }  
    });
}

//Listener to detect when the user cancel the category creation
export function categoryCancelClick(){
    let category_cancel = document.getElementById('cancel-category');
    category_cancel.addEventListener('click', ()=>{
        hideCategoryForm();
    });
}

export function saveCategory(){
    let category_form = document.getElementById('category-form-buttons');
    category_form.addEventListener('click', (event)=>{
        if(event.target.matches('#save-category')){
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
                    clearCategoryForm();

                }else{
                    //Alert to the user that something went wrong
                    alert(data['error']);
                }
            }).catch(error => console.log(error));
        }
    });
}

export function showUpdateFormCategory(category_id){
    let category_form = document.getElementById('floating-category-form');
    let button_edit = document.getElementById('edit-category');
    let button_save = document.getElementById('save-category');
    getCategory(category_id).then(data => {
        if(data['success'] == true){
            const category = data['category'];
            
            let titleInput = document.getElementById('category-form-title');
            let descriptionInput = document.getElementById('category-form-description');
            titleInput.value = category.name;
            descriptionInput.value = category.description;

            button_save.style.display = 'none';
            button_edit.setAttribute('value',category_id);
            button_edit.style.display = 'flex';
            
            if (category_form.classList.contains('hide') || !category_form.classList.contains('active')){
                category_form.classList.remove('hide');
                category_form.classList.add('active');
            }
        }
    }).catch(error => console.log(error));
}

export function editCategoryClick(){
    let editButton = document.getElementById('edit-category');
    editButton.addEventListener('click',function(){
        let category_id = editButton.value;
        // Get values from the form
        let title = document.getElementById('category-form-title').value;
        let desc = document.getElementById('category-form-description').value;

        let category = {
            name: title,
            description: desc
        }

        updateCategory(category_id, category).then(data=>{
            if(data['success']){
                alert('To-do updated succesfully');
                hideCategoryForm();
                refreshDescription(title, desc);
                refreshFilterElement(category_id, title);
                refreshFilterContent();
                updateCategorySelectForm(category_id, title);
            }else{
                alert(data['error']);
            }
        });
    });
}

export function showAlertDeleteCategory(category_id){
    getCategory(category_id).then(data=>{
        if(data['success'] == true){
            let dialog = buildAlertDelete(data['category']);
            document.body.append(dialog);
        }
    }).catch(error=>console.error(error))
}

function buildAlertDelete(category){
    let dialog = document.createElement('dialog');
    dialog.className = 'floating-dialog active';
    dialog.setAttribute('id','floating-dialog');
    dialog.setAttribute('open','');
    
    let msgDiv = document.createElement('div');
    msgDiv.className = 'floating-dialog-message';

    let buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'floating-dialog-buttons';
    
    let message = document.createElement('p');
    let question = document.createElement('b');
    question.textContent = 'Are your sure you want to continue?';
    message.textContent = `You are going to delete the next category: ${category.name}, This transaction is irreversible. `;
    message.append(document.createElement('br'), document.createElement('br'), question);

    msgDiv.append(message);
    
    let confirmButton = document.createElement('button');
    confirmButton.className = 'button-layout success';
    confirmButton.textContent = 'Confirm';
    confirmButton.setAttribute('onclick',`removeCategory(${category.id})`);

    let cancelButton = document.createElement('button');
    cancelButton.className = 'button-layout danger';
    cancelButton.textContent = 'Cancel';
    cancelButton.setAttribute('onclick','deleteFloatingDialog()');
    
    buttonsDiv.append(confirmButton,cancelButton);
    
    dialog.append(msgDiv, buttonsDiv);
    
    return dialog;
}

export function removeCategory(category_id){
    deleteCategory(category_id).then(data=>{
        if(data['success'] == true){
            deleteFloatingDialog();
            alert('The category was deleted succesfully');
            selectFirstFilter();
            document.getElementById(`label-category${category_id}`).remove();
            document.getElementById(`li-category-${category_id}`).remove();

        }else{
            alert(data['error']);
        }
    }).catch(error=>console.error(error));
} 