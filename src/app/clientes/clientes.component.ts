import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes!: Cliente[];    

  constructor(private clienteService: ClienteService){}//declarar el atributo de la clase service en el constr, con inyeccion de dependencias se inyecta

  ngOnInit(): void {
    //forma sincrona sin ser reactivo
    //this.clientes = this.clienteService.getClientes();   //INICIALIZA el atributo clientes y le asigna la constante dentro del archivo CLIENTES.JSON
    //forma reactiva con stream
    this.clienteService.getClientes().subscribe(//suscribir o registrar el observador a los clientes
      CLIENTES => this.clientes = CLIENTES//function anonima, asigna en el atributo clientes, el valor que se recibe desde clientes service
      );//osea el listado de clientes, cada vez que hay cambios

  }

  delete(cliente: Cliente): void{

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
                    this.clientes = this.clientes.filter(cli => cli!== cliente)//si cada uno de los clientes de la lista es distinto al que vamos a eliminar, lo muestra en la lista                  
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
