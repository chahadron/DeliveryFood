const basket = document.querySelector('.authorization__basket-btn');
const modal = document.querySelector('.modal');
const close = document.querySelector('.modal-header__close');
const cancel = document.querySelector('.modal-footer-buttons__cancel');



basket.addEventListener('click',toggleModal);

close.addEventListener('click',toggleModal);

cancel.addEventListener('click',toggleModal);

function toggleModal (){
    modal.classList.toggle("is-open")
}