// DIVS
const edit = document.getElementById("edit")
const cardView = document.getElementById("cardView")
const addressView = document.getElementById("addressView")
// BUTTONS
const editButton = document.getElementById("editButton")
const addCard = document.getElementById("addCreditCard")
// FORMS
const editEmail = document.getElementById("editEmail")
const editName = document.getElementById("editName")
const editLastName = document.getElementById("editLastName")
const editPass = document.getElementById("editPassword")
const editBirthDay = document.getElementById("editBirthDay")
const num1 = document.getElementById("num1")
const num2 = document.getElementById("num2")
const num3 = document.getElementById("num3")
const num4 = document.getElementById("num4")
const cvv = document.getElementById("cvv")
const expire1 = document.getElementById("expire1")
const expire2 = document.getElementById("expire2")
const owner = document.getElementById("owner")
const editnum1 = document.getElementById("editnum1")
const editnum2 = document.getElementById("editnum2")
const editnum3 = document.getElementById("editnum3")
const editnum4 = document.getElementById("editnum4")
const editcvv = document.getElementById("editcvv")
const editexpire1 = document.getElementById("editexpire1")
const editexpire2 = document.getElementById("editexpire2")
const editowner = document.getElementById("editowner")
const address = document.getElementById("address")
const postalCode = document.getElementById("postalCode")
const country = document.getElementById("country")
const province = document.getElementById("province")
const editaddress = document.getElementById("editaddress")
const editpostalCode = document.getElementById("editpostalCode")
const editcountry = document.getElementById("editcountry")
const editprovince = document.getElementById("editprovince")
// LOCAL STORAGE
let user = JSON.parse(localStorage.getItem('user'))
let opcion = localStorage.getItem('opcion')

// faltan tarjetas o direcciones para el pedido
if (opcion != null) {
    if (opcion == "addCard") {showAddCard()}
    if (opcion == "addAddress") {showAddAddress()}
    if (opcion == "order") {orderView()}
}

// establecer datos en inputs
editEmail.value = user.email
editName.value = user.name
editLastName.value = user.lastName
editPassword.value = user.password
editBirthDay.value = user.birthDate

// establecer nombre en menu
document.getElementById("nombreUsuario").innerHTML = user.name

// return Edit
function returnEdit() {
    edit.style.display = "flex"
    cardView.style.display = "none"
    addressView.style.display = "none"
}
document.getElementById("returnEdit").addEventListener("click", function() {
    returnEdit()
})
document.getElementById("returnEdit2").addEventListener("click", function() {
    returnEdit()
})

// view cards
document.getElementById("viewCardDiv").addEventListener("click", e => {
    showAddCard()
})
function showAddCard() {
    edit.style.display = "none"
    cardView.style.display = "flex"
    addressView.style.display = "none"

    cargarCards()
    localStorage.setItem("opcion","")
}

// cargar cards
function cargarCards() {
    document.getElementById("allItems").innerHTML = ""

    let cards = user.creditCards
    for (let i=0; i<cards.length; i++) {
        let card = cards[i]
        var cardDiv = `                                
        <div class="itemPro">
            <div class="menuOculto" id="menuOculto">
                <img class="editCard" id="${i}" src="https://api.iconify.design/bx/bx-message-square-edit.svg?color=%23222">
                <img class="deleteCard" id="${i}" src="https://api.iconify.design/akar-icons/trash-bin.svg?color=%23222">
            </div>
            <div>
                <p id="titulo">Card Number</p>
                <p class="campoNormal">${card.num}</p>
            </div>
            <div>
                <p id="titulo">CVV</p>
                <p class="campoNormal">${card.cvv}</p>
            </div>
            <div>
                <p id="titulo">Expire Date</p>
                <p class="campoNormal">${card.expireDate}</p>
            </div>
            <div>
                <p id="titulo">Owner</p>
                <p class="campoNormal">${card.owner}</p>
            </div>
        </div>`

        document.getElementById("allItems").innerHTML += cardDiv
    }
}

// show add card 
document.getElementById("addCardIcon").addEventListener("click", e => {
    document.querySelector(".editCardDiv").style.display = "none"
    document.querySelector(".addCard").style.display = "flex"
})

// view address
document.getElementById("viewAddressDiv").addEventListener("click", e => {
    showAddAddress()
})
function showAddAddress() {
    edit.style.display = "none"
    addressView.style.display = "flex"
    cardView.style.display = "none"

    cargarAddress()
    localStorage.setItem("opcion","")
}

