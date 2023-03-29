import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';//importa desde un json la data
import { Cliente } from './cliente';
import { Observable } from 'rxjs';//ESTO ES PARA USAR STREAM, REACTIVE EXTENTION
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';//para trabajar http

@Injectable({//injectable, es para clases de servicios, representan logica de negocio
  providedIn: 'root'//se puede inyectar a otros componentes, via inyeccion de dependencias
})
export class ClienteService {//ESTA  clase es para majear los datos de los clientes

  private urlEndPoint:string = 'http://localhost:8080/api/clientes'//ubicacion del back
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})//las cabeceras

  constructor(private http: HttpClient) { }//definimos la variable http y se inyecta la referencia, para REST

/* MODO NORMAL SINCRONO
  getClientes(): Cliente[] {
    return CLIENTES;
  }*/

//ESTE ES REACTIVO, RETORNA UN STREAM
getClientes(): Observable<Cliente[]> {         //GET como en postman pero todos
  
  //este get devuelve un observable de tipo any generico, y con Cast se vuelve tipo Cliente
  return this.http.get<Cliente[]>(this.urlEndPoint);//se usa this porque es un atributo de esta clase
  //retorna el atributo http de esta clase, .el tipo de peticion y la url


  //return of(CLIENTES);//Convertimos / creamos nuestro FLUJO OBSERVABLE a partir de los objetos clientes
}//la idea es que maneje grandes flujos de datos de cualquier tipo, stream audio o video, o listas de objetos
//patron de diseño observador: Tenemos un objeto observable, y tenemos observadores, que estan atentos obserbando un posible cambio en el sujeto
//los observadores se suscriben al sujeto(el observable), y cuando cambia el estado, se notifica a los observadores y se dispara algun tipo de evento

//retorna un observable cliente, el objeto cliente que se creo en el apiRest
create(cliente: Cliente): Observable<Cliente>{  //CREAR

  return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders})
}

getCliente(id: any): Observable<Cliente>{  //GET solo un cliente
  return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)//a los argumentos le añade el id ya que asi esta el servicio
}

update(cliente: Cliente): Observable<Cliente>{  //PUT solo un cliente
  return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders})//envia tres parametros, id, el objeto cliente, y cabecera
}

delete(id: number): Observable<Cliente>{  //DELETE solo un cliente
  return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers: this.httpHeaders})
}

}
