import { Component, OnInit, Inject } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'src/app/services/message.service';
import Swal from 'sweetalert2';

export interface parametros {
    foliop: string,
    cliente: string;
    status: boolean;
    tipo: string;
}




@Component({
    selector: 'app-emailgeneral',
    templateUrl: './emailgeneral.component.html',
    styleUrls: ['./emailgeneral.component.css']
})
export class EmailgeneralComponent implements OnInit {
    public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

    constructor(public dialogRef: MatDialogRef<EmailgeneralComponent>, public _MessageService: MessageService, @Inject(MAT_DIALOG_DATA) public data: parametros) { }
    pdfstatus = false;
    fileUrl;
    //   files: File[] = [];
    files: any[] = [];
    archivos: any[];
    loading2 = false;
    Intevalo;

    //^ HTML que se muestra al momento de enviar el Correo electronico.

    html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

  <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
  
  <head>
      <script src="https://kit.fontawesome.com/c30d3b68be.js" crossorigin="anonymous"></script>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
      <title>Pro LactoIngredientes</title>
  
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  </head>
  
  </html>
  
  <body style="margin: 0; padding: 0;">
  
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
          <tr>
  
              <td>
  
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
  
                      <tr>
  
  
                          <td align="center" bgcolor="#000000" style="padding: 20px 0 30px 0;">
                              <img src='data:image/png;base64,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'
                                style="height: 150px; width: 150px;">
                              <h1 style="color: #ffffff">Pro LactoIngredientes - `+ this.data.tipo + `</h1>
  
                          </td>
  
                      </tr>
  
                      <tr>
  
                          <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
  
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                  <tr>
  
                                      <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
  
                                          Cliente: `+ this.data.cliente + `
  
                                      </td>
  
                                  </tr>
  
                                  <tr>
  
                                      <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
  
                                          Agradecemos de antemano la oportunidad de brindar esta `+ this.data.tipo + `, y aprovechamos la misma, para que conozca mas nuestra organizacion.
  
                                      </td>
  
                                  </tr>
  
                                  <tr>
  
                                      <td>
  
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                              <tr>
  
                                                  <td width="260" valign="top">
  
                                                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                                          <tr>
  
                                                              <td>
  
                                                                  <h1>Principios</h1>
  
                                                              </td>
  
                                                          </tr>
  
                                                          <tr>
  
                                                              <td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
  
                                                                  Los principios fundamentales de Pro Lactoingredientes son: calidad ante todo y satisfacción total del cliente. Estamos convencidos que para que esto sea posible debemos aplicar una gestión basada en la excelencia, innovación, honestidad, mejora continua,
                                                                  y compromiso como valores corporativos de referencia.
  
  
  
                                                                  <br>1.- Asegurar que los productos y servicios cumplen con la satisfacción exigida por nuestros clientes.
  
                                                                  <br>2.- Conocer las necesidades y expectativas de los clientes para ofrecer un servicio personalizado.
  
                                                                  <br>3.- Asegurar el cumplimiento de los compromisos legales y normativas para garantizar la calidad de los productos que comercializamos.
  
                                                                  <br>4.- Optimizar el funcionamiento de los procesos a través de la calidad y la eficiencia.
  
                                                                  <br>5.- Promover un entorno positivo de desarrollo, participación y de formación con los empleados.
  
                                                                  <br>6.- Asegurar que esta política es difundida, entendida y aceptada por la Organización, con el fin de que contribuya al logro de los compromisos establecidos.
  
                                                              </td>
  
                                                          </tr>
  
                                                      </table>
  
                                                  </td>
  
                                                  <td style="font-size: 0; line-height: 0;" width="20">
  
                                                      &nbsp;
  
                                                  </td>
  
                                                  <td width="260" valign="top">
  
                                                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                                          <tr>
  
                                                              <td>
  
                                                                  <h1>Politica de Calidad</h1>
  
                                                              </td>
  
                                                          </tr>
  
                                                          <tr>
  
                                                              <td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
  
                                                                  Comercializar únicamente productos que reúnan los requerimientos de calidad establecidos en las normas sanitarias de instituciones nacionales e internacionales. Recibir y enviar todos los productos que se comercializan debidamente respaldados con los
                                                                  documentos que permitan garantizar a nuestros clientes el origen y la calidad de los mismos. Basar nuestros servicios en un sustento de seriedad y responsabilidad por parte de directivos
                                                                  y colaboradores.
  
                                                              </td>
  
                                                          </tr>
  
                                                      </table>
  
                                                  </td>
  
                                              </tr>
  
                                          </table>
  
                                      </td>
  
                                  </tr>
  
                              </table>
  
                          </td>
  
                      </tr>
  
                      <tr>
  
                          <td bgcolor="#000000" style="padding: 30px 30px 30px 30px;">
  
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
                                  <tr>
  
                                      <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
  
                                          &reg; Pro LactoIngredientes<br/>
  
  
  
                                      </td>
  
                                      <td align="right" style="color: #ffffff">
  
