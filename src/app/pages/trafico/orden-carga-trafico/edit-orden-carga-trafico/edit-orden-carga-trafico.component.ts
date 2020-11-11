import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatTable, MatDialog, MatSnackBar, MatDialogConfig, MatDialogRef } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { OrdenCargaService } from 'src/app/services/almacen/orden-carga/orden-carga.service';
import Swal from 'sweetalert2';
import { EmailComponent } from 'src/app/components/email/email/email.component';
import { MessageService } from 'src/app/services/message.service';
// import { EnviarOrdenCargaComponent } from './enviar-orden-carga/enviar-orden-carga.component';
import { AlmacenEmailService } from 'src/app/services/almacen/almacen-email.service';
import { Fleteras } from 'src/app/Models/trafico/fleteras-model';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { startWith, map } from 'rxjs/operators';
import { OrdenCargaTraficoService } from '../../../../services/trafico/orden-carga-trafico.service';
// import { Facturaflete } from 'src/app/Models/trafico/facturaflete-model';
import { FacturaFlete } from '../../../../Models/trafico/facturaflete-model';
import { facturafletedata } from '../../../../Models/trafico/facturafletedata-model';
import { TarimaService } from 'src/app/services/almacen/tarima/tarima.service';

@Component({
  selector: 'app-edit-orden-carga-trafico',
  templateUrl: './edit-orden-carga-trafico.component.html',
  styleUrls: ['./edit-orden-carga-trafico.component.css']
})
export class EditOrdenCargaTraficoComponent implements OnInit {

  IdOrdenCarga: number;
  IDFactFletera: number;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['IdTarima', 'QR', 'ClaveProducto', 'Producto', 'Sacos', 'Lote', 'Proveedor', 'PO', 'FechaMFG', 'FechaCaducidad', 'Shipper', 'USDA', 'Pedimento'];
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  DataOrdenCarga: any;
  Folio: number;

  // dropdown select
  myControl = new FormControl();

  options: Fleteras[] = [];

  filteredOptions: Observable<any[]>;
  listFleteras: Fleteras[] = [];

  estatusSelect;

  public listEstatus: Array<Object> = [
    { Estatus: 'Transito' },
    { Estatus: 'Terminada' }    
  ];

  UbicacionEstatus;
  Tarima;
  




  constructor(public router: Router, private datePipe: DatePipe,  public dialogRef: MatDialogRef<EditOrdenCargaTraficoComponent>, private dialog: MatDialog, public traficoService: OrdenCargaTraficoService, public ordencargaservice: OrdenCargaService, public tarimaService: TarimaService) {

    this.ordencargaservice.listen().subscribe((m: any) => {
      console.log(m);
      this.getOrdenCarga();
      // this.refreshDetalleOrdenCargaList();
    });

  }

  ngOnInit() {
    this.IdOrdenCarga = +(localStorage.getItem('IdOrdenCarga'));
    this.traficoService.formDatafactura= new FacturaFlete();
    this.getOrdenCarga();
    this.getFacturaFleteValues();
    this.getTarimaId();
    // this.dropdownRefresh();
  }

