function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetch("https://apicfe.onrender.com/api/auth/login", {
        method: 'POST',
        mode: "cors",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: username, contraseña: password }),

    }).then(response => {
        if (response.status !== 200) {
            document.getElementById('error').innerHTML = 'CREDENCIALES INCORRECTAS';
        }
        else {
            response.json().then(data => {
                localStorage.setItem("token", data.token)
                window.location.href = '/cuchillas_cfe/panel.html'
            })

        }
    }) // Analizar la respuesta como JSON
        .catch(error => console.error(error));
}
