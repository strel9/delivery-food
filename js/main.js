'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const buttonLogin = document.querySelector('.button-login');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('sDelivery');

function toggleModal() {
	modal.classList.toggle("is-open");
}

function toggleModalAuth() {
	modalAuth.classList.toggle('is-open');
	loginInput.placeholder = '';
	loginInput.style.borderColor = '';
}

function autorized() {
	console.log('авторизован')
	function logOut() {
		login = null;
		localStorage.removeItem('sDelivery');

		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();

	}
	userName.textContent = login;
	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'block';
	buttonOut.addEventListener('click', logOut);
	// localStorage.setItem('', login);
}

function notAutorized() {
	console.log('неавторизован')
	function logIn(e) {
		e.preventDefault();
		if (loginInput.value.trim()) {
			// alert('введи логин');
			login = loginInput.value;
			localStorage.setItem('sDelivery', login);
			// console.log(login);
			toggleModalAuth();
			buttonAuth.removeEventListener('click', toggleModalAuth);
			closeAuth.removeEventListener('click', toggleModalAuth);
			logInForm.removeEventListener('submit', logIn);
			// loginInput.value = '';
			logInForm.reset();
			checkAuth();
		} else {
			loginInput.placeholder = 'введи логин';
			loginInput.style.borderColor = 'red';


		}

	}

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
	if (login) {
		autorized()
	} else {
		notAutorized()
	}
}

function createCardRestaurants() {
	const card = `
  <a class="card card-restaurant">
  <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">Тануки</h3>
      <span class="card-tag tag">60 мин</span>
    </div>
    <div class="card-info">
      <div class="rating">
        4.5
      </div>
      <div class="price">От 1 200 ₽</div>
      <div class="category">Суши, роллы</div>
    </div>
  </div>
</a>
`;
	cardsRestaurants.insertAdjacentHTML('beforeend', card)
}

function createCardGood() {
	const card = document.createElement('div');
	card.className = 'card';
	// card.classList.add('card');
	card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
          грибы.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div>
    </div>
  `);

	// console.log(card);
	cardsMenu.insertAdjacentElement('beforeEnd', card);
}

function openGoods(e) {
	// console.log(e.target)
	const target = e.target;
	const restaurant = target.closest('.card-restaurant');
	// console.log('restaraunt: ', restaurant);
	if (restaurant) {

		if (login) {
			containerPromo.classList.add('hide')
			restaurants.classList.add('hide')
			menu.classList.remove('hide')

			cardsMenu.textContent = '';

			createCardGood();
			createCardGood();
			createCardGood();
		} else {
			toggleModalAuth()
		}
	}
}

cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function () {
	containerPromo.classList.remove('hide')
	restaurants.classList.remove('hide')
	menu.classList.add('hide')
})
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

checkAuth()
createCardRestaurants();
createCardRestaurants();
createCardRestaurants();

new Swiper('.swiper-container', {
	loop: true,
	autoplay: true,
	// slidesPerView : 3,
	// direction: 'vertical',
	speed: 300,
	pagination: {
		el: '.swiper-pagination',
		dynamicBullets: true,
	},
})