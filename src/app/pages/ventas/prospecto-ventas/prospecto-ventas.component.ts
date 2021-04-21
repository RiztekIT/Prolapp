import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import { Prospecto } from 'src/app/Models/ventas/prospecto-model';
import { VentasCotizacionService } from '../../../services/ventas/ventas-cotizacion.service';
import { FormBuilder } from '@angular/forms';
import { AddClienteComponent } from '../../administracion/catalogos/clientes/add-cliente/add-cliente.component';
import { ClientesService } from '../../../services/catalogos/clientes.service';
import { ProspectoclienteComponent } from 'src/app/components/prospecto/prospectocliente/prospectocliente.component';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { isThisSecond } from 'date-fns';
import { EventosService } from 'src/app/services/eventos/eventos.service';



@Component({
  selector: 'app-prospecto-ventas',
  templateUrl: './prospecto-ventas.component.html',
  styleUrls: ['./prospecto-ventas.component.css']
})
export class ProspectoVentasComponent implements OnInit {

  constructor(public router: Router, private dialog: MatDialog, public service: VentasCotizacionService, public service2: ClientesService, private _formBuilder: FormBuilder,
    private eventosService:EventosService,) {
    this.service.listen().subscribe((m:any)=>{
      this.refreshProspectoList();
    });
   }

  ngOnInit() {
    this.refreshProspectoList();
    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
  }

    
    //^ **** PRIVILEGIOS POR USUARIO *****
    privilegios: any;
    privilegiosExistentes: boolean = false;
    modulo = 'Ventas';
    area = 'Prospecto';
  
    //^ VARIABLES DE PERMISOS
    Agregar: boolean = false;
    Borrar: boolean = false;
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
        case ('Agregar Cliente'):
          this.Agregar = true;
          break;
        case ('Borrar Cliente'):
          this.Borrar = true;
          break;
        default:
          break;
      }
    }
    //^ **** PRIVILEGIOS POR USUARIO *****

  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['Nombre', 'Correo', 'Telefono', 'Direccion', 'Empresa', 'Estatus', 'IdCotizacion', 'Options']

  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  refreshProspectoList(){
    this.service.getProspectos().subscribe(data => {
      // console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Prospectos por Pagina';
    })
  }

  onDelete(row){

    Swal.fire({
      title: '¿Segur@ de Borrar Prospecto ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        console.log(row);
        this.service.deleteProspecto(row.IdProspecto).subscribe(res=>{
          
          this.eventosService.movimientos('Prospecto Borrado')
          this.refreshProspectoList();
          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false,
            
          });
        })
      }
    })
  }

  onEdit(prospecto: Prospecto){
    // console.log(prospecto);


    this.service2.formData = new Cliente();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(ProspectoclienteComponent, dialogConfig);
    
    this.eventosService.movimientos('Edit Prospecto Cliente')
    this.service2.formData.Nombre = prospecto.Nombre;
    this.service2.formData.Calle = prospecto.Direccion;
    this.service2.formData.RazonSocial = prospecto.Empresa;
    this.service2.prospEstatus = prospecto.Estatus;

    localStorage.setItem("prospecto" , JSON.stringify(prospecto.IdProspecto));

  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdCotizacion.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
}
