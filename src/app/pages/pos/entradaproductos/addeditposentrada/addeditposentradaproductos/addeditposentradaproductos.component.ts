import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { PosserviceService, Producto } from '../../../posservice.service';
import Swal from 'sweetalert2';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-addeditposentradaproductos',
  templateUrl: './addeditposentradaproductos.component.html',
  styleUrls: ['./addeditposentradaproductos.component.css']
})
export class AddeditposentradaproductosComponent implements OnInit {

  constructor(public posSVC: PosserviceService, public dialogbox: MatDialogRef<AddeditposentradaproductosComponent>) { }
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  producto = new Producto;
  IVA;
  options: Producto[] = [];
  listproducto: Producto[] = [];
  detalleservicio: any;

  ngOnInit() {
    this.dropdownRefresh()
    console.log(this.posSVC.detalleentradaForm);  
    this.detalleservicio = this.posSVC.detalleentradaForm;  
        if (this.posSVC.addeditdetalleEntrada=='Editar'){
          this.producto.iva = this.detalleservicio.iva1;
          
        }
  }

  onClose(){
    this.dialogbox.close();
  }

  onBlurProducto(){

    console.log(this.posSVC.detalleentradaForm);

  }

  dropdownRefresh() {
    let consulta = {
      'consulta':"select * from dbo.Productos where Estatus='Activo' and tipo='Producto'"
    };
    console.log(consulta);
    this.posSVC.generarConsulta(consulta).subscribe((data:any) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.listproducto.push(client);
        this.options.push(client)
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });
  }

  private _filter(value: any): any[] {
    // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.nombre.toLowerCase().includes(filterValue) ||
      option.idProductos.toString().includes(filterValue));
  }

  onSelectionChange(option, event){

    if (event.isUserInput){
      console.log('producto',option);
      this.producto = option;
      this.posSVC.detalleentradaForm.idproducto = option.idProductos;
      this.posSVC.detalleentradaForm.nombreproducto = option.nombre;
      this.posSVC.detalleentradaForm.claveproducto = option.Clave;
      this.posSVC.detalleentradaForm.cantidad = '1';
      this.posSVC.detalleentradaForm.precioProducto = (+option.precioVenta).toFixed(2);
      this.posSVC.detalleentradaForm.iva = (+option.precioVenta*+option.iva).toFixed(2);
      if(option.iva=='0.16'){
        this.IVA = true;
      }else{
        this.IVA = false;
      }
      this.calcularIVA();
      
    }

  }

  calcularIVA(){


    this.posSVC.detalleentradaForm.precioProducto = (+this.posSVC.detalleentradaForm.precioProducto).toFixed(2)
    this.posSVC.detalleentradaForm.subtotal = (+this.posSVC.detalleentradaForm.precioProducto*+this.posSVC.detalleentradaForm.cantidad).toFixed(2);
    this.posSVC.detalleentradaForm.iva = ((+this.posSVC.detalleentradaForm.precioProducto*+this.posSVC.detalleentradaForm.cantidad)*+this.producto.iva).toFixed(2);
    this.posSVC.detalleentradaForm.total = (+this.posSVC.detalleentradaForm.subtotal + +this.posSVC.detalleentradaForm.iva).toFixed(2);
  }

  agregarServicio(){
    console.log(this.posSVC.detalleentradaForm);
    let detalle = this.posSVC.detalleentradaForm
    let consulta = {
      'consulta':"insert into DetalleEntrada values(" + detalle.identrada + "," + detalle.idproducto + ",'" + detalle.nombreproducto + "','" + detalle.claveproducto + "','" + detalle.precioProducto + "','" + detalle.cantidad + "','" + detalle.subtotal + "','" + detalle.iva + "','" + detalle.total + "','" + detalle.observaciones + "','" + detalle.tipodecambio + "','" + detalle.precioProductodlls + "','" + detalle.subtotaldlls + "','" + detalle.ivadlls + "','" + detalle.totaldlls + "')"
    };

    this.posSVC.generarConsulta(consulta).subscribe((res:any)=>{
      console.log(res);
      this.agregarInventario();
      if (res.length==0){
        Swal.fire({
          icon: 'success',
          title: 'Producto Agregado',
          text: ''+this.posSVC.detalleentradaForm.nombreproducto+'',
          timer: 1500
        })
        this.onClose();

      }else{
        Swal.fire({
          title: 'Error',
          text: 'Error: '+ res,
          icon: 'error',  
        });
      }

    })
  }

  agregarInventario(){

    let consulta = {
      'consulta':"select top (1) iddetalleentrada from DetalleEntrada order by iddetalleentrada desc"
    };
    
    
    
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      
      console.log(data);
      
      this.posSVC.inventarioForm = {
        
        idinventario:0,
        iddocorigen:this.posSVC.detalleentradaForm.identrada,
        iddetalleorigen:data[0].iddetalleentrada,
        claveproducto:this.posSVC.detalleentradaForm.claveproducto,
        nombreproducto:this.posSVC.detalleentradaForm.nombreproducto,
        precio:this.posSVC.detalleentradaForm.precioProducto,
        cantidad:this.posSVC.detalleentradaForm.cantidad,
        subtotal:this.posSVC.detalleentradaForm.subtotal,
        iva:this.posSVC.detalleentradaForm.iva,
        total:this.posSVC.detalleentradaForm.total,
        tipocambio:this.posSVC.detalleentradaForm.tipodecambio,
        subtotaldlls:this.posSVC.detalleentradaForm.subtotal,
        ivadlls:this.posSVC.detalleentradaForm.ivadlls,
        totaldlls:this.posSVC.detalleentradaForm.totaldlls,
        sucursal:this.posSVC.entradaForm.sucursal,
        tipo:'Entrada',
        fecha:new Date(),
        
      }
      let inventario = this.posSVC.inventarioForm;
      let fecha  = this.posSVC.inventarioForm.fecha.toISOString().slice(0,10);
      let consulta2 = {
        'consulta':"insert into inventarios values("+inventario.iddocorigen+","+ inventario.iddetalleorigen + ",'"+ inventario.claveproducto+ "','"+ inventario.nombreproducto+ "','"+ inventario.precio+ "','"+ inventario.cantidad+ "','"+ inventario.subtotal+ "','"+ inventario.iva+ "','"+ inventario.total+ "','"+ inventario.tipocambio+ "','"+ inventario.subtotaldlls+ "','"+ inventario.ivadlls+ "','"+ inventario.totaldlls+ "','"+ inventario.sucursal+ "','"+ inventario.tipo+ "','"+ fecha + "')"
      };
      console.log(consulta2);
      this.posSVC.generarConsulta(consulta2).subscribe(res=>{
        console.log(res);
      })
    })
  }


  actualizarServicio(){

    let detalle = this.posSVC.detalleentradaForm

    let consulta2 = {
      'consulta':"update DetalleEntrada set identrada=" + detalle.identrada + ",idproducto=" + detalle.idproducto + ",nombreproducto='" + detalle.nombreproducto + "',claveproducto='" + detalle.claveproducto + "',precioProducto='" + detalle.precioProducto + "',cantidad='" + detalle.cantidad + "',subtotal='" + detalle.subtotal + "',iva='" + detalle.iva + "',total='" + detalle.total + "',observaciones='" + detalle.observaciones + "',tipodecambio='" + detalle.tipodecambio + "',precioProductodlls='" + detalle.precioProductodlls + "',subtotaldlls='" + detalle.subtotaldlls + "',ivadlls='" + detalle.ivadlls + "',totaldlls='" + detalle.totaldlls +  "' where iddetalleentrada=" + detalle.iddetalleentrada + ";"
    };
    

console.log(consulta2);
    this.posSVC.generarConsulta(consulta2).subscribe((res:any)=>{
      console.log(res);
      this.actualizarInventario();
      if (res.length==0){
        Swal.fire({
          icon: 'success',
          title: 'Producto Actualizado',
          text: ''+this.posSVC.detalleentradaForm.nombreproducto+'',
          timer: 1500
        })
        this.onClose();

      }else{
        Swal.fire({
          title: 'Error',
          text: 'Error: '+ res,
          icon: 'error',  
        });
      }

    })
  }

  actualizarInventario(){

    this.posSVC.inventarioForm = {

      idinventario:0,
      iddocorigen:this.posSVC.detalleentradaForm.identrada,
      iddetalleorigen:this.posSVC.detalleentradaForm.iddetalleentrada,
      claveproducto:this.posSVC.detalleentradaForm.claveproducto,
      nombreproducto:this.posSVC.detalleentradaForm.nombreproducto,
      precio:this.posSVC.detalleentradaForm.precioProducto,
      cantidad:this.posSVC.detalleentradaForm.cantidad,
      subtotal:this.posSVC.detalleentradaForm.subtotal,
      iva:this.posSVC.detalleentradaForm.iva,
      total:this.posSVC.detalleentradaForm.total,
      tipocambio:this.posSVC.detalleentradaForm.tipodecambio,
      subtotaldlls:this.posSVC.detalleentradaForm.subtotal,
      ivadlls:this.posSVC.detalleentradaForm.ivadlls,
      totaldlls:this.posSVC.detalleentradaForm.totaldlls,
      sucursal:'Zarco',
      tipo:'Salida',
      fecha:new Date(),

    }

    console.log(this.posSVC.inventarioForm);

    let detalle = this.posSVC.detalleentradaForm
    let inventario = this.posSVC.inventarioForm;
      let fecha  = this.posSVC.inventarioForm.fecha.toISOString().slice(0,10);

    let consulta = {
      'consulta':"update inventarios set iddocorigen=" + inventario.iddocorigen + ", claveproducto='" + inventario.claveproducto + "', nombreproducto='" + inventario.nombreproducto + "',precio='" + inventario.precio + "', cantidad='" + inventario.cantidad + "', subtotal='" + inventario.subtotal + "', iva='" + inventario.iva + "', total='" + inventario.total + "', tipocambio='" + inventario.tipocambio + "',subtotaldlls='" + inventario.subtotaldlls + "', ivadlls='" + inventario.ivadlls + "', totaldlls='" + inventario.totaldlls + "', sucursal='" + inventario.sucursal + "', tipo='" + inventario.tipo + "', fecha='" + fecha + "' where iddetalleorigen=" + inventario.iddetalleorigen + ";"
    };

    this.posSVC.generarConsulta(consulta).subscribe(res=>{
      console.log(res);
    })

  }

  quitarPonerIVA(event){
    console.log(this.IVA);
    if (this.IVA){
      this.IVA = !this.IVA;
      this.producto.iva = '0'
    }else{
      this.IVA = !this.IVA;
      this.producto.iva = '0.16'
    }
    this.calcularIVA();
  }

}
