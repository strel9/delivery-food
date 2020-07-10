'use strict';

const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
// const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const sectionHeading = document.querySelector('.menu-section-heading');
const cartBody = document.querySelector('.cart-body');
const modalPricetag = document.querySelector('.modal-pricetag');

let login = localStorage.getItem('DeliveryLogin');
const cart = [];

const loadCart = () => {
	if (localStorage.getItem(login)) {
		JSON.parse(localStorage.getItem(login)).forEach((item) => cart.push(item));
	}
};

const saveCart = () => localStorage.setItem(login, JSON.stringify(cart));
const getData = async (url) => {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Ошибка по адресу ${url}, статус ${response.status}`);
	}
	return await response.json();
};

const valid = (str) => /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/.test(str);

const toggleModal = () => modal.classList.toggle('is-open');

const toggleModalAuth = () => {
	modalAuth.classList.toggle('is-open');
	loginInput.placeholder = '';
	loginInput.style.borderColor = '';
};

const autorized = () => {
	console.log('авторизован');
	const logOut = () => {
		login = null;
		cart.length = 0;
		localStorage.removeItem('DeliveryLogin');

		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		cartButton.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();
		returnMain();
	};
	userName.textContent = login;
	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'flex';
	cartButton.style.display = 'flex';
	buttonOut.addEventListener('click', logOut);
	loadCart();
	// localStorage.setItem('', login);
};

const notAutorized = () => {
	console.log('неавторизован');
	const logIn = (e) => {
		e.preventDefault();
		if (valid(loginInput.value.trim())) {
			// alert('введи логин');
			login = loginInput.value;
			localStorage.setItem('DeliveryLogin', login);
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
	};

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn);
};

const checkAuth = () => {
	if (login) {
		autorized();
	} else {
		notAutorized();
	}
};

const createCardRestaurants = ({
	image,
	kitchen,
	name,
	price,
	stars,
	products,
	time_of_delivery: timeofDelivery,
}) => {
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
	cardsRestaurants.insertAdjacentHTML('beforeend', card);
};

const createCardGood = ({ id, name, description, price, image }) => {
	// console.log(goods);
	const card = document.createElement('div');
	// card.className = 'card';
	card.classList.add('card');
	card.insertAdjacentHTML(
		'beforeend',
		`
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
	`,
	);

	// console.log(card);
	cardsMenu.insertAdjacentElement('beforeEnd', card);
};

const createSectionHeading = (data) => {
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
	`;
	sectionHeading.insertAdjacentHTML('beforeend', heading);
};

const openGoods = (e) => {
	// console.log(e.target)
	const target = e.target;
	const restaurant = target.closest('.card-restaurant');
	// console.log('restaraunt: ', restaurant);
	if (restaurant) {
		if (login) {
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');
			cardsMenu.textContent = '';

			getData(`./db/${restaurant.dataset.products}`).then((data) => data.forEach(createCardGood));

			createSectionHeading(restaurant.dataset);

			// console.log(restaurant.dataset.products);
			// createCardGood();
			// createCardGood();
			// createCardGood();
		} else {
			toggleModalAuth();
		}
	}
};

const returnMain = () => {
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');
};

const addToCart = (e) => {
	const target = e.target;
	const buttonAddCart = target.closest('.button-add-cart');
	if (buttonAddCart) {
		const card = target.closest('.card');
		const title = card.querySelector('.card-title-reg').textContent;
		const cost = card.querySelector('.card-price').textContent;
		const id = buttonAddCart.id;
		const food = cart.find((item) => item.id === id);
		food ? (food.count += 1) : cart.push({ id, title, cost, count: 1 });
		saveCart();
	}
};

const renderCart = () => {
	cartBody.textContent = '';
	cart.forEach(({ id, title, cost, count }) => {
		const itemCart = `
		<div class="food-row">
		<span class="food-name">${title}</span>
		<strong class="food-price">${cost}</strong>
		<div class="food-counter">
			<button class="counter-button counter-minus" data-id=${id}>-</button>
			<span class="counter">${count}</span>
			<button class="counter-button counter-plus" data-id=${id}>+</button>
		</div>
		</div>
	`;
		cartBody.insertAdjacentHTML('afterbegin', itemCart);
	});

	const totalPrice = cart.reduce((result, item) => result + parseFloat(item.cost) * item.count, 0);

	modalPricetag.textContent = totalPrice + ' ₽';
};

const changeCount = (e) => {
	const target = e.target;

	if (target.classList.contains('counter-button')) {
		const food = cart.find((item) => item.id === target.dataset.id);
		if (target.classList.contains('counter-minus')) {
			console.log('minus');
			food.count--;
			if (food.count === 0) {
				cart.splice(cart.indexOf(food), 1);
			}
		}
		if (target.classList.contains('counter-plus')) {
			food.count++;
		}
		renderCart();
		saveCart();
	}
};

const init = () => {
	getData('./db/partners.json').then((data) => data.forEach(createCardRestaurants));

	cardsRestaurants.addEventListener('click', openGoods);
	logo.addEventListener('click', returnMain);
	// cartButton.addEventListener("click", toggleModal);
	cartButton.addEventListener('click', () => {
		toggleModal();
		renderCart();
	});
	cartBody.addEventListener('click', changeCount);
	close.addEventListener('click', toggleModal);
	cardsMenu.addEventListener('click', addToCart);

	checkAuth();

	new Swiper('.swiper-container', {
		loop: true,
		autoplay: {
			delay: 1000,
			autoplay: false,
		},
		// slidesPerView : 3,
		// direction: 'vertical',
		speed: 300,
		pagination: {
			el: '.swiper-pagination',
			dynamicBullets: true,
		},
	});
};

init();