  private _filter(value: any): any[] {
    
    console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.Nombre.toLowerCase().includes(filterValue) ||
      option.IdFletera.toString().includes(filterValue));
  }
  
  dropdownRefresh() {
    
    this.traficoService.getDepDropDownValues().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let Nombre = data[i];
        this.listFleteras.push(Nombre);
        this.options.push(Nombre)
        console.log('options: ', this.options);
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
      this.listFleteras = [];
      this.options = [];
      this.dropdownRefresh();
    }





  onSelectionChange(options: Fleteras, event: any) {
    if (event.isUserInput) {
      this.traficoService.formrow = options;
    }
  }




  //variable para guardar el estatus de la Orden Carga
  estatusOC: string;

  //Obtener informacion Orden Carga
  getOrdenCarga() {
    this.ordencargaservice.getOCID(this.IdOrdenCarga).subscribe(data => {
      console.log('Orden',data);
      this.traficoService.formData = data[0];
      this.traficoService.formrow.Nombre = this.traficoService.formData.Fletera;
      this.estatusOC = data[0].Estatus;
    }); 
  }

  getTarimaId(){

    this.tarimaService.GetTarimaOC(this.IdOrdenCarga).subscribe(tar=>{
      console.log('tarima',tar);
      this.tarimaService.tarimaTrafico = tar[0];
    })

  }

  onClose() {
    localStorage.removeItem('FormDataOrdenCarga');
    this.dialogRef.close();
  }

  UpdateOrdenCargaTrafico() {
    this.traficoService.formData.Fletera = this.traficoService.formrow.Nombre;
    
    console.log(this.traficoService.formData);
    this.ordencargaservice.updateOrdenCarga(this.traficoService.formData).subscribe(res => {
      console.log(res);
    })

  }

  // get para desplegar la informacion del form de abajo
  // agregar que sea por ID
  getFacturaFleteValues(){
    this.traficoService.getFacturaFleteID(this.IdOrdenCarga).subscribe(ress =>{
      console.log('FACTU',ress);
      if (ress.length != 0) {
        this.traficoService.formDatafactura = ress[0];
        this.traficoService.formDatafactura.Estatus = ress[0].Estatus
        this.IDFactFletera = ress[0].IDFacturaFlete;
      }else{
        this.traficoService.formDatafactura.Estatus = "Pendiente"
      }
    })
  }

  updateFacturaFlete(){
    this.UpdateOrdenCargaTrafico();

    let ff = new facturafletedata();

    ff.Factura = this.traficoService.formDatafactura.Factura;
    ff.Fletera = this.traficoService.formrow.Nombre;
    ff.IVA = this.traficoService.formDatafactura.IVA;
    ff.Subtotal = this.traficoService.formDatafactura.Subtotal;
    ff.Total = this.traficoService.formDatafactura.Total;
    ff.IDOrdenCarga = this.traficoService.formData.IdOrdenCarga;
    ff.IDPedido = this.traficoService.formData.IdPedido;
    ff.Estatus = "Capturada"

    console.log(ff);


    // console.log(this.traficoService.formDatafactura);


    this.traficoService.updateFacturaFlete(ff).subscribe(resx => {
      console.log(resx);

      localStorage.removeItem('FormDataOrdenCarga');
      this.ordencargaservice.filter('Register click');
      this.dialogRef.close();
    })


  }
  updateFacturaFlete2(){
    //this.UpdateOrdenCargaTrafico();

    let ff = new facturafletedata();

    ff.IDFacturaFlete = this.IDFactFletera;

    ff.Factura = this.traficoService.formDatafactura.Factura;
    ff.Fletera = this.traficoService.formrow.Nombre;
    ff.IVA = this.traficoService.formDatafactura.IVA;
    ff.Subtotal = this.traficoService.formDatafactura.Subtotal;
    ff.Total = this.traficoService.formDatafactura.Total;
    ff.IDOrdenCarga = this.traficoService.formData.IdOrdenCarga;
    ff.IDPedido = this.traficoService.formData.IdPedido;
    ff.Estatus = "Terminada"

    console.log(ff);


    // console.log(this.traficoService.formDatafactura);


    this.traficoService.updateFacturaFlete2(ff).subscribe(resx => {
      console.log(resx);

      localStorage.removeItem('FormDataOrdenCarga');
      this.ordencargaservice.filter('Register click');
      this.dialogRef.close();
    })


  }


  actualizarEstatus(){

    if (this.estatusSelect=='Transito'){

      this.tarimaService.tarimaTrafico.Bodega='Transito -'+this.UbicacionEstatus
    }else{
      
      this.tarimaService.tarimaTrafico.Bodega='Terminada';
    }


    console.log(this.tarimaService.tarimaTrafico);


    this.tarimaService.updateTarima(this.tarimaService.tarimaTrafico).subscribe(data=>{
      console.log(data);
    })

  }

  estatusCambio(event){
    this.estatusSelect = event.value;

  }





}
