import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenDescargaService } from 'src/app/services/almacen/orden-descarga/orden-descarga.service';
import { OrdenTemporalService } from 'src/app/services/almacen/orden-temporal/orden-temporal.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { Imagenes } from 'src/app/Models/Imagenes/imagenes-model';
import { ImagenService } from '../../../../services/imagenes/imagen.service';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlmacenEmailService } from '../../../../services/almacen/almacen-email.service';
import { OrdenDescargaEmailComponent } from './orden-descarga-email/orden-descarga-email.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Tarima } from 'src/app/Models/almacen/Tarima/tarima-model';
import { startWith, map } from 'rxjs/operators';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';
import { QrComponent } from 'src/app/components/qr/qr.component';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';
import { EntradaProductoComponent } from 'src/app/components/almacen/entrada-producto/entrada-producto.component';


@Component({
  selector: 'app-ordendescargadetalle',
  templateUrl: './ordendescargadetalle.component.html',
  styleUrls: ['./ordendescargadetalle.component.css']
})
export class OrdendescargadetalleComponent implements OnInit {
  //Id Orden Carga
  IdOrdenDescarga: number;
  constructor(public service: OrdenDescargaService,public Tarimaservice: TarimaService, public ordenTemporalService: OrdenTemporalService, public router: Router,  private dialog: MatDialog,  public imageService: ImagenService, private _sanitizer: DomSanitizer,
    public AlmacenEmailService:AlmacenEmailService){

    this.ordenTemporalService.listenOrdenTemporal().subscribe((m: any) => {
      this.actualizarTablaOrdenTemporal();
    });
  }

  // Tabla Orden Temporal
  listDataOrdenTemporal: MatTableDataSource<any>;
  displayedColumnsOrdenTemporal: string[] = ['Factura', 'CBK', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios'];
  // displayedColumnsOrdenTemporal: string[] = ['QR', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;

  files: File[] = [];
  imagenes: any[];
  Folio: number;
  Estatus: string="";

  imagePath: SafeResourceUrl;
  imageInfo: ImgInfo[] = [];

  // ShowBuscar: boolean;
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  listQR: Tarima[] = [];
  options: Tarima[] = [];

  qrsearch;



  ngOnInit() {
    // this.ShowBuscar = false;
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    console.log('this.IdOrdenDescarga: ', this.IdOrdenDescarga);
    this.service.formData = JSON.parse(localStorage.getItem('OrdenDescarga')); 
    console.log(this.service.formData, 'formdata');
    this.actualizarTablaOrdenTemporal();
    console.log(localStorage.getItem('IdOrdenDescarga'));
    this.ObtenerFolio(this.IdOrdenDescarga);
  //^ **** PRIVILEGIOS POR USUARIO *****
  this.obtenerPrivilegios();
  //^ **** PRIVILEGIOS POR USUARIO *****
}


//^ **** PRIVILEGIOS POR USUARIO *****
privilegios: any;
privilegiosExistentes: boolean = false;
modulo = 'Almacen';
area = 'Orden de Descarga';

//^ VARIABLES DE PERMISOS
AgregarEvidencia: boolean = false;
Enviar: boolean = false;
Descargar: boolean = false;
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
    case ('Agregar Evidencias'):
      this.AgregarEvidencia = true;
      break;
    case ('Enviar Orden de Descarga'):
      this.Enviar = true;
      break;
    case ('Agregar Productos'):
      this.Descargar = true;
      break;
    default:
      break;
  }
}
//^ **** PRIVILEGIOS POR USUARIO *****

  regresar(){
    this.router.navigate(['/ordendescarga']);
  }

  actualizarTablaOrdenTemporal() {
    this.ordenTemporalService.GetOrdenTemporalIDOD(this.IdOrdenDescarga).subscribe(dataOrdenTemporal => {
      console.log(dataOrdenTemporal);
      // if (this.ShowBuscar == false){
        if (dataOrdenTemporal.length > 0) {
          console.log('Si hay Movimientos en esta orden de Descarga');
          this.listDataOrdenTemporal = new MatTableDataSource(dataOrdenTemporal);
          this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
          this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
          this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
        } else {
          console.log('No hay Movimientos en esta orden de Descarga');
          this.listDataOrdenTemporal = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
          // this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
          // this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
          // this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
        }
      // } else{
      //   console.log("buscar true");
      //   console.log(this.ShowBuscar);
      //   console.log(this.qrsearch,'actualizar')
      //   this.ordenTemporalService.GetOrdenTemporalIdqrOD(this.IdOrdenDescarga, this.qrsearch).subscribe(qrvalue => {
      //     console.log(qrvalue);
      //     this.listDataOrdenTemporal = new MatTableDataSource(qrvalue);
      //     this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
      //     this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
      //     this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      //   })
      // }

    })


  }

  evidencia(){
    this.router.navigate(['/ordenDescargaEvidencia']);

  }
  onAddTarima(){
    
    this.router.navigate(['/ordenDescargaTarima']);
  }

  //Metodo para obtener el nombre de las imagenes y posteriormente traerse la imagen del servidor
