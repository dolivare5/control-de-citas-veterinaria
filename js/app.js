// Campos del formulario
const inputMascota = document.querySelector('#mascota');
const inputPropietario = document.querySelector('#propietario');
const inputTelefono = document.querySelector('#telefono');
const inputFecha = document.querySelector('#fecha');
const inputHora = document.querySelector('#hora');
const inputSintomas = document.querySelector('#sintomas');

// User Interface ==> UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');
let editando;
let citasArr = [];


// Clases a utilizar
class Citas {
    constructor() {
        citasArr = [];
    }

    agregarCita(cita){
        citasArr.push(cita);
        this.sincronizarStorage();
        ui.imprimirAlerta('Cita registrada correctamente.')
    }
    sincronizarStorage(){
        localStorage.setItem('citas', JSON.stringify(citasArr));
        this.cargarCitas();
    }

    cargarCitas(){
        citasArr = JSON.parse(localStorage.getItem('citas')) || [];
        ui.imprimirCitas();
    }

    eliminarCita(id){
        citasArr = citasArr.filter( cita => cita.id !== id);
        this.sincronizarStorage();
    }
    editarCita(citaActualizada){
        citasArr = citasArr.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        this.sincronizarStorage();
    }

}

class UI {
    imprimirAlerta(mensaje, tipo){
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('tex-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de error
        if (tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta despues de 5 segundos
        setTimeout(() =>{
            divMensaje.remove();
        }, 5000)
    }

    imprimirCitas() { // Aplico destructuring para acceder directamente a la cita que se pasa.
        this.limpiarHTML();
        //Ahora se recorren cada uina de las citas
        if (citasArr.length > 0){
            citasArr.forEach(cita => {
                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;

                // Scripting de los elementos de la cita

                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                mascotaParrafo.textContent = mascota;

                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`

                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span> ${telefono}`

                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`

                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`

                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas: </span> ${sintomas}`

                // Boton Para eliminar Cita
                const btnEliminar = document.createElement('button');
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML='Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\n' +
                    '  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />\n' +
                    '</svg>';

                btnEliminar.onclick = () => eliminarCita(id);

                // Boton para editar una cita
                const btnEditar= document.createElement('button');
                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML='Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">\n' +
                    '  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />\n' +
                    '</svg>';

                btnEditar.onclick = () => cargarEdicion(cita);
                // Agregar los parrafos al divCita
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);


                // Agregar la cita al HTML
                contenedorCitas.appendChild(divCita);
            })
        }

    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

// Se intancian de forma global porque se va a utilizar esta instancia en más de una funciónm
const ui = new UI();
const administrarCitas = new Citas();

// Registro de eventos
eventListeners();
function eventListeners() {
    inputMascota.addEventListener('input', datosCita);
    inputPropietario.addEventListener('input', datosCita);
    inputTelefono.addEventListener('input', datosCita);
    inputFecha.addEventListener('input', datosCita);
    inputHora.addEventListener('input', datosCita);
    inputSintomas.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
    document.addEventListener('DOMContentLoaded', administrarCitas.cargarCitas)
}


// Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

function reiniciarObjeto() {
    citaObj.mascota =  '';
    citaObj.propietario= '';
    citaObj.telefono= '';
    citaObj.fecha= '';
    citaObj.hora = '';
    citaObj.sintomas= '';
}

// Agregar datos al objeto de cita
function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva Cita a la clase de Citas
function nuevaCita(e) {
    e.preventDefault();

    // Extraer la información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if (mascota === '' || propietario ==='' || telefono === '' || fecha === '' || hora === '' || sintomas === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    }else{
        if (!editando){
            // Generar un id unico
            citaObj.id = Date.now();
            // Creando una nueva cita
            administrarCitas.agregarCita(citaObj);
            // Se pasa una copia del obj y no una referencia para que se modifique los datos anterios que para que este no se reescriba

        }else{
            ui.imprimirAlerta('Cita modifica Correctamente');

            administrarCitas.editarCita(citaObj)

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        }

        ui.imprimirCitas(administrarCitas);
        // Reinicia el formulario
        formulario.reset();
        //Reinicia el objeto
        reiniciarObjeto();
        // Mostrar HTML
    }


}

// Elimina una Cita
function eliminarCita(id) {
    // Eliminar la cita
    administrarCitas.eliminarCita(id)
    // Mostrar mensajes
    ui.imprimirAlerta('La cita se ha eliminado satisfactoriamente');
    // Refrescar las Citas
    ui.imprimirCitas();
}

// Editar una cita
function cargarEdicion(cita) {
    console.log(cita);
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    // Llenar los inputs
    inputMascota.value = mascota;
    inputPropietario.value = propietario;
    inputTelefono.value = telefono;
    inputFecha.value = fecha;
    inputHora.value = hora;
    inputSintomas.value = sintomas;

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

