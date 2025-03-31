let url = 'https://apicfe.onrender.com/api/usuarios'
const tableBody = document.querySelector('#table-body');
const btnSearch = document.querySelector('#btn-search');

if (!localStorage.getItem('token')) {
    window.location.href = '/index.html'
}

fetch(url, {
    headers: {
        'Authorization': 'token ' + localStorage.getItem('token')
    },
})
    .then(response => response.json())
    .then(data => {
        data.forEach(usuario => {
            let actualizado = usuario.updatedAt != null ? String(usuario.updatedAt).slice(0, 10) : "Sin actualización"
            let registro = usuario.createdAt != null ? String(usuario.updatedAt).slice(0, 10) : "Sin registro"
            let esadministrador = usuario.esadministrador ? "Administrador" : "Usuario Normal"
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td class="text-center">${usuario.id}</td>
                        <td class="text-center" style="width: 30%">${usuario.nombres} ${usuario.apellido_p} ${usuario.apellido_m}</td>
                        <td class="text-center">${usuario.correo}</td>
                        <td class="text-center">${usuario.puesto}</td>
                        <td class="text-center">${esadministrador}</td>
                        <td class="text-center" style="width: 15%">${registro}</td>
                        <td class="text-center" style="width: 15%">${actualizado}</td>
                        <td class="text-center" style="width: 30%">
                            <div class="flex" style="justify-content: space-evenly;">
                                <a onclick="detalle(${usuario.id})" class="btn btn-outline-warning p-1" title="Detalles">
                                    <i class="fa fa-brands fa-list p-2"></i>
                                </a>
                                <a onclick="editar(${usuario.id})" class="btn btn-outline-primary p-1" title="Editar">
                                    <i class="fa fa-brands fa-pencil p-2"></i>
                                </a>
                                <a onclick="eliminar(${usuario.id})" class="btn btn-outline-danger p-1" title="Eliminar">
                                    <i class="fa fa-brands fa-trash p-2"></i>
                                </a>
                            </div>
                        </td>
                        `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error(error));

function search() {
    tableBody.innerHTML = ""
    btnSearch.disabled = true

    fetch(url, {
        headers: {
            'Authorization': 'token ' + localStorage.getItem('token')
        },
    })
        .then(response => response.json())
        .then(data => {
            var inputSearch = document.querySelector('#inputSearch');
            let textValue = inputSearch.value.toUpperCase()
            const tableBody = document.querySelector('#table-body');
            let filterData = []
            data.forEach(value => {
                let nombresUpper = (value.nombres + " " + value.apellido_p + " " + value.apellido_m).toUpperCase()
                if (nombresUpper.includes(textValue)) {
                    filterData.push(value)
                }
            }
            )
            filterData.forEach(usuario => {
                let actualizado = usuario.updatedAt != null ? String(usuario.updatedAt).slice(0, 10) : "Sin actualización"
                let registro = usuario.createdAt != null ? String(usuario.updatedAt).slice(0, 10) : "Sin registro"
                let esadministrador = usuario.esadministrador ? "Administrador" : "Usuario Normal"
                const row = document.createElement('tr');
                row.innerHTML = `
                <td class="text-center">${usuario.id}</td>
                <td class="text-center" style="width: 30%">${usuario.nombres} ${usuario.apellido_p} ${usuario.apellido_m}</td>
                <td class="text-center">${usuario.correo}</td>
                <td class="text-center">${usuario.puesto}</td>
                <td class="text-center">${esadministrador}</td>
                <td class="text-center" style="width: 15%">${registro}</td>
                <td class="text-center" style="width: 15%">${actualizado}</td>
                <td class="text-center" style="width: 30%">
                    <div class="flex" style="justify-content: space-evenly;">
                        <a onclick="detalle(${usuario.id})" class="btn btn-outline-warning p-1" title="Detalles">
                            <i class="fa fa-brands fa-list p-2"></i>
                        </a>
                        <a onclick="editar(${usuario.id})" class="btn btn-outline-primary p-1" title="Editar">
                            <i class="fa fa-brands fa-pencil p-2"></i>
                        </a>
                        <a onclick="eliminar(${usuario.id})" class="btn btn-outline-danger p-1" title="Eliminar">
                            <i class="fa fa-brands fa-trash p-2"></i>
                        </a>
                    </div>
                </td>
                `;
                tableBody.appendChild(row);
            });

            btnSearch.disabled = false

        })
        .catch(error => {
            console.error(error)
            btnSearch.disabled = false
        });


}

function editar(id_usuario) {
    localStorage.setItem("id_usuario", id_usuario)
    window.location.href = './usuario/formulario.html'
}

function crear() {
    localStorage.removeItem("id_usuario")
    window.location.href = './usuario/formulario.html'
}

function detalle(id_usuario) {
    localStorage.setItem("id_usuario", id_usuario)
    window.location.href = './usuario/detalle.html'
}


function eliminar(id_usuario) {
    Swal.fire({
        focusConfirm: false,
        title: '¿Estas seguro de realizar esta acción?',
        text: '¡El usuario ' + id_usuario + ' será eliminado!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#D33',
        cancelButtonColor: '#C0C0C0',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',

    }).then((result) => {
        if (result.isConfirmed) {
            fetch(url + '/' + id_usuario, {
                method: 'DELETE',
                mode: "cors",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + localStorage.getItem('token')
                },

            }).then(response => {
                if (response.status == 200 || response.status == 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Acción realizada con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.search();

                }
                else if (response.status == 403) {
                    window.location.href = "../index.html"
                }
                else if (response.status >= 500) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al realizar la acción',
                        text: 'Intentelo más tarde o elimine las dependencias',
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            })
        }
    })
}