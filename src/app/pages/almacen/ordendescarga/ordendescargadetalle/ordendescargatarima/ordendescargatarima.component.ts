import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { OrdenDescargaService } from '../../../../../services/almacen/orden-descarga/orden-descarga.service';
import Swal from 'sweetalert2';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { DetalleOrdenDescarga } from '../../../../../Models/almacen/OrdenDescarga/detalleOrdenDescarga-model';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { Router } from '@angular/router';
import { preOrdenTemporalOD } from '../../../../../Models/almacen/OrdenTemporal/preOrdenTemporalOD-model';
import { nanoid } from 'nanoid'
import { Tarima } from '../../../../../Models/almacen/Tarima/tarima-model';
import { TarimaService } from '../../../../../services/almacen/tarima/tarima.service';
import { DetalleTarima } from '../../../../../Models/almacen/Tarima/detalleTarima-model';
import { preOrdenTemporalODSacos } from '../../../../../Models/almacen/OrdenTemporal/preOrdenTemporalODSacos-model';


 

@Component({
  selector: 'app-ordendescargatarima',
  templateUrl: './ordendescargatarima.component.html',
  styleUrls: ['./ordendescargatarima.component.css']
})
export class OrdendescargatarimaComponent implements OnInit {



rowDTOD:any;
sacosSaldo:any;
InputComentarios:string;
sacostotal:any;
saldototal:any;
IdOrdenDescarga: number;
Lote: any;
cantidadSacos: number;
ClaveProducto: any;
dataODID = new Array<DetalleOrdenDescarga>();
cantidadMaximaSacos: number;
// isVisibleVisualizacion: boolean;
// isVisibleOT: boolean;

  constructor(public router: Router, private dialog: MatDialog, public service: OrdenDescargaService, public ordenTemporalService: OrdenTemporalService, private Tarimaservice: TarimaService) {
    this.service.listen().subscribe((m:any)=>{
      console.log(m);
      this.refreshOrdenDescargaList();
      });

      this.service.listenOrdenTemporal().subscribe((m:any)=>{
        console.log(m);
        this.actualizarTablaOrdenTemporal();
        });
   }
   
regresar(){
  this.router.navigate(['/ordenDescargadetalle']);
}

  //tabla visualizacion
  listData: MatTableDataSource<any>;
  displayedColumns: string [] = ['ClaveProducto','Producto', 'Sacos', 'SacosIngresados', 'Lote', 'Saldo', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sort : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  //tabla Sacos Ingresados
  listDataSacosIngresados: MatTableDataSource<any>;
  displayedColumnsSacosIngresados: string [] = ['ClaveProducto','Producto', 'Sacos', 'SacosIngresados', 'Options'];
  @ViewChild(MatSort, null) sortSacosIngresados : MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorSacosIngresados: MatPaginator;

   // Tabla Orden Temporal
  listDataOrdenTemporal: MatTableDataSource<any>;
  displayedColumnsOrdenTemporal: string[] = ['QR', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;

  ngOnInit() {
    console.clear();
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    this.refreshOrdenDescargaList();
    this.actualizarTablaOrdenTemporal();
    //igualar en 0s el arreglo que se encuentra en el servicio
    this.ordenTemporalService.preOrdenTemporalOD = [];
    console.log(this.ordenTemporalService.preOrdenTemporalOD);
    this.Tarimaservice.tarimaDetalleDOD = [];
    this.ordenTemporalService.preOrdenTemporalSacos = [];
  }

  refreshOrdenDescargaList(){   
    this.service.getOrdenDescargaIDList(this.IdOrdenDescarga).subscribe(dataID =>{ 

      console.log(dataID,'detalles DOD a asignarse');
      // recorrer tantos conceptos tenga la OD
      for (let i = 0; i <= dataID.length - 1; i++) {
      this.dataODID[i] = dataID[i];
      console.log(dataID[i],'ID OD-verificar tabla');

    
    this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga,this.dataODID[i].Lote, this.dataODID[i].ClaveProducto).subscribe(data =>{
    console.log(data,'IDLOTECP');
    let DOD = new preOrdenTemporalOD();
    let DTOD = new DetalleOrdenDescarga();

    DOD.IdDetalleOrdenDescarga = this.dataODID[i].IdDetalleOrdenDescarga;
    DOD.IdOrdenDescarga = this.dataODID[i].IdOrdenDescarga;
    DOD.ClaveProducto = this.dataODID[i].ClaveProducto
    DOD.Producto = this.dataODID[i].Producto
    DOD.Sacos = this.dataODID[i].Sacos
    DOD.Lote = this.dataODID[i].Lote
    DOD.Saldo = this.dataODID[i].Saldo
    DOD.PesoTotal = ((+DOD.Sacos) * (+this.dataODID[i].PesoxSaco)).toString();
    DOD.FechaCaducidad = this.dataODID[i].FechaCaducidad;
    DOD.SacosIngresados = (+this.dataODID[i].Sacos - +this.dataODID[i].Saldo).toString()
    DOD.Comentarios = 'NA';
    DOD.SacosIngresadosTotales = (+this.dataODID[i].Sacos - +this.dataODID[i].Saldo).toString();
    console.log(DOD,'DOD');
    this.ordenTemporalService.preOrdenTemporalOD.push(DOD);
        this.listData = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalOD);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.paginator._intl.itemsPerPageLabel = 'Ordenes de Descarga por Pagina';



    //llenar DTOD para los detalles de tarima
    
    DTOD.ClaveProducto = this.dataODID[i].ClaveProducto;
    DTOD.Producto = this.dataODID[i].Producto;
    DTOD.Sacos = this.dataODID[i].Sacos;
    DTOD.PesoxSaco = this.dataODID[i].PesoxSaco;
    DTOD.Lote = this.dataODID[i].Lote;
    DTOD.IdProveedor = this.dataODID[i].IdProveedor;
    DTOD.Proveedor = this.dataODID[i].Proveedor;
    DTOD.PO = this.dataODID[i].PO;
    DTOD.FechaMFG = this.dataODID[i].FechaMFG;
    DTOD.FechaCaducidad = this.dataODID[i].FechaCaducidad;
    DTOD.Shipper = this.dataODID[i].Shipper;
    DTOD.USDA = this.dataODID[i].USDA;
    DTOD.Pedimento = this.dataODID[i].Pedimento;
    console.log(DTOD,'DTOD para DetalleTarima');
    this.Tarimaservice.tarimaDetalleDOD.push(DTOD);
    
        // this.service.getOrdenCargaList().subscribe(data => {
        //   console.log(data);
          
        // });
      })
      }
    })
  }
    

