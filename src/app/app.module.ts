import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';//IMPLEMENTACION DE RUTAS EN ANGULAR Y NAVEGACION
import { HttpClientModule } from '@angular/common/http';//para comunicarse REST
import { FormComponent } from './clientes/form.component';//importa el componente
import { FormsModule } from '@angular/forms';//importa formularios


const routes: Routes = [//una constante que tiene un arreglo con las rutas tipo Routes
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },//el home '' va a clientes, y hace un match completo, osea va a la 3era opcion
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },//url clientes se asigna a componente clientecomponent
  { path: 'clientes/form', component: FormComponent },
  { path: 'clientes/form/:id', component: FormComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,//aca se registra
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,//se importa form module, se registra el modulo para trabajar con formularios
    RouterModule.forRoot(routes)//se importan las rutas    
  ],
  providers: [ClienteService],//aca se registran los servicios
  bootstrap: [AppComponent]
})
export class AppModule { }
