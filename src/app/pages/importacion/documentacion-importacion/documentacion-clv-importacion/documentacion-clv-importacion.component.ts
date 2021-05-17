import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators';

import { Producto } from 'src/app/Models/catalogos/productos-model';

import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';

import { AddsproductosService } from 'src/app/services/addsproductos.service';

import { ProductosService } from 'src/app/services/catalogos/productos.service';

import { DocumentosImportacionService } from 'src/app/services/importacion/documentos-importacion.service';

import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';

import { DocumentacionImportacionVisorDocumentosComponent } from '../../documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';
import { Documento } from 'src/app/Models/documentos/documento-model';

import Swal from 'sweetalert2';

import { MatSort } from '@angular/material/sort';

import { EventosService } from 'src/app/services/eventos/eventos.service';

import { ConnectionHubServiceService } from 'src/app/services/shared/ConnectionHub/connection-hub-service.service';



let origenNotificacion =[] = [
  {
  "IdNotificacion": 0,
  "Folio": 0,
  "IdUsuario": '',
  "Usuario": '',
  "Mensaje": '',
  "ModuloOrigen": '',
  "FechaEnvio": '',
  "origen": "Almacen", 
  "titulo": 'Documento CLV',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-documentacion-clv-importacion',
  templateUrl: './documentacion-clv-importacion.component.html',
  styleUrls: ['./documentacion-clv-importacion.component.css']
})
export class DocumentacionCLVImportacionComponent implements OnInit {

  constructor(public ServiceProducto: ProductosService, public addproductos: AddsproductosService, public documentosService: DocumentosImportacionService,  private dialog: MatDialog,
    private eventosService:EventosService,
    private ConnectionHubService: ConnectionHubServiceService,) { 
    this.productosExistentes = false;
  }

  ngOnInit() {
    this.dropdownRefresh2();
  }

  //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

  //guardar arreglo de documentos del dropzone
  events: any;

  //Arreglo donde se guardan los nombres de los Documentos
  archivos: any[];

  //Variable de onjetos donde se guardaran los Documentos/Imagenes TIPO FILE ( estos son los que son enviados al server como parametro, para ser adjuntasos en el email)
  files: File[] = [];
  filesImagen: File[] = [];

  //Estatus
  pdfstatus = false;

  //File URL del pdf, para ser mostrado en el visor de decumentos
  fileUrl;

  //Arreglo de objetos donde se guardaran las fotos obtenidas del server
  imageInfo: ImgInfo[] = [];
  imagenes: any[];

  //Variable para identificar si el archivo es un documento o una imagen
  tipo: string;

  //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

    //Tabla detalles Seleccionados
    listDataSeleccionados: MatTableDataSource<any>;
    seleccionados = new Array<any>();
    displayedColumnsSeleccionados: string[] = ['ClaveProducto', 'Producto', 'Options'];
    @ViewChild(MatSort, null) sortSeleccionados: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginatorSeleccionados: MatPaginator;
  

      //Esta variable especifica si hay productos en la tabla productos Seleccionados
  productosExistentes: boolean;


//^ Valores del Producto y Clave Producto generado
Producto: string = "";
ClaveProducto: string = "";

   //^ valores Producto
   ProductoSelect: string;
   myControl2 = new FormControl();
   options2: Producto[] = [];
   filteredOptions2: Observable<any[]>;
   listProducts: Producto[] = [];
   ClaveSelect: string;
   ProductoPrecio: number;
 
   formProd = new Producto();
 
   //^ Valores Marca
   MarcaSelect: string;
   clavemarca:string;
   myControl3 = new FormControl();
   options3: any[] = []
   filteredOptions3: Observable<any[]>;

     //^ Valores Origen
  OrigenSelect:string;
  claveorigen:string;
  myControl4 = new FormControl();
  filteredOptions4: Observable<any[]>;
  options4: any[] = []
  //^ Valores presentacion
  PresentacionSelect: string;
  clavepresentacion:string;
  myControl5 = new FormControl();
  filteredOptions5: Observable<any[]>;
  options5: any[] = []


  //******************** METODOS PRODUCTOS ********************//
  
  dropdownRefresh2() {
    this.options2 = [];
    this.ServiceProducto.getProductosList().subscribe(dataP => {
      for (let i = 0; i < dataP.length; i++) {
        let product = dataP[i];
        this.listProducts.push(product);
        this.options2.push(product)
        this.filteredOptions2 = this.myControl2.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter2(value))
          );
        }
      });
      
    }
    private _filter2(value: any): any[] {
      // console.clear();
      // console.log(value);
      if (typeof (value) == 'string') {
        const filterValue2 = value.toLowerCase();
        return this.options2.filter(option => option.ClaveProducto.toString().toLowerCase().includes(filterValue2) || option.Nombre.toString().toLowerCase().includes(filterValue2));
      } else if (typeof (value) == 'number') {
        const filterValue2 = value.toString();
        return this.options2.filter(option => option.ClaveProducto.toString().includes(filterValue2) || option.Nombre.toString().includes(filterValue2));
      }
      
      
    }
    
    onSelectionChangeProducto(option: any, event: any){
      console.log(option);
      if (event.isUserInput) {
        this.ProductoSelect = option.Nombre
        this.ClaveSelect = option.ClaveProducto
        this.generarClaveProducto();
        this.dropdownMarcas(option.Nombre);
        this.dropdownOrigen();
      // this.dropdownPresentacion();
      }
      
    }
    //******************** METODOS PRODUCTOS ********************//
    
    //******************** METODOS MARCAS ********************//
    dropdownMarcas(producto){
      this.options3 = [];
      this.addproductos.getMarcas(producto).subscribe((marca: any) =>{
        for (let i=0; i < marca.length; i++){
          
          this.options3.push(marca[i])
          this.filteredOptions3 = this.myControl3.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filtermarca(value))
            );
          }
          
        })
      }
      
      private _filtermarca(value: any): any[] {
        if (typeof (value) == 'string') {
          const filterValue2 = value.toLowerCase();
          return this.options3.filter(option => option.NombreMarca.toString().toLowerCase().includes(filterValue2));
        } 
      }
      
      
      
      onSelectionChangeMarca(option: any, event: any){
        if (event.isUserInput) {
          this.clavemarca = option.ClaveMarca
          this.MarcaSelect = option.NombreMarca

          this.generarClaveProducto();
        }
      }
      //******************** METODOS MARCAS ********************//

      //******************** METODOS ORIGEN ********************//

      dropdownOrigen(){
        this.options4 = [];
        this.addproductos.getOrigen().subscribe((origen: any) =>{
          for (let i=0; i < origen.length; i++){
            
            this.options4.push(origen[i])
            this.filteredOptions4 = this.myControl4.valueChanges
              .pipe(
                startWith(''),
                map(value => this._filterorigen(value))
              );
          }
          
        })
      }
      private _filterorigen(value: any): any[] {
        // console.clear();
        // console.log(value);
        if (typeof (value) == 'string') {
          const filterValue2 = value.toLowerCase();
          return this.options4.filter(option => option.NombreOrigen.toString().toLowerCase().includes(filterValue2));
        } 
      }
      onSelectionChangeOrigen(options2, event: any){
        console.log(options2);
        this.claveorigen = options2.ClaveOrigen;
        this.OrigenSelect = options2.NombreOrigen;

        this.generarClaveProducto();
    
      }

      //******************** METODOS ORIGEN ********************//

      //******************** METODOS PRESENTACION ********************//

      // dropdownPresentacion(){
      //   this.options5 = [];
      //   this.addproductos.getPresentacion().subscribe((Presentacion: any) =>{
      //     for (let i=0; i < Presentacion.length; i++){
            
      //       this.options5.push(Presentacion[i])
      //       this.filteredOptions5 = this.myControl5.valueChanges
      //         .pipe(
      //           startWith(''),
      //           map(value => this._filterpresentacion(value))
      //         );
      //     }
          
      //   })
      // }
    
      // private _filterpresentacion(value: any): any[] {
      //   if (typeof (value) == 'string') {
      //     const filterValue2 = value.toLowerCase();
      //     return this.options5.filter(option => option.Presentacion.toString().toLowerCase().includes(filterValue2));
      //   } 
      // }
      // onSelectionChangePresentacion(options2, event: any){
      //   console.log(options2);
      //   this.PresentacionSelect = options2.Presentacion;
      //  this.generarClaveProducto();
        
      
      // }
      //******************** METODOS PRESENTACION ********************//
      
      
      generarClaveProducto(){
        this.ClaveProducto = "";
        this.Producto = "";
        // this.ClaveProducto = this.ClaveSelect + this.clavemarca;
        this.ClaveProducto = this.ClaveSelect + this.clavemarca + this.claveorigen;
        this.Producto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect; 
        // this.Producto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect;
      }

      addToList() {

        let producto : any ={};
        producto.Producto = this.Producto;
        producto.ClaveProducto = this.ClaveProducto;

          this.seleccionados.push(producto);    
         

        this.verificarProductosSeleccionados();
    
      }

      removeFromList(row: any) {
        console.log(row);
        this.seleccionados.splice(this.seleccionados.indexOf(row), 1);
        this.verificarProductosSeleccionados();
    
      }
      
  //este metodo verifica si aun hay datos en la tabla de productos seleccionados
  verificarProductosSeleccionados() {
    if (this.seleccionados.length > 0) {
      this.productosExistentes = true;
    } else {
      this.productosExistentes = false;
    }
    this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
    this.listDataSeleccionados.sort = this.sortSeleccionados;
  }
      
      //******************** METODOS ARCHIVOS  ********************//

      onAddDocumentos2() {
         console.log(this.seleccionados);
      }

      
  //Agregar documentos a la base de datos y Servidor
  onAddDocumentos() {

    let event = this.events;
    console.log(event)
    console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionados.length
    for (var l = 0; l < this.seleccionados.length; l++) {
      console.log(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'CLV')
        formData.append('clave', this.seleccionados[l].ClaveProducto)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = 0;
        documento.IdDetalle = 0;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'CLV';
        documento.ClaveProducto = this.seleccionados[l].ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/CLV/0/0/' + this.seleccionados[l].ClaveProducto + '/' + event.addedFiles[i].name;
        documento.Observaciones = "";
        documento.Vigencia = new Date();
        console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            console.log('Ya existe este documento');
            if (ultimoSeleccionado == l && event.addedFiles.length == i) {
              this.seleccionados = []
              // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
              this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
              // this.clearFolio();
              // this.clearTipoDocumento();
              this.events = [];
              this.files = [];
              this.archivos = [];
              Swal.fire({
                title: 'Documentos Guardados',
                icon: 'success',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
              });
            }
          } else {
            console.log('Agregar Documento');
            this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
              console.log(resBaseDatos);
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
                console.log('%c%s', 'color: #ff6600', res);
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionados = []
                  // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
                  this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
                  // this.clearFolio();
                  // this.clearTipoDocumento();
                  this.events = [];
                  this.files = [];
                  this.archivos = [];
                  
                  this.eventosService.movimientos('Agregar Documento CLV')
                  this.ConnectionHubService.generarNotificacion(origenNotificacion[0])
                  Swal.fire({
                    title: 'Documentos Guardados',
                    icon: 'success',
                    timer: 1000,
                    showCancelButton: false,
                    showConfirmButton: false
                  });
                }

              });
            })
          }
          
        })
      }

    }
    // this.files.push(...event.addedFiles);
  }


  //Leer archivo/documento del Servidor
  leerArchivos(a) {
    console.log(a);
    const formData = new FormData();
    formData.append('folio', '0')
    formData.append('id', '0')
    formData.append('archivo', a.name)
    formData.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/'+a.id)
    this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
      // console.log(res);
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      let fr = new FileReader();

      fr.readAsDataURL(blob);
      fr.onload = e => {
        // console.log(e);
        // console.log(fr.result);
        this.fileUrl = fr.result;
        this.pdfstatus = true;
        this.documentosService.fileUrl = this.fileUrl;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "70%";
        this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
      }
    })

  }

  obtenerDocumentos() {
// const formData = new FormData();
//     this.documentosService.readDirDocumentosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
//       console.log(res);
//     })

    // console.log(folio, id);
    let ClaveProducto = this.ClaveProducto
    console.log('%c%s', 'color: #cc0036', this.ClaveProducto);

    const formData = new FormData();
    //Folio de la Orden
    formData.append('folio', '0');
    //Id Detalle Tarima
    formData.append('id', '0');
    formData.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/'+ClaveProducto);
    console.log(formData);
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      console.log(res);
      this.archivos = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = ClaveProducto;
          archivo.folio = 0;
          this.archivos.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', '0');
          formDataDoc.append('id', ClaveProducto);
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/CLV/0/0/'+ClaveProducto);
          this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
            //  console.log(resDoc)
            const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
            //  console.log(blob)
            let fr = new FileReader();
            let name = res[i];
            fr.readAsDataURL(blob);
            //  console.log(fr.readAsDataURL(blob));
            fr.onload = e => {
              //  console.log(e);
              //  console.log(fr.result);
              this.tipo = 'documento'
              this.dataURItoBlob(fr.result, name);
            }
          })
        }
      }
      // console.log(this.archivos)
    })

  }

  //Metodo para convertir imagen base64 a tipo File
  dataURItoBlob(dataURI: any, fileName: string): File {

    // console.log(dataURI);
    // console.log(fileName);

    // convert base64/URLEncoded data component to a file
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //igualar documento a tipo File 
    let file = new File([ia], fileName, { type: mimeString });

    return new File([ia], fileName, { type: mimeString });
  }

  //Agregar Documento al arreglo events(este arreglo es el que se usa para guardar Docs en Server y Base de datos) y al arreglo files(dropzone)
  onSelect(event) {

    this.events = event
    this.files.push(...event.addedFiles);

  }
  //Eliminar documento de arreglos locales
  onRemoveDocDropzone(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.events.addedFiles.splice(this.events.addedFiles.indexOf(event), 1);
  }
  //Eliminar Documento del Servidor
  onRemove(event) {
    console.log(event);
    Swal.fire({
      title: '¿Seguro de Borrar Documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        const formData = new FormData();
        formData.append('name', event.name.toString())
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'CLV')
        formData.append('clave', event.id)
        console.log(formData);
        let docu = new Documento();
        docu.Folio = event.folio;
        docu.Modulo = 'Importacion';
        docu.Tipo = 'CLV';
        docu.NombreDocumento = event.name;
        docu.IdDetalle = event.id
        this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
          console.log(resDelete);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
            console.log(res)
            // this.files.splice(this.files.indexOf(event),1);
            this.archivos.splice(this.archivos.indexOf(event), 1);
            this.pdfstatus = false;
            
            this.eventosService.movimientos('Documento CLV Borrado')
            Swal.fire({
              title: 'Borrado',
              icon: 'success',
              timer: 1000,
              showCancelButton: false,
              showConfirmButton: false
            });
          })
        })


      }
    })

  }

      //******************** METODOS ARCHIVOS  ********************//


}