      onEdit(detalleordendescarga: DetalleOrdenDescarga, id: any){
        console.clear();
        console.log(id);
        console.log(detalleordendescarga);
       this.rowDTOD = detalleordendescarga;
        console.log(id,'posicion');
        this.ordenTemporalService.posicionOrdenTemporalOD = id;
        console.log(this.ordenTemporalService.posicionOrdenTemporalOD,'wwwwwwwwwwwwwwwwwwwwwwwwwww');
        
//asigna el id del producto a la posicion para que se le puedan asignar los valores al dato temporal en tabla -1
console.log(this.ordenTemporalService.posicionOrdenTemporalOD,'Posicion');

// if(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo != this.rowDTOD.Sacos){
//   this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = '0'
//   this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = this.rowDTOD.Sacos
// }

console.log(this.rowDTOD.Sacos,'Sacos en total');
console.log(this.rowDTOD.Saldo,'Saldo al momento');

  }

      validarCantidad() {
      this.cantidadSacos = this.sacosSaldo;
      this.cantidadMaximaSacos = +this.rowDTOD.Sacos;
      
      if ((+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo - +this.cantidadSacos) < 0) {
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = this.cantidadMaximaSacos.toString()
        console.log('la cantidad de sacos ingresados es mayor al saldo');
      }
      else{
        console.log('else');
        if (this.sacosSaldo >= this.cantidadMaximaSacos) {
          this.cantidadSacos = this.cantidadMaximaSacos;
        }
        if (this.sacosSaldo <= 0) {
          this.cantidadSacos = 0;
        }
        if (this.sacosSaldo == null) {
          this.cantidadSacos = 0;
        }
        
        if (this.sacosSaldo > this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo) {
          this.cantidadSacos = +this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo;
        }

        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados = this.cantidadSacos.toString();
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo - +this.cantidadSacos.toString()).toString();
      }
    }

  addSacos(form: NgForm){
    if(this.ordenTemporalService.posicionOrdenTemporalOD == null){
      Swal.fire({
        title: 'Seleccionar Producto',
        icon: 'warning',
        text: ''
      });
    }
    this.validarCantidad();
    this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresadosTotales = (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Sacos - +this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo).toString()
    console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresadosTotales,'sacos totaaaaaaales');
    if(this.InputComentarios == '' || this.InputComentarios == null){
      console.log('comentario if');
      this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = 'NA'
    } else{
        console.log('comentario else');
        this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Comentarios = this.InputComentarios
        }
    console.log('sipaso');
    console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD ].Sacos,'Cantidad de sacos');
    console.log(this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD ].SacosIngresados,'Sacos ingresados');
    console.log(+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo - +this.cantidadSacos.toString(),'resta' ) 
  
    
    console.log(this.ordenTemporalService.preOrdenTemporalSacos);

    let oTSacos = new preOrdenTemporalODSacos();



    oTSacos.IdDetalleOrdenDescarga = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].IdDetalleOrdenDescarga;
    oTSacos.ClaveProducto = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].ClaveProducto;
    oTSacos.Producto = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Producto;
    oTSacos.Sacos = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Sacos;
    oTSacos.SacosIngresados = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].SacosIngresados;
    oTSacos.IdOrdenDescarga = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].IdOrdenDescarga;
    oTSacos.Lote = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Lote
    oTSacos.Saldo = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].Saldo
    // oTSacos.PesoTotal = ((+oTSacos.Sacos) * (+this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].PesoxSaco)).toString();
    oTSacos.FechaCaducidad = this.ordenTemporalService.preOrdenTemporalOD[this.ordenTemporalService.posicionOrdenTemporalOD].FechaCaducidad;
    oTSacos.Comentarios = 'NA';

    console.log(oTSacos,'OTSACOS');

    this.ordenTemporalService.preOrdenTemporalSacos.push(oTSacos);
    console.log('pushazo');
    console.log(this.ordenTemporalService.preOrdenTemporalSacos);
    this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';

    this.sacosSaldo = 0;
    this.ordenTemporalService.posicionOrdenTemporalOD = null
    
    // this.isVisibleVisualizacion = true;
}

