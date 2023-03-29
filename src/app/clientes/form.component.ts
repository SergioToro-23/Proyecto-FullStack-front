import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';//para obtener el id se usa activatedRoute
import swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit{

  protected titulo: String = "Crear mi Cliente"
  protected cliente: Cliente = new Cliente() //atributo tipo clase cliente,  y ngModel toma datos del form y lo pobla
  //osea es un binding = poblar/enlazar, osea mapea el formulario al objeto
  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }//inyecta la clase service, e inyecta router
    
  ngOnInit(): void {
      this.cargarCliente()
  }

  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params=>{//un observador que esta observando cuando le pasemos el parametro
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)//coje el id y lo asigna al objeto
      }
    })
  }  

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(//envia el objeto de la clase con el objeto de cliente service inyectado
      cliente =>{ //respuesta y alguna accion, y redirigir
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente',`Cliente ${cliente.nombre} creado con éxito!`, 'success')
      }//una vez creado el objeto retorna un redirect a la vista de todos los clientes
    )
      
    console.log("Clicked!");//el metodo create se conecta al apirest y persiste el objeto cliente que enviemos atravez del formulario
    console.log(this.cliente);//muestra el objeto cliente con sus datos, pero como es atributo le pone this
  }

  update(): void{
    this.clienteService.update(this.cliente)//llama a el metodo update de la clase clienteService y le envia el objeto cliente
    .subscribe( cliente =>{//lo suscribimos,registramos el observador, osea la respuesta, osea el cliente, una vez que se actualiza va lo de abajo
      this.router.navigate(['/clientes'])//redirige al listado de clientes
      swal.fire('Cliente Actualizado',`Cliente ${cliente.nombre} actualizado con éxito!`, 'success')//y muestra un mensaje de exitoso
    })
  } 


}
