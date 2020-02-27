import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { NgForm, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { startWith, map } from 'rxjs/operators';
import { UnidadMedidaService } from 'src/app/services/unidadmedida/unidad-medida.service';
@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.css']
})
export class EditProductoComponent implements OnInit {
  myControlUnidad = new FormControl();
  filteredOptionsUnidad: Observable<any[]>;
  //Clave Unidad
public listUM: Array<any> = [];

  constructor(public dialogbox: MatDialogRef<EditProductoComponent>,
    public service: ProductosService, private snackBar: MatSnackBar, public enviarfact: EnviarfacturaService , public ServiceUnidad: UnidadMedidaService) { }

iva: boolean;

  ngOnInit() {
     if (this.service.formData.IVA == '0.16'){
      this.iva = true;
    }else{
      this.iva = false;
    }
    // console.log(this.service.formData.IVA);
    // console.log(this.iva);
    

    this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUnidad(value))
      );
  }

  unidadMedida(){
    this.listUM = [];
    // this.enviarfact.unidadMedida().subscribe(data=>{
    //   //console.log(JSON.parse(data).data);
    //   for (let i=0; i<JSON.parse(data).data.length; i++){
    //     this.listUM.push(JSON.parse(data).data[i])
    //   }
    //   console.log(this.listUM);      
    // })

    this.ServiceUnidad.GetUnidadesMedida().subscribe(data =>{
      console.log(data);
        this.listUM = data;
        console.log(this.listUM);

        this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterUnidad(value))
        );


    });
  }

  
  private _filterUnidad(value: any): any[] {
    const filterValueUnidad = value.toLowerCase();
    //return this.optionsUnidad.filter(optionUnidad => optionUnidad.toString().toLowerCase().includes(filterValueUnidad));
    return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.Nombre.toString().toLowerCase().includes(filterValueUnidad));
  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {

    if (form.controls['IVA'].value == true) {
      this.service.formData.IVA = '0.16';
      }  else {
        this.service.formData.IVA = '0';
      }
// console.log(this.service.formData.IVA);
    this.service.updateProducto(this.service.formData).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Producto Actualizado'
      })
    });
  }

}
