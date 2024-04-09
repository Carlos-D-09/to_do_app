import {createCategory, deleteCategory, getCategory, updateCategory} from './requests.js';
import { selectFirstFilter, disableEnableFilterList } from '../filter.js';
import { displayCategoryForm, deleteDialogForm, showCategoryFormAlert } from './utils.js'

//This files contains all the functions to manipulate category

//Sart create category functions.....................................................................

    //- showForm(): Show the form to create a category
    //- removeFormCategory(): If the user press the button cancel, delete the form to add or update category
    //- saveCategory(): If the user press the button save in create form, request the server create the category and update the page
    //- addFilter(category): Update the filter list with the new category
    //- buildFilterElement(category): Build a filter element to add on the filter list. 
    //- addCategorySelectForm(category): add ends an option in the create form select

    export function showForm(){
        $('body').on('click', '#add-category', function(){
            if ($('#floating-category-form').length != 0){
                $('#floating-category-form').empty();
            }
            displayCategoryForm();
        });
    }

    export function removeFormCategory(){
        $('body').on('click', '#cancel-category', function(){
            deleteDialogForm();
        });
    }

    export function saveCategory(){
        $('body').on('click', '#save-category', function(){
            // Get values from the form
            let title = $('#title').val();
            let desc = $('#desc').val();

            //Validate values
            if(title == '' || desc == ''){
                showCategoryFormAlert(true, 'All inputs are required');
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
                    showCategoryFormAlert(false, 'Category added succesfully', true);
                    
                    //Update filters
                    addFilter(data['category']);
                    addCategorySelectForm(data['category']);

                }else{
                    //Alert to the user that something went wrong
                    showCategoryFormAlert(true, data['error']);
                }
            }).catch(error => console.log(error));
        });
    }

    function addFilter(category){
        if (category == null){
            alert('Your categorie is saved, but something went wrong trying to update the view, please reload the page to see it');
        }else{
            let filter = buildFilterElement(category);
            $('#custome-filters').append(filter);
        }
    }

    function buildFilterElement(category){
        var label = $('<label class="container">').attr({'id':'label-category'+category.id}).text(category.name);
        var input = $('<input>').attr({
            type: 'radio',
            name: 'radio',
            id: 'category' + category.id,
            value: category.id
        });
        var span = $('<span class="checkmark">');
        label.append(input, span);

        return label;
    }

    function addCategorySelectForm(category){
        if(category == null){
            alert('Your categorie is saved, but something went wrong trying to update the view, please reload the page to see it');
        }else{
            let categories = $('#categories-form');
            categories.append(
                $('<option>').attr({value:category.id}).text(category.name)
            )
        }
    }
//End create category functions............................................................................................

//Start functions to delete a category.....................................................................................

    //- showAlertDeleteCategory(): Show a floating window to confirm delete operation
    //- removeCategory(category): Send delete request and handle response
    //- deleteFloatingDialog(): Remove floating dialog
    //- removeFilter(category_id): Delete a filter from the list
    //- removeCategoryFromCreateForm(category_id): Remove category from the select into the create form 

    export function showAlertDeleteCategory(){
        let category_id = $('.filter-list input[type=radio]:checked').val();
        getCategory(category_id).then(
            data => {
                if (data['success'] == true){
                    let category = data['category'];
                    let dialog = $('<dialog open>').addClass('floating-dialog').attr('id','floating-dialog');
                    let msgDiv = $('<div>');
                    let buttonsDiv = $('<div>').addClass('right-center');
                    
                    
                    let message = $('<p>').append("You are going to delete the category " + category.name + ", this options is irreversible. Your activtities with this category are going to have undefined as category.", 
                                    $('<br>'), $('<br>'), "Are you sure you want to continue?");
                    msgDiv.append(message);
                    
                    let confirmButton = $('<button>').addClass('button-success').text('Confirm').css({'margin':'5px'}).attr({'data-id': category_id, 'onclick':'removeCategory(this)'});
                    let cancelButton = $('<button>').addClass('button-danger').text('Cancel').css({'margin':'5px'}).attr('onclick','deleteFloatingDialog()');
                    buttonsDiv.append(confirmButton,cancelButton);
                    
                    dialog.append(msgDiv, buttonsDiv);
                    $('body').append(dialog);
                }else{
                    alert('You are trying to delete an non-existent category');
                }
            }
        ).catch(
            error => console.error(error)
        )
        
    }

    export function removeCategory(button){
        let categoryId = $(button).attr('data-id')
        deleteFloatingDialog();
        deleteCategory(categoryId).then(data => {
            if(data['success'] == true){
                removeFilter(categoryId);
                removeCategoryFromCreateForm(categoryId);
                selectFirstFilter();
                alert(data['message']);
            }else{
                alert(data['error']);
            }
        }).catch(error => console.log(error));
    }

    export function deleteFloatingDialog(){
        $('#floating-dialog').remove();
    }

    function removeFilter(category_id){
        let filter = $('#label-category'+category_id);
        filter.remove();
    }

    function removeCategoryFromCreateForm(category_id){
        let option = $('#categories-form option[value='+category_id+']');
        option.remove();
    }

//End functions to delete a category..........................................................................

//Start functions to update a category........................................................................

    //- showUpdateFormCategory(): Show update form for the category selected
    //- editCategory(): Send request to update a category and handle response
    //- editFilterElement(category): Refresh in the filter list the category name
    //- updateCategoryFromCreateForm(category): Refresh the category name in the select input into the form for create a to-do

    export function showUpdateFormCategory(){
        if ($('#form-category').length != 0){
            $('#form-category').empty();
        }
        let category_id = $('.filter-list input[type=radio]:checked').val();
        getCategory(category_id).then(data => {
            if(data['success'] == true){
                displayCategoryForm(true, data['category'])
                disableEnableFilterList(true);
            }else{
                alert(data['error']);
            }
        }).catch(error => console.log(error));
    }

    export function editCategory(){
        $('body').on('click', '#update-category', function(){

            let category_id = $('#update-category').val(); 
            let title = $('#title').val();
            let desc = $('#desc').val();

            //Validate values
            if(title == '' || desc == ''){
                showCategoryFormAlert(true, 'All inputs are required');
                return false;
            }else{
                let category = {
                    id: category_id,
                    title: title,
                    desc: desc
                }

                updateCategory(category).then(data => {
                    if(data['success']){
                        showCategoryFormAlert(false, 'Category edited successfully', true);
                        
                        editFilterElement(data['category']);
                        updateCategoryFromCreateForm(data['category']);
                        selectFirstFilter();
                    }else{
                        showCategoryFormAlert(true, data['error'])
                    }
                }).catch(error => console.log(error));
            }

        });
    }

    function editFilterElement(category){
        if(category == null){
            alert('Your categorie is saved, but something went wrong trying to update the view, please reload the page to see the changes');
        }else{
            let filterLabel = $('#label-category'+category.id);
            var input = $('<input>').attr({
                type: 'radio',
                name: 'radio',
                id: 'category' + category.id,
                value: category.id
            });
            var span = $('<span class="checkmark">');
            filterLabel.empty();
            filterLabel.text(category.name);
            filterLabel.append(input, span);
        }
    }

    
    function updateCategoryFromCreateForm(category){
        if(category == null){
            alert('Your categorie is saved, but something went wrong trying to update the view, please reload the page to see it');
        }else{
            let option = $('#categories-form option[value='+category.id+']');
            option.text(category.name);
        }
    }
//End functions to update a category.................................................................