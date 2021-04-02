import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TraspasoMercanciaService } from '../../../services/importacion/traspaso-mercancia.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ResumentraspasoComponent } from './resumentraspaso/resumentraspaso.component';
import { DocumentacionFormularioImportacionComponent } from '../../importacion/documentacion-importacion/documentacion-formulario-importacion/documentacion-formulario-importacion.component';
import { OrdenCargaDescargaComponent } from 'src/app/components/orden-carga-descarga/orden-carga-descarga.component';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { TraspasoMercancia } from '../../../Models/importacion/detalleTraspasoMercancia-model';
import { TarimaService } from '../../../services/almacen/tarima/tarima.service';
import { DetalleTarima } from 'src/app/Models/almacen/Tarima/detalleTarima-model';
import { OrdenCargaService } from '../../../services/almacen/orden-carga/orden-carga.service';
import { OrdenTemporal } from '../../../Models/almacen/OrdenTemporal/ordenTemporal-model';

@Component({
  selector: 'app-traspasomercancia',
  templateUrl: './traspasomercancia.component.html',
  styleUrls: ['./traspasomercancia.component.css']
})
export class TraspasomercanciaComponent implements OnInit {

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Folio', 'Kg', 'Origen', 'Destino', 'Fecha','Estatus','Options'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  

  constructor(public traspasoSVC: TraspasoMercanciaService, public router: Router, private dialog: MatDialog, public serviceTarima: TarimaService, public ocService:OrdenCargaService) { 
    this.traspasoSVC.listen().subscribe((m:any)=>{
      console.log('Actualizando Tabla Principal');
      this.obtenerTraspasos();
      this.obtenerPrivilegios();
    });
  }

  ngOnInit() {
    this.obtenerTraspasos();

    //^ **** PRIVILEGIOS POR USUARIO *****
    this.obtenerPrivilegios();
    //^ **** PRIVILEGIOS POR USUARIO *****
  }

  ngOnDestroy(): void {
    if(this.subs1){
      this.subs1.unsubscribe();
    }
    // this.subs2.unsubscribe();
  }

   //^ **** PRIVILEGIOS POR USUARIO *****
   privilegios: any;
   privilegiosExistentes: boolean = false;
   modulo = 'Almacen';
   area = 'Importaciones';
 
   //^ VARIABLES DE PERMISOS
   Vista: boolean = false;
   Agregar: boolean = false;
   Editar: boolean = false;
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
      case ('Editar Traspaso'):
        this.Editar = true;
        break;
      case ('Borrar Traspaso'):
        this.Borrar = true;
        break;
      case ('Agregar Traspaso'):
        this.Agregar = true;
        break;
      case ('Vista'):
        this.Vista = true;
        break;
      default:
        break;
    }
  }
   //^ **** PRIVILEGIOS POR USUARIO *****

  nuevoTraspaso(){
    this.router.navigateByUrl('/embarque');
    
  }

  applyFilter(filtervalue: string){
    this.listData.filterPredicate = (data, filter: string) => {
      return data.Folio.toString().toLowerCase().includes(filter)
    };
    this.listData.filter = filtervalue.trim().toLocaleLowerCase();

  }
