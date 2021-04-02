import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { DocumentosImportacionService } from '../../../services/importacion/documentos-importacion.service';

@Component({
  selector: 'app-documentacion-importacion-visor-documentos',
  templateUrl: './documentacion-importacion-visor-documentos.component.html',
  styleUrls: ['./documentacion-importacion-visor-documentos.component.css']
})
export class DocumentacionImportacionVisorDocumentosComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<DocumentacionImportacionVisorDocumentosComponent>, public documentosService: DocumentosImportacionService) { }

  ngOnInit() {
    this.fileUrl = this.documentosService.fileUrl;
  }

  fileUrl: string;

  onClose() {
    this.dialogbox.close();
  }

}
