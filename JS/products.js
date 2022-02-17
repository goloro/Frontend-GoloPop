// DIV
const productsDiv = document.getElementById("products")
// LOCAL STORAGE
let user = JSON.parse(localStorage.getItem('user'))

// Cargar Productos
const url = "https://golopop-backend.herokuapp.com/products/"

let products = null

const xhr = new XMLHttpRequest()
xhr.open('GET', url, true)
xhr.send()
xhr.onload = () => {
    if (xhr.status === 200) {
        products = JSON.parse(xhr.responseText)

        cargarProductos(products)
    }
}
function cargarProductos(products) {
    document.getElementById("products").innerHTML = ""
    for (let i=0; i<products.length; i++) {
        let product = products[i]
        var div = `                                
        <div class="item">
            <div class="itemTop">
                <img loading="lazy" src="${product.image}">
            </div>
            <div class="itemBot">
                <div class="itemBotInfo">
                    <p class="itemBotName">${product.name}</p>
                    <p class="itemBotCategorie">${product.categorie}</p>
                </div>
                <div class="itemBotBuy">
                    <p class="itemBotPrice">${product.price}$</p>
                    <div id="${product._id}" class="itemBotAddCart">
                        <img id="${product._id}" class="imgAddCart" src="https://api.iconify.design/ic/baseline-add-shopping-cart.svg?color=%23f8f8f8">
                    </div>
                </div>
            </div>
        </div>`
    
        document.getElementById("products").innerHTML += div
    }
}

// Añadir al carrito
document.getElementById("products").addEventListener("click", e => {
    if (e.target.className == "itemBotAddCart" || e.target.className == "imgAddCart") {
        if (user != null) {
            anadirCarrito(e.target.id)
        } else {
            // carritoLocal(e.target.id)
        }
    }
})

function anadirCarrito(id) {
    const url = "https://golopop-backend.herokuapp.com/orders/" + user.email

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)

    xhr.onload = () => {
        if (xhr.status === 200) {
            let orders = JSON.parse(xhr.responseText)
            let flag = false
            let order

            if (orders != null) {
                for (let i=0; i<orders.length; i++) {
                    if (orders[i].status == "cart") {
                        flag = true
                        order = orders[i]
                        break
                    }
                }
            }

            if (flag) {
                let product = {"id": id, "cant": 1}
                let flag = true
                order.products.forEach(e => {
                    if (e.id == id) {
                        falg = false
                    }
                });
                if (flag) {
                    order.products.push(product)
                    updateCarrito(order)
                }
            } else {
                let product = {"id": id, "cant": 1}
                crearCarrito(product)
            }
        }
    }
    xhr.send()
}
function crearCarrito(product) {
    const url = "https://golopop-backend.herokuapp.com/orders/add"

    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(JSON.stringify({
        email: user.email,
        products: [product],
        status: "cart"
    }))
}
function updateCarrito(order) {
    const url = "https://golopop-backend.herokuapp.com/orders/update/" + order._id

    const xhr = new XMLHttpRequest()
    xhr.open('PATCH', url, true)
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(JSON.stringify(order))
}

// BUSCADOR
let result
let resultTxt
let resultPr
let flagTxt = false
let flagPr = false
document.getElementById("buscador").addEventListener("input", e => {
    let cadena = e.target.value
    document.getElementById("filtrosTxt").innerHTML = ""

    if (cadena != "" && cadena != " ") {
        document.getElementById("imgExtraNav").style.display = "none"
        document.getElementById("extraNav").style.height = "20vh"
        crearFiltro(cadena, "texto")
    } else {
        document.getElementById("imgExtraNav").style.display = "flex"
        document.getElementById("extraNav").style.height = "80vh"
    }

    buscador(cadena)
})
function buscador(cadena) { 
    if (flagPr) {
        result = resultPr.filter(r => r.name.toUpperCase().includes(cadena.trim().toUpperCase()) || r.categorie.toUpperCase().includes(cadena.trim().toUpperCase()))
    } else {
        result = products.filter(p => p.name.toUpperCase().includes(cadena.trim().toUpperCase()) || p.categorie.toUpperCase().includes(cadena.trim().toUpperCase()))
    }

    resultTxt = result
    cargarProductos(result)
}

