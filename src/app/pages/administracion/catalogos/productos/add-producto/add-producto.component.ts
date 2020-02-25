import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ProductosService } from '../../../../../services/catalogos/productos.service';
import { NgForm, FormGroup, FormArray, Validators, FormControl  } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { EnviarfacturaService } from 'src/app/services/facturacioncxc/enviarfactura.service';
import { startWith, map } from 'rxjs/operators';
import { UnidadMedidaService } from '../../../../../services/unidadmedida/unidad-medida.service';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.css']})
export class AddProductoComponent implements OnInit {
  myControlUnidad = new FormControl();
  filteredOptionsUnidad: Observable<any[]>;
  //Clave Unidad
public listUM: Array<any> = [];

  constructor(public dialogbox: MatDialogRef<AddProductoComponent>,
    public service: ProductosService, private snackBar: MatSnackBar,public enviarfact: EnviarfacturaService, public ServiceUnidad: UnidadMedidaService) { }

  ngOnInit() {
    this.resetForm();
    this.unidadMedida();

    
  }

  unidadMedida(){
    // this.listUM = [];
    // this.enviarfact.unidadMedida().subscribe(data=>{
    //   //console.log(JSON.parse(data).data);
    //   for (let i=0; i<JSON.parse(data).data.length; i++){
    //     this.listUM.push(JSON.parse(data).data[i])
    //   }
    this.ServiceUnidad.GetUnidadesMedida().subscribe(data =>{
        this.listUM = data;
      

        this.filteredOptionsUnidad = this.myControlUnidad.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterUnidad(value))
        );


    });
      

      
    // })
  }

   //Filter Unidad
   private _filterUnidad(value: any): any[] {
     console.log(value);
    const filterValueUnidad = value.toString().toLowerCase();
    return this.listUM.filter(optionUnidad => optionUnidad.ClaveSAT.toString().toLowerCase().includes(filterValueUnidad) || optionUnidad.Nombre.toString().toLowerCase().includes(filterValueUnidad));
  }


  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.service.formData = {
      IdProducto: 0,
      Nombre: '',
      PrecioVenta: '',
      PrecioCosto: '',
      Cantidad: '',
      ClaveProducto: '',
      Stock: '',
      DescripcionProducto: '',
      Estatus: '',
      UnidadMedida: '',
      IVA: '',
      ClaveSAT: '',
      Categoria: ''
    }

  }

  onClose() {
    this.dialogbox.close();
    this.service.filter('Register click');
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    if (form.controls['IVA'].value == true) {
    this.service.formData.IVA = '0.16';
    }  else {
      this.service.formData.IVA = '0';
    }
    // console.log(this.service.formData.IVA);
    this.service.addProducto(this.service.formData).subscribe(res => {
      this.resetForm(form);
      Swal.fire({
        icon: 'success',
        title: 'Producto Agregado',
      })
    }
    );
  }


}
