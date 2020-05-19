
const buttonAuth = document.querySelector('.button-auth'),
modalAuth = document.querySelector('.modal-auth'),
closeAuth = document.querySelector('.close-auth'),
loginForm = document.querySelector('#logInForm'),
buttonLogin = document.querySelector('.button-login'),
userName = document.querySelector('.user-name'),
buttonOut = document.querySelector('.button-out'),
inputLogin = document.querySelector('#login'),
inputPassword = document.querySelector('#password'),
cartButton = document.querySelector("#cart-button"),
modal = document.querySelector(".modal"),
close = document.querySelector(".close"),
cardsRestaurants = document.querySelector('.cards-restaurants'),
containerPromo = document.querySelector('.container-promo'),
restaurants = document.querySelector('.restaurants'),
logo = document.querySelector('.logo'),
menu = document.querySelector('.menu'),
restaurantTitle = document.querySelector('.restaurant-title'),
rating = document.querySelector('.rating'),
minPrice = document.querySelector('.price'),
category = document.querySelector('.category'),
modalPrice = document.querySelector('.modal-pricetag'),
modalBody = document.querySelector('.modal-body'),
buttonClearCart = document.querySelector('.clear-cart'),
cardsMenu = document.querySelector('.cards-menu');


let login = localStorage.getItem('login');

let cart = [];

const getData = async function (url) {

const response = await fetch(url);

return await response.json();

}


function toggleModal() {
modal.classList.toggle("is-open");
}

function toggleAuth() {
modalAuth.classList.toggle('is-open');
inputLogin.style.borderColor = 'initial';

loginForm.reset();
}

function authorized() {
console.log('avtoriz');

function logOut() {
  login = null;
  localStorage.removeItem('login');
  buttonAuth.style.display = 'block';
  userName.style.display = 'none';
  buttonOut.style.display = 'none';
  cartButton.style.display = 'none'
  buttonOut.removeEventListener('click', logOut);
  checkAuth();
}

userName.textContent = login;

buttonAuth.style.display = 'none';
userName.style.display = 'inline';
buttonOut.style.display = 'flex';
cartButton.style.display = 'flex'
buttonOut.addEventListener('click', logOut);

}

function notAuthorized() {
console.log('ne avtorizovan');

function logIn(event) {
  event.preventDefault();

  if (inputLogin.value.trim()) {
    login = inputLogin.value;
    localStorage.setItem('login', login);



    buttonAuth.removeEventListener('click', toggleAuth);
    closeAuth.removeEventListener('click', toggleAuth);
    loginForm.removeEventListener('submit', logIn);

    toggleAuth();
    checkAuth();
  }
  else {
    inputLogin.style.borderColor = '#ff2800';
  }
}

buttonAuth.addEventListener('click', toggleAuth);
closeAuth.addEventListener('click', toggleAuth);
loginForm.addEventListener('submit', logIn);

}

function checkAuth() {
if (login) {
  authorized();
} else {
  notAuthorized();
}
}

function createCardRestaurant({ image, kitchen, name, price, products, stars,
time_of_delivery: timeOfDelivery }) {

const card = `
    <a class="card card-restaurant" 
    data-products="${products}"
    data-info="${[name, price, stars, kitchen]}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
        ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
    </a>
`

cardsRestaurants.insertAdjacentHTML("beforeend", card)
}

function openRestaurant(e) {
const target = e.target;
const restaurant = target.closest('.card-restaurant');

if (restaurant && login) {

  const info = restaurant.dataset.info.split(',');

  const [name, price, stars, kitchen] = info;

  cardsMenu.textContent = '';
  restaurantTitle.textContent = name;
  rating.textContent = stars;
  minPrice.textContent = `От ${price} ₽`;
  category.textContent = kitchen;

  containerPromo.classList.add('hide');
  restaurants.classList.add('hide');
  menu.classList.remove('hide');



  getData(`./db/${restaurant.dataset.products}`).then(function (data) {
    data.forEach(createCardGood);
  })

}
else {
  toggleAuth();
}


}

function createCardGood({ image, name, description, price, id }) {

const card = document.createElement('section');

card.className = 'card';
card.id = id;
card.innerHTML = `
    <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
`
cardsMenu.insertAdjacentElement('beforeend', card);
}

function addToCard(e) {
const target = e.target;

const buttonAddToCard = target.closest('.button-add-cart');

if (buttonAddToCard) {
  const card = target.closest('.card');
  const title = card.querySelector('.card-title-reg').textContent;
  const cost = card.querySelector('.card-price').textContent;
  
  const id = buttonAddToCard.id;

  const food = cart.find(function (item) {
    return item.id === id;
  })

  if (food) {
    food.count += 1;
  } else {
    cart.push({
      id,
      title,
      cost,
      count: 1
    })
  }

}



}

function renderCart() {

modalBody.textContent = '';

cart.forEach(function ({ id, title, cost, count }) {
  const itemCart = `
  <div class="food-row">
  <span class="food-name">${title}</span>
  <strong class="food-price">${cost}</strong>
  <div class="food-counter">
    <button class="counter-button counter-minus" data-id="${id}">-</button>
    <span class="counter">${count}</span>
    <button class="counter-button counter-plus" data-id="${id}">+</button>
  </div>
</div>
  `


  

  modalBody.insertAdjacentHTML('afterbegin', itemCart);
})

const totalPrice = cart.reduce(function (result, item) {
  return result + (parseFloat(item.cost) * item.count);
}, 0)

modalPrice.textContent = totalPrice + ' ₽';

}

function changeCount(e) {
const target = e.target;

if (target.classList.contains('counter')) target.setAttribute('contenteditable', true);

if (target.classList.contains('counter-button')) {
  const food = cart.find(function(item) {
    return item.id === target.dataset.id;
  });
  if (target.classList.contains('counter-minus')) {
    food.count--;
    if (food.count === 0) {
      cart.splice(cart.indexOf(food), 1);
    }
  };
  if (target.classList.contains('counter-plus')) {
    food.count++;
  }
  console.log(cart);
  console.log(food);
  
  
  renderCart();
}
}

function init() {
getData('./db/partners.json').then(function (data) {
  data.forEach(createCardRestaurant);
});

cardsRestaurants.addEventListener('click', openRestaurant);

cartButton.addEventListener("click", function () {
  renderCart();
  toggleModal();
});

buttonClearCart.addEventListener('click', function(){
  cart.length = 0;
  renderCart();
})

modalBody.addEventListener('click', changeCount);

cardsMenu.addEventListener('click', addToCard);

close.addEventListener("click", toggleModal);

logo.addEventListener('click', function () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});

checkAuth();
}

init();