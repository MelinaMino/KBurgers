const productList = document.getElementById('list-products');
const cartContainer = document.getElementById('cartWrapper');
const finalPrice = document.getElementById('totalProducts');
const finish = document.getElementById('finish');

const renderizarCarrito = (carrito) => {
    while (cartContainer.firstChild) {
        cartContainer.removeChild(cartContainer.firstChild);
    }
    while (finalPrice.firstChild) {
        finalPrice.removeChild(finalPrice.firstChild);
    }
    if (!carrito.products.length) {
        finish.classList.add('disabled-button');
        finish.setAttribute('disabled', true);
        finish.textContent = 'Tu carrito está vacio'
    } else {
        finish.classList.remove('disabled-button');
        finish.removeAttribute('disabled');
        finish.textContent = 'Finalizar compra';
    }

    const finalPriceText = document.createTextNode(carrito.subtotal);
    finalPrice.appendChild(finalPriceText);

    if (!carrito.products.length) {
        const msjCarritoVacio = document.createElement('div');
        msjCarritoVacio.classList.add('emptyProductMsj');
        const msjCarritoVacioText = document.createTextNode('No seleccionaste ningún producto');
        msjCarritoVacio.appendChild(msjCarritoVacioText);
        cartContainer.appendChild(msjCarritoVacio);
        return
    }
    carrito.products.forEach((product) => {
        const DatabaseProduct = database.products.find((p) => p.ID === product.ID);

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const cartItemContent = document.createElement('div');
        cartItemContent.classList.add('cart-item-content');
        const itemPrice = document.createElement('div');

        const productName = document.createElement('p');
        const productNameText = document.createTextNode(DatabaseProduct.name);
        productName.appendChild(productNameText);

        const price = document.createElement('p');
        const priceText = document.createTextNode(`$${DatabaseProduct.price} x ${product.quantity}`);
        price.appendChild(priceText);

        const containerButton = document.createElement('div');

        const botonDisminuir = document.createElement('button');
        const botonTextDisminuir = document.createTextNode('-');

        botonDisminuir.appendChild(botonTextDisminuir);

        botonDisminuir.addEventListener('click', (e) => carrito.removeProduct(product.ID));

        const botonAumentar = document.createElement('button');
        const botonTextAumentar = document.createTextNode('+');
        botonAumentar.appendChild(botonTextAumentar);
        botonAumentar.addEventListener('click', (e) => carrito.addProduct(product.ID));
        containerButton.appendChild(botonDisminuir);
        containerButton.appendChild(botonAumentar);

        cartItemContent.appendChild(productName);

        itemPrice.appendChild(price);

        cartItem.appendChild(cartItemContent);
        cartItem.appendChild(itemPrice);
        cartItem.appendChild(containerButton);

        cartContainer.appendChild(cartItem);

    });
};

const renderizarProductos = (carrito) => {
    while (productList.firstChild) {
        productList.removeChild(productList.firstChild);
    }

    database.products.forEach((product) => {
        const item = document.createElement('div');

        const image = document.createElement('img');
        image.setAttribute('src', product.image);

        const name = document.createElement('p');
        const textname = document.createTextNode(product.name);
        name.appendChild(textname);

        const ingredientes = document.createElement('p');
        const textingredientes = document.createTextNode(product.ingredientes);
        ingredientes.appendChild(textingredientes);

        const price = document.createElement('p');
        const textprice = document.createTextNode(`$${product.price} - stock: ${product.stock}`);
        price.appendChild(textprice);

        const button = document.createElement('button');
        const textbutton = document.createTextNode('Agregar al carrito');

        if (product.stock === 0) {
            button.classList.add('disabled-button');
            button.setAttribute('disabled', true);
            textbutton.textContent = 'Sin stock';
        }

        button.appendChild(textbutton);

        button.addEventListener('click', (e) => {
            carrito.addProduct(product.ID, 1);

            console.log(carrito);
        });

        item.appendChild(image);
        item.appendChild(name);
        item.appendChild(ingredientes);
        item.appendChild(price);
        item.appendChild(button);
        productList.appendChild(item);
    });
};

document.addEventListener('DOMContentLoaded', (e) => {
    const carritoExistente = localStorage.getItem('cart');

    const carrito = carritoExistente ? new Cart(JSON.parse(carritoExistente)) : new Cart({ owner: '' });

    localStorage.setItem('cart', JSON.stringify(carrito));

    renderizarCarrito(carrito);
    renderizarProductos(carrito);

    finish.addEventListener('click', () => {
        carrito.endShopSpree();
    });
});