import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators';
import { Cliente } from 'src/app/Models/catalogos/clientes-model';
import { VentasCotizacionService } from 'src/app/services/ventas/ventas-cotizacion.service';

import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../../../Models/catalogos/productos-model';

import { MatTableDataSource, MatSort } from '@angular/material';
import Swal from 'sweetalert2';
import { TipoCambioService } from '../../../../services/tipo-cambio.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { Vendedor } from 'src/app/Models/catalogos/vendedores.model';
import { ClienteDireccion } from 'src/app/Models/cliente-direccion/clienteDireccion-model';

const httpOptions = {
  headers: new HttpHeaders({
    'Bmx-Token': 'd83c7088f2823be9f29cc124cf95dc37056de37c340da5477a09ca1ee91a80a6',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Headers': 'Bmx-Token, Accept, Accept-Encoding, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'

  })
}

@Component({
  selector: 'app-add-cotizacion',
  templateUrl: './add-cotizacion.component.html',
  styleUrls: ['./add-cotizacion.component.css']
})
export class AddCotizacionComponent implements OnInit {

  dialogbox: any;

  constructor(public router: Router, private currencyPipe: CurrencyPipe, public service: VentasCotizacionService,private _formBuilder: FormBuilder,
    private serviceTipoCambio: TipoCambioService, private http: HttpClient, public ServiceUnidad: UnidadMedidaService, private dialog: MatDialog) { }

    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

  ngOnInit() {  

  
  }

  

}
