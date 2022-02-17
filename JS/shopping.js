// VARIABLES
let precioTotal = 0
let cantProducts = 0
let idOrder = null
// LOCAL STORAGE
let user = JSON.parse(localStorage.getItem('user'))
let carritoLocal = JSON.parse(localStorage.getItem('cart'))
// const requestHandler = new RequestHandler()

document.getElementById("shopping-cart-img").src = "https://api.iconify.design/jam/shopping-cart.svg?color=%23222"

// Leer carrito
let carrito = null
if (user != null) {
    const url = "https://golopop-backend.herokuapp.com/orders/" + user.email

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onload = () => {
        if (xhr.status === 200) {
            let orders = JSON.parse(xhr.responseText)
    
            if (orders != null) {
                for (let i=0; i<orders.length; i++) {
                    if (orders[i].status == "cart") {
                        let order = orders[i]
                        carrito = order.products
                        idOrder = order._id

                        if (carritoLocal != null) {
                            for (let j=0; j<carrito.length; j++) {
                                for (let i=0; i<carritoLocal.length; i++) {
                                    if(carrito[j].id == carritoLocal[i].id) {
                                        
                                    }
                                }
                            }
                        }

                        // Actualizamos info pedido
                        document.getElementById("cantProducts").innerHTML = "Products: " + order.products.length
                        localStorage.setItem("orders", JSON.stringify(order.products))
                        for (let i=0; i<order.products.length; i++) {
                            cantProducts = order.products.length
                            getProducto(order.products[i].id, i, order.products[i].cant)
                        }
                    }
                }
            }
        }
    }
} else {
    if (carritoLocal != null) {
        for (let i=0; i<carritoLocal.length; i++) {
            getProducto(carritoLocal[i].id, i, carritoLocal[i].cant)
        }
    }
}

function getProducto(id, idCarrito, cant) {
    const url = "https://golopop-backend.herokuapp.com/products/" + id

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onload = () => {
        if (xhr.status === 200) {
            let product = JSON.parse(xhr.responseText)
            precioTotal += (product.price * cant)

            mostrarProducto(product, idCarrito, cant)
        }
    }
}

function mostrarProducto(producto, idCarrito, cant) {
    let div = document.getElementById("productsCarrito")

    let product = `
    <div class="itemCarrito" id="itemCarrito">
        <div class="itemCarritoImg">
            <img src="${producto.image}">
        </div>
        <div class="itemCarritoInfo">
            <div>
                <div>
                    <p id="carritoName">${producto.name}</p>
                    <p id="carritoNormalP">${producto.categorie}</p>
                    <p id="carritoNormalP">Stock: ${producto.stock}</p>
                </div>
                <p id="cp${idCarrito}" class="carritoPrice">${(producto.price * cant).toFixed(2)}$</p>
            </div>
            <div id="divBtnCarrito">
                <input id="${idCarrito}" class="cantidadCarrito" type="number" value="${cant}" min="1" max="${producto.stock}">
                <button id="${producto._id}" class="eliminarCarrito"><img id="${producto._id}" class="eliminarCarrito" src="https://api.iconify.design/heroicons-outline/trash.svg?color=%23f8f8f8"></button>
            </div>
        </div>
    </div>`

    actualizarPedCar()

    div.innerHTML += product
}

// Actualizamos info pedido
function actualizarPedCar() {
    document.getElementById("cantProducts").innerHTML = "Products: " + cantProducts
    document.getElementById("priceProducts").innerHTML = "Total Price: " + precioTotal.toFixed(2) + "$"
}

// modificar precio producto
document.getElementById("productsCarrito").addEventListener("input", e=> {
    let id = e.target.id
    let p = document.getElementById("cp" + id)
    let prod = carrito[id]    
    const url = "https://golopop-backend.herokuapp.com/products/" + prod.id

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onload = () => {
        if (xhr.status === 200) {
            let product = JSON.parse(xhr.responseText)

            let precio = product.price
            let newPrice = precio * e.target.value
            p.innerHTML = newPrice.toFixed(2) + "$"

            precioTotal = 0
            let precios = document.querySelectorAll(".carritoPrice")
            for (let i=0; i<precios.length; i++) {
                let p = precios[i].innerHTML
                let precio = (p).substring(0, p.length-1)
                precioTotal += parseFloat(precio)
            }

            actualizarPedCar()
        }
    }

    carrito[id].cant = parseInt(e.target.value)
    const url2 = "https://golopop-backend.herokuapp.com/orders/update/" + idOrder
    const xhr2 = new XMLHttpRequest()
    xhr2.open('PATCH', url2, true)
    xhr2.setRequestHeader("content-type", "application/json");
    xhr2.send(JSON.stringify({"products": carrito}))
})