subs1: Subscription
  obtenerTraspasos(){

  this.subs1 =  this.traspasoSVC.getTraspasoMercancia().subscribe(data=>{
      console.log(data,'TRASPASO');
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.paginator._intl.itemsPerPageLabel = 'Traspasos por Pagina';
    })



  }

  onEdit(row){
    console.log(row);
    this.traspasoSVC.selectTraspaso = row;
    const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = false;
          dialogConfig.autoFocus = true;
          dialogConfig.width = "80%";
          dialogConfig.data = {
            IdTraspaso: row.IdTraspasoMercancia
          }
          /* let dl = this.dialog.open(DocumentacionFormularioImportacionComponent, dialogConfig); */
          let dl = this.dialog.open(ResumentraspasoComponent, dialogConfig);
  }

  accederPDF(row) {
    // console.log(row);
    // this.traspasoSVC.formrow = []
    // let query = 'select DetalleTraspasoMercancia.*, DetalleTarima.*, OrdenTemporal.* from DetalleTraspasoMercancia left join detalletarima on DetalleTraspasoMercancia.IdDetalle=detalletarima.IdDetalleTarima left join OrdenTemporal on OrdenTemporal.IdDetalleTarima=DetalleTarima.IdDetalleTarima where DetalleTraspasoMercancia.IdTraspasoMercancia='+row.IdTraspasoMercancia;
    // console.log('%c⧭', 'color: #731d6d', query);
    // let consulta = {
    //   'consulta':query
    // };
    // console.log('%c⧭', 'color: #e57373', consulta);

    // this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
    //   console.log('%c⧭', 'color: #997326', detalles);
    //   this.traspasoSVC.formrow[0] = detalles;
    //   console.log('%c⧭', 'color: #d90000', this.traspasoSVC.formrow);


    //   console.log('%c%s', 'color: #364cd9', detalles.length);
    //   console.log('%c⧭', 'color: #ffa280', detalles[0]);

    //   if (detalles.length == 0) {
    //     Swal.fire({
    //       title: 'No Hay Registro',
    //       icon: 'error',
    //     })
        
    //   } else {
        console.log(row);
        console.log(row.IdOrdenCarga);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "70%";
        dialogConfig.data = {
          IdOrdenCarga: row.IdOrdenCarga
        }
        this.dialog.open(OrdenCargaDescargaComponent, dialogConfig);
      // }

    // })
    // this.service.formrow = row;
    // console.log();
    
  }
  
  onDelete(row: TraspasoMercancia){
    console.log(row);
    Swal.fire({
      title: '¿Seguro de Borrar Traspaso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

    
    //^ Al eliminar un Traspaso es necesario hacer lo siguiente:
    //^Eliminar el traspaso por IdTraspaso asi como sus detalles
    //^ Regresar los productos a su bodega origen, ya que se encuentran en Transito
     //^ Esta metodo movera los productos que seran traspasados a la bodega transtio. 
  //^ Con el objetivo de descontar los inventarios en la bodega y asi evitar traspasar productos que ya hayan sido traspasados


  //^ Obtenemos la informacion de los detalles Traspaso
  let query = 'select * from DetalleTraspasoMercancia where IdTraspasoMercancia = '+row.IdTraspasoMercancia;
      let consulta = {
        'consulta':query
      };

      console.log(query);

      


      this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
        console.log(detalles);

        //^ Funcion para eliminar traspaso y detalles.
        this.eliminarTraspaso(row.IdTraspasoMercancia, row.IdOrdenCarga);
        
        for (let i = 0; i < detalles.length; i++) {
          
          console.log(i);
          console.log(detalles[i]);
          
          let Sacos = detalles[i].Sacos;
          let Lote = detalles[i].Lote;
          let ClaveProducto = detalles[i].ClaveProducto;
          
          let kg = detalles[i].PesoTotal;
          
          
          //^ Obtenemos la informacion del producto a regresar
          // this.serviceTarima.GetGetProductoInformacionBodega(detalles[i].ClaveProducto, detalles[i].Lote, row.Origen).subscribe(dataDetalleTarima => {
            let consulta = {
              'consulta':"select * from detalletarima where ClaveProducto='"+detalles[i].ClaveProducto+ "' and lote='"+detalles[i].Lote+"' and Bodega='"+detalles[i].Bodega+"' and Shipper = '"+detalles[i].CampoExtra3+"';"
            };
        
            console.log(consulta);
            this.serviceTarima.generarConsulta(consulta).subscribe((dataDetalleTarima:any)=>{
            console.log(dataDetalleTarima);

            //^ Verificamos si en la bodega origen existe el mismo producto con el mismo Lote
            //^ En dado caso que sea cierto, actualizaremos los kilogramos y sacos de ese Producto
            if(dataDetalleTarima.length>0){

              let SacosDetalleTarima = ((+dataDetalleTarima[0].SacosTotales) + (+detalles[i].Sacos));
              let PesoTotalDetalleTarima = ((+dataDetalleTarima[0].PesoTotal) + (+detalles[i].PesoTotal));

              dataDetalleTarima[0].SacosTotales = SacosDetalleTarima.toString();
              dataDetalleTarima[0].PesoTotal = PesoTotalDetalleTarima.toString();
              this.serviceTarima.updateDetalleTarimaSacosPesoTarimasBodega(dataDetalleTarima[0]).subscribe(resUpdateOriginal => {
                        console.log(resUpdateOriginal);

                        this.eliminarDetalleTarima(detalles[i].ClaveProducto, detalles[i].Lote, 'Transito');
                
                
              })

            }
            //^ Si es falso, significa que no existe ese producto con ese lote en la bodega origen. Entonces se creara un nuevo Detalle Tarima
            else{

              //^ Como no existe el detalleTarima (el producto con lote en la bodega Origen) obtendremos la informacion de Orden Temporal, para crear de nuevo el DetalleTarima
              let queryInformacionDetalleTarima = 'select * from OrdenTemporal where ClaveProducto = '+"'"+detalles[i].ClaveProducto+"'"+' and Lote = '+"'"+detalles[i].Lote+"'"+'';
              let consulta2 = {
                'consulta':queryInformacionDetalleTarima
              };
             
              console.log(queryInformacionDetalleTarima);
             
              this.traspasoSVC.getQuery(consulta2).subscribe((detalleTarima: OrdenTemporal)=>{
                console.log(detalles);
                console.log(detalles[0]);
                console.log(detalles[0].Sacos);
                console.log(detalles[0].PesoxSaco);
                
                let dataDetalleTarimaNueva: DetalleTarima = {
                  IdDetalleTarima: 0,
                  ClaveProducto: detalleTarima[0].ClaveProducto,
                  Producto: detalleTarima[0].Producto,
                  SacosTotales: (detalleTarima[0].Sacos).toString(),
                  // PesoxSaco: detalleTarima[0].PesoxSaco.toString(),
                  PesoxSaco: ((+detalleTarima[0].PesoTotal) / (+detalleTarima[0].Sacos)).toString(),
                  Lote: detalleTarima[0].Lote,
                  PesoTotal: detalleTarima[0].PesoTotal,
                  SacosxTarima: '',
                  TarimasTotales: '',
                  Bodega: row.Origen,
                  IdProveedor: detalles[i].IdProveedor,
                  Proveedor: detalles[i].Proveedor,
                  PO: detalleTarima[0].CampoExtra1,
                  FechaMFG: detalleTarima[0].FechaMFG,
                  FechaCaducidad: detalleTarima[0].FechaCaducidad,
                  Shipper: detalleTarima[0].NumeroFactura,
                  USDA: '',
                  Pedimento: detalleTarima[0].NumeroEntrada,
                  Estatus: 'Creada'                  
                };

                console.log(dataDetalleTarimaNueva);
                
                this.serviceTarima.addDetalleTarima(dataDetalleTarimaNueva).subscribe(resNuevaTarima => {
                  console.log(resNuevaTarima);
                  this.eliminarDetalleTarima(detalles[i].ClaveProducto, detalles[i].Lote, 'Transito');
                })
                
              })
            }            
          });
           //^ verificar que se el ultimo producto a regresar
           if (i == (detalles.length - 1)) {
            this.obtenerTraspasos();
          }         
        }
      })
    })
  }

  //^ Funcion para eliminar traspaso y detalles asi como la Orden Carga y detalles
  eliminarTraspaso(idTraspaso: number, idOc: number){
 //^ Eliminamos Traspaso
 let query = 'delete TraspasoMercancia where IdTraspasoMercancia = '+idTraspaso+'';
 let consulta = {
   'consulta':query
 };

 console.log(query);

 this.traspasoSVC.getQuery(consulta).subscribe((detalles: any)=>{
   console.log(detalles);
  })

  let query2 = 'delete DetalleTraspasoMercancia where IdTraspasoMercancia = '+idTraspaso+'';
 let consulta2 = {
   'consulta':query2
 };

 console.log(query2);

 this.traspasoSVC.getQuery(consulta2).subscribe((detalles: any)=>{
   console.log(detalles);
  })


  this.ocService.deleteOrdenCarga(idOc).subscribe(resOC=>{
    console.log(resOC);
    let query3 = 'delete DetalleOrdenCarga where IdOrdenCarga = '+idOc+'';
    let consulta3 = {
      'consulta':query3
    };
   
    console.log(query3);
   
    this.traspasoSVC.getQuery(consulta3).subscribe((detallesOC: any)=>{
      console.log(detallesOC);
     })
  })




  }


  //^ Eliminar DetalleTarima
  eliminarDetalleTarima(clave, lote, bodega){

    let queryDeleteDetalle = 'delete DetalleTarima where ClaveProducto = '+"'"+clave+"'"+' and Lote = '+"'"+lote+"'"+' and bodega = '+"'Transito'"+'';
    let consulta = {
      'consulta':queryDeleteDetalle
    };
   
    console.log(queryDeleteDetalle);
   
    this.traspasoSVC.getQuery(consulta).subscribe((detalleTarima: any)=>{
      console.log(detalleTarima);
    })
  }
  

 
  

}
