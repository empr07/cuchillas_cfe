let url = 'https://apicfe.onrender.com/api/subestaciones'
const tableBody = document.querySelector('#table-body');
const btnSearch = document.querySelector('#btn-search');

if(!localStorage.getItem('token')){
    window.location.href = '/index.html'
}

fetch(url, {
    headers: {
        'Authorization': 'token ' + localStorage.getItem('token')
    },
})
    .then(response => response.json())
    .then(data => {
        data.forEach(subestacion => {
            let actualizado = subestacion.updatedAt != null ? String(subestacion.updatedAt).slice(0, 10) : "Sin actualización"
            let registro = subestacion.createdAt != null ? String(subestacion.updatedAt).slice(0, 10) : "Sin registro"
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td class="text-center">${subestacion.id}</td>
                        <td class="text-center">${subestacion.nombre}</td>
                        <td class="text-center">${subestacion.area.nombre}</td>
                        <td class="text-center">${registro}</td>
                        <td class="text-center">${actualizado}</td>
                        <td class="text-center">
                            <div class="flex" style="justify-content: space-evenly;">
                                <a onclick="detalle(${subestacion.id})" class="btn btn-outline-warning p-1" title="Detalles">
                                    <i class="fa fa-brands fa-list p-2"></i>
                                </a>
                                <a onclick="editar(${subestacion.id})" class="btn btn-outline-primary p-1" title="Editar">
                                    <i class="fa fa-brands fa-pencil p-2"></i>
                                </a>
                                <a onclick="eliminar(${subestacion.id})" class="btn btn-outline-danger p-1" title="Eliminar">
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
                let nombreUpper = value.nombre.toUpperCase()
                if (nombreUpper.includes(textValue)) {
                    filterData.push(value)
                }
            }
            )
            filterData.forEach(subestacion => {
                let registro = subestacion.createdAt != null ? String(subestacion.updatedAt).slice(0, 10) : "Sin registro"
                let actualizado = subestacion.updatedAt != null ? String(subestacion.updatedAt).slice(0, 10) : "Sin actualización"
                const row = document.createElement('tr');
                row.innerHTML = `
                <td class="text-center">${subestacion.id}</td>
                <td class="text-center">${subestacion.nombre}</td>
                <td class="text-center">${subestacion.area.nombre}</td>
                <td class="text-center">${registro}</td>
                <td class="text-center">${actualizado}</td>
                <td class="text-center">
                    <div class="flex" style="justify-content: space-evenly;">
                        <a onclick="detalle(${subestacion.id})" class="btn btn-outline-warning p-1" title="Detalles">
                            <i class="fa fa-brands fa-list p-2"></i>
                        </a>
                        <a onclick="editar(${subestacion.id})" class="btn btn-outline-primary p-1" title="Editar">
                            <i class="fa fa-brands fa-pencil p-2"></i>
                        </a>
                        <a onclick="eliminar(${subestacion.id})" class="btn btn-outline-danger p-1" title="Eliminar">
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

function editar(id_subestacion) {
    localStorage.setItem("id_subestacion", id_subestacion)
    window.location.href = './subestacion/formulario.html'
}

function crear() {
    localStorage.removeItem("id_subestacion")
    window.location.href = './subestacion/formulario.html'
}

function detalle(id_subestacion) {
    localStorage.setItem("id_subestacion", id_subestacion)
    window.location.href = './subestacion/detalle.html'
}


function eliminar(id_subestacion) {
    Swal.fire({
        focusConfirm: false,
        title: '¿Estas seguro de realizar esta acción?',
        text: '¡La subestacion ' + id_subestacion + ' será eliminada!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#D33',
        cancelButtonColor: '#C0C0C0',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar!',

    }).then((result) => {
        if (result.isConfirmed) {
            fetch(url + '/' + id_subestacion, {
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