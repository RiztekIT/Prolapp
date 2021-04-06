import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Entrada, PosserviceService } from '../posservice.service';

@Component({
  selector: 'app-entradaproductos',
  templateUrl: './entradaproductos.component.html',
  styleUrls: ['./entradaproductos.component.css'],
  animations: [
    trigger('detailExpand', [
      // state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),  
  ],
})
export class EntradaproductosComponent implements OnInit {
  estatusSelect
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Proveedor', 'Subtotal','IVA', 'Total', 'FechaDeExpedicion', 'Estatus','Sucursal','Options'];
  expandedElement: any;
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  idEntrada;

  constructor(public posSVC: PosserviceService, public router: Router) { }

  public entradaBlanco: Entrada = {
    idEntrada: 0,
    idProveedor: 0,
    nombreProveedor: 'Abarrotodo',
    folio: '',
    descripcion: '',
    estatus: 'Creada',
    categoria1: '',
    categoria2: '',
    categoria3: '',
    tipo: '',
    fechaexpedicion: new Date(),
    campoextra1: '',
    campoextra2: '',
    campoextra3: '',
    subtotal: '',
    iva: '',
    total: '',
    subtotaldlls: '',
    ivadlls: '',
    totaldlls: '',
    sucursal: 'Hermosillo',
  }

  ngOnInit() {
    //this.SucursalSelect = localStorage.getItem('sucursal')
    //this.arrcon = []
    //this.PermisosService.permisos =[]
    //let u = JSON.parse(localStorage.getItem('ProlappSession'));
    //this.GetPermisos(u.user);
    this.posSVC.entradaForm = this.entradaBlanco;
    this.refreshEntradaList();
    
  }

  refreshEntradaList(){
    Swal.showLoading();

    
    this.posSVC.masterEntrada = []

    let consulta = {
      'consulta':'select *  from EntradaMercancia order by EntradaMercancia.fechaexpedicion desc'
    };
    // this.entradaSVC.getEntradas().subscribe(data=>{
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      console.log('lista entradas',data);
      for (let i=0; i<data.length;i++){
      /*   if (data[i].estatus == 'Creada') {

          this.entradaSVC.deleteEntrada(data[i].idEntrada).subscribe(res => {
            
            this.refreshOrdenesList();
          });
        } */


        this.posSVC.masterEntrada[i] = data[i];
        this.posSVC.masterEntrada[i].DetalleEntrada = [];
        let consulta2 = {
          'consulta':'select *  from DetalleEntrada where identrada='+data[i].idEntrada
        };
        this.posSVC.generarConsulta(consulta).subscribe((detallesresp:any)=>{
          for(let l=0; l<detallesresp.length;l++){
            this.posSVC.masterEntrada[i].DetalleEntrada.push(detallesresp[l]);
          }
        })
      }
      
      console.log(this.posSVC.masterEntrada);
      Swal.close();
      this.listData = new MatTableDataSource(this.posSVC.masterEntrada);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Entradas por Pagina';
      
      
      
    })
    
    
  }
  
  onAdd(){
    
    let consulta = {
      'consulta':'select TOP 1 EntradaMercancia.Folio from EntradaMercancia order by EntradaMercancia.Folio desc'
    };
console.log(consulta);
    this.posSVC.generarConsulta(consulta).subscribe((data:any) => {
      console.log(data);

      let folio
      if (data.length>0){
        folio = +data[0].Folio+1;

      }else{
        folio=1
      }


      console.log(folio);
      this.entradaBlanco.folio = folio;
      let entrada = this.entradaBlanco;
      let fecha = new Date().toISOString().slice(0,10);
      // console.log(this.ordenSericioBlanco);
      let consulta2 = {
        'consulta':"insert into EntradaMercancia values("+entrada.idProveedor + ",'"+entrada.nombreProveedor + "','"+entrada.folio + "','"+entrada.descripcion+"','"+entrada.estatus+"','"+entrada.categoria1+"','"+ entrada.categoria2+ "','"+ entrada.categoria3+ "','"+entrada.tipo+"','"+ fecha + "','"+entrada.campoextra1+"','"+ entrada.campoextra2+ "','"+ entrada.campoextra3 + "','"+entrada.subtotal+"','"+entrada.iva+"','"+entrada.total+"','"+entrada.subtotaldlls+"','"+entrada.ivadlls+"','"+entrada.totaldlls+"','"+entrada.sucursal+"')"
      };
      this.posSVC.generarConsulta(consulta2).subscribe(res => {
        console.log(res);
      
        this.ObtenerUltimoServicio();
      });
    });

  }

  ObtenerUltimoServicio(){

    let consulta = {
      'consulta':'select TOP 1 EntradaMercancia.idEntrada from EntradaMercancia order by EntradaMercancia.idEntrada desc'
    };

    this.posSVC.generarConsulta(consulta).subscribe(res => {
      console.log(res);
      this.idEntrada = res[0].idEntrada;   
      this.posSVC.entradaForm.idEntrada = this.idEntrada;
      console.log(this.posSVC.entradaForm);   
      localStorage.setItem('entradaMercancia', JSON.stringify(this.posSVC.entradaForm));
      this.router.navigate(['/posaddeditentrada']);
    })
  }

  applyFilter(filtervalue: string) {
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Nombre.toString().toLowerCase().includes(filter) || data.IdCotizacion.toString().includes(filter);
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }

  onEdit(row){

    console.log(row);

   this.posSVC.entradaForm = row;
    console.log(this.posSVC.entradaForm);   
    localStorage.setItem('entradaMercancia', JSON.stringify(this.posSVC.entradaForm));
    this.router.navigate(['/posaddeditentrada']);

  }

  onDelete(row){
    console.log(row);
Swal.fire({
  title: '¿Borrar Servicio?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  confirmButtonText: 'Borrar',
  cancelButtonText: 'Cancelar'
}).then((result) => {
  if (result.value) {
    let consulta = {
      'consulta':'delete from DetalleEntrada where identrada ='+row.idEntrada
    };
    let consulta2 = {
      'consulta':'delete from EntradaMercancia where idEntrada ='+row.idEntrada
    };
      this.posSVC.generarConsulta(consulta).subscribe(res=>{
        this.posSVC.generarConsulta(consulta2).subscribe(res1=>{

          Swal.fire({
            title: 'Borrado',
            icon: 'success',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          }).then((result)=>{
            this.refreshEntradaList();
          });
        })
      })

     
  }
})

  }

}