// cargar address
function cargarAddress() {
    document.getElementById("allItemsAddress").innerHTML = ""

    let direcciones = user.address
    for (let i=0; i<direcciones.length; i++) {
        let direccion = direcciones[i]
        var cardDiv = `                                
        <div class="itemPro">
            <div class="menuOculto" id="menuOcultoAddress">
                <img class="editAddress" id="${i}" src="https://api.iconify.design/bx/bx-message-square-edit.svg?color=%23222">
                <img class="deleteAddress" id="${i}" src="https://api.iconify.design/akar-icons/trash-bin.svg?color=%23222">
            </div>
            <div>
                <p id="titulo">Address</p>
                <p class="campoNormal">${direccion.addressDirection}</p>
            </div>
            <div>
                <p id="titulo">Postal Code</p>
                <p class="campoNormal">${direccion.postalCode}</p>
            </div>
            <div>
                <p id="titulo">Country</p>
                <p class="campoNormal">${direccion.country}</p>
            </div>
            <div>
                <p id="titulo">Province</p>
                <p class="campoNormal">${direccion.province}</p>
            </div>
        </div>`

        document.getElementById("allItemsAddress").innerHTML += cardDiv
    }
}

// show add address 
document.getElementById("addAddressIcon").addEventListener("click", e => {
    document.querySelector(".editAddressDiv").style.display = "none"
    document.querySelector(".addAddressDiv").style.display = "flex"
})

// edit USER
editButton.addEventListener("click", e => {
    e.preventDefault()

    user = {
        _id: user._id,
        email: user.email,
        name: editName.value,
        lastName: editLastName.value,
        password: editPass.value,
        creditCards: user.creditCards,
        birthDate: editBirthDay.value,
        address: user.address
    }

    document.getElementById("nombreUsuario").innerHTML = user.name

    updateUser()
})

// add card
addCard.addEventListener("click", e => {
    e.preventDefault()

    let num = num1.value + "-" + num2.value + "-" + num3.value + "-" + num4.value
    let expire = expire1.value + " / " + expire2.value

    let card = {
        num: num,
        expireDate: expire,
        cvv: cvv.value,
        owner: owner.value
    }

    let cards = user.creditCards
    if (cards == null) {
        cards = []
    }
    cards.push(card)

    num1.value = ""
    num2.value = ""
    num3.value = ""
    num4.value = ""
    cvv.value = ""
    expire1.value = ""
    expire2.value = ""
    owner.value = ""

    user.creditCards = cards
    localStorage.setItem("user", JSON.stringify(user))

    updateUser()
    cargarCards()
})

// edit card
document.getElementById("allItems").addEventListener("click", e => {
    let ele = e.target

    if (ele.className == "editCard") {
        let id = ele.id

        localStorage.setItem('id', id)
        
        document.querySelector(".editCardDiv").style.display = "flex"
        document.querySelector(".addCard").style.display = "none"

        let card = user.creditCards[id]
        let num = (card.num).split("-")
        let expire = (card.expireDate).split(" / ")

        editnum1.value = num[0]
        editnum2.value = num[1]
        editnum3.value = num[2]
        editnum4.value = num[3]
        editcvv.value = card.cvv
        editexpire1.value = expire[0]
        editexpire2.value = expire[1]
        editowner.value = card.owner
    }
})
document.getElementById("editCreditCard").addEventListener("click", function() {
    let id = localStorage.getItem("id")
    let card = user.creditCards[id]

    localStorage.setItem('id', "")

    card.num = editnum1.value + "-" + editnum2.value + "-" + editnum3.value + "-" + editnum4.value
    card.cvv = editcvv.value
    card.exporeDate = editexpire1.value + " / " + editexpire2.value
    card.owner = editowner.value

    updateUser()
    cargarCards()

    document.querySelector(".editCardDiv").style.display = "none"
    document.querySelector(".addCard").style.display = "flex"

    editnum1.value = ""
    editnum2.value = ""
    editnum3.value = ""
    editnum4.value = ""
    editcvv.value = ""
    editexpire1.value = ""
    editexpire2.value = ""
    editowner.value = ""
})

// delete card
document.getElementById("allItems").addEventListener("click", e => {
    let ele = e.target

    if (ele.className == "deleteCard") {
        let id = ele.id
        
        
        let cards = user.creditCards
        cards.splice(id, 1)

        updateUser()
        cargarCards()
    }
})

// add address
document.getElementById("addAddress").addEventListener("click", e => {
    e.preventDefault()

    let addresss = {
        addressDirection: address.value,
        postalCode: postalCode.value,
        country: country.value,
        province: province.value
    }

    let userAddress = user.address
    if (userAddress == null) {
        userAddress = []
    }
    userAddress.push(addresss)

    user.address = userAddress
    localStorage.setItem("user", JSON.stringify(user))

    address.value = ""
    postalCode.value = ""
    country.value = ""
    province.value = ""

    updateUser()
    cargarAddress()
})

