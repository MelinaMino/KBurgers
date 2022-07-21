//MENU HAMBURGUESA

const hamburger = document.querySelector('.hamburger');
const listanav = document.querySelector('.listanav');

const mobileMenu = () => {
    hamburger.classList.toggle('active');
    listanav.classList.toggle('active');
}
hamburger.addEventListener('click', mobileMenu);


const navLink = document.querySelectorAll('.navlink');
const closeMenu = () => {
    hamburger.classList.remove('active');
    listanav.classList.remove('active');
}
navLink.forEach(n => n.addEventListener('click', closeMenu));


//RENDERIZAR PRODUCTOS DE JS EN HTML


class Database {
    constructor({ products = [], users = [] }) {
        this.users = users;
        this.products = products;
    }

    addProduct(...products) {
        this.products.push(...products);
        localStorage.setItem(`database`, JSON.stringify(this));
    }

    addUser(user) {
        this.users.push(user);
        localStorage.setItem(`database`, JSON.stringify(this));
    }
};

class Cart {
    constructor({
        ID = Date.now().toString(36) + Math.random().toString(36).substring(2),
        products = [],
        subtotal = 0,
        owner,
    }) {
        this.ID = ID;
        this.products = products;
        this.owner = owner;
        this.subtotal = subtotal;
    }

    endShopSpree() {
        alert(`El total a abonar es de $ ${this.subtotal}`);
        this.products = [];
        this.subtotal = 0;

        localStorage.removeItem('cart');
        renderizarCarrito(this);
        location.reload();

    }
    addProduct(ID, quantity = 1) {
        const product = database.products.find((product) => product.ID === ID);

        if (product.stock >= quantity) {
            const price = quantity * product.price;

            this.subtotal = this.subtotal + price;
            product.stock = product.stock - quantity;

            const productInCart = this.products.find((p) => p.ID === ID);

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                this.products.push({ ID, quantity });
            }
            localStorage.setItem('cart', JSON.stringify(this));
            renderizarProductos(this);
            renderizarCarrito(this);
            localStorage.setItem('database', JSON.stringify(database));
        } else {
            alert('No hay stock disponible');
        }
    }
    removeProducts(ID) {
        const product = this.products.find((p) => p.ID === ID);
        const productdb = database.products.find((p) => p.ID === ID);

        if (!product) {
            return alert('El producto que deseas eliminar no existe');
        }
        productdb.stock++;
        this.subtotal = this.subtotal - productdb.price;

        if (product.quantity > 1) {
            product.quantity--;
        } else {
            this.products = this.products.filter((product) => product.ID !== ID);
        }
        localStorage.setItem('cart', JSON.stringify(this));
        localStorage.setItem('database', JSON.stringify(database));

        renderizarProductos(this);
        renderizarCarrito(this);
    }
};

class Product {
    static currentID = 1;
    constructor({ price, stock = 0, name, ingredientes, image }) {
        this.ID = Product.currentID;
        this.price = price;
        this.stock = stock;
        this.name = name;
        this.ingredientes = ingredientes;
        this.image = image;

        Product.currentID++;
    }
    update({ price, stock, name = this.name, ingredientes = this.ingredientes, image = this.image }) {
        this.price = price || this.price;
        this.stock = stock || this.stock;
        this.name = name;
        this.ingredientes = ingredientes;
        this.image = image;
    }
};

const baconburger = new Product({
    price: 660,
    stock: 25,
    name: 'baconburger',
    ingredientes: ['Pan de Papa', 'Medallón de 110gr', 'Cheddar', 'Bacon'],
    image: src = './Imgs/2BaconBurger.JPG',
});
const cheeseburger = new Product({
    price: 590,
    stock: 25,
    name: 'cheeseburger',
    ingredientes: ['Pan de Papa', 'Medallón de 110gr', 'Doble Cheddar'],
    image: src = './Imgs/1Cheeseburger.JPG'
});

const friedonion = new Product({
    price: 600,
    stock: 20,
    name: 'friedonion',
    ingredientes: ['Pan de Papa', 'Medallón de 110gr', 'Cheddar', 'Cebolla Grilled'],
    image: src = './Imgs/3FriedOnion.JPG',
});

const americanburger = new Product({
    price: 640,
    stock: 20,
    name: 'americanburger',
    ingredientes: ['Pan de Papa', 'Medallón de 110gr', 'Cheddar', 'Tomate', 'Lechuga', 'Pepino'],
    image: src = './Imgs/4AmericanBurger.JPG',
});

const bigk = new Product({
    price: 630,
    stock: 25,
    name: 'bigk',
    ingredientes: ['Pan de Papa', 'Medallón de 110gr', 'Cheddar', 'Lechuga', 'Pepino', 'Aderezo especial'],
    image: src = './Imgs/5BigK.JPG',
});

const veggie = new Product({
    price: 750,
    stock: 20,
    name: 'veggie',
    ingredientes: ['Pan de Papa', 'Medallón de espinaca, lentejas y quinoa', 'Triple Cheddar', 'Lechuga', 'Tomate', 'Aderezo secreto'],
    image: src = './Imgs/6Veggie.JPG',
});

const dbExistente = localStorage.getItem('database');

const database = dbExistente ? new Database(JSON.parse(dbExistente)) : new Database({});

if (!dbExistente) {
    database.addProduct(cheeseburger, baconburger, friedonion, americanburger, bigk, veggie);
};