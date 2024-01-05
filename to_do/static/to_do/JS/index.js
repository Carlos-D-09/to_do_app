import {checkFilter } from './filter.js';
import {createTodo, updateImportant, updateCompleted, updateTodo, cancelUpdate, listenEditTodo} from './todo.js';
import {showForm, removeFormCategory, saveCategory, showAlertDeleteCategory, editCategory, deleteFloatingDialog, removeCategory, showUpdateFormCategory, removeUpdateFormCategory} from './category.js';

window.updateImportant = updateImportant;
window.updateCompleted = updateCompleted;
window.updateTodo = updateTodo;
window.cancelUpdate = cancelUpdate;
window.showAlertDeleteCategory = showAlertDeleteCategory;
window.deleteFloatingDialog = deleteFloatingDialog;
window.removeCategory = removeCategory;
window.showUpdateFormCategory = showUpdateFormCategory;

$(document).ready(function() {
    checkFilter();
    
    //Listeners for category
    saveCategory();
    showForm();
    removeFormCategory();
    removeUpdateFormCategory();
    editCategory();
    
    createTodo();
    listenEditTodo();
});