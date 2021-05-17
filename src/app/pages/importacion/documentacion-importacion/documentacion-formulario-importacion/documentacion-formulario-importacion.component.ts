import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';

import { MatSort } from '@angular/material/sort';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { DocumentosImportacionService } from '../../../../services/importacion/documentos-importacion.service';

import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';

import { DocumentacionImportacionVisorDocumentosComponent } from '../../documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';

import { Documento } from '../../../../Models/documentos/documento-model';

import { Producto } from 'src/app/Models/catalogos/productos-model';

import { OrdenTemporalService } from '../../../../services/almacen/orden-temporal/orden-temporal.service';

import { ProductosService } from 'src/app/services/catalogos/productos.service';

import { AddsproductosService } from 'src/app/services/addsproductos.service';

import { map, startWith } from 'rxjs/operators';

import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';

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
  "titulo": 'Documento Factura',
  "datosExtra": '',
  },
]

@Component({
  selector: 'app-documentacion-formulario-importacion',
  templateUrl: './documentacion-formulario-importacion.component.html',
  styleUrls: ['./documentacion-formulario-importacion.component.css']
})
export class DocumentacionFormularioImportacionComponent implements OnInit {
  

  constructor(public documentosService: DocumentosImportacionService, public router: Router, private dialog: MatDialog, public otService: OrdenTemporalService, public ServiceProducto: ProductosService, 
    public addproductos: AddsproductosService, public traspasoService: TraspasoMercanciaService,
    private eventosService:EventosService,
    private ConnectionHubService: ConnectionHubServiceService,) {
    this.productosExistentes = false;
  }

  ngOnInit() {
    this.dropdownRefresh2();
    // console.log(this.documentosService.folioOrdenDescarga);
    // if (this.documentosService.folioOrdenDescarga) {
    //   this.folioOrdenDescarga = this.documentosService.folioOrdenDescarga;
    //   this.obtenerOrdenesDescargaDetalles(this.folioOrdenDescarga);

    // }
    // if (this.documentosService.importacion){
    //   this.obtenerProductos();
    // }
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
    displayedColumnsSeleccionados: string[] = ['ClaveProducto', 'Producto', 'Lote', 'Options'];
    @ViewChild(MatSort, null) sortSeleccionados: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginatorSeleccionados: MatPaginator;
  

      //Esta variable especifica si hay productos en la tabla productos Seleccionados
  productosExistentes: boolean;

  fechaVigencia : string = "";

  Lote: string = "";


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
        this.Producto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect ; 
        // this.Producto = this.ProductoSelect + ' ' + this.MarcaSelect + ' ' + this.OrigenSelect + ' ' + this.PresentacionSelect;
      }

