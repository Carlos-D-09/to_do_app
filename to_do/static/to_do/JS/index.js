import {checkFilter} from './filter.js';
import {createTodo, updateImportant, updateCompleted, updateTodo, cancelUpdate, listenEditTodo} from './todo.js';
import {showForm, deleteFormCategory, createCategory} from './category.js';

window.updateImportant = updateImportant;
window.updateCompleted = updateCompleted;
window.updateTodo = updateTodo;
window.cancelUpdate = cancelUpdate;

$(document).ready(function() {
    checkFilter();
    createCategory();
    listenEditTodo();
    showForm();
    deleteFormCategory();
    
    createTodo();
});