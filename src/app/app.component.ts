import { Component } from '@angular/core';

@Component({//como en spring es una denotacion de componente
  selector: 'app-root',//corresponde a una etiqueta html
  templateUrl: './app.component.html',//es la vista asociada a esta clase component
  styleUrls: ['./app.component.css']//igual la css
})
export class AppComponent {//por tanto esa notacion marca esta clase como componente
  title = 'Bienvenido Angular';
  curso: string = 'curso spring 5 con Angular';//definiendo el tipado, es buena practica
  profesor: string = 'sergioo';
}
