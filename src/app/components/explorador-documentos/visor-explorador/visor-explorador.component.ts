import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileElement } from 'src/app/Models/explorardor-archivos/FileElement';
import { FileService } from 'src/app/services/explorador-archivos/explorador.service';
import { TraspasoMercanciaService } from 'src/app/services/importacion/traspaso-mercancia.service';
import { element } from 'protractor';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-visor-explorador',
  templateUrl: './visor-explorador.component.html',
  styleUrls: ['./visor-explorador.component.css']
})
export class VisorExploradorComponent implements OnInit {

  public fileElements: Observable<FileElement[]>;

  constructor(public fileService: FileService, public traspasoSVC: TraspasoMercanciaService, public dialogbox: MatDialogRef<VisorExploradorComponent>) {
    this.fileService.listen().subscribe((m:any)=>{
      console.log(m);
      this.cerrarModal();
      });
    this.fileService.listenUpdate().subscribe((m:any)=>{
      console.log(m);
      this.obtenerFolders(m);
      });
   }

  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  ngOnInit() {
    this.obtenerFolders();
  }

  obtenerFolders(actualizacion?){
    console.log(actualizacion);
//^ Limpiar los archivos guardados anteriormente.
this.fileService.map.clear();
//^ Obtendremos los Folder de los Diferentes Documentos guardados en la Base de Datos.
this.generarFolderUSDA();
this.generarFolderFacturas();
this.generarFolderCLV();
this.generarFolderCO();
this.generarFolderPESPI();
this.generarFolderCA();
this.generarFolderGeneral(actualizacion);
this.updateFileElementQuery();
  }


  cerrarModal(){
    this.dialogbox.close();    
  }

  generarFolderUSDA() {
    const folderUSDA = this.fileService.add({ name: 'USDA', isFolder: true, parent: 'root', path: 'Documentos/Importacion/USDA' });
    let consulta = {
      'consulta': "select Folio from Documentos where Tipo ='USDA' group by Folio"
    };
    this.traspasoSVC.getQuery(consulta).subscribe((dataFolios: any) => {

      if (dataFolios.length > 0) {
        dataFolios.forEach(element => {
          const folderFolios = this.fileService.add({ name: element.Folio, isFolder: true, parent: folderUSDA.id, path: 'Documentos/Importacion/USDA/' + element.Folio });
          let consultaDocumentos = {
            'consulta': "select * from Documentos where Tipo ='USDA' and Folio =" + element.Folio
          };
    
          this.traspasoSVC.getQuery(consultaDocumentos).subscribe((dataDocumentos: any) => {
            dataDocumentos.forEach(elementDocumentos => {
              this.fileService.add({ name: elementDocumentos.NombreDocumento, isFolder: false, parent: folderFolios.id, path: 'Documentos/Importacion/USDA/' + element.Folio + '/' + elementDocumentos.NombreDocumento });
            });
          })
        });
      }
    })
  }

