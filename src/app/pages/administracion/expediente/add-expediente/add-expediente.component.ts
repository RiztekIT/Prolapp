import { Component, OnInit } from '@angular/core';  
import { ClientesService } from '../../../../services/catalogos/clientes.service';
import { DocumentosImportacionService } from '../../../../services/importacion/documentos-importacion.service';
import { ImgInfo } from 'src/app/Models/Imagenes/imgInfo-model';
import { Documento } from '../../../../Models/documentos/documento-model';
import Swal from 'sweetalert2';
import { MatDialogRef, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DocumentacionImportacionVisorDocumentosComponent } from '../../../importacion/documentacion-importacion-visor-documentos/documentacion-importacion-visor-documentos.component';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-add-expediente',
  templateUrl: './add-expediente.component.html',
  styleUrls: ['./add-expediente.component.css']
})
export class AddExpedienteComponent implements OnInit {

  constructor(public clienteService: ClientesService, private dialog: MatDialog, public documentosService: DocumentosImportacionService, public dialogbox: MatDialogRef<AddExpedienteComponent>,) { }

  ngOnInit() {
    this.IdCliente = this.clienteService.objetoCliente.IdClientes;
    console.log(this.IdCliente);
    //Si el IdCliente es valido, se procede a traer los documentos del Servidor
    if(this.IdCliente){
      this.obtenerDocumentos(this.IdCliente);
    }
    this.dropdownRefresh();
  }


  IdCliente: number
    //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

  //guardar arreglo de documentos del dropzone
  events: any;

  //Arreglo donde se guardan los nombres de los Documentos
  archivos: any[];

  //Variable de onjetos donde se guardaran los Documentos/Imagenes TIPO FILE ( estos son los que son enviados al server como parametro, para ser adjuntasos en el email)
  files: File[] = [];

  //Estatus
  pdfstatus = false;

  //File URL del pdf, para ser mostrado en el visor de decumentos
  fileUrl;

  //Variable para identificar si el archivo es un documento o una imagen
  tipo: string;

  //******************** VARIABLES DOCUMENTOS (API, DROPZONE) ********************//

  
  myControl = new FormControl();
  options: Cliente[] = [];
  filteredOptions: Observable<any[]>;
  listClientes: Cliente[] = [];

  dropdownRefresh() {
    this.clienteService.getClientesList().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.listClientes.push(client);
        this.options.push(client)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });

  }
  onSelectionChange(options: Cliente, event: any) {
    if (event.isUserInput) {
      this.clienteService.objetoCliente = options;
    }
  }


  private _filter(value: any): any[] {
    // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdClientes.toString().includes(filterValue));
  }



  
    obtenerDocumentos(id: number) {
  
      console.log(id);
  
      const formData = new FormData();
      formData.append('direccionDocumento', './Documentos/expedientes/'+id);
      this.documentosService.readDirDocuemntosServer(formData, 'cargarNombreDocumentos').subscribe(res => {
        // console.log(res);
        this.archivos = [];
        if (res) {
          // console.log(res.length)
          for (let i = 0; i < res.length; i++) {
            let archivo = <any>{};
            archivo.name = res[i];
            archivo.id = id;
            this.archivos.push(archivo);
            const formDataDoc = new FormData();
            formDataDoc.append('direccionDocumento', './Documentos/expedientes/'+id)
            formDataDoc.append('archivo', res[i])
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


//Agregar documentos a la base de datos y Servidor
onAddDocumentos() {

  let event = this.files;
  console.log(event)
    for (var i = 0; i < event.length; i++) {
      console.log(i);
      console.log(event[i]);
      
      const formData = new FormData();
      formData.append('0', event[i])
      formData.append('direccionDocumento', './Documentos/expedientes/'+this.IdCliente)
      formData.append('id', this.IdCliente.toString())
      // console.log(res);
      // Buscar ultimo folio Documento
      let documento = new Documento();
      documento.IdDocumneto = 0;
      documento.Folio = this.IdCliente;
      documento.IdDetalle = this.IdCliente;
      documento.Modulo = 'Administracion';
      documento.Tipo = 'Expediente';
      documento.ClaveProducto = this.clienteService.objetoCliente.RFC;
      documento.NombreDocumento = event[i].name;
      documento.Path =  'Documentos/expedientes/'+this.IdCliente+'/'+ event[i].name;
      documento.Observaciones = "";
      documento.Vigencia = new Date();
      // console.log(documento);

      //verificar que no exista ese documento en la base de datos
      this.documentosService.getDocumentoFMTDID(documento).subscribe(resExistente => {
        if (resExistente.length > 0) {
          console.log('Ya existe este documento');
          if (event.length == i) {
            this.events = [];
            this.files = [];
            this.archivos = [];
            this.obtenerDocumentos(this.IdCliente);
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
            console.log(formData);
            this.documentosService.saveFileServer(formData, 'guardarDocumentoExpedientes').subscribe(res => {
              console.log(res);
              if (event.length == i) {
                this.events = [];
                this.files = [];
                this.archivos = [];
                this.obtenerDocumentos(this.IdCliente);
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
        // 
      })
    }

  
  // this.files.push(...event.addedFiles);
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
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          const formData = new FormData();
          formData.append('name', event.name.toString())
          formData.append('direccionDocumento', './Documentos/expedientes/'+this.IdCliente)
          formData.append('id', event.id.toString())
          console.log(formData);
          let docu = new Documento();
          docu.Folio = event.id;
          docu.Modulo = 'Administracion';
          docu.Tipo = 'Expediente';
          docu.NombreDocumento = event.name;
          docu.IdDetalle = event.id
          this.documentosService.borrarDocumentoFMTDID(docu).subscribe(resDelete=>{
            console.log(resDelete);
            this.documentosService.deleteDocumentoServer(formData, 'borrarDocumentoExpedientes').subscribe(res => {
              console.log(res)
              this.files.splice(this.files.indexOf(event),1);
              this.archivos.splice(this.archivos.indexOf(event), 1);
              this.pdfstatus = false;
              
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

    // descargar(documento: any) {
    //   const content: Element = document.getElementById('element-to-PDF');
    //   const option = {    
    //     margin: [.5,0,0,0],
    //     filename: documento.name,
    //     image: {type: 'jpeg', quality: 1},
    //     html2canvas: {scale: 2, logging: true},
    //     jsPDF: {unit: 'cm', format: 'letter', orientation: 'portrait'}, 
    //     pagebreak:{ avoid: '.pgbreak'}
    //   };
    
    //   html2pdf()
    //  .from(content)
    //  .set(option)
    //  .save();
    // }

        //Leer archivo/documento del Servidor
        leerArchivos(a) {
          // console.log(a);
          const formData = new FormData();
          formData.append('direccionDocumento', './Documentos/expedientes/'+this.IdCliente)
        
          formData.append('archivo', a.name)
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
        dialogConfig.width="70%";
        this.dialog.open(DocumentacionImportacionVisorDocumentosComponent, dialogConfig);
            }
          })
      
        }

    descargar(documento){
      // console.log(documento);
      const formData = new FormData();
      formData.append('direccionDocumento', './Documentos/expedientes/'+this.IdCliente)
    
      formData.append('archivo', documento.name)
      this.documentosService.readDocumentosServer(formData, 'ObtenerDocumento').subscribe(res => {

        const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        // 
        const link = document.createElement('a');
        link.href = url;
        link.download = documento.name;
        link.click();
      })
   
  
    }

  


  onClose(){
    this.dialogbox.close();
  }
}
