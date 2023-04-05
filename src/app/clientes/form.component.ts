import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';//para obtener el id se usa activatedRoute
import swal from 'sweetalert2';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  protected titulo: String = "Crear mi Cliente"
  protected cliente: Cliente = new Cliente() //atributo tipo clase cliente,  y ngModel toma datos del form y lo pobla
  protected errores: string[];//toca asignarle un nuevo valor

  //osea es un binding = poblar/enlazar, osea mapea el formulario al objeto
  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.errores = [];
  }//inyecta la clase service, e inyecta router

  ngOnInit(): void {
    this.cargarCliente()//aca carga la info del cliente repectivo al id de la url dentro del objeto cliente de este componente
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {//un observador que esta observando cuando le pasemos el parametro
      let id = params['id']//asigna el valor del parámetro id de la URL a la variable id.
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)//coje el id y lo asigna al objeto
      }
    })
  }

  public create(): void {
    this.clienteService.create(this.cliente)
      .pipe(tap(//envia el objeto de la clase con el objeto de cliente service inyectado
        cliente => { //respuesta y alguna accion, y redirigir, mediante el nombre json, accede al map que envia springboot
          this.router.navigate(['/clientes'])
          swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxitos!`, 'success')//y aca saca el cliente y el nombre del map json que viene
          //swal.fire('Nuevo cliente', `${json.mensaje}: ${json.cliente.nombre}`, 'success')//mas optimizado, usa el mensaje que viene en el map
        }),//una vez creado el objeto retorna un redirect a la vista de todos los clientes
        catchError(err => {
          this.errores = err.error.errors as string[];
          console.log('codigo de error desde el backend: ' + err.status);
          console.log(err.error.errors);
          return of(err)
        })//la variable local = a la entrada.(json de errores).(todos los errores)
      ).subscribe();//finalmente se llama para activar el observable y recibir los valores.

    console.log("Clicked!");//el metodo create se conecta al apirest y persiste el objeto cliente que enviemos atravez del formulario
    console.log(this.cliente);//muestra el objeto cliente con sus datos, pero como es atributo le pone this
  }

  update(): void {
    this.clienteService.update(this.cliente)//llama a el metodo update de la clase clienteService y le envia el objeto cliente
      .pipe(tap(
        json => {//lo suscribimos,registramos el observador, osea la respuesta, osea el cliente, una vez que se actualiza va lo de abajo
          this.router.navigate(['/clientes'])//redirige al listado de clientes
          swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success');//y muestra un mensaje de exitoso
        }),
        catchError(err => {
          this.errores = err.error.errors as string[];
          console.log('codigo de error desde el backend: ' + err.status);
          console.log(err.error.errors);
          return of(err)
        })
      ).subscribe();
  }


}
