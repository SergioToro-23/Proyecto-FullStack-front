import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import {tap} from 'rxjs/operators'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes!: Cliente[];

  constructor(private clienteService: ClienteService) { }//declarar el atributo de la clase service en el constr, con inyeccion de dependencias se inyecta

  ngOnInit(): void {
    //forma sincrona sin ser reactivo
    //this.clientes = this.clienteService.getClientes();   //INICIALIZA el atributo clientes y le asigna la constante dentro del archivo CLIENTES.JSON
    //forma reactiva con stream
    this.clienteService.getClientes().pipe(//permite hacer cosas en el flujo y modificarlo
      tap(clientes => {//permite hacer cosas, recibe de service un objeto tipo Cliente[]
        console.log("tap 3 de clientes component")
        clientes.forEach(cliente => {//lo itera
          console.log(cliente.nombre)          
        });
        this.clientes = clientes//lo asigna el arreglo a la variable de este componente que se llama clientes
      })
    ).subscribe();//suscribir o registrar el observador a los clientes
      //(clientes => this.clientes = clientes) funcion anonima, asigna en el atributo clientes, el valor que se recibe desde clientes service
    //osea el listado de clientes, cada vez que hay cambios

  }

  delete(cliente: Cliente): void {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {//cuando responda hace esto
            this.clientes = this.clientes.filter(clientes => clientes !== cliente)//dice que muestre en la tabla, clientes que sean direntes al cliente recien eliminado
            swalWithBootstrapButtons.fire(
              'Deleted!',
              `Cliente ${cliente.nombre} eliminado con exito.`,
              'success'
            )
          }
        )
      }
    })


  }


}
