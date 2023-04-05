import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';//importa desde un json la data
import { Cliente } from './cliente';
import { asapScheduler, Observable, throwError } from 'rxjs';//ESTO ES PARA USAR STREAM, REACTIVE EXTENTION, throw error para retornar erroes observables
import { catchError, map, tap } from 'rxjs/operators';//cathc error, operador que intercepta el observable o flujo en busqueda de fallos, y si falla se obitenen este objeto dentro del operador .pipe()
import { HttpClient, HttpHeaders } from '@angular/common/http';//para trabajar http
import swal from 'sweetalert2';
import { Router } from '@angular/router';//redireccionar
import { formatDate } from '@angular/common';//formato fecha


//aca es donde estamos trabajando con nuestro datos, es donde estamos obteniendo la logica de negocio desde el backend

@Injectable({//injectable, es para clases de servicios, representan logica de negocio
  providedIn: 'root'//se puede inyectar a otros componentes, via inyeccion de dependencias
})
export class ClienteService {//ESTA  clase es para majear los datos de los clientes

  private urlEndPoint: string = 'http://localhost:8080/api/clientes'//ubicacion del back
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })//las cabeceras

  constructor(private http: HttpClient, private router: Router) { }//definimos la variable http y se inyecta la referencia, para REST
  //definimos la variable router para redireccionar  
  /* MODO NORMAL SINCRONO
    getClientes(): Cliente[] {
      return CLIENTES;
    }*/

  //ESTE ES REACTIVO, RETORNA UN STREAM
  getClientes(): Observable<Cliente[]> {         //GET como en postman pero todos

    //este get devuelve un observable de tipo any generico, y con Cast se vuelve tipo Cliente, o desde adentro con map tambien se vuelve tipo cliente[]
    return this.http.get(this.urlEndPoint).pipe(//vamos a transformar los datos
      tap(Response => { //no suscribe el objeto a un observable, no cambia o modifica el flujo de datos, pero si permite hacer cositas
        let clientes = Response as Cliente[];
        console.log("tap 1")
        clientes.forEach(cliente => { 
          console.log(cliente.nombre)
        }
        )
      }),      
      map(Response => {//map cambia el Response de tipo object a tipo Cliente[]
        let clientes = Response as Cliente[];//define variable local dentro de funcion, convierte el tipo objeto a tipo arreglo de clientesCliente[]
        return clientes.map(
          cliente => { //aca modifico los valores internos de clientes con .map()
            cliente.nombre = cliente.nombre.toUpperCase()//el apellido lo modifico desde la plantilla html
            cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyy', 'es')
            return cliente
        });
      }
      ),
      tap(Response => { //aca el response si fue transformado y ya es de tipo cliente, por eso es importante el orden
        console.log("tap 2")
        Response.forEach(cliente => {
          console.log(cliente.nombre)
        }
        )
      })
    );//se usa this porque es un atributo de esta clase
    //retorna el atributo http de esta clase, .el tipo de peticion y la url


    //return of(CLIENTES);//Convertimos / creamos nuestro FLUJO OBSERVABLE a partir de los objetos clientes
  }//la idea es que maneje grandes flujos de datos de cualquier tipo, stream audio o video, o listas de objetos
  //patron de diseño observador: Tenemos un objeto observable, y tenemos observadores, que estan atentos obserbando un posible cambio en el sujeto
  //los observadores se suscriben al sujeto(el observable), y cuando cambia el estado, se notifica a los observadores y se dispara algun tipo de evento

  //retorna un observable cliente, el objeto cliente que se creo en el apiRest
  create(cliente: Cliente): Observable<Cliente> {  //CREAR, retorna cualquier cosa
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400) {
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })

    );
  }

  getCliente(id: any): Observable<Cliente> {  //GET solo un cliente
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(//a los argumentos le añade el id ya que asi esta el servicio
      catchError(e => { //aca obtenemos el error, lo recibimos por argumento en la funcion de =>(osea una func anonima)
        //el reconoce el error a traves del estado de la respuesta: 200, 401, 500
        this.router.navigate(['/clientes'])//redirige a /clientes cuando ocurre error
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(() => e);//retorna el error observable
      })

    );
  }

  update(cliente: Cliente): Observable<any> {  //PUT solo un cliente 
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(//envia tres parametros, id, el objeto cliente, y cabecera
      catchError(e => {

        if (e.status == 400) {
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })

    );
  }

  delete(id: number): Observable<Cliente> {  //DELETE solo un cliente
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => e);
      })
    )
  }

}