leerDirImagenes() {
  //Obtener nombre de la imagen del servidor
  const formData = new FormData();
  formData.append('folio', this.Folio.toString())
  this.imagenes = [];
  this.imageInfo = new Array<ImgInfo>();
  this.files = [];
  console.log(this.imageInfo);
  this.imageService.readDirImagenesServidor(formData,'cargarNombreImagenesOrdenDescarga').subscribe(res => {
    if(res){
    if (res.length > 0) {
      console.log('Si hay imagenes')
      console.log(res);
      
      for (let i = 0; i < res.length; i++) {
        this.imagenes.push(res[i]);
        let data = new ImgInfo;
        data.ImageName = res[i];

        //Traer la imagen del servidor
        const formDataImg = new FormData();
        formDataImg.append('folio', this.Folio.toString())
        formDataImg.append('archivo', data.ImageName)
        console.log(formDataImg);
        this.imageService.readImagenesServidor(formDataImg,'ObtenerImagenOrdenDescarga').subscribe(resImagen => {
          console.log(resImagen);

          let TYPED_ARRAY = new Uint8Array(resImagen);
          const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
            return data + String.fromCharCode(byte);
          }, '');
          let base64String = btoa(STRING_CHAR);

          data.ImagePath = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);

          console.log(data);
          this.imageInfo.push(data)
        })
      }
      console.log(this.imageInfo)

    } else {
      console.log('No hay imagenes')
    }
  }
  })

}

//Obtener Folio de Orden Descarga
ObtenerFolio(id: number) {
  this.service.getOrdenDescargaID(id).subscribe(dataOC => {
    console.log(dataOC);
    this.Estatus = dataOC[0].Estatus
    this.Folio = dataOC[0].Folio;
    console.log(this.Folio);
    console.log(this.Estatus);
    this.leerDirImagenes();
  })
}
  
  // ObtenerFolio() {
    // this.router.navigate(['/ordenDescargatarima']);
    // this.service.GetFolio().subscribe(data => {
    //   // console.log(data[0].Folio);
    //   let folio = data[0].Folio;
    //   if (folio == "") {
    //     folio = 1;
    //   } else {
    //     folio = +folio + 1;
    //   }
    //   console.log(folio);
    //   this.PedidoBlanco.Folio = folio.toString();
    //   console.log(this.PedidoBlanco);
    //   //Agregar el nuevo pedido. NECESITA ESTAR DENTRO DEL SUBSCRIBEEEEEEEE :(
    //   this.service.addPedido(this.PedidoBlanco).subscribe(res => {
    //     console.log(res);
    //     //Obtener el pedido que se acaba de generar
    //     this.ObtenerUltimoPedido();
    //   });
    // });
  // }


  email(){
   
    this.AlmacenEmailService.correo='ivan.talamantes@live.com';
    this.AlmacenEmailService.cco='javier.sierra@riztek.com.mx';
    this.AlmacenEmailService.asunto='Envio Orden Descarga con Folio '+this.Folio.toString();
    this.AlmacenEmailService.cuerpo='Se han enviado Documentos de Orden Descarga con el Folio '+this.Folio.toString();
    this.AlmacenEmailService.nombre='ProlactoIngredientes';
    this.AlmacenEmailService.folio = this.Folio;

    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = "90%";
      
        this.dialog.open(OrdenDescargaEmailComponent, dialogConfig);

  }

  // BuscarTarimaQR(){
  //   this.ShowBuscar = true;
  //   this.dropdownRefresh();
  //   // const dialogConfig = new MatDialogConfig();
  //   // dialogConfig.disableClose = true;
  //   // dialogConfig.autoFocus = true;
  //   // dialogConfig.height = "90%";
  
  //   // this.dialog.open(OrdenDescargaEmailComponent, dialogConfig);

  // }

  // CloseBuscar(){
  //   this.ShowBuscar = false;
  //   this.qrsearch = "";
  //   this.actualizarTablaOrdenTemporal();
  // }


  // qr
  private _filter(value: any): any[] {
    console.log(value);
this.qrsearch = value;
console.log(this.qrsearch,"filtro");
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.QR.toLowerCase().includes(filterValue));
  }

  dropdownRefresh() {
    this.service.GetQROD(this.IdOrdenDescarga).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let Qr = data[i];
        this.listQR.push(Qr);
        this.options.push(Qr)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });

  }

  //on blur se usa para que en caso de modificar el filtro no se borre el dato que esta dentro del select, limpia el arreglo y lo vuelve a llenar desde DB
  onBlurQR() {
    console.log('blur');
    console.log(this.qrsearch,'blur');
    this.listQR = [];
    this.options = [];
    // this.dropdownRefresh();
    this.actualizarTablaOrdenTemporal();
  }

  onSelectionChange(options: Tarima, event: any) {
    if (event.isUserInput) {
      this.Tarimaservice.formDataDrop = options;
    }
  }

  QRmodal(){

    localStorage.setItem("QRtarima", this.qrsearch)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(QrComponent, dialogConfig);
  }

  rowqr(row: OrdenTemporal){
    console.log(row);
    this.qrsearch = row.QR
 localStorage.setItem("QRtarima", this.qrsearch);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    this.dialog.open(QrComponent, dialogConfig);
  }

  pdf(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.data = {
     IdOrdenDescarga: this.IdOrdenDescarga
    }
    this.dialog.open(EntradaProductoComponent, dialogConfig);
  }





}


