import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'  
})
export class DirectivaComponent {

  listaCurso: string[] = ['TypeScript', 'JavaScript', 'Java SE','C#','PHP'];
  habilitar: boolean = true;
  titulo_btn: string ='Quitar';

  setHabilitar(): void {
    this.habilitar = (this.habilitar==true)? false : true; //este metodo no retorna nada y usa los atributos de la clase, por eso el this
    this.titulo_btn = this.habilitar==true? 'Quitar':'Mostrar';
  }

}