// PRICE
document.getElementById("filtroR").addEventListener("input", e => {
    let precio = e.target.value
    document.getElementById("filtrosPr").innerHTML = ""

    document.getElementById("imgExtraNav").style.display = "none"
    document.getElementById("extraNav").style.height = "20vh"

    price(precio)
})
function price(precio) {
    if (flagTxt) {
        result = resultTxt.filter(r => r.price < precio)
    } else {
        result = products.filter(p => p.price < precio)
        console.log(precio)
    }
    
    resultPr = result
    crearFiltro(precio, "price")
    cargarProductos(result)
}

// FILTROS
function crearFiltro(txt, tipo) {
    let filtro = ""

    if (tipo == "texto") {
        document.getElementById("filtrosTxt").innerHTML = ""
        filtro = `<div>
                    <p id="textoFiltro">${txt}</p>
                    <img id="deleteFiltro" class="filtrosTxt" src="https://api.iconify.design/akar-icons/circle-x.svg?color=%23f44141">
                </div>`
        document.getElementById("filtrosTxt").innerHTML += filtro
        flagTxt = true
    } else if (tipo == "price") {
        document.getElementById("filtrosPr").innerHTML = ""
        filtro = `<div>
                    <p id="priceFiltro">max ${txt}$</p>
                    <img id="deleteFiltro" class="filtrosPr" src="https://api.iconify.design/akar-icons/circle-x.svg?color=%23f44141">
                </div>`
        document.getElementById("filtrosPr").innerHTML += filtro
        flagPr = true
    }
}
document.getElementById("filtros").addEventListener("click", e => {
    let clase = e.target.className
    if (clase == "filtrosTxt") {
        flagTxt = false
        if (flagPr) {
            let precioF = document.getElementById("priceFiltro").innerHTML
            let partesPF = precioF.split("max ")
            let precioLimpio = partesPF[1].substring(0, partesPF[1].length - 1)
            price(precioLimpio)
        } else {
            cargarProductos(products)
        }
        document.getElementById("buscador").value = ""
        buscador("")
        document.getElementById("imgExtraNav").style.display = "flex"
        document.getElementById("extraNav").style.height = "80vh"
    } else  if (clase == "filtrosPr") {
        flagPr = false
        if (flagTxt) {
            let cadenaF = document.getElementById("textoFiltro").innerHTML
            buscador(cadenaF)
        } else {
            cargarProductos(products)
        }
        document.getElementById("filtroR").value = 50
        buscador("")

        document.getElementById("imgExtraNav").style.display = "flex"
        document.getElementById("extraNav").style.height = "80vh"
    }
    document.getElementById(clase).innerHTML = ""

    if (flagPr || flagTxt) {
        document.getElementById("imgExtraNav").style.display = "none"
        document.getElementById("extraNav").style.height = "20vh"
    } else {
        document.getElementById("imgExtraNav").style.display = "flex"
        document.getElementById("extraNav").style.height = "80vh"
    }
})

// FILTROS BUTTONS
document.getElementById("marcaExtraNavContent").addEventListener("click", e => {
    document.getElementById("buscador").value = ""
    buscador("")
    buscador(e.target.id)
    crearFiltro(e.target.id, "texto")

    document.getElementById("imgExtraNav").style.display = "none"
    document.getElementById("extraNav").style.height = "20vh"
})

// CARRITO LOCAL
function carritoLocal(idP) {
    let carrito = JSON.parse(localStorage.getItem('cart'))
    if (carrito == null) {
        carrito = []
    }

    carrito.push({
        id: idP,
        cant: 1
    })

    localStorage.setItem("cart", JSON.stringify(carrito))
}