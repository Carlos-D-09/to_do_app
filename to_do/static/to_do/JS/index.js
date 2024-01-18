import {checkFilter } from './filter.js';
import {createTodo, updateImportant, updateCompleted, updateTodo, cancelUpdate, editTodo, showAlertDeleteTodo, removeTodo} from './todo.js';
import {showForm, removeFormCategory, saveCategory, showAlertDeleteCategory, editCategory, deleteFloatingDialog, removeCategory, showUpdateFormCategory, removeUpdateFormCategory} from './category.js';

window.updateImportant = updateImportant;
window.updateCompleted = updateCompleted;
window.updateTodo = updateTodo;
window.cancelUpdate = cancelUpdate;
window.showAlertDeleteTodo = showAlertDeleteTodo;
window.removeTodo = removeTodo;

window.showAlertDeleteCategory = showAlertDeleteCategory;
window.showUpdateFormCategory = showUpdateFormCategory;
window.removeCategory = removeCategory;

window.deleteFloatingDialog = deleteFloatingDialog;

$(document).ready(function() {
    checkFilter();
    
    //Listeners for category
    saveCategory();
    showForm();
    removeFormCategory();
    removeUpdateFormCategory();
    editCategory();
    
    //Listener for to-do
    createTodo();
    editTodo();
});