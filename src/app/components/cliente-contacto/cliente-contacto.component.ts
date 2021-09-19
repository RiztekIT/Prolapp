import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ClientesService } from '../../services/catalogos/clientes.service';

@Component({
  selector: 'app-cliente-contacto',
  templateUrl: './cliente-contacto.component.html',
  styleUrls: ['./cliente-contacto.component.css']
})
export class ClienteContactoComponent implements OnInit {

  NombreCliente: string;
  IdCliente: number;

  constructor(
    public clienteSVC: ClientesService,
    public dialogbox: MatDialogRef<ClienteContactoComponent>
  ) { }


  ngOnInit() {
    console.log(this.clienteSVC.contactoCliente);
    this.IdCliente = this.clienteSVC.contactoCliente.IdClientes
    this.NombreCliente = this.clienteSVC.contactoCliente.Nombre
  }

  onClose() {
    this.dialogbox.close();
    this.clienteSVC.filter('');
  }

  agregarContacto(){
    console.log(this.clienteSVC.contactoCliente);
    this.clienteSVC.addContactoCliente(this.clienteSVC.contactoCliente).toPromise().then(resp=>{
      console.log(resp);
    })
  }

}
