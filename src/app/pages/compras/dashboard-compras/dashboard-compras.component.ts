import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';

import {MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import Swal from 'sweetalert2';
import { Observable, Subscriber } from 'rxjs';
import { DetalleCompra } from '../../../Models/Compras/detalleCompra-model';
import { CompraService } from '../../../services/compras/compra.service';
import { Compras } from 'src/app/Models/Compras/compra-model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CalendarioService } from 'src/app/services/calendario/calendario.service';

@Component({
  selector: 'app-dashboard-compras',
  templateUrl: './dashboard-compras.component.html',
  styleUrls: ['./dashboard-compras.component.css']
})
export class DashboardComprasComponent implements OnInit,  AfterViewChecked {
  altura;


constructor(public router: Router,private service:CompraService, private dialog: MatDialog, private http: HttpClient,public calendarioService:CalendarioService) {

   }

  ngOnInit() {
    this.altura = 10;
    this.calendarioService.filter('Compras');
    

  }

 

  ngAfterViewInit(){
    console.log(document.getElementById("compras").offsetHeight);
    
}



ngAfterViewChecked(): void {
  //Called after every check of the component's view. Applies to components only.
  //Add 'implements AfterViewChecked' to the class.
  this.altura = document.getElementById("compras").offsetHeight
}




  

}