  generarFolderFacturas(){
    const folderFactura = this.fileService.add({ name: 'Facturas', isFolder: true, parent: 'root', path: 'Documentos/Importacion/Factura' });
    let consulta = {
      'consulta': "select ClaveProducto from Documentos where Tipo = 'Factura' group by ClaveProducto"
    };
    this.traspasoSVC.getQuery(consulta).subscribe((dataClave: any) => {

      if (dataClave.length > 0) {
        dataClave.forEach(element => {
          const folderClave = this.fileService.add({ name: element.ClaveProducto, isFolder: true, parent: folderFactura.id, path: 'Documentos/Importacion/Factura/' + element.ClaveProducto });
          let consultaClave = {
            'consulta': "select Observaciones from Documentos where Tipo = 'Factura' and ClaveProducto = '"+element.ClaveProducto+"' group by Observaciones"
          };
    
          this.traspasoSVC.getQuery(consultaClave).subscribe((dataLotes: any) => {
      
            dataLotes.forEach(elementLote => {
              const folderLote = this.fileService.add({ name: elementLote.Observaciones, isFolder: true, parent: folderClave.id, path: 'Documentos/Importacion/Factura/' + element.ClaveProducto + '/' + elementLote.Observaciones });
              let consultaLote = {
                'consulta': "select * from Documentos where Tipo = 'Factura' and ClaveProducto = '"+element.ClaveProducto+"' and Observaciones = '"+elementLote.Observaciones+"' "
              };
        
              this.traspasoSVC.getQuery(consultaLote).subscribe((dataLotes: any) => {
                dataLotes.forEach(elementDocumento => {                
                  this.fileService.add({ name: elementDocumento.NombreDocumento, isFolder: false, parent: folderLote.id, path: 'Documentos/Importacion/Factura/' + element.ClaveProducto + '/' + elementLote.Observaciones + '/' + elementDocumento.NombreDocumento });
                });
              });
            });
          })
        });
      }
    })
  }
  generarFolderCLV(){
    const folderCLV = this.fileService.add({ name: 'C. Libre Venta', isFolder: true, parent: 'root', path: 'Documentos/Importacion/CLV' });
    let consulta = {
      'consulta': "select ClaveProducto from Documentos where Tipo = 'CLV' group by ClaveProducto"
    };
    this.traspasoSVC.getQuery(consulta).subscribe((dataClave: any) => {

      if (dataClave.length > 0) {
        dataClave.forEach(element => {
          const folderClave = this.fileService.add({ name: element.ClaveProducto, isFolder: true, parent: folderCLV.id, path: 'Documentos/Importacion/CLV/' + element.ClaveProducto });
          let consultaClave = {
            'consulta': "select * from Documentos where Tipo = 'CLV' and ClaveProducto = '"+element.ClaveProducto+"'"
          };
    
          this.traspasoSVC.getQuery(consultaClave).subscribe((dataDocumentos: any) => {
                                         
            dataDocumentos.forEach(elementDocumento => {                
                  this.fileService.add({ name: elementDocumento.NombreDocumento, isFolder: false, parent: folderClave.id, path: 'Documentos/Importacion/CLV/0/0/' + element.ClaveProducto  + '/' + elementDocumento.NombreDocumento });
                });                       
          })
        });
      }
    })
  }
  generarFolderCO(){
    const folderCO = this.fileService.add({ name: 'C. Origen', isFolder: true, parent: 'root', path: 'Documentos/Importacion/CO' });
    let consulta = {
      'consulta': "select ClaveProducto from Documentos where Tipo = 'CO' group by ClaveProducto"
    };
    this.traspasoSVC.getQuery(consulta).subscribe((dataClave: any) => {

      if (dataClave.length > 0) {
        dataClave.forEach(element => {
          const folderClave = this.fileService.add({ name: element.ClaveProducto, isFolder: true, parent: folderCO.id, path: 'Documentos/Importacion/CO/' + element.ClaveProducto });
          let consultaClave = {
            'consulta': "select * from Documentos where Tipo = 'CO' and ClaveProducto = '"+element.ClaveProducto+"'"
          };
    
          this.traspasoSVC.getQuery(consultaClave).subscribe((dataDocumentos: any) => {
                                         
            dataDocumentos.forEach(elementDocumento => {                
                  this.fileService.add({ name: elementDocumento.NombreDocumento, isFolder: false, parent: folderClave.id, path: 'Documentos/Importacion/CO/0/0/' + element.ClaveProducto  + '/' + elementDocumento.NombreDocumento });
                });                       
          })
        });
      }
    })
  }
  generarFolderPESPI(){
    const folderPESPI = this.fileService.add({ name: 'PESPI', isFolder: true, parent: 'root', path: 'Documentos/Importacion/PESPI' });
    let consulta = {
      'consulta': "select ClaveProducto from Documentos where Tipo = 'PESPI' group by ClaveProducto"
    };
    this.traspasoSVC.getQuery(consulta).subscribe((dataClave: any) => {

      if (dataClave.length > 0) {
        dataClave.forEach(element => {
          const folderClave = this.fileService.add({ name: element.ClaveProducto, isFolder: true, parent: folderPESPI.id, path: 'Documentos/Importacion/PESPI/' + element.ClaveProducto });
          let consultaClave = {
            'consulta': "select Observaciones from Documentos where Tipo = 'PESPI' and ClaveProducto = '"+element.ClaveProducto+"' group by Observaciones"
          };
    
          this.traspasoSVC.getQuery(consultaClave).subscribe((dataLotes: any) => {
      
            dataLotes.forEach(elementLote => {
              const folderLote = this.fileService.add({ name: elementLote.Observaciones, isFolder: true, parent: folderClave.id, path: 'Documentos/Importacion/PESPI/' + element.ClaveProducto + '/' + elementLote.Observaciones });
              let consultaLote = {
                'consulta': "select * from Documentos where Tipo = 'PESPI' and ClaveProducto = '"+element.ClaveProducto+"' and Observaciones = '"+elementLote.Observaciones+"' "
              };
        
              this.traspasoSVC.getQuery(consultaLote).subscribe((dataLotes: any) => {
                dataLotes.forEach(elementDocumento => {                
                  this.fileService.add({ name: elementDocumento.NombreDocumento, isFolder: false, parent: folderLote.id, path: 'Documentos/Importacion/PESPI/' + element.ClaveProducto + '/' + elementLote.Observaciones + '/' + elementDocumento.NombreDocumento });
                });
              });
            });
          })
        });
      }
    })
  }
  generarFolderCA(){
    const folderCA = this.fileService.add({ name: 'C. Analisis', isFolder: true, parent: 'root', path: 'Documentos/Importacion/CA' });
    let consulta = {
      'consulta': "select ClaveProducto from Documentos where Tipo = 'CA' group by ClaveProducto"
    };
    this.traspasoSVC.getQuery(consulta).subscribe((dataClave: any) => {

      if (dataClave.length > 0) {
        dataClave.forEach(element => {
          const folderClave = this.fileService.add({ name: element.ClaveProducto, isFolder: true, parent: folderCA.id, path: 'Documentos/Importacion/CA/' + element.ClaveProducto });
          let consultaClave = {
            'consulta': "select Observaciones from Documentos where Tipo = 'CA' and ClaveProducto = '"+element.ClaveProducto+"' group by Observaciones"
          };
    
          this.traspasoSVC.getQuery(consultaClave).subscribe((dataLotes: any) => {
      
            dataLotes.forEach(elementLote => {
              const folderLote = this.fileService.add({ name: elementLote.Observaciones, isFolder: true, parent: folderClave.id, path: 'Documentos/Importacion/CA/' + element.ClaveProducto + '/' + elementLote.Observaciones });
              let consultaLote = {
                'consulta': "select * from Documentos where Tipo = 'CA' and ClaveProducto = '"+element.ClaveProducto+"' and Observaciones = '"+elementLote.Observaciones+"' "
              };
        
              this.traspasoSVC.getQuery(consultaLote).subscribe((dataLotes: any) => {
                dataLotes.forEach(elementDocumento => {                
                  this.fileService.add({ name: elementDocumento.NombreDocumento, isFolder: false, parent: folderLote.id, path: 'Documentos/Importacion/CA/' + element.ClaveProducto + '/' + elementLote.Observaciones + '/' + elementDocumento.NombreDocumento });
                });
              });
            });
          })
        });
      }
    })
  }
  generarFolderGeneral(actualizacion?){
    console.log(actualizacion);
    const folderGeneral = this.fileService.add({ name: 'General', isFolder: true, parent: 'root', path: 'Documentos/Importacion/General' });
    let consulta = {
      'consulta': "select * from Documentos where Tipo = 'General'"
    };
    this.traspasoSVC.getQuery(consulta).subscribe((dataDocs: any) => {
      if (dataDocs.length > 0) {    
        console.log(dataDocs.length);                        
        dataDocs.forEach((elementDocumento, i) => {                
                  this.fileService.add({ name: elementDocumento.NombreDocumento, isFolder: false, parent: folderGeneral.id, path: 'Documentos/Importacion/General/'+ elementDocumento.NombreDocumento });
                  // //^ Si actualizacion, moveremos al usuario a la carpeta General
                  console.log(i);
                  if(actualizacion && dataDocs.length == i+1){                  
                    console.log('Ultimo Folder');
                    this.actualizarFolders();
                    // this.updateFileElementQuery();
                  }                      
                });  
      }
    })
  }

  actualizarFolders(){
    console.log('Actualizando Folder');
    this.navigateUp();
    console.log('Actualizacion true');
    let element : FileElement ={
      isFolder: true,
      name: 'General',
      parent: 'root',
      path: 'Documentos/Importacion/General'
    }
      this.navigateToFolder(element);
      // this.updateFileElementQuery();
  }

  addFolder(folder: { name: string }) {
    this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root', path: '' });
    this.updateFileElementQuery();
  }

  removeElement(element: FileElement) {
    this.fileService.delete(element.id);
    this.updateFileElementQuery();
  }

  navigateToFolder(element: FileElement) {
    console.log(element);
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  navigateUp() {
    console.log('Regresamos a main');
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.fileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

}
