import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { ClientesService } from 'src/app/services/catalogos/clientes.service';
import { RedhgfacturacionService } from 'src/app/services/redholding/redhgfacturacion.service';
import { RedhgreporteplantillaComponent } from '../redhgreporteplantilla/redhgreporteplantilla.component';

@Component({
  selector: 'app-redhgreportes',
  templateUrl: './redhgreportes.component.html',
  styleUrls: ['./redhgreportes.component.css']
})
export class RedhgreportesComponent implements OnInit {

  todosClientes = true;
  myControl = new FormControl();
  filteredOptions: Observable<any[]>
  ClienteNombre: any;

  constructor(
    public redhgSVC: RedhgfacturacionService,
    public serviceCliente: ClientesService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  checkbox(event) {
    this.todosClientes = event.checked;
    console.log(this.todosClientes);
  }

  onSelectionChange(cliente: Cliente, event: any) {
    console.log('OSC', cliente);
    console.log('OSC', event);
    this.ClienteNombre = cliente.Nombre;
  }

  reporteCobranza() {
    /* console.log(this.enviarfact.empresa) */
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = {
      clientes: this.todosClientes
    }
    this.redhgSVC.titulo = 'Reporte Cobranza'
    let dl = this.dialog.open(RedhgreporteplantillaComponent, dialogConfig);

  }

}
