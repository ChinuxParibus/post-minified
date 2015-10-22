/* Aunque no se esté usando Node.js, Minified.js usa su propia forma de AMD (Asyncronous Module Definition) */
var MINI = require('minified');

/* Definición de espacios de nombre para todas las funciones de Minified.js */
var _ = MINI._,				// Helper de funciones Javascript (basado en "_")
		$ = MINI.$,				// Manipulación de DOM (como jQuery o Zepto)
		$$ = MINI.$$,			// Efectos especiales y transiciones CSS
		EE = MINI.EE,			// Creación de nodos y elementos del DOM
		HTML = MINI.HTML;	// Compilación de templates HTML (basado en mustache)

/* Manejador del Evento onload (como en jQuery o Zepto)*/
$(function() {
	// "_" tiene [casi] las mismas funciones de Underscore
	var today = _.formatValue('dd-MM-yyyy hh:mm a', new Date()),
	// Sintaxis de templates como mustache
			template = '<div class="todo"><h3 style="display: inline-block;">{{title}}<span class="u-pull-left" style="margin-right: 5px;"><i class="octicon octicon-x"></i></span></h3><span class="u-pull-right">{{date}}</span><p class="content">{{content}}</p></div>'
	//EE() permite crear elementos y nodos del DOM, también permite anidar elementos y crear formas complejas de interacción
			todoForm = EE('form', {'@id': 'todoForm'}, [
				EE('input', {'@id': 'title', '@type': 'text', '@placeholder': 'Título', '$marginRight': '5px'}),
				EE('input', {'@id': 'content', '@type': 'text', '@placeholder': 'Descripción', '@size': '69', '$marginRight': '5px'}),
				EE('button', {'@id': 'newTodo', 'className': 'button-primary'}, 'Nueva Tarea')
			]);

	// .add() añade un nodo hijo al selector
	$('#form').add(todoForm);

	// .toggle() permite crear mapas de animaciones o cambios entre dos estados
	var toggleForm = $('#form').toggle(
	//$$slide y $$fade maneja interacción automática slideIn y slideOut / fadeIn y fadeOut respectivamente
		{'$$slide': 0},
		{'$$slide': 1},
		300
	);

	// Manejo de eventos personalizados (click, change, focus, hover)
	$('#add').onClick(function() {
		toggleForm();
	});

	$('#newTodo').onClick(function() {
		var todo = {
			title: $('#title').get('value'), //Universal .get()
			date: today,
			content: $('#content').get('value')
		};

		toggleForm();

		$('#title, #content').set({'value': ''}); //Universal .set()

		//HTML() permite la "compilación" de templates con objetos
		$('#todo-list').add(HTML(template, todo));

		//Manejador de eventos asíncronos
		$('.octicon-x').onClick(closeTodoHandler);
	});

	function closeTodoHandler(e, index) {
		var self = this; // Viejo truco ^^'
		this.up('.todo')
			.animate({'$$fade': 1, '$$fade': 0}, 300) //Manejo de transiciones
			.then(function() { //Manejo de API Promises A+
				self.up('.todo').remove();
			});
	}

});