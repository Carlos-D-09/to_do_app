document.addEventListener('DOMContentLoaded', ()=>{
    profileClick();
})

// Listener to detect profile picture click and show floating dialog
function profileClick(){
    let profile_picture = document.getElementById('navbar-picture');
    let floating_menu = document.getElementById('floating-navbar-menu');
    profile_picture.addEventListener('click',()=>{
        floating_menu.classList.toggle('active') ? floating_menu.classList.remove('hide') : floating_menu.classList.add('hide');
    })
}