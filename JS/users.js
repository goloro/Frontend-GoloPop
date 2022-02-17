// IMPORTS
import RequestHandler from "./requestHandler.js"

// VARIABLES CONST
const requestHandler = new RequestHandler()
// MENU
const Login = document.getElementById("Login")
const SignUp = document.getElementById("SignUp")
const Profile = document.getElementById("Profile")
const Logout = document.getElementById("Logout")
// VENTANAS FLOTANTES
const login = document.getElementById("loginContainer")
const signUp = document.getElementById("signUpContainer")
// FORMS
const loginButton = document.getElementById("loginButton")
const loginEmail = document.getElementById("loginEmail")
const loginPass = document.getElementById("loginPassword")
const signUpButton = document.getElementById("signUpButton")
const signUpEmail = document.getElementById("signUpEmail")
const signUpName = document.getElementById("signUpName")
const signUpLastName = document.getElementById("signUpLastName")
const signUpPass = document.getElementById("signUpPassword")
const signUpBirthDay = document.getElementById("signUpBirthDay")

// Comprobación Sesión
const user = JSON.parse(localStorage.getItem('user'))

if (user == null) {
    deslogueado()
} else {
    logueado()
}

// FUNCIONALIDAD MENU
    // Abrir menu pulsando en icono
    document.getElementById("user").addEventListener("click", function() {
        document.getElementById("idMenu").classList.toggle("show")
    })
    // Mostrar Login / BUTTON LOGIN
    function mostrarLogin() {login.style.display = "block"}
    Login.addEventListener("click", function() {
        mostrarLogin()
        cerrarSignUp()
        document.querySelector(".bodyContent").style.filter = "blur(6px)"
    })
    // Mostrar SignUp / BUTTON SIGNUP
    function mostrarSignUp() {signUp.style.display = "block"}
    SignUp.addEventListener("click", function() {
        mostrarSignUp()
        cerrarLogin()
        document.querySelector(".bodyContent").style.filter = "blur(6px)"
    })
    // Cerrar Login
    function cerrarLogin() {login.style.display = "none"}
    document.getElementById("closeLogin").addEventListener("click", function() {
        cerrarLogin()
        document.querySelector(".bodyContent").style.filter = "none"
    })
    // Cerrar SignUp
    function cerrarSignUp() {signUp.style.display = "none"}
    document.getElementById("closeSignUp").addEventListener("click", function() {
        cerrarSignUp()
        document.querySelector(".bodyContent").style.filter = "none"
    })
    // Mostrar Perfil / BUTTON PROFILE
    Profile.addEventListener("click", function() {
        window.open("../HTML/profile.html", "_self")
    })
    // Logout / BUTTON LOGOUT
    Logout.addEventListener("click", function() {
        deslogueado()
        localStorage.clear()
        window.open("../index.html", "_self")
    })

// Logueado (Mostrar Profile y Logout / Ocultar Login y SignUp)
function logueado() {
    Login.style.display = "none"
    SignUp.style.display = "none"
    Profile.style.display = "block"
    Logout.style.display = "block"
}
// Deslogueado (Mostrar Login y SignUp / Ocultar Profile y Logout)
function deslogueado() {
    Login.style.display = "block"
    SignUp.style.display = "block"
    Profile.style.display = "none"
    Logout.style.display = "none"
}

// set problem
function setProblem(txt) {
    let problem = document.getElementById("problems")
    problem.style.display = "flex"

    document.getElementById("thing").innerHTML = txt
}

// login
loginButton.addEventListener("click", e => {
    e.preventDefault()

    let email = loginEmail.value
    let password = loginPassword.value

    const url = "https://golopop-backend.herokuapp.com/users/" + email

    if (email.match('[^@ \t\r\n]+@gmail\.com') == null) {
        setProblem("Email invalid format")
        loginEmail.value = ""
        loginPass.value = ""
    } else {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.send()
        xhr.onload = () => {
            if (xhr.status === 200) {
                let user = JSON.parse(xhr.responseText)
    
                if (user != null) {
                    if (user.password === password) {
                        document.querySelector(".bodyContent").style.filter = "none"
                        cerrarLogin()
                        logueado()
                        localStorage.setItem('user', JSON.stringify(user))
                        document.getElementById("problems").style.display = "none"

                        window.open("./HTML/profile.html", "_self")
                    } else {
                        setProblem("Wrong password")
                        loginPass.value = ""
                    }
                } else {
                    setProblem("Email not found")
                    loginEmail.value = ""
                    loginPass.value = ""
                }
            }
        }
    }
})

// registro
signUpButton.addEventListener("click", e => {
    e.preventDefault()

    let emailV = signUpEmail.value
    let nameV = signUpName.value
    let lastNameV = signUpLastName.value
    let passwordV = signUpPass.value
    let birthDateV = signUpBirthDay.value

    if (emailV.match('[^@ \t\r\n]+@gmail\.com') != null) {
        let hoy = new Date()
        let fechaNacimiento = new Date(birthDateV)
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
        let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
        if (
          diferenciaMeses < 0 ||
          (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
        ) {
          edad--
        }

        if (edad >= 18) {
            if (nameV != "" && name != " " && lastNameV != "" && lastNameV != " " && passwordV != "" && passwordV != " ") {
                let user = {
                    email: emailV,
                    name: nameV,
                    lastName: lastNameV,
                    password: passwordV,
                    birthDate: birthDateV
                }
                const url = "https://golopop-backend.herokuapp.com/users/add"

                const xhr = new XMLHttpRequest()
                xhr.open('POST', url, true)
                xhr.setRequestHeader("content-type", "application/json");
                xhr.onreadystatechange = function() {
            
                    if (this.readyState == 4 && this.status == 200) {
                        document.querySelector(".bodyContent").style.filter = "none"
                        cerrarSignUp()
                        logueado()
                        localStorage.setItem('user', JSON.stringify(user))
                        document.getElementById("problems").style.display = "none"
            
                        window.open("./HTML/profile.html", "_self")
                    }
            
                }
                xhr.send(JSON.stringify(user))
            } else {
                setProblem("Empty fields")
            }
        } else {
            setProblem("You must be of legal age")
            signUpBirthDay.value = ""
        }
    } else {
        setProblem("Email invalid format")
        signUpEmail.value = ""
    }
})