import { checkFilter } from './filters.js';
import { categoryDropdownClick, categoryDropdownMenu, saveTodoClick, 
    updateTodoClick, cancelUpdate, editTodo,
    changeTags, showAlertDeleteTodo, removeTodo
} from './todo.js';
import { deleteFloatingDialog } from './utils.js';
import { category_add_click, category_cancel_click, saveCategory } from './category.js';

document.addEventListener('DOMContentLoaded', ()=>{
    
    window.updateTodoClick = updateTodoClick;
    window.cancelUpdate = cancelUpdate;
    window.changeTags = changeTags;
    window.showAlertDeleteTodo = showAlertDeleteTodo;
    window.deleteFloatingDialog = deleteFloatingDialog;
    window.removeTodo = removeTodo;

    //Listeners
    categoryDropdownClick();
    categoryDropdownMenu();
    category_add_click();
    category_cancel_click();
    checkFilter();
    saveTodoClick();
    editTodo();
    saveCategory();
});