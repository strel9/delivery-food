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
const sectionHeading = document.querySelector('.menu-section-heading');
const cartBody = document.querySelector('.cart-body');
const modalPricetag = document.querySelector('.modal-pricetag');

let login = localStorage.getItem('sDelivery');

const cart = [];

const getData = async function (url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Ошибка по адресу ${url}, статус ${response.status}`);
	}
	return await response.json();
};

const valid = function (str) {
	const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
	return nameReg.test(str);
};

const toggleModal = function () {
	modal.classList.toggle("is-open");
};

function toggleModalAuth() {
	modalAuth.classList.toggle('is-open');
	loginInput.placeholder = '';
	loginInput.style.borderColor = '';
};

function autorized() {
	console.log('авторизован')
	function logOut() {
		login = null;
		localStorage.removeItem('sDelivery');

		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		cartButton.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();
		returnMain();
	}
	userName.textContent = login;
	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'flex';
	cartButton.style.display = 'flex';
	buttonOut.addEventListener('click', logOut);
	// localStorage.setItem('', login);
};

function notAutorized() {
	console.log('неавторизован')
	function logIn(e) {
		e.preventDefault();
		if (valid(loginInput.value.trim())) {
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
			loginInput.value = '';


		}

	}

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn);
};

function checkAuth() {
	if (login) {
		autorized()
	} else {
		notAutorized()
	}
};

function createCardRestaurants({ image, kitchen, name, price, stars, products, time_of_delivery: timeofDelivery }) {

	// console.log(restaurant)

	const card = `
			<a class="card card-restaurant" 
			data-products="${products}" 
			data-name="${name}" 
			data-stars="${stars}" 
			data-price="${price}" 
			data-kitchen="${kitchen}"
			>
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
				<h3 class="card-title">${name}</h3>
				<span class="card-tag tag">${timeofDelivery}</span>
				</div>
				<div class="card-info">
				<div class="rating">
					${stars}
				</div>
				<div class="price">От ${price} ₽</div>
				<div class="category">${kitchen}</div>
				</div>
			</div>
			</a>
			`;
	cardsRestaurants.insertAdjacentHTML('beforeend', card)
};

function createCardGood({ id, name, description, price, image }) {
	// console.log(goods);
	const card = document.createElement('div');
	// card.className = 'card';
	card.classList.add('card');
	card.insertAdjacentHTML('beforeend', `
		<img src="${image}" alt="image" class="card-image"/>
		<div class="card-text">
		<div class="card-heading">
			<h3 class="card-title card-title-reg">${name}</h3>
		</div>
		<div class="card-info">
			<div class="ingredients">${description}
			</div>
		</div>
		<div class="card-buttons">
			<button class="button button-primary button-add-cart" id="${id}">
			<span class="button-card-text">В корзину</span>
			<span class="button-cart-svg"></span>
			</button>
			<strong class="card-price card-price-bold">${price} ₽</strong>
		</div>
		</div>
	`);

	// console.log(card);
	cardsMenu.insertAdjacentElement('beforeEnd', card);
};

function createSectionHeading(data) {
	sectionHeading.textContent = '';
	const heading = `
	<h2 class="section-title restaurant-title">${data.name}</h2>
	<div class="card-info">
		<div class="rating">
		${data.stars}
		</div>
		<div class="price">От ${data.price} ₽</div>
		<div class="category">${data.kitchen}</div>
	</div>
	`
	sectionHeading.insertAdjacentHTML('beforeend', heading)
};

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

			getData(`./db/${restaurant.dataset.products}`).then(function (data) {
				data.forEach(createCardGood);
			});

			createSectionHeading(restaurant.dataset);

			// console.log(restaurant.dataset.products);
			// createCardGood();
			// createCardGood();
			// createCardGood();
		} else {
			toggleModalAuth()
		}
	}
};

function returnMain() {
	containerPromo.classList.remove('hide')
	restaurants.classList.remove('hide')
	menu.classList.add('hide')
};

function addToCart(e) {
	const target = e.target;
	const buttonAddCart = target.closest('.button-add-cart');
	if (buttonAddCart) {
		const card = target.closest('.card');
		const title = card.querySelector('.card-title-reg').textContent;
		const cost = card.querySelector('.card-price').textContent;
		const id = buttonAddCart.id;
		// console.log(title, cost, id)

		const food = cart.find(function (item) {
			return item.id === id;
		})
		// console.log(food)
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

		console.log(cart)
	}

}

function renderCart() {
	cartBody.textContent = '';
	cart.forEach(function ({ id, title, cost, count }) {
		const itemCart = `
		<div class="food-row">
		<span class="food-name">${title}</span>
		<strong class="food-price">${cost}</strong>
		<div class="food-counter">
			<button class="counter-button">-</button>
			<span class="counter">${count}</span>
			<button class="counter-button">+</button>
		</div>
		</div>
	`;
		cartBody.insertAdjacentHTML('afterbegin', itemCart);
	})

	const totalPrice = cart.reduce(function (result, item) {
		return result + (parseFloat(item.cost)) * item.count;
	}, 0)

	modalPricetag.textContent = totalPrice + ' ₽';

}

function init() {
	getData('./db/partners.json').then(function (data) {
		data.forEach(createCardRestaurants);
	});

	cardsRestaurants.addEventListener('click', openGoods);
	logo.addEventListener('click', returnMain);
	// cartButton.addEventListener("click", toggleModal);
	cartButton.addEventListener("click", function () {
		toggleModal();
		renderCart();
	});
	close.addEventListener("click", toggleModal);
	cardsMenu.addEventListener('click', addToCart);

	checkAuth();

	new Swiper('.swiper-container', {
		loop: true,
		autoplay: {
			delay: 1000,
			// autoplay: true,
		},
		// slidesPerView : 3,
		// direction: 'vertical',
		speed: 300,
		pagination: {
			el: '.swiper-pagination',
			dynamicBullets: true,
		},
	})

}

init();