import { Component, OnInit, ViewChild } from '@angular/core';

import { ForwardsService } from '../../../services/cxp/forwards/forwards.service';

import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material';

import { Router } from '@angular/router';

import { AddUsuarioComponent } from '../../administracion/catalogos/usuarios/add-usuario/add-usuario.component';

import { Usuario } from 'src/app/Models/catalogos/usuarios-model';

import { EditUsuarioComponent } from '../../administracion/catalogos/usuarios/edit-usuario/edit-usuario.component';

import { AddfordwardComponent } from './addfordward/addfordward.component';

import { Forwards } from 'src/app/Models/cxp/forwards-model';

import { DatePipe } from '@angular/common';

import { EventosService } from 'src/app/services/eventos/eventos.service';


import { ConnectionHubServiceService } from './../../../services/shared/ConnectionHub/connection-hub-service.service';


let origen: { origen: string, titulo: string }[] = [
  {"origen": "Cxp", "titulo": 'Forward'}
]

@Component({
  selector: 'app-forwardscxp',
  templateUrl: './forwardscxp.component.html',
  styleUrls: ['./forwardscxp.component.css'],
})
export class ForwardscxpComponent implements OnInit {

  IdForward: any;
  defaultData;

  listData: MatTableDataSource<any>;
  displayedColumns : string [] = ['IdForward','FechaCierre','FechaPago','CantidadDlls','TipoCambio','CantidadMXN','CantidadPendiente','Destino','Promedio','Estatus','Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public ForwardsService:ForwardsService, private datePipe: DatePipe, public router: Router,private dialog: MatDialog,
    private eventosService:EventosService,
    private ConnectionHubService: ConnectionHubServiceService,) {
    this.ForwardsService.listen().subscribe((m: any) => {
      console.log(m);
      this.getforwards();
    });
    
    this.ConnectionHubService.listenForward().subscribe((m:any)=>{
      this.getforwards();
      });
   }

  ngOnInit() {
    this.getforwards();
  
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****

  }


  //^ **** PRIVILEGIOS POR USUARIO *****
  privilegios: any;
  privilegiosExistentes: boolean = false;
  modulo = 'Cuentas por Pagar';
  area = 'Forwards';

  //^ VARIABLES DE PERMISOS
  Agregar: boolean = false;
  Editar: boolean = false;
  //^ VARIABLES DE PERMISOS


  obtenerPrivilegios() {
    let arrayPermisosMenu = JSON.parse(localStorage.getItem('Permisos'));
    console.log(arrayPermisosMenu);
    let arrayPrivilegios: any;
    try {
      arrayPrivilegios = arrayPermisosMenu.find(modulo => modulo.titulo == this.modulo);
      // console.log(arrayPrivilegios);
      arrayPrivilegios = arrayPrivilegios.submenu.find(area => area.titulo == this.area);
      // console.log(arrayPrivilegios);
      this.privilegios = [];
      arrayPrivilegios.privilegios.forEach(element => {
        this.privilegios.push(element.nombreProceso);
        this.verificarPrivilegio(element.nombreProceso);
      });
      // console.log(this.privilegios);
    } catch {
      console.log('Ocurrio algun problema');
    }
  }

  verificarPrivilegio(privilegio) {
    switch (privilegio) {
      case ('Agregar Nuevo Forward'):
        this.Agregar = true;
        break;
      case ('Editar Forward'):
        this.Editar = true;
        break;
      default:
        break;
    }
  }
  //^ **** PRIVILEGIOS POR USUARIO *****


  getforwards(){
    this.ForwardsService.getForwardsList().subscribe( data=> {
      console.log('data: ', data);
      
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Forwards por Pagina';


    });
  }

  applyFilter(filtervalue: string) {
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();
  }

  public ForwardBlanco: Forwards =
  {
    IdForward: 0,
    FechaCierre: new Date(),
    FechaPago: new Date(),
    CantidadDlls: "",
    TipoCambio: "",
    CantidadMXN: "",
    Garantia: "",
    GarantiaPagada: "",
    CantidadPendiente: "",
    Destino: "",
    Promedio: "",
    Estatus: ""
  }


  onAdd(){
    this.ForwardsService.getUltimoForward().subscribe(res => {
      console.log(res[0]);
      this.ForwardBlanco.IdForward = res[0].IdForward;
      console.log(this.IdForward);

      // localStorage.setItem('IdForward', this.IdForward.toString());
      console.log(this.ForwardBlanco);
      this.ForwardsService.addForward(this.ForwardBlanco).subscribe(res => {
        console.log(res);
        
        this.ConnectionHubService.on(origen[0]);
        
        this.eventosService.movimientos('Generar Forward')
        this.ForwardsService.onadd = true;
        this.ForwardsService.formDataForwards = this.ForwardBlanco;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width="70%";
        this.dialog.open(AddfordwardComponent, dialogConfig);
      })
})

  }



  onEdit(row){
    console.log(row);
    this.ForwardsService.formDataForwards = row;
    
    this.ForwardsService.onadd = false;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    
    this.eventosService.movimientos('Editar Forward')
    this.dialog.open(AddfordwardComponent, dialogConfig);
  }

  estatusSelect;

  estatusCambio(event){
    // console.log(event);
this.estatusSelect = event.value;
console.log(this.estatusSelect);
if (this.estatusSelect==='Todos'){
  this.applyFilter2('')
}else {

  this.applyFilter2(this.estatusSelect)
}

  }

  applyFilter2(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Estatus.toString().toLowerCase().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  public listEstatus: Array<Object> = [
    { Estatus: 'Todos' },
    { Estatus: 'Cotizado' },
    { Estatus: 'Comprado' },
    { Estatus: 'Finalizado' },
    
  ];

}