onDeleteSacos(posicion: any){
  
  console.log(posicion);
  console.log(this.ordenTemporalService.preOrdenTemporalSacos);

  this.ordenTemporalService.preOrdenTemporalSacos.splice(posicion, 1); 
  
  this.ordenTemporalService.preOrdenTemporalOD[posicion].Saldo = (+this.ordenTemporalService.preOrdenTemporalOD[posicion].SacosIngresados + +this.ordenTemporalService.preOrdenTemporalOD[posicion].Saldo).toString()
  this.ordenTemporalService.preOrdenTemporalOD[posicion].SacosIngresados = '0';
  this.listDataSacosIngresados = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporalSacos);
  this.listData.sort = this.sort;
  this.listData.paginator = this.paginator;
  this.listData.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
  
}


  onAddTarimaOT(){
    console.log(this.ordenTemporalService.preOrdenTemporalOD);
    let IdOD = this.ordenTemporalService.preOrdenTemporalOD[0].IdOrdenDescarga
    console.log(IdOD);
    this.service.getOrdenDescargaIDList(IdOD).subscribe(dataOD =>{ 
      console.clear();
      console.log(dataOD)
              
        let TarimaTemp = new Tarima();
        let DetalleTarimaTemp = new DetalleTarima();
        let sacosTarima = 0; 
        let PesoTotalTarima =  0;

        for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporalSacos.length -1; i++){
          //Tarima
          sacosTarima = +this.ordenTemporalService.preOrdenTemporalSacos[i].SacosIngresados + +sacosTarima;
          PesoTotalTarima = ((+this.ordenTemporalService.preOrdenTemporalSacos[i].SacosIngresados) * (+this.dataODID[i].PesoxSaco)) + PesoTotalTarima

        }
        TarimaTemp.IdTarima = 0;
        TarimaTemp.Sacos = sacosTarima.toString();
        TarimaTemp.PesoTotal = PesoTotalTarima.toString();
        TarimaTemp.QR = nanoid(7);
        TarimaTemp.Bodega = 'ELP';
        console.log(TarimaTemp, "TARIMA");

        this.Tarimaservice.addTarima(TarimaTemp).subscribe(resAdd => {
          console.log('Se agrego una nueva tarima');
        console.log(resAdd);

        for (let i = 0; i <= this.ordenTemporalService.preOrdenTemporalSacos.length -1; i++){
          
          this.Tarimaservice.getUltimaTarima().subscribe(DataTarima => {
           let IdTarimaDt = DataTarima[0].IdTarima;
           let Sacos = this.ordenTemporalService.preOrdenTemporalSacos[i].SacosIngresados;
           let Lote = this.Tarimaservice.tarimaDetalleDOD[i].Lote;
           let ClaveProducto = this.ordenTemporalService.preOrdenTemporalSacos[i].ClaveProducto;
            
            //detalle tarima

              DetalleTarimaTemp.IdDetalleTarima = 0;
              DetalleTarimaTemp.IdTarima = IdTarimaDt;
              DetalleTarimaTemp.ClaveProducto = this.Tarimaservice.tarimaDetalleDOD[i].ClaveProducto;
              DetalleTarimaTemp.Producto = this.Tarimaservice.tarimaDetalleDOD[i].Producto;
              DetalleTarimaTemp.Sacos = this.ordenTemporalService.preOrdenTemporalOD[i].SacosIngresados;
              DetalleTarimaTemp.PesoxSaco = this.Tarimaservice.tarimaDetalleDOD[i].PesoxSaco;
              DetalleTarimaTemp.Lote = this.Tarimaservice.tarimaDetalleDOD[i].Lote;
              DetalleTarimaTemp.IdProveedor = this.Tarimaservice.tarimaDetalleDOD[i].IdProveedor;
              DetalleTarimaTemp.Proveedor = this.Tarimaservice.tarimaDetalleDOD[i].Proveedor;
              DetalleTarimaTemp.PO = this.Tarimaservice.tarimaDetalleDOD[i].PO;
              DetalleTarimaTemp.FechaMFG = this.Tarimaservice.tarimaDetalleDOD[i].FechaMFG;
              DetalleTarimaTemp.FechaCaducidad = this.Tarimaservice.tarimaDetalleDOD[i].FechaCaducidad;
              DetalleTarimaTemp.Shipper = this.Tarimaservice.tarimaDetalleDOD[i].Shipper;
              DetalleTarimaTemp.USDA = this.Tarimaservice.tarimaDetalleDOD[i].USDA;
              DetalleTarimaTemp.Pedimento = this.Tarimaservice.tarimaDetalleDOD[i].Pedimento;
            console.log(DetalleTarimaTemp,"PRUEBA AGREGAR SOLO EL QUE CAMBIA");
            
            console.log(DetalleTarimaTemp, 'DETALLETARIMA a DB');
            
            this.Tarimaservice.addDetalleTarima(DetalleTarimaTemp).subscribe(DataTemp =>{
            
  
                console.log(DataTemp);
                })

                
              

                //insercion a orden temporal
                let ordenTemp = new OrdenTemporal();
                
                ordenTemp.IdOrdenTemporal = 1;
                ordenTemp.IdTarima = IdTarimaDt;
                ordenTemp.IdOrdenCarga = 0;
                ordenTemp.IdOrdenDescarga = this.IdOrdenDescarga;
                ordenTemp.QR = TarimaTemp.QR;
                ordenTemp.ClaveProducto = this.ordenTemporalService.preOrdenTemporalOD[i].ClaveProducto;
                ordenTemp.Lote = this.ordenTemporalService.preOrdenTemporalOD[i].Lote;


                //conforme a lo ingresado van los sacos, y cada orden temporal resta el saldo total


                ordenTemp.Sacos = this.ordenTemporalService.preOrdenTemporalOD[i].SacosIngresados;
                ordenTemp.Producto = this.ordenTemporalService.preOrdenTemporalOD[i].Producto;
                ordenTemp.PesoTotal = ((+this.ordenTemporalService.preOrdenTemporalOD[i].SacosIngresados) * (+this.dataODID[i].PesoxSaco)).toString();
                ordenTemp.FechaCaducidad = this.ordenTemporalService.preOrdenTemporalOD[i].FechaCaducidad;
                ordenTemp.Comentarios = this.ordenTemporalService.preOrdenTemporalOD[i].Comentarios;
                console.log(ordenTemp,'ordentemp´final');

                this.ordenTemporalService.addOrdenTemporal(ordenTemp).subscribe(DataOT =>{
                  console.log(DataOT);

                  //se tomara el valor de sacos, para ser modificado en update saldo
                  this.service.getDetalleOrdenDescargaIdLoteClave(this.IdOrdenDescarga, Lote, ClaveProducto).subscribe(dataOD =>{
                    console.log(dataOD);
                    console.log(Sacos);
                    let NuevoSaldo = ((+dataOD[0].Saldo) - (+Sacos)).toString();
                    this.service.updateDetalleOrdenCargaSaldo(dataOD[0].IdDetalleOrdenDescarga, NuevoSaldo).subscribe(res =>{
                      console.log(res);
                  })
                    })
                    this.actualizarTablaOrdenTemporal();
    // console.log('actualizar');
    // this.isVisibleOT = true;
                })
          })
  
          }

          
          // asignar valores al objeto que sera insertado en orden temporal.
          // se crea un nuevo objeto ya que el anterior(OT) tiene datos locales, los cuales no estan en la DB
          
          
          
        })
       
      
      
      
    })
    //fin de la insercion
    
  }


  actualizarTablaOrdenTemporal() {
    this.ordenTemporalService.GetOrdenTemporalIDOD(this.IdOrdenDescarga).subscribe(dataOrdenTemporal => {
      console.log(dataOrdenTemporal);
      if (dataOrdenTemporal.length > 0) {
        console.log('Si hay Movimientos en esta orden de Descarga');
        this.listDataOrdenTemporal = new MatTableDataSource(dataOrdenTemporal);
        this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      } else {
        console.log('No hay Movimientos en esta orden de Descarga');

        // this.listDataOrdenTemporal = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
        // this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        // this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        // this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      }
    })
  }

}