                                          <table border="0" cellpadding="0" cellspacing="0">
  
                                              <tr>
  
                                                  <td>
  
                                                      <a href="http://www.twitter.com/">
  
                                                          <i class="fa fa-twitter-square" style="color: #ffffff"></i>
  
                                                      </a>
  
                                                  </td>
  
                                                  <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
  
                                                  <td>
  
                                                      <a href="http://www.facebook.com/">
  
                                                          <i class="fa fa-facebook-square" style="color: #ffffff"></i>
  
                                                      </a>
  
                                                  </td>
  
                                              </tr>
  
                                          </table>
  
                                      </td>
  
                                  </tr>
  
                              </table>
  
                          </td>
  
                      </tr>
  
                  </table>
  
      </table>
  
      </td>
  
      </tr>
  
      </table>
  
  </body>`
    // cuerpo;


    ngOnInit() {
        //! Modificar en la forma en la que trabaja el pedido
        if (this.data.tipo == 'Pedido') {
            this.Intevalo = setInterval(() => {
                this.urlPDF();
            }, 1000)
        } else if (this.data.tipo == 'Traspaso') {
            // console.log('Es un traspaso');
            this.files = this._MessageService.documentosURL;
        }
    }

    onClose() {
        this.dialogRef.close();
        // this.service.filter('Register click');
    }
    //! Modificar en la forma en la que trabaja el pedido
    urlPDF() {

        // const blob = new Blob([localStorage.getItem('pdf'+this.foliop) as BlobPart], { type: 'application/pdf' });
        // let file = new File(blob,'pdf.pdf')
        // console.log(this.data.foliop);
        this.fileUrl = localStorage.getItem('pdfcorreo' + this.data.foliop);
        // this.fileUrl = localStorage.getItem('pdfnuevo2');
        // this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(localStorage.getItem('pdf'+this.foliop)))
        // this.fileUrl = localStorage.getItem('pdf'+this.foliop); 
        // this.pdfstatus = true;  

        if (this.fileUrl) {
            // console.log(this.fileUrl);
            this.pdfstatus = true;
            clearInterval(this.Intevalo);
            this.leerDir();
        }
        // console.log(this.fileUrl);

    }
    //! Modificar en la forma en la que trabaja el pedido
    leerDir() {

        const formData = new FormData();
        formData.append('folio', this.data.foliop)
        // console.log(this.data.foliop);
        this._MessageService.readDir(formData).subscribe(res => {
            // console.log(res);
            this.archivos = [];
            if (res) {
                for (let i = 0; i < res.length; i++) {
                    this.archivos.push(res[i]);
                }
            }
        })

    }

    //^ Metodo para guardar el Documento del Dropzone en el servidor (TODOS SE ESTAN GUARDANDO EN FACTURAFILES).
    onSelect(event) {
        // console.log(event);
        const formData = new FormData();
        formData.append('0', event.addedFiles[0])
        formData.append('folio', this.data.foliop)
        this._MessageService.saveFile(formData).subscribe(res => {
            // console.log(res);
            //   this.leerDir();
        })
        let archivo = {
            name: event.addedFiles[0].name,
            path: 'facturaFiles/' + this.data.foliop + '/' + event.addedFiles[0].name,
        }
        //^ se hace push al arreglo donde estan todos los documentos del correo.
        this.files.push(archivo)
        // this.files.push(...event.addedFiles);
    }

    //^ Eliminar Documento del Arreglo
    onRemove(event) {
        // console.log(event);
        this.files.splice(this.files.indexOf(event), 1);

    }

    //^ Metodo para Enviar el Correo.
    onEnviar() {
        this.loading2 = true;
        const formData = new FormData();
        setTimeout(() => {
            //^ STRING donde se guardaran los objetos de los archivos
            formData.append('archivos', JSON.stringify(this.files));
            //^ Informacion adicional al Correo.
            formData.append('nombre', this._MessageService.nombre)
            formData.append('email', this._MessageService.correo + ',' + this._MessageService.cco)
            formData.append('mensaje', this.data.cliente)
            formData.append('folio', this.data.foliop)
            formData.append('asunto', this._MessageService.asunto)
            formData.append('html', this.html)
            //^ Especificamos si va un archivo en base64 (cuando no esta guardado este  archivo en el servidor)
            if (localStorage.getItem('pdfcorreo' + this.data.foliop)) {
                //^ Este archivo se manda en base64 listo para ser enviado.
                formData.append('pdf', localStorage.getItem('pdfcorreo' + this.data.foliop))
            }
            //^ Aqui se guarda la cantidad de archivos que se estan subiendo en el dropzone (despues son obtenidos en el sever y adjuntados)
            formData.append('adjuntos', this.files.length.toString())
            this._MessageService.enviarCorreo(formData).subscribe(() => {
                this.loading2 = false;
                this.files = []
                Swal.fire("Correo Enviado", "Mensaje enviado correctamente", "success");
            });
        }, 5000);
    }





}
