// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// DOM Elements
const cartItems = document.getElementById('cart-items');
const totalPriceSpan = document.getElementById('cart-total-price');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const checkoutButton = document.getElementById('checkout-button');
const categoryLinks = document.querySelectorAll('.category-list a');
const products = document.querySelectorAll('.product');
const navCategoryLink = document.getElementById('nav-category-link');

// Initialize cart display
function initCartDisplay() {
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const newItem = document.createElement('li');
        newItem.innerHTML = `
            <span>${item.name}</span>
            <input type="number" value="${item.quantity}" min="0" class="quantity-input">
            <span>@$${item.price}</span>
        `;
        cartItems.appendChild(newItem);

        const quantityInput = newItem.querySelector('.quantity-input');
        quantityInput.addEventListener('input', function() {
            if (parseInt(this.value) === 0) {
                this.parentNode.remove();
                cart = cart.filter(i => i.name !== item.name);
            } else {
                item.quantity = parseInt(this.value);
            }
            // Update localStorage when cart data changes
            localStorage.setItem('cart', JSON.stringify(cart));
            calculateTotalPrice();
        });
    });
    calculateTotalPrice();
}

// Calculate total price
function calculateTotalPrice() {
    let total = 0;
    const items = cartItems.querySelectorAll('li');
    items.forEach(item => {
        const price = parseFloat(item.querySelector('span:nth-child(3)').textContent.replace('@$', ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        total += price * quantity;
    });
    totalPriceSpan.textContent = `$${total.toFixed(2)}`;
}

// Add to cart functionality
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productName = this.dataset.product;
        const productPrice = parseFloat(this.dataset.price);

        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        // Update localStorage when cart data changes
        localStorage.setItem('cart', JSON.stringify(cart));
        initCartDisplay();
    });
});

// Checkout button
checkoutButton.addEventListener('click', function () {
    const isCheckoutSuccess = confirm('Proceed to checkout?');
    if (isCheckoutSuccess) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        cartItems.innerHTML = '';
        calculateTotalPrice();
    }
});

// Category filter functionality
categoryLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const category = this.dataset.category;
        const navText = this.dataset.textcategory;
        products.forEach(product => {
            if (product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        navCategoryLink.textContent = navText;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const product = urlParams.get('product');

    if (category) {
        // hide all of the products
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            product.style.display = 'none';
        });

        // show only the products that belong to the category
        const categoryProducts = document.querySelectorAll(`.product[data-category="${category}"]`);
        categoryProducts.forEach(product => {
            product.style.display = 'block';
        });

        // update the category link in the navigation
        const navCategoryLink = document.getElementById('nav-category-link');
        if (navCategoryLink) {
            const categoryText = document.querySelector(`a[data-category="${category}"]`).textContent;
            navCategoryLink.textContent = categoryText;
            navCategoryLink.href = `main.html?category=${category}`;
        }
    } else {
        // if no category is specified, show all products
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            product.style.display = 'block';
        });
    }
    if (product) {
        const navProductLink = document.getElementById('nav-product');
        if (navProductLink) {
            // set the product link in the navigation
            navProductLink.textContent = product;
        }
    }
});

// Initialize
initCartDisplay();