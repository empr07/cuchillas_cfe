if(!localStorage.getItem('token')){
    window.location.href = '/index.html'
}

const token = localStorage.getItem("token")
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const dataToken = parseJwt(token)
document.getElementById("welcome-user").innerHTML = "Bienvenido al panel " + dataToken.nombres + " " + dataToken.apellido_p + " " + dataToken.apellido_m