// eliminar producto carrito
document.getElementById("productsCarrito").addEventListener("click", e=> {
    if (e.target.className == "eliminarCarrito") {
        let id = e.target.id

        precioTotal = 0
        for (let i=0; i<carrito.length; i++) {
            if (carrito[i].id == id) {
                carrito.splice(i, 1)

                break;
            } 
        };

        const url = "https://golopop-backend.herokuapp.com/orders/update/" + idOrder
        const xhr = new XMLHttpRequest()
        xhr.open('PATCH', url, true)
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify({"products": carrito}))

        let div = document.getElementById("productsCarrito")
        div.innerHTML = ""

        for (let i=0; i<carrito.length; i++) {
            getProducto(carrito[i].id, i, carrito[i].cant)
        }
    }
})

// comprar pedido
document.getElementById("tramitBuyBtn").addEventListener("click", e => {
    e.preventDefault()
    let creditCard = document.getElementById("selectCard").value
    let addressV = document.getElementById("selectAddress").value

    let user = JSON.parse(localStorage.getItem('user'))
    if (user != null) {
        if (user.creditCards.length != 0) {
            if (user.address.length != 0) {
                let creditN = creditCard.split("-")
                let creditCardV = creditN[0] + creditN[1] + creditN[2] + creditN[3]

                const url = "https://golopop-backend.herokuapp.com/orders/update/" + idOrder
                const xhr = new XMLHttpRequest()
                xhr.open('PATCH', url, true)
                xhr.setRequestHeader("content-type", "application/json");
                xhr.send(JSON.stringify({
                    status: "buy",
                    credit: creditCardV,
                    address: addressV,
                    totalPrice: precioTotal,
                }))
                xhr.onreadystatechange = function() {

                    if (this.readyState == 4 && this.status == 200) {
                        for (let i=0; i<carrito.length; i++) {
                            cambiarStock(carrito[i].id, carrito[i].cant)
                        }
                    }
            
                }
            } else {
                localStorage.setItem("opcion","addAddress")
                alert("you have to add a address")
                window.open("../HTML/profile.html", "_self")
            }
        } else {
            localStorage.setItem("opcion","addCard")
            alert("you have to add a credit card")
            window.open("../HTML/profile.html", "_self")
        }
    } else {
        document.getElementById("loginContainer").style.display = "block"
        document.querySelector(".bodyContent").style.filter = "blur(6px)"
    }
})
function cambiarStock(id, cant) {
    const url = "https://golopop-backend.herokuapp.com/products/" + id

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onload = () => {
        if (xhr.status === 200) {
            let product = JSON.parse(xhr.response)
            let newStock = product.stock - cant
            console.log(newStock)

            const url2 = "https://golopop-backend.herokuapp.com/products/update/" + id
            const xhr2 = new XMLHttpRequest()
            xhr2.open('PATCH', url2, true)
            xhr2.setRequestHeader("content-type", "application/json");
            xhr2.send(JSON.stringify({
                stock: newStock,
            }))
            xhr2.onreadystatechange = function() {
        
                if (this.readyState == 4 && this.status == 200) {
                    localStorage.setItem("opcion","order")
                    window.open("../HTML/profile.html", "_self")
                }
        
            }
        }
    }
}

// Cargar tarjetas
let cards = user.creditCards
let selectCard = document.getElementById("selectCard")
for (let i=0; i<cards.length; i++) {
    let opcion = `<option>${cards[i].num}</option>`
    selectCard.innerHTML += opcion
}

let address = user.address
let selectAddress = document.getElementById("selectAddress")
for (let i=0; i<address.length; i++) {
    let opcion = `<option>${address[i].addressDirection}</option>`
    selectAddress.innerHTML += opcion
}