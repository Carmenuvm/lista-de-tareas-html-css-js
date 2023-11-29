const d = document; // guardamos el objeto document en una variable para abreviar su uso

// guardamos en variables los elementos del dom que vamos a necesitar
const formulario = d.querySelector("#formulario");
const inputTarea = d.querySelector("#inputTarea");
const areaListaTareas = d.querySelector("#listaTareas");
const filtro = d.querySelector("#filtro");

// la variable listaTareas contiene la lista de tareas
let listaTareas = [];
// la variable opcionFiltro contiene la opcion de filtrado, por defecto va a ser 1
let opcionFiltro = "1";

// revisamos si se encuentra guardada la lista de tareas en el local storage, de ser
// cierto, almacenamos su valor en la variable listaTareas
if (JSON.parse(localStorage.getItem("tareas")).length > 0) {
  listaTareas = JSON.parse(localStorage.getItem("tareas"));
}

/* 
  funcion muestraTareas recibe 2 parametros:
  lista: es un array que contiene la lista de tareas, por defecto es []
  opcion: es string con el valor de la opcion de filtrado de datos
*/
function muestraTareas(lista = [], opcion) {
  // guardamos la lista de tareas en el localStorage
  localStorage.setItem("tareas", JSON.stringify(lista));

  /* 
    si la opcion es 2 filtramos los datos con los tareas por completar
    y si la opcion es 3 los datos seran los de las tareas completadas
    si no se cumplen estas condiciones la lista sera de todas las tareas 
  */
  if (opcion == "2") {
    lista = lista.filter((item) => {
      return item.estado == false;
    });
  } else if (opcion == "3") {
    lista = lista.filter((item) => {
      return item.estado != false;
    });
  }

  /* 
    si la lista de tareas esta vacias pintamos en el elemento del DOM #listaTareas un mensaje 
    de aviso que no hay tareas para mostrar. De lo contrario recorremos la lista de tareas
    para almacenar el html de cada tarea en una variable y luego pintarla en el elemento del DOM #listaTareas
  */
  if (lista.length < 1) {
    areaListaTareas.innerHTML = "No hay tareas";
  } else {
    let tareasHtml = "";
    lista.map((item) => {
      tareasHtml += `
				<div class="lista-item">
					<div class="check-item">
						<input 
              type="checkbox" 
              class="estado" 
              estado=${item.id} 
              ${item.estado ? "checked" : ""}
            />
					</div>
					<div class="tarea-item">
						${item.tarea}
					</div>
					<div class="opciones-item">
						<span class="borrar" borrar=${item.id}>X</span>
					</div>
				</div>
			`;
    });
    areaListaTareas.innerHTML = tareasHtml;
  }
}

// asignamos un evento submit al formulario para guardar la lista de tareas
formulario.addEventListener("submit", (e) => {
  // e.preventDefault() nos ayuda a que la pagina no se recargue al momento de hacer el envio del formulario
  e.preventDefault();

  // si el input con el nombre de la tarea esta vacio, devolvemos la funcion sin hacer nada
  if (inputTarea.value.trim() == "") return;

  // aguregamos a la lista de tareas un objeto con los datos de la tarea
  listaTareas.push({
    id: Date.now() + Math.random(), // generamos un id al documento usando las funciones Date.now y Math.random
    tarea: inputTarea.value, // valor del input con la tarea
    estado: false, // el estado de la tarea indica si esta terminada o no, por defecto es false
  });

  // se reinicial el formulario luego de agregar la tarea
  formulario.reset();

  // el filtro de tareas pasa a ser 1 para que muestre todas las tareas
  filtro.value = "1";
  opcionFiltro = "1";

  // se llama la funcion muestraTareas para guardar en el localStorage la lista actualizada y mostrar la lista
  muestraTareas(listaTareas, opcionFiltro);
});

/* 
  delegamos los eventos de borrar y cambiar el estado de una tarea añadiendo un evento click
  en el elemento del DOM div#listaTareas
*/
areaListaTareas.addEventListener("click", (e) => {
  /*  
    Borrar tarea
    validamos si el elmento que lanza el evento tiene la clase borrar, en caso de ser así
    extraemos el id de la tarea a traves del atributo borrar que se le agregó al documento,
    con la funcion filter de los arrays devolvemos los elemento de la lista excepto el elemento
    a borrar y loalmacenamos en la variable listaTareas para finalmente hacer el llamado a la
    funcion muestraTareas para almacenar en el localStorage la nueva lista y mostrarla en la interface
  */
  if (e.target.className == "borrar") {
    const id = e.target.attributes.borrar.value;

    listaTareas = listaTareas.filter((item) => item.id != id);

    muestraTareas(listaTareas, opcionFiltro);
  } else if (e.target.className == "estado") {
  /* 
    Cambiar estado de la tarea
    validamos si el elmento que lanza el evento tiene la clase estado, en caso de ser así
    extraemos el id de la tarea a traves del atributo estado que se le agregó al documento,
    con la funcion map de los arrays devolvemos la lista de tareas con el elemento editado
    para finalmente hacer el llamado a la funcion muestraTareas para almacenar en el localStorage
    la nueva lista y mostrarla en la interface

  */
    const id = e.target.attributes.estado.value;

    listaTareas = listaTareas.map((item) => {
      if (item.id == id) {
        item.estado = !item.estado;
      }
      return item;
    });
    muestraTareas(listaTareas, opcionFiltro);
  }
});

/* 
  asignamos el evento change al elemento del DOM select#filtro dondeo cada vez
  que cambie de valor actualize la variable opcionfiltro y hacer el llamado a la 
  funcion muestraTareas mostrar los elementos filtrados en la interface
*/
filtro.addEventListener("change", (e) => {
  opcionFiltro = e.target.value;
  muestraTareas(listaTareas, opcionFiltro);
});

muestraTareas(listaTareas);
