import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent{ //permite poder exportar la clase para que se pueda ultilizar en la configuracion del modulo(app.module)
    title = 'Proy1 Angular';
} 