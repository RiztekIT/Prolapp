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

@Component({
  selector: 'app-ordendescargadetalle',
  templateUrl: './ordendescargadetalle.component.html',
  styleUrls: ['./ordendescargadetalle.component.css']
})
export class OrdendescargadetalleComponent implements OnInit {
  //Id Orden Carga
  IdOrdenDescarga: number;
  constructor(private service: OrdenDescargaService, public ordenTemporalService: OrdenTemporalService, public router: Router,  private dialog: MatDialog,  public imageService: ImagenService, private _sanitizer: DomSanitizer,
    public AlmacenEmailService:AlmacenEmailService){

    this.ordenTemporalService.listenOrdenTemporal().subscribe((m: any) => {
      this.actualizarTablaOrdenTemporal();
    });
  }

  // Tabla Orden Temporal
  listDataOrdenTemporal: MatTableDataSource<any>;
  displayedColumnsOrdenTemporal: string[] = ['QR', 'ClaveProducto', 'Producto', 'Lote', 'Sacos', 'PesoTotal', 'FechaCaducidad', 'Comentarios', 'Options'];
  @ViewChild(MatSort, null) sortOrdenTemporal: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginatorOrdenTemporal: MatPaginator;

  files: File[] = [];
  imagenes: any[];
  Folio: number;

  imagePath: SafeResourceUrl;
  imageInfo: ImgInfo[] = [];



  ngOnInit() {
    this.IdOrdenDescarga = +(localStorage.getItem('IdOrdenDescarga'));
    this.actualizarTablaOrdenTemporal();
    console.log(this.service.formData);
    console.log(localStorage.getItem('IdOrdenDescarga'));
    this.ObtenerFolio(this.IdOrdenDescarga);
  }

  regresar(){
    this.router.navigate(['/ordendescarga']);
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
        this.listDataOrdenTemporal = new MatTableDataSource(this.ordenTemporalService.preOrdenTemporal);
        // this.listDataOrdenTemporal.sort = this.sortOrdenTemporal;
        // this.listDataOrdenTemporal.paginator = this.paginatorOrdenTemporal;
        // this.listDataOrdenTemporal.paginator._intl.itemsPerPageLabel = 'Conceptos por Pagina';
      }
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
    this.Folio = dataOC[0].Folio;
    console.log(this.Folio);
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








}