// edit address
document.getElementById("allItemsAddress").addEventListener("click", e => {
    let ele = e.target

    if (ele.className == "editAddress") {
        let id = ele.id
        
        localStorage.setItem('idAddress', id)
        
        document.querySelector(".editAddressDiv").style.display = "flex"
        document.querySelector(".addAddressDiv").style.display = "none"

        let userAddress = user.address[id]

        editaddress.value = userAddress.addressDirection
        editpostalCode.value = userAddress.postalCode
        editcountry.value = userAddress.country
        editprovince.value = userAddress.province
    }
})
document.getElementById("editAddress").addEventListener("click", e => {
    let id = localStorage.getItem("idAddress")
    let address = user.address[id]

    localStorage.setItem('idAddress', "")

    address.addressDirection = editaddress.value
    address.postalCode = editpostalCode.value
    address.country = editcountry.value
    address.province = editprovince.value

    updateUser()
    cargarAddress()

    document.querySelector(".editAddressDiv").style.display = "none"
    document.querySelector(".addAddressDiv").style.display = "flex"

    editaddress.value = ""
    editpostalCode.value = ""
    editcountry.value = ""
    editprovince.value = ""
})

// delete address
document.getElementById("allItemsAddress").addEventListener("click", e => {
    let ele = e.target

    if (ele.className == "deleteAddress") {
        let id = ele.id
        
        
        let address = user.address
        address.splice(id, 1)

        updateUser()
        cargarAddress()
    }
})

// actualizar usuario
function updateUser() {
    const url = "https://golopop-backend.herokuapp.com/users/update/" + user._id

    const xhr = new XMLHttpRequest()
    xhr.open('PATCH', url, true)
    xhr.setRequestHeader("content-type", "application/json");
    xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            let response = this.response;

            localStorage.setItem('user', JSON.stringify(user))
        }

    }
    xhr.send(JSON.stringify(user))
}

// MENU VIEWS
document.getElementById("menuBot").addEventListener("click", e => {
    e.preventDefault()
    let id = e.target.id

    if (e.target.className == "buttonsBot") {
        if (id == "buttonBotPorfile") {
            estiloBoton(document.getElementById(id))
            quitarEstiloBoton(document.getElementById("buttonBotOrders"))
            document.getElementById("contentProfileProfile").style.display = "flex"
            document.getElementById("contentProfileOrders").style.display = "none"
        } else if (id == "buttonBotOrders") {
            orderView()
        }
    }
})
function orderView() {
    estiloBoton(document.getElementById("buttonBotOrders"))
    quitarEstiloBoton(document.getElementById("buttonBotPorfile"))
    document.getElementById("contentProfileProfile").style.display = "none"
    document.getElementById("contentProfileOrders").style.display = "grid"
    viewPedidos()
}
function estiloBoton(button) {
    button.style.backgroundColor = "#f7fafb44"
    button.style.color = "white"
}
function quitarEstiloBoton(button) {
    button.style.backgroundColor = "#F7FAFB"
    button.style.color = "black"
}

// Ver pedidos
function viewPedidos() {
    document.getElementById("contentProfileOrders").innerHTML = ""
    const url = "https://golopop-backend.herokuapp.com/orders/" + user.email

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onload = () => {
        if (xhr.status === 200) {
            let orders = JSON.parse(xhr.responseText)
    
            if (orders != null) {
                for(let i=0; i<orders.length; i++) {
                    if (orders[i].status == "buy") {
                        mostrarPedido(orders[i], i)
                    }
                }
            }
        }
    }
}
// Mostrar Pedido
function mostrarPedido(order, id) {
    let divPedido = `
    <div class="itemPed">
        <div>
            <p id="titulo">Email</p>
            <p class="campoNormal">${order.email}</p>
        </div>
        <div>
            <p id="titulo">Address</p>
            <p class="campoNormal">${order.address}</p>
        </div>
        <div>
            <p id="titulo">Credit Card</p>
            <p class="campoNormal">${order.credit}</p>
        </div>
        <div>
        <p id="titulo">Total Price</p>
        <p class="campoNormal">${order.totalPrice}</p>
    </div>
        <div class="pd${id}" id="productosPedido2">

        </div>
    </div>`

    document.getElementById("contentProfileOrders").innerHTML += divPedido

    let id2 = "pd" + id
    for (let i=0; i<order.products.length; i++) {
        getProdu(order.products[i], id2)
    }
}

// get producto
function getProdu(productI, id) {
    const url = "https://golopop-backend.herokuapp.com/products/" + productI.id

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onload = () => {
        if (xhr.status === 200) {
            let product = JSON.parse(xhr.responseText)

            cargarProdu(productI, id, product)
        }
    }
}

// Ver productos de pedido
function cargarProdu(productI, id, produ) {
    let precio = (productI.cant * produ.price).toFixed(2)
    let divProduct = `
    <div id="prPed">
        <div>
            <p id="titulo">Name</p>
            <p class="campoNormal">${produ.name}</p>
        </div>
        <div>
            <p id="titulo">Cant</p>
            <p class="campoNormal">${productI.cant}</p>
        </div>
        <div>
            <p id="titulo">Price</p>
            <p class="campoNormal">${precio}</p>
        </div>
    </div>`

    document.querySelector("." + id).innerHTML += divProduct
}