      addToList() {

        let producto : any ={};
        producto.Producto = this.Producto;
        producto.ClaveProducto = this.ClaveProducto;
        producto.Lote = this.Lote

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
      
  //Agregar documentos a la base de datos y Servidor
  onAddDocumentos() {

    let event = this.events;
    // console.log(event)
    // console.log(this.seleccionados.length);
    let ultimoSeleccionado = this.seleccionados.length
    for (var l = 0; l < this.seleccionados.length; l++) {
      // console.log(this.seleccionados[l]);
      for (var i = 0; i < event.addedFiles.length; i++) {
        const formData = new FormData();
        formData.append('0', event.addedFiles[i])
        formData.append('folio', '0')
        formData.append('id', '0')
        formData.append('tipo', 'Factura')
        formData.append('lote', this.seleccionados[l].Lote)
        formData.append('clave', this.seleccionados[l].ClaveProducto)
        // console.log(res);
        // Buscar ultimo folio Documento
        let documento = new Documento();
        documento.IdDocumneto = 0;
        documento.Folio = 0;
        documento.IdDetalle = 0;
        documento.Modulo = 'Importacion';
        documento.Tipo = 'Factura';
        documento.ClaveProducto = this.seleccionados[l].ClaveProducto;
        documento.NombreDocumento = event.addedFiles[i].name;
        documento.Path = 'Documentos/Factura/' + this.seleccionados[l].ClaveProducto + '/' + this.seleccionados[l].Lote + '/' + event.addedFiles[i].name;
        //Las observaciones se usaran como Lote
        documento.Observaciones = this.seleccionados[l].Lote;

        documento.Vigencia = new Date();
        // console.log(documento);

        //verificar que no exista ese documento en la base de datos

        this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
          if (resExistente.length > 0) {
            // console.log('Ya existe este documento');
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
            // console.log('Agregar Documento');
            this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
              // console.log(resBaseDatos);
              this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
                if (ultimoSeleccionado == l && event.addedFiles.length == i) {
                  this.seleccionados = []
                  // this.listDataDetalles = new MatTableDataSource(this.seleccionados);
                  this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
                  // this.clearFolio();
                  // this.clearTipoDocumento();
                  this.events = [];
                  this.files = [];
                  this.archivos = [];

                  
                  this.eventosService.movimientos('Agregar Documento Factura')
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
    formData.append('lote', a.lote)
    formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+a.clave+'/'+a.lote)
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

    // console.log(folio, id);
    let ClaveProducto = this.ClaveProducto
    let Lote = this.Lote;

    const formData = new FormData();
    formData.append('folio', '0');
    formData.append('id', '0');
    formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+ClaveProducto+'/'+Lote);
    this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
      // console.log(res);
      this.archivos = [];
      if (res) {
        // console.log(res.length)
        for (let i = 0; i < res.length; i++) {
          let archivo = <any>{};
          archivo.name = res[i];
          archivo.id = 0;
          archivo.folio = 0;
          archivo.clave = ClaveProducto;
          archivo.lote = Lote;
          this.archivos.push(archivo);
          const formDataDoc = new FormData();
          formDataDoc.append('folio', '0');
          formDataDoc.append('id', '0');
          formDataDoc.append('archivo', res[i])
          formDataDoc.append('direccionDocumento', 'Documentos/Importacion/Factura/'+ClaveProducto+'/'+Lote);
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
    console.log(event);
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
        formData.append('tipo', 'Factura')
        formData.append('clave', event.clave)
        formData.append('lote', event.lote)
        console.log(formData);
        let docu = new Documento();
        docu.Folio = event.folio;
        docu.Modulo = 'Importacion';
        docu.Tipo = 'Factura';
        docu.NombreDocumento = event.name;
        docu.IdDetalle = event.id
      
        // this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
          let query = 'delete Documentos where Path = ' + "'Documentos/Factura/" + event.clave + "/" + event.lote + "/" + event.name + "'"  +''
          let consulta = {
            'consulta': query
          };
          console.log('%c⧭', 'color: #9c66cc', consulta);
          this.traspasoService.getQuery(consulta).subscribe((detallesConsulta: any) => {
            console.log(detallesConsulta);
          // console.log(resDelete);
          this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
            console.log(res)
            // this.files.splice(this.files.indexOf(event),1);
            this.archivos.splice(this.archivos.indexOf(event), 1);
            this.pdfstatus = false;
            
          this.eventosService.movimientos('Documento Factura Borrado')
          
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

  // //Tabla Detalle Orden Descarga
  // listDataDetalles: MatTableDataSource<any>;
  // detallesOrdenTemporal = new Array<any>();
  // displayedColumnsDetalles: string[] = ['Agregar', 'ClaveProducto',  'Lote', 'USDA', 'Pedimento', 'Options'];
  // @ViewChild(MatSort, null) sortDetalles: MatSort;
  // @ViewChild(MatPaginator, { static: true }) paginatorDetalles: MatPaginator;

  // //Tabla detalles Seleccionados
  // listDataSeleccionados: MatTableDataSource<any>;
  // seleccionados = new Array<any>();
  // displayedColumnsSeleccionados: string[] = ['Folio', 'ClaveProducto', 'Lote', 'Options'];
  // @ViewChild(MatSort, null) sortSeleccionados: MatSort;
  // @ViewChild(MatPaginator, { static: true }) paginatorSeleccionados: MatPaginator;

  // folioOrdenDescarga: number;

  // //Esta variable especifica si hay productos en la tabla productos Seleccionados
  // productosExistentes: boolean;

  // //Dropdown Tipo de Documentos
  // myControlTipoDocumento = new FormControl();
  // filteredOptionsTipoDocumento: Observable<any[]>;
  // //Lista de Documentos
  // public listTipoDocumentos: Array<Object> = [
  //   { Tipo: 'USDA' },
  //   { Tipo: 'PEDIMENTO' },
  //   { Tipo: 'OTRO' }
  // ];
  // //Tipo Documento Seleccionado
  // tipoDocumentoSeleccionado: String;
  // //guardar el # del documento
  // stringDocumentoSeleccionado: string = "";


//   //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

//   //guardar arreglo de documentos del dropzone
//   events: any;

//   //Arreglo donde se guardan los nombres de los Documentos
//   archivos: any[];

//   //Variable de onjetos donde se guardaran los Documentos/Imagenes TIPO FILE ( estos son los que son enviados al server como parametro, para ser adjuntasos en el email)
//   files: File[] = [];
//   filesImagen: File[] = [];

//   //Estatus
//   pdfstatus = false;

//   //File URL del pdf, para ser mostrado en el visor de decumentos
//   fileUrl;

//   //Arreglo de objetos donde se guardaran las fotos obtenidas del server
//   imageInfo: ImgInfo[] = [];
//   imagenes: any[];

//   //Variable para identificar si el archivo es un documento o una imagen
//   tipo: string;

//   //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//
  
//   //******************** VARIABLES DROPDOWNS ********************//
//   //valores Producto
//   ProductoSelect: string;
//   myControl2 = new FormControl();
//   options2: Producto[] = [];
//   filteredOptions2: Observable<any[]>;
//   listProducts: Producto[] = [];
//   Cantidad:number
//   ProductoPrecio: number;
  
//   formProd = new Producto();
  
//   //Valores Marca
//   MarcaSelect: string;
//   clavemarca:string;
//   myControl3 = new FormControl();
//   options3: any[] = []
//   filteredOptions3: Observable<any[]>;
  
//   //******************** VARIABLES DROPDOWNS ********************//
  


//   //On change Folio
//   onChangeFolio(folio: any) {
//     // console.log(cantidad);
//     let elemHTML: any = document.getElementsByName('Folio')[0];
//     this.validarFolio(folio);
//     elemHTML.value = this.folioOrdenDescarga;
//     //Transformar la Cantidad en entero e igualarlo a la variable Cantidad
//     // this.calcularImportePedido();
//     console.log(this.folioOrdenDescarga);
//   }

//   //Validar que el folio no sea nula o menor a 0
//   validarFolio(folio: any) {
//     // console.log(cantidad + ' CANTIDAD');
//     this.folioOrdenDescarga = +folio;
//     if (this.folioOrdenDescarga <= 0) {
//       this.folioOrdenDescarga = 0;
//     }
//     if (this.folioOrdenDescarga == null) {
//       this.folioOrdenDescarga = 0;
//     }
//   }

//   clearFolio() {
//     this.folioOrdenDescarga = null;
//     this.seleccionados = []
//     this.listDataDetalles = new MatTableDataSource(this.seleccionados);
//   }

//   clearTipoDocumento() {
//     this.tipoDocumentoSeleccionado = "";
//     this.stringDocumentoSeleccionado = "";
//   }

//   //llenar tabla con Orden Temporal (Es donde se encuentra la informacion de la factura)
//   obtenerOrdenesDescargaDetalles(folio: number) {
//     console.log(folio);
//     // if (folio) {

//       this.documentosService.getOrdenDescargaFolio(folio).subscribe(dataOD => {
//         console.log(dataOD);
//         if (dataOD.length > 0) {
//           this.otService.GetOrdenTemporalIDOD(dataOD[0].IdOrdenDescarga).subscribe(dataDOD => {
//             console.log(dataDOD);
//             for (let i = 0; i <= dataDOD.length - 1; i++) {
//               this.detallesOrdenTemporal[i] = dataDOD[i];
//               this.detallesOrdenTemporal[i].Agregar = false;
//               this.detallesOrdenTemporal[i].Index = i;
//               this.detallesOrdenTemporal[i].Folio = folio;
//             }

//             console.log(this.detallesOrdenTemporal);

//             this.listDataDetalles = new MatTableDataSource(dataDOD);
//             this.listDataDetalles.sort = this.sortDetalles;
//             // this.listDataDetalles.paginator = this.paginatorDetalles;
//             // this.listDataDetalles.paginator._intl.itemsPerPageLabel = 'Productos por Pagina';
//           })
//         } else {
//           Swal.fire({
//             title: 'Error',
//             text: 'No existe Orden de Descarga',
//             icon: 'error',
//             timer: 1000,
//             showCancelButton: false,
//             showConfirmButton: false
//           });
//         }
//       })
//     // } else {
//     //   Swal.fire({
//     //     title: 'Folio no valido',
//     //     icon: 'error',
//     //     timer: 1000,
//     //     showCancelButton: false,
//     //     showConfirmButton: false
//     //   });
//     // }
//   }

//   obtenerProductos(){
//     // this.listDataDetalles = new MatTableDataSource(this.documentosService.productosimportacion);
//     // this.listDataDetalles.sort = this.sortDetalles;

//     // for (let i=0; i<this.documentosService.productosimportacion.length; i++){
//     //   this.addToList(true, this.documentosService.productosimportacion[i])
//     // }
//   }

  Regresar() {
    // this.router.navigate(['/documentacion-importacion']);
    this.router.navigate(['/documentosalmacen']);
  }

//   addToList(checkbox: any, boolean: any) {
//     // console.log(checkbox);
//     // console.log(boolean);
//     // console.log(this.listDataDetalles.data[checkbox.Index].Agregar);
//     // console.log(this.listDataDetalles[checkbox.Index].Agregar );
//     //si checkbox == true
//     if (this.listDataDetalles.data[checkbox.Index].Agregar == false) {
//       this.listDataDetalles.data[checkbox.Index].Agregar = true
//       this.seleccionados.push(checkbox);    
//       // this.stringDocumentoSeleccionado = this.listDataDetalles.data[checkbox.Index].QR
//     }
//     //si es falso
//     else {
//       this.listDataDetalles.data[checkbox.Index].Agregar = false
//       this.seleccionados.splice(this.seleccionados.indexOf(checkbox), 1);
//     }
//     // // //si checkbox == true
//     // if (this.listDataDetalles.data[checkbox.Index].Agregar == true) {
//     //   this.listDataDetalles.data[checkbox.Index].Agregar = true
//     //   this.seleccionados.push(checkbox);      
//     // }
//     // // //si es falso
//     // else {
//     //   this.listDataDetalles.data[checkbox.Index].Agregar = false
//     //   this.seleccionados.splice(this.seleccionados.indexOf(checkbox), 1);
//     // }
//     // console.log(this.listDataDetalles.data[checkbox.Index].Agregar);
//     this.verificarProductosSeleccionados();

//   }

//   removeFromList(row: any) {
//     console.log(row);
//     this.listDataDetalles.data[row.Index].Agregar = false
//     this.seleccionados.splice(this.seleccionados.indexOf(row), 1);
//     this.verificarProductosSeleccionados();

//   }

//   //este metodo verifica si aun hay datos en la tabla de productos seleccionados
//   verificarProductosSeleccionados() {
//     if (this.seleccionados.length > 0) {
//       this.productosExistentes = true;
//     } else {
//       this.productosExistentes = false;
//     }
//     this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
//     this.listDataDetalles.sort = this.sortDetalles;
//   }

//   onSelectionChangeTipoDocumento(options: any, event: any) {
//     if (event.isUserInput) {
//       console.log(options);
//       console.log(event);
//       // this.NombreProveedor = options.Nombre;
//       // this.compra.Proveedor = options.Nombre;
//     }

//   }

//   onAddDocumentos2(){
//     console.log(this.seleccionados,'seleccionados');
//   }

//   //Agregar documentos a la base de datos y Servidor
//   onAddDocumentos() {
//     console.log(this.seleccionados,'seleccionados');

//     let event = this.events;
//     // console.log(event)
//     // console.log(this.seleccionados.length);
//     let ultimoSeleccionado = this.seleccionados.length
//     for (var l = 0; l < this.seleccionados.length; l++) {
//       // console.log(this.seleccionados[l]);
//       //update OrdenTemporal
//       //^ this.actualizarTipoDocumento(this.seleccionados[l]);
//       for (var i = 0; i < event.addedFiles.length; i++) {
//         const formData = new FormData();
//         formData.append('0', event.addedFiles[i])
//         formData.append('id', this.seleccionados[l].IdOrdenDescarga.toString())
//         // formData.append('id', this.seleccionados[l].IdDetalleTarima)
//         formData.append('clave', this.seleccionados[l].ClaveProducto)
//         formData.append('lote', this.seleccionados[l].Lote)
//         formData.append('tipo', 'Factura')
//         // console.log(res);
//         // Buscar ultimo folio Documento
//         let documento = new Documento();
//         documento.IdDocumneto = 0;
//         documento.Folio = this.seleccionados[l].IdOrdenDescarga;
//         documento.IdDetalle = this.seleccionados[l].IdDetalleTarima;
//         documento.Modulo = 'Importacion';
//         documento.Tipo = 'Factura';
//         documento.ClaveProducto = this.seleccionados[l].ClaveProducto;
//         documento.NombreDocumento = event.addedFiles[i].name;
//         documento.Path = 'Documentos/Factura/' + this.seleccionados[l].IdOrdenDescarga.toString() + '/' + this.seleccionados[l].ClaveProducto.toString() + '/' + this.seleccionados[l].Lote.toString() + '/' + event.addedFiles[i].name;
//         documento.Observaciones = this.seleccionados[l].Lote;
//         documento.Vigencia = new Date();
//         // console.log(documento);

//         //verificar que no exista ese documento en la base de datos

//         this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
//           if (resExistente.length > 0) {
//             // console.log('Ya existe este documento');
//             if (ultimoSeleccionado == l && event.addedFiles.length == i) {
//               this.seleccionados = []
//               this.listDataDetalles = new MatTableDataSource(this.seleccionados);
//               this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
//               // this.clearFolio();
//               this.clearTipoDocumento();
//               this.events = [];
//               this.files = [];
//               this.archivos = [];
//               Swal.fire({
//                 title: 'Documentos Guardados',
//                 icon: 'success',
//                 timer: 1000,
//                 showCancelButton: false,
//                 showConfirmButton: false
//               });
//             }
//           } else {
//             // console.log('Agregar Documento');
//             this.documentosService.addDocumento(documento).subscribe(resBaseDatos => {
//               // console.log(resBaseDatos);
//               this.documentosService.saveFileServer(formData, 'guardarDocumentoImportacion').subscribe(res => {
//                 if (ultimoSeleccionado == l && event.addedFiles.length == i) {
//                   this.seleccionados = []
//                   this.listDataDetalles = new MatTableDataSource(this.seleccionados);
//                   this.listDataSeleccionados = new MatTableDataSource(this.seleccionados);
//                   // this.clearFolio();
//                   this.clearTipoDocumento();
//                   this.events = [];
//                   this.files = [];
//                   this.archivos = [];
//                   Swal.fire({
//                     title: 'Documentos Guardados',
//                     icon: 'success',
//                     timer: 1000,
//                     showCancelButton: false,
//                     showConfirmButton: false
//                   });
//                 }

//               });
//             })
//           }
          
//         })
//       }

//     }
//     // this.files.push(...event.addedFiles);
//   }

//   actualizarTipoDocumento(detalle: any){
//     //Actualizar Factura en Orden Temporal
//     console.log(detalle);
//     detalle.QR = this.stringDocumentoSeleccionado;
    
//     this.otService.updateOrdenTemporal(detalle).subscribe(res=>{
//       console.log(res);
//     })
// // // console.log(detalle);
// // if(this.tipoDocumentoSeleccionado == 'USDA'){
// // // console.log('ES USDA');
// // this.documentosService.updateUSDA(this.stringDocumentoSeleccionado,detalle.IdDetalleOrdenDescarga).subscribe(resUsda=>{  
// //   // console.log(resUsda);
// // })
// // this.documentosService.updateUSDADetalle(this.stringDocumentoSeleccionado,detalle.IdDetalleTarima).subscribe(resUsda=>{  
// //   // console.log(resUsda);
// // })
// // }
// // else if(this.tipoDocumentoSeleccionado == 'PEDIMENTO'){
// // // console.log('ES PEDIMENTO');
// // this.documentosService.updatePedimento(this.stringDocumentoSeleccionado,detalle.IdDetalleOrdenDescarga).subscribe(resUsda=>{
// //   // console.log(resUsda);
// // })
// // this.documentosService.updatePedimentoDetalle(this.stringDocumentoSeleccionado,detalle.IdDetalleTarima).subscribe(resUsda=>{
// //   // console.log(resUsda);
// // })
// // }
// // else{
// //   // console.log('ES OTRO');
// // }
//   }
//   //Leer archivo/documento del Servidor
//   leerArchivos(a) {
//     console.log(a);
//     const formData = new FormData();
//     formData.append('clave', a.clave.toString())
//     formData.append('lote', a.lote.toString())
//     formData.append('id', a.id.toString())
//     formData.append('archivo', a.name)
//     formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+a.id.toString()+'/'+a.clave+'/'+a.lote)
//     this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {
//       // console.log(res);
//       const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
//       let fr = new FileReader();

//       fr.readAsDataURL(blob);
//       fr.onload = e => {
//         // console.log(e);
//         // console.log(fr.result);
//         this.fileUrl = fr.result;
//         this.pdfstatus = true;
//         this.documentosService.fileUrl = this.fileUrl;
//         const dialogConfig = new MatDialogConfig();
//         dialogConfig.disableClose = true;
//         dialogConfig.autoFocus = true;
//         dialogConfig.width = "70%";
//         this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
//       }
//     })

//   }

//   obtenerDocumentos(row,folio: number, id: number) {

//     console.log(folio, id);
//     console.log(row,'ROW');

//     const formData = new FormData();
//     formData.append('folio', row.Lote.toString());
//     formData.append('id', id.toString());
//     // formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+folio.toString()+'/'+id.toString());
//     formData.append('direccionDocumento', 'Documentos/Importacion/Factura/'+row.IdOrdenDescarga+'/'+row.ClaveProducto+'/'+row.Lote);
//     this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
//       // console.log(res);
//       this.archivos = [];
//       if (res) {
//         // console.log(res.length)
//         for (let i = 0; i < res.length; i++) {
//           let archivo = <any>{};
//           archivo.name = res[i];
//           archivo.id =  row.IdOrdenDescarga;
//           archivo.clave =  row.ClaveProducto;
//           archivo.lote = row.Lote;
//           this.archivos.push(archivo);
//           const formDataDoc = new FormData();
//           // formDataDoc.append('folio', folio.toString());
//           // formDataDoc.append('id', id.toString());
//           formDataDoc.append('id', row.IdOrdenDescarga.toString());
//           formDataDoc.append('clave', row.ClaveProducto);
//           formDataDoc.append('lote', row.Lote);
//           formDataDoc.append('archivo', res[i])
//           // formDataDoc.append('direccionDocumento', 'Documentos/Importacion/Factura/'+folio.toString()+'/'+id.toString());
//           formDataDoc.append('direccionDocumento', 'Documentos/Importacion/Factura/'+row.IdOrdenDescarga+'/'+row.ClaveProducto+'/'+row.Lote);
//           this.documentosService.readDocumentosServer(formDataDoc, 'ObtenerDocumento').subscribe(resDoc => {
//             //  console.log(resDoc)
//             const blob = new Blob([resDoc as BlobPart], { type: 'application/pdf' });
//             //  console.log(blob)
//             let fr = new FileReader();
//             let name = res[i];
//             fr.readAsDataURL(blob);
//             //  console.log(fr.readAsDataURL(blob));
//             fr.onload = e => {
//               //  console.log(e);
//               //  console.log(fr.result);
//               this.tipo = 'documento'
//               this.dataURItoBlob(fr.result, name);
//             }
//           })
//         }
//       }
//       // console.log(this.archivos)
//     })

//   }

//   //Metodo para convertir imagen base64 a tipo File
//   dataURItoBlob(dataURI: any, fileName: string): File {

//     // console.log(dataURI);
//     // console.log(fileName);

//     // convert base64/URLEncoded data component to a file
//     var byteString;
//     if (dataURI.split(',')[0].indexOf('base64') >= 0)
//       byteString = atob(dataURI.split(',')[1]);
//     else
//       byteString = unescape(dataURI.split(',')[1]);

//     // separate out the mime component
//     var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

//     // write the bytes of the string to a typed array
//     var ia = new Uint8Array(byteString.length);
//     for (var i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }

//     //igualar documento a tipo File 
//     let file = new File([ia], fileName, { type: mimeString });

//     return new File([ia], fileName, { type: mimeString });
//   }

//   //Agregar Documento al arreglo events(este arreglo es el que se usa para guardar Docs en Server y Base de datos) y al arreglo files(dropzone)
//   onSelect(event) {

//     this.events = event
//     this.files.push(...event.addedFiles);

//   }
//   //Eliminar documento de arreglos locales
//   onRemoveDocDropzone(event) {
//     this.files.splice(this.files.indexOf(event), 1);
//     this.events.addedFiles.splice(this.events.addedFiles.indexOf(event), 1);
//   }
//   //Eliminar Documento del Servidor
//   onRemove(event) {
//     console.log(event);
//     Swal.fire({
//       title: '¿Seguro de Borrar Documento?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//     cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Borrar',
//       cancelButtonText: 'Cancelar'
//     }).then((result) => {
//       if (result.value) {
//         const formData = new FormData();
//         formData.append('name', event.name.toString())
//         formData.append('id', event.id.toString())
//         formData.append('clave', event.clave.toString())
//         formData.append('lote', event.lote.toString())
//         formData.append('tipo', 'Factura')
//         console.log(formData);
//         let docu = new Documento();
//         docu.Folio = event.id;
//         docu.Modulo = 'Importacion';
//         docu.Tipo = 'Factura';
//         docu.NombreDocumento = event.name;
//         docu.Observaciones =  event.lote;
//         docu.ClaveProducto = event.clave;
//         this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
//           console.log(resDelete);
//           this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoImportacion').subscribe(res => {
//             console.log(res)
//             // this.files.splice(this.files.indexOf(event),1);
//             this.archivos.splice(this.archivos.indexOf(event), 1);
//             this.pdfstatus = false;
            
//             Swal.fire({
//               title: 'Borrado',
//               icon: 'success',
//               timer: 1000,
//               showCancelButton: false,
//               showConfirmButton: false
//             });
//           })
//         })


//       }
//     })

//   }

//   resettipoDocumentoSeleccionado(){
//     this.tipoDocumentoSeleccionado = '';
//     this.stringDocumentoSeleccionado ="";
//   }

}
