import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import Swal from 'sweetalert2';
import { NgForm, FormControl } from '@angular/forms';
import { OrdenTemporalService } from '../../../../../../services/almacen/orden-temporal/orden-temporal.service';
import { Observable } from 'rxjs';
import { QR } from '../../../../../../Models/almacen/OrdenDescarga/QR-model';
import { TarimaService } from '../../../../../../services/almacen/tarima/tarima.service';
import { startWith, map } from 'rxjs/operators';
import { Tarima } from 'src/app/Models/almacen/Tarima/tarima-model';
import { DetalleTarima } from '../../../../../../Models/almacen/Tarima/detalleTarima-model';
import { OrdenTemporal } from 'src/app/Models/almacen/OrdenTemporal/ordenTemporal-model';

@Component({
  selector: 'app-orden-decarga-tarima-existente',
  templateUrl: './orden-decarga-tarima-existente.component.html',
  styleUrls: ['./orden-decarga-tarima-existente.component.css']
})
export class OrdenDecargaTarimaExistenteComponent implements OnInit {

  constructor(public dialogbox: MatDialogRef<OrdenDecargaTarimaExistenteComponent>, public ordenTemporalService: OrdenTemporalService, public tarimaService: TarimaService) { }

  ngOnInit() {
    // PREORDENTEMPORALTARIMAEXISTENTE
    this.POTSTE = this.ordenTemporalService.preOrdenTemporalSacos;
    console.log(this.POTSTE);
    this.toShowInput()
    this.dropdownRefresh();

  }
  onClose() {
    this.dialogbox.close();
  }

  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  listQR: Tarima[] = [];
  options: Tarima[] = [];

  QR: any;
  Producto: string;
  Lote: string;
  SacosIngresadosAll = 0;
  POTSTE: any;
  sacosFinal = 0;
  pesoFinal = 0;
  SacosTotalesTarimaE = 0;

  private _filter(value: any): any[] {
    // Causa problema al borrar el codigo
    console.log(value);

    console.log(this.tarimaService.formDataDrop);

    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.QR.toLowerCase().includes(filterValue));

  }


  dropdownRefresh() {

    this.tarimaService.getTarima().subscribe(data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let Qr = data[i];
        this.listQR.push(Qr);
        this.options.push(Qr)
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
    this.listQR = [];
    this.options = [];
    this.dropdownRefresh();
  }

  onSelectionChange(options: Tarima, event: any) {
    if (event.isUserInput) {
      this.tarimaService.formDataDrop = options;
    }
  }

  toShowInput() {
    for (let i = 0; i <= this.POTSTE.length - 1; i++) {
      this.SacosIngresadosAll = +this.POTSTE[i].SacosIngresados + +this.SacosIngresadosAll;
    }

    this.Producto = this.POTSTE[0].Producto
    this.Lote = this.POTSTE[0].Lote


  }

  onSubmit(form: NgForm) {
    let TarimaDataQR = this.tarimaService.formDataDrop

    if (TarimaDataQR.QR == null) {
      Swal.fire({
        title: 'Ingresar QR',
        icon: 'warning',
        text: ''
      });

    } else {

      console.log(TarimaDataQR);
      let idTarima = TarimaDataQR.IdTarima;
      let codigoQR = TarimaDataQR.QR;
      let sacos
      let DTTE = new Array<DetalleTarima>();
      this.tarimaService.getTarimaID(idTarima).subscribe(resDataTarima => {
        let sacosOT = +resDataTarima[0].Sacos;
        let pesoTotalOT = +resDataTarima[0].PesoTotal;
        let PesoTotalTarima = 0;
        for (let i = 0; i <= this.POTSTE.length - 1; i++) {
          let Dt = new DetalleTarima();
          // Dt = this.POTSTE[i];

          PesoTotalTarima = ((+this.POTSTE[i].SacosIngresados) * (+this.POTSTE[i].PesoxSaco))

          Dt.IdTarima = idTarima;
          Dt.ClaveProducto = this.POTSTE[i].ClaveProducto;
          Dt.Producto = this.POTSTE[i].Producto;
          Dt.Sacos = this.POTSTE[i].SacosIngresados;
          Dt.PesoxSaco = this.POTSTE[i].PesoxSaco;
          Dt.Lote = this.POTSTE[i].Lote;
          Dt.IdProveedor = this.POTSTE[i].IdProveedor;
          Dt.PO = this.POTSTE[i].PO;
          Dt.FechaMFG = this.POTSTE[i].FechaMFG;
          Dt.FechaCaducidad = this.POTSTE[i].FechaCaducidad;
          Dt.Shipper = this.POTSTE[i].Shipper;
          Dt.USDA = this.POTSTE[i].USDA;
          Dt.Pedimento = this.POTSTE[i].Pedimento;
          DTTE.push(Dt);
          sacosOT = (+sacosOT + +DTTE[i].Sacos)
          // pesoTotalOT =( +pesoTotalOT + +this.POTSTE[i].PesoTotal)
          pesoTotalOT = (+pesoTotalOT + +PesoTotalTarima)
        }
        console.log(DTTE)
        console.warn(idTarima);
        console.log(this.POTSTE)
        console.log(sacosOT);
        console.log(pesoTotalOT);
        this.tarimaService.updateTarimaSacosPeso(idTarima, sacosOT.toString(), pesoTotalOT.toString()).subscribe(dataT => {

          for (let i = 0; i <= DTTE.length - 1; i++) {


            // let sacostarimaE = +sacosOT + +resDataTarima[0].Sacos;            
            // let pesotarimaE = +pesoTotalOT + +resDataTarima[0].PesoTotal;
            this.tarimaService.addDetalleTarima(DTTE[i]).subscribe(DataTemp => {
              console.log(DataTemp);

              //insercion a orden temporal
              let ordenTempTE = new OrdenTemporal();

              ordenTempTE.IdOrdenTemporal = 1;
              ordenTempTE.IdTarima = idTarima;
              ordenTempTE.IdOrdenCarga = 0;
              //cambiar esta chingadera
              ordenTempTE.IdOrdenDescarga = 1;
              ordenTempTE.QR = codigoQR;
              ordenTempTE.ClaveProducto = this.POTSTE[i].ClaveProducto;
              ordenTempTE.Lote = this.POTSTE[i].Lote;
              ordenTempTE.Sacos = this.POTSTE[i].SacosIngresados;
              ordenTempTE.Producto = this.POTSTE[i].Producto;
              ordenTempTE.PesoTotal = ((+this.POTSTE[i].SacosIngresados) * (+this.POTSTE[i].PesoxSaco)).toString();
              ordenTempTE.FechaCaducidad = this.POTSTE[i].FechaCaducidad;
              ordenTempTE.Comentarios = this.POTSTE[i].Comentarios;
              console.log(ordenTempTE, 'ordenTempTE');

              // console.log(sacostarimaE);
              // console.log(pesotarimaE);


              console.log(dataT);
              this.ordenTemporalService.addOrdenTemporal(ordenTempTE).subscribe(DataOT => {
                console.log(DataOT);


                this.ordenTemporalService.filterOrdenTemporal('Register click');
                this.ordenTemporalService.filterOrdenTemporalSI('Register click');

                this.dialogbox.close();

              })
            })
          }
        })
      }
      )
    }
  }
}
