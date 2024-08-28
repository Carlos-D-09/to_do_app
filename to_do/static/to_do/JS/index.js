import { checkFilters, filterWindowResize } from './filters.js';
import { categoryDropdownClick, categoryDropdownMenu, saveTodoClick, 
    updateTodoClick, cancelUpdate, editTodo,
    changeTags, showAlertDeleteTodo, removeTodo
} from './todo.js';
import { deleteFloatingDialog } from './utils.js';
import { categoryAddClick, categoryCancelClick, saveCategory, showUpdateFormCategory, editCategoryClick, showAlertDeleteCategory, removeCategory} from './category.js';

document.addEventListener('DOMContentLoaded', ()=>{
    
    window.updateTodoClick = updateTodoClick;
    window.cancelUpdate = cancelUpdate;
    window.changeTags = changeTags;
    window.showAlertDeleteTodo = showAlertDeleteTodo;
    window.deleteFloatingDialog = deleteFloatingDialog;
    window.removeTodo = removeTodo;
    window.showUpdateFormCategory = showUpdateFormCategory;
    window.showAlertDeleteCategory = showAlertDeleteCategory;
    window.removeCategory = removeCategory;

    //Listeners
    //To-do form
    categoryDropdownClick();
    categoryDropdownMenu();
    saveTodoClick();
    editTodo();
    
    //Category
    categoryAddClick();
    categoryCancelClick();
    saveCategory();
    editCategoryClick();
    
    //Filters
    checkFilters();
    filterWindowResize();
});