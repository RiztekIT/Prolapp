import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Cliente, PosserviceService, Ventas, Producto, DetalleVentas } from '../posservice.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { PospagoventaComponent } from './pospagoventa/pospagoventa.component';
import { PosaddeditclientesComponent } from '../catalogos/poscatclientes/posaddeditclientes/posaddeditclientes.component';
import { PoshistoricoventasComponent } from './poshistoricoventas/poshistoricoventas.component';
import { PossaldosclientesComponent } from './possaldosclientes/possaldosclientes.component';

@Component({
  selector: 'app-posventadirecta',
  templateUrl: './posventadirecta.component.html',
  styleUrls: ['./posventadirecta.component.css']
})
export class PosventadirectaComponent implements OnInit {
  Estatus
  myControl = new FormControl();
  myControl2 = new FormControl();
  filteredOptions: Observable<any[]>;
  filteredOptions2: Observable<any[]>;
  options: Cliente[] = [];
  options2: Producto[] = [];
  listClientes: Cliente[] = [];
  listProductos: Producto[] = [];
  cliente = new Cliente;
  producto = new Producto
  displayedColumns: string[] = ['Clave', 'Producto', 'Cantidad', 'PrecioUnitario', 'Precio', 'Options'];
  listData: MatTableDataSource<any>;
  IVA;
  @ViewChild(MatSort, null) sort: MatSort;

  constructor(private location: Location,public posSVC: PosserviceService, private dialog: MatDialog) { }

  public ventaBlanco: Ventas =  {
    idVentas:0,
    idCliente:3,
    nombreCliente:'Venta al Publico',
    precioVenta:'',
    folio:'',
    descripcion:'',
    estatus:'Abierta',
    categoria1:'',
    categoria2:'',
    categoria3:'',
    tipo:'Venta',
    fechaexpedicion:new Date(),    
    campoextra1:'',
    campoextra2:'',
    campoextra3:'',
    subtotal:'',
    iva:'',
    total:'',
    subtotaldlls:'',
    ivadlls:'',
    totaldlls:'',
    clasificacion1:'',
    clasificacion2:'',
    clasificacion3:'',    
    sucursal: 'Hermosillo',

  }


  ngOnInit() {

    this.crearNuevaVenta();

    
    
    
    this.dropdownRefresh();
    this.dropdownRefresh2();
    // // console.clear();
    // console.log(this.ordenservicioService.servicioForm);
    
    this.refreshTablaProductos();
  }

  Regresar(){
    this.location.back();
  }

  dropdownRefresh() {
    let consulta = {
      'consulta':"select * from Cliente order by nombre"
    };
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
    
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let client = data[i];
        this.listClientes.push(client);
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
    // // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option =>
      option.nombre.toLowerCase().includes(filterValue) ||
      option.idCLiente.toString().includes(filterValue));
  }

  dropdownRefresh2() {
    let consulta = {
      'consulta':"select * from Productos order by nombre"
    };
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
    
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let producto = data[i];
        this.listProductos.push(producto);
        this.options2.push(producto)
        this.filteredOptions2 = this.myControl2.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter2(value))
          );
      }
    });
  }

  private _filter2(value: any): any[] {
    // // console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.options2.filter(option =>
      option.nombre.toLowerCase().includes(filterValue) ||
      option.idProductos.toString().includes(filterValue));
  }

  onBlurCliente(){

  }

  onSelectionChange(option, event) {

    if (event.isUserInput) {
      // console.log('cliente', option);
      this.cliente = option;
      this.posSVC.ventasForm.idCliente = option.idCLiente;
      this.posSVC.ventasForm.nombreCliente = option.nombre;
      this.guardar2();
    }

  }

  onSelectionChange2(option, event) {

    if (event.isUserInput){
      console.log('producto',option);
      this.producto = option;
      this.posSVC.detallesventasForm.idproducto = option.idProductos;
      this.posSVC.detallesventasForm.nombreproducto = option.nombre;
      this.posSVC.detallesventasForm.claveproducto = option.Clave;
      this.posSVC.detallesventasForm.cantidad = '1';
      this.posSVC.detallesventasForm.precioProducto = (+option.precioVenta).toFixed(2);
      this.posSVC.detallesventasForm.iva = (+option.precioVenta*+option.iva).toFixed(2);
      if(option.iva=='0.16'){
        this.IVA = true;
      }else{
        this.IVA = false;
      }
      this.calcularIVA();
      
    }

  }

  calcularIVA(){


    this.posSVC.detallesventasForm.precioProducto = (+this.posSVC.detallesventasForm.precioProducto).toFixed(2)
    this.posSVC.detallesventasForm.subtotal = (+this.posSVC.detallesventasForm.precioProducto*+this.posSVC.detallesventasForm.cantidad).toFixed(2);
    this.posSVC.detallesventasForm.iva = ((+this.posSVC.detallesventasForm.precioProducto*+this.posSVC.detallesventasForm.cantidad)*+this.producto.iva).toFixed(2);
    this.posSVC.detallesventasForm.total = (+this.posSVC.detallesventasForm.subtotal + +this.posSVC.detallesventasForm.iva).toFixed(2);
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

  guardar2() {
    // console.log(this.ordenservicioService.servicioForm);
    localStorage.removeItem('idservicio')
    this.posSVC.ventasForm.estatus = 'Abierta';
    this.Estatus = this.posSVC.ventasForm.estatus;
    let servicio = this.posSVC.ventasForm
    let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString();
    console.log(fecha);
    //let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString().slice(0,10);
    let consulta = {
      'consulta':"update ventas set idCliente=" + servicio.idCliente + ",nombreCliente='" + servicio.nombreCliente + "',precioVenta='" + servicio.precioVenta + "',folio='" + servicio.folio + "',descripcion='" + servicio.descripcion + "',estatus='" + servicio.estatus + "',categoria1='" + servicio.categoria1 + "',categoria2='" + servicio.categoria2 + "',categoria3='" + servicio.categoria3 + "',tipo='" + servicio.tipo + "',fechaexpedicion='" + fecha + "',campoextra1='" + servicio.campoextra1 + "',campoextra2='" + servicio.campoextra2 + "',campoextra3='" + servicio.campoextra3 + "',subtotal='" + servicio.subtotal + "',iva='" + servicio.iva + "',total='" + servicio.total + "',subtotaldlls='" + servicio.subtotaldlls + "',ivadlls='" + servicio.ivadlls + "',totaldlls='" + servicio.totaldlls + "',clasificacion1='" + servicio.clasificacion1 + "',clasificacion2='" + servicio.clasificacion2 + "',clasificacion3='" + servicio.clasificacion3 + "', sucursal='" + servicio.sucursal + "'  where idVentas=" + servicio.idVentas+";"
    };
    console.log(consulta);
    this.posSVC.generarConsulta(consulta).subscribe((res:any)=>{

    
      console.log(res);
      if (res.length==0) {

      


        /*   Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: '' + this.ordenservicioService.servicioForm.folio + '',
            timer: 1500
          }) */
        
        // console.log('%c%s', 'color: #997326', this.ordenservicioService.CEProds);


      } else {
         Swal.fire({
           title: 'Error',
           text: 'Error: ' + res,
           icon: 'error',
         });
      }
    })
  }

  onBlurProducto(){

    console.log(this.posSVC.detallesventasForm);

  }


  agregarDetalleVenta(){
    console.log(this.posSVC.detallesventasForm);
    if (this.posSVC.detallesventasForm.idproducto) {

      let detalle = this.posSVC.detallesventasForm;

      let consulta = {
        'consulta': "insert into DetalleVentas values("+detalle.idventas+","+detalle.idproducto+",'"+detalle.nombreservicio+"','"+ detalle.claveservicio+ "','"+ detalle.nombreproducto+ "','"+ detalle.claveproducto+ "','"+ detalle.precioProducto+ "','"+ detalle.cantidad+ "','"+ detalle.subtotal+ "','"+ detalle.iva+ "','"+ detalle.total+ "','"+ detalle.Observaciones+ "','"+ detalle.tipocambio+ "','"+ detalle.precioProductodlls+ "','"+ detalle.cantidaddlls+ "','"+ detalle.subtotaldlls+ "','"+ detalle.ivadlls+ "','"+ detalle.totaldlls+ "')"
      };
      console.log(consulta);
      this.posSVC.generarConsulta(consulta).subscribe((res:any)=>{
          console.log(res);
      
      if (res.length==0){
      /*   Swal.fire({
          icon: 'success',
          title: 'Producto / Servicio Agregado',
          text: ''+this.posSVC.detallesventasForm.nombreservicio+'',
          timer: 1500
        }) */
        this.agregarInventario();

       /*  this.posSVC.detallesventasForm.idproducto = 0;
        this.posSVC.detallesventasForm.nombreproducto = '';
        this.posSVC.detallesventasForm.claveproducto = '';
        this.posSVC.detallesventasForm.cantidad = '1';
        this.posSVC.detallesventasForm.precioProducto = '0.00';
        this.posSVC.detallesventasForm.iva = '0.00';
        if(this.posSVC.detallesventasForm.iva=='0.16'){
          this.IVA = true;
        }else{
          this.IVA = false;
        }
        this.calcularIVA();
        this.refreshTablaProductos(); */
        

      }else{
        Swal.fire({
          title: 'Error',
          text: 'Error: '+ res,
          icon: 'error',  
        });
      }

    })
  }else{
    Swal.fire({
      icon: 'error',
      title: 'Seleccionar Directamente Desde la Lista',
      text: 'Favor de seleccionar el Producto desde la lista',
      timer: 1500
    })
  }
  }


  agregarInventario(){

    let consulta = {
      'consulta':"select top (1) iddetalleventas from DetalleVentas order by iddetalleventas desc"
    };

    console.log(this.posSVC.detallesventasForm);

    

    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{

      console.log(data);

      this.posSVC.inventarioForm = {
  
        idinventario:0,
        iddocorigen:this.posSVC.detallesventasForm.idventas,
        iddetalleorigen:data[0].iddetalleventas,
        claveproducto:this.posSVC.detallesventasForm.claveproducto,
        nombreproducto:this.posSVC.detallesventasForm.nombreproducto,
        precio:this.posSVC.detallesventasForm.precioProducto,
        cantidad:this.posSVC.detallesventasForm.cantidad,
        subtotal:this.posSVC.detallesventasForm.subtotal,
        iva:this.posSVC.detallesventasForm.iva,
        total:this.posSVC.detallesventasForm.total,
        tipocambio:this.posSVC.detallesventasForm.tipocambio,
        subtotaldlls:this.posSVC.detallesventasForm.subtotal,
        ivadlls:this.posSVC.detallesventasForm.ivadlls,
        totaldlls:this.posSVC.detallesventasForm.totaldlls,
        sucursal:'Hermosillo',
        tipo:'Salida',
        fecha:new Date(),
  
      }

      let inventario = this.posSVC.inventarioForm;
      let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString();
    console.log(fecha);
      //let fecha  = this.posSVC.inventarioForm.fecha.toISOString().slice(0,10);

      let consulta2 = {
        'consulta':"insert into inventarios values("+inventario.iddocorigen+","+ inventario.iddetalleorigen + ",'"+ inventario.claveproducto+ "','"+ inventario.nombreproducto+ "','"+ inventario.precio+ "','"+ inventario.cantidad+ "','"+ inventario.subtotal+ "','"+ inventario.iva+ "','"+ inventario.total+ "','"+ inventario.tipocambio+ "','"+ inventario.subtotaldlls+ "','"+ inventario.ivadlls+ "','"+ inventario.totaldlls+ "','"+ inventario.sucursal+ "','"+ inventario.tipo+ "','"+ fecha + "')"
      };
      console.log(consulta2);
      this.posSVC.generarConsulta(consulta2).subscribe((res:any)=>{
  
      
        console.log(res);
        if (res.length==0){
          this.posSVC.detallesventasForm.idproducto = 0;
          this.posSVC.detallesventasForm.nombreproducto = '';
          this.posSVC.detallesventasForm.claveproducto = '';
          this.posSVC.detallesventasForm.cantidad = '1';
          this.posSVC.detallesventasForm.precioProducto = '0.00';
          this.posSVC.detallesventasForm.iva = '0.00';
          if(this.posSVC.detallesventasForm.iva=='0.16'){
            this.IVA = true;
          }else{
            this.IVA = false;
          }
          this.calcularIVA();
          this.refreshTablaProductos();
        }else{
          Swal.fire({
            title: 'Error',
            text: 'Error: '+ res,
            icon: 'error',  
          });
        }
      })
    })
  }


  actualizarVenta(){

    //;
    let detalle = this.posSVC.detallesventasForm
    let consulta = {
      'consulta':"update DetalleVentas set idventas=" + detalle.idventas + ",idproducto=" + detalle.idproducto + ",nombreservicio='" + detalle.nombreservicio + "',claveservicio='" + detalle.claveservicio + "',nombreproducto='" + detalle.nombreproducto + "',claveproducto='" + detalle.claveproducto + "',precioProducto='" + detalle.precioProducto + "',cantidad='" + detalle.cantidad + "',subtotal='" + detalle.subtotal + "',iva='" + detalle.iva + "',total='" + detalle.total + "',Observaciones='" + detalle.Observaciones + "',tipocambio='" + detalle.tipocambio + "',precioProductodlls='" + detalle.precioProductodlls + "',cantidaddlls='" + detalle.cantidaddlls + "',subtotaldlls='" + detalle.subtotaldlls + "',ivadlls='" + detalle.ivadlls + "',totaldlls='" + detalle.totaldlls + "' where iddetalleventas="+detalle.iddetalleventas+";"
    };


    this.posSVC.generarConsulta(consulta).subscribe((res:any)=>{
      console.log(res);
      this.actualizarInventario();
      if (res.length==0){
        this.posSVC.addedit = 'Agregar'
        this.posSVC.detallesventasForm.idproducto = 0;
        this.posSVC.detallesventasForm.nombreproducto = '';
        this.posSVC.detallesventasForm.claveproducto = '';
        this.posSVC.detallesventasForm.cantidad = '1';
        this.posSVC.detallesventasForm.precioProducto = '0.00';
        this.posSVC.detallesventasForm.iva = '0.00';
        if(this.posSVC.detallesventasForm.iva=='0.16'){
          this.IVA = true;
        }else{
          this.IVA = false;
        }
        this.calcularIVA();
        this.refreshTablaProductos();
        

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
      iddocorigen:this.posSVC.detallesventasForm.idventas,
      iddetalleorigen:this.posSVC.detallesventasForm.iddetalleventas,
      claveproducto:this.posSVC.detallesventasForm.claveproducto,
      nombreproducto:this.posSVC.detallesventasForm.nombreproducto,
      precio:this.posSVC.detallesventasForm.precioProducto,
      cantidad:this.posSVC.detallesventasForm.cantidad,
      subtotal:this.posSVC.detallesventasForm.subtotal,
      iva:this.posSVC.detallesventasForm.iva,
      total:this.posSVC.detallesventasForm.total,
      tipocambio:this.posSVC.detallesventasForm.tipocambio,
      subtotaldlls:this.posSVC.detallesventasForm.subtotal,
      ivadlls:this.posSVC.detallesventasForm.ivadlls,
      totaldlls:this.posSVC.detallesventasForm.totaldlls,
      sucursal:'Hermosillo',
      tipo:'Salida',
      fecha:new Date(),

    }

    console.log(this.posSVC.inventarioForm);

    let detalle = this.posSVC.detalleentradaForm
    let inventario = this.posSVC.inventarioForm;
    let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString();
    console.log(fecha);
      //let fecha  = this.posSVC.inventarioForm.fecha.toISOString().slice(0,10);

    let consulta = {
      'consulta':"update inventarios set iddocorigen=" + inventario.iddocorigen + ", claveproducto='" + inventario.claveproducto + "', nombreproducto='" + inventario.nombreproducto + "',precio='" + inventario.precio + "', cantidad='" + inventario.cantidad + "', subtotal='" + inventario.subtotal + "', iva='" + inventario.iva + "', total='" + inventario.total + "', tipocambio='" + inventario.tipocambio + "',subtotaldlls='" + inventario.subtotaldlls + "', ivadlls='" + inventario.ivadlls + "', totaldlls='" + inventario.totaldlls + "', sucursal='" + inventario.sucursal + "', tipo='" + inventario.tipo + "', fecha='" + fecha + "' where iddetalleorigen=" + inventario.iddetalleorigen + ";"
    };

    this.posSVC.generarConsulta(consulta).subscribe(res=>{
      console.log(res);
    })


  }


  onEdit(row) {
     console.log(row);
     this.posSVC.detallesventasForm = row;
     this.posSVC.addedit = 'Editar'



/*
    this.ordenservicioService.detalleservicioForm = new DetalleServicios;
    this.ordenservicioService.detalleservicioForm = row;
    




    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    let dlg = this.dialog.open(AddeditproductoordenservicioComponent, dialogConfig);
    dlg.afterClosed().subscribe(resp => {
      this.refreshTablaProductos();
      this.totales()
    }) */

  }

  onDelete(row, index?) {

    // console.log(row);
    Swal.fire({
      title: '¿Borrar Detalles?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {

        let consulta = {
          'consulta':'delete from DetalleVentas where iddetalleventas ='+row.iddetalleventas
        };
        let consulta2 = {
          'consulta':'delete from inventarios where iddetalleorigen ='+row.iddetalleventas
        };
        
        console.log(consulta);
        console.log(consulta2);
        this.posSVC.generarConsulta(consulta).subscribe(res=>{
          this.posSVC.generarConsulta(consulta2).subscribe(resp=>{
            
            // this.files.splice(this.files.indexOf(event),1);
          });
        })
        
        Swal.fire({
          title: 'Borrado',
          icon: 'success',
          timer: 1000,
          showCancelButton: false,
          showConfirmButton: false
        }).then((result) => {
          this.refreshTablaProductos();
          
          
          
          
        })
        
        
      }
    })
    
  }
  
  refreshTablaProductos(){
    
    
    let consulta = {
      'consulta':"select DetalleVentas.*, Productos.* from DetalleVentas left join Productos on DetalleVentas.idproducto=Productos.idProductos where tipo='Producto' and DetalleVentas.idventas="+this.posSVC.ventasForm.idVentas
    };
    
    
    
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      // console.log(data);
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.posSVC.ventasForm.DetalleVentas = null;
      
      this.totales();
      
    })
    
    
    
    
  }
  
  totales() {
    let consulta = {
      'consulta':"select * from ventas where ventas.idVentas ="+this.posSVC.ventasForm.idVentas
    };
    
    this.posSVC.generarConsulta(consulta).subscribe((data:any)=>{
      // console.clear();
      // console.log('lista servicios',data);
      
      this.posSVC.master[0] = data[0];
      this.posSVC.master[0].DetalleVentas = [];
      let consulta = {
        'consulta':"select * from DetalleVentas where idVentas="+data[0].idVentas
      };

      this.posSVC.generarConsulta(consulta).subscribe((detallesresp:any)=>{
          for(let l=0; l<detallesresp.length;l++){
            this.posSVC.master[0].DetalleVentas.push(detallesresp[l]);
            // console.log('%c⧭', 'color: #73998c', this.ordenservicioService.master[0].DetalleServicios);
          }
          
          this.posSVC.ventasForm.DetalleVentas = []
          
          // console.log('%c⧭', 'color: #33cc99',  this.ordenservicioService.master[0].DetalleServicios);
          // console.log('%c⧭', 'color: #7f2200', this.ordenservicioService.servicioForm.DetalleServicios);
          // console.log('%c⧭', 'color: #e5de73', data[0].DetalleServicios);
          
      for (let i=0; i<this.posSVC.master[0].DetalleVentas.length;i++){
        
        // console.log('%c⧭', 'color: #514080', this.ordenservicioService.servicioForm.DetalleServicios);
        this.posSVC.ventasForm.DetalleVentas.push(this.posSVC.master[0].DetalleVentas[i])
      }
      console.log('%c⧭', 'color: #7f2200', this.posSVC.ventasForm);
      
    
    // // console.clear();
    console.log('%c⧭', 'color: #cc0088', this.posSVC.ventasForm);


      this.posSVC.ventasForm.subtotal = '0';
      this.posSVC.ventasForm.total = '0';
      this.posSVC.ventasForm.iva = '0';

   
      if (this.posSVC.ventasForm.DetalleVentas.length >= 1) {
        console.log('%c⧭', 'color: #8c0038', this.posSVC.ventasForm.DetalleVentas);
        for (let i = 0; i < this.posSVC.ventasForm.DetalleVentas.length; i++) {

        this.posSVC.ventasForm.subtotal = (+this.posSVC.ventasForm.subtotal + +this.posSVC.ventasForm.DetalleVentas[i].subtotal).toFixed(2);
        this.posSVC.ventasForm.total = (+this.posSVC.ventasForm.total + +this.posSVC.ventasForm.DetalleVentas[i].total).toFixed(2);
        this.posSVC.ventasForm.iva = (+this.posSVC.ventasForm.iva + +this.posSVC.ventasForm.DetalleVentas[i].iva).toFixed(2);
        console.log('%c%s', 'color: #7f7700', this.posSVC.ventasForm.total);
      }
      
      // console.log('%c⧭', 'color: #f279ca', this.ordenservicioService.servicioForm);
      }


      let servicio = this.posSVC.ventasForm
      let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString();
    console.log(fecha);
      //let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString().slice(0,10);
      let consulta = {
        'consulta':"update ventas set idCliente=" + servicio.idCliente + ",nombreCliente='" + servicio.nombreCliente + "',precioVenta='" + servicio.precioVenta + "',folio='" + servicio.folio + "',descripcion='" + servicio.descripcion + "',estatus='" + servicio.estatus + "',categoria1='" + servicio.categoria1 + "',categoria2='" + servicio.categoria2 + "',categoria3='" + servicio.categoria3 + "',tipo='" + servicio.tipo + "',fechaexpedicion='" + fecha + "',campoextra1='" + servicio.campoextra1 + "',campoextra2='" + servicio.campoextra2 + "',campoextra3='" + servicio.campoextra3 + "',subtotal='" + servicio.subtotal + "',iva='" + servicio.iva + "',total='" + servicio.total + "',subtotaldlls='" + servicio.subtotaldlls + "',ivadlls='" + servicio.ivadlls + "',totaldlls='" + servicio.totaldlls + "',clasificacion1='" + servicio.clasificacion1 + "',clasificacion2='" + servicio.clasificacion2 + "',clasificacion3='" + servicio.clasificacion3 + "', sucursal='" + servicio.sucursal + "'  where idVentas=" + servicio.idVentas+";"
      };
      console.log(consulta);
      
  
      this.posSVC.generarConsulta(consulta).subscribe()


      //this.posSVC.actualizarServicio(this.posSVC.ventasForm).subscribe();
    

  })
})
  }

  guardar(){
  

      // console.log(this.ordenservicioService.servicioForm);
      //localStorage.removeItem('idservicio')
      this.posSVC.ventasForm.estatus = 'Abierta';
      this.Estatus = this.posSVC.ventasForm.estatus;
      let servicio = this.posSVC.ventasForm;
      let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString();
    console.log(fecha);
      //let fecha = new Date(this.posSVC.ventasForm.fechaexpedicion).toISOString().slice(0,10);
      let consulta = {
        'consulta':"update ventas set idCliente=" + servicio.idCliente + ",nombreCliente='" + servicio.nombreCliente + "',precioVenta='" + servicio.precioVenta + "',folio='" + servicio.folio + "',descripcion='" + servicio.descripcion + "',estatus='" + servicio.estatus + "',categoria1='" + servicio.categoria1 + "',categoria2='" + servicio.categoria2 + "',categoria3='" + servicio.categoria3 + "',tipo='" + servicio.tipo + "',fechaexpedicion='" + fecha + "',campoextra1='" + servicio.campoextra1 + "',campoextra2='" + servicio.campoextra2 + "',campoextra3='" + servicio.campoextra3 + "',subtotal='" + servicio.subtotal + "',iva='" + servicio.iva + "',total='" + servicio.total + "',subtotaldlls='" + servicio.subtotaldlls + "',ivadlls='" + servicio.ivadlls + "',totaldlls='" + servicio.totaldlls + "',clasificacion1='" + servicio.clasificacion1 + "',clasificacion2='" + servicio.clasificacion2 + "',clasificacion3='" + servicio.clasificacion3 + "', sucursal='" + servicio.sucursal + "'  where idVentas=" + servicio.idVentas+";"
      };
      console.log(consulta);
      this.posSVC.generarConsulta(consulta).subscribe(res => {
        // console.log(res);
        if (res == 'Actualizacion Existosa') {



          Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: '' + this.posSVC.ventasForm.folio + '',
            timer: 1500
          })
          
          // console.log('%c%s', 'color: #997326', this.ordenservicioService.CEProds);


        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error: ' + res,
            icon: 'error',
          });
        }
      })

    
  }

  crearNuevaVenta(){
    
    let consulta = {
      'consulta':"select top 1 cast(folio as int) as folio from ventas order by folio desc"
    };
    console.log(consulta);
  

    this.posSVC.generarConsulta(consulta).subscribe((data:any) => {
      console.log(data);
  let folio    
if (data.length>0){
  folio = +data[0].folio + 1
}else{

  folio = 1;
}
      
      
 
      console.log(folio);
      this.ventaBlanco.folio = folio;
      let servicio = this.ventaBlanco
      let fecha = new Date().toISOString();
    console.log(fecha);
      //let fecha = new Date().toISOString().slice(0,10);
      // console.log(this.ordenSericioBlanco);
      let consulta = {
        'consulta':"insert into ventas OUTPUT inserted.* values("+servicio.idCliente+",'"+servicio.nombreCliente+"','"+servicio.precioVenta+"','"+servicio.folio+"','"+servicio.descripcion+"','"+servicio.estatus+"','"+servicio.categoria1+"','"+ servicio.categoria2+ "','"+ servicio.categoria3+ "','"+servicio.tipo+"','"+ fecha + "','"+servicio.campoextra1+"','"+ servicio.campoextra2+ "','"+ servicio.campoextra3+ "','"+servicio.subtotal+"','"+servicio.iva+"','"+servicio.total+"','"+servicio.subtotaldlls+"','"+servicio.ivadlls+"','"+servicio.totaldlls+"','"+servicio.clasificacion1+"','"+ servicio.clasificacion2+ "','"+ servicio.clasificacion3 + "', '" + servicio.sucursal + "') "
      };

      console.log(consulta);

      this.posSVC.ventasForm = this.ventaBlanco;
      this.posSVC.generarConsulta(consulta).subscribe(res => {
         console.log(res);
         this.posSVC.ventasForm = res[0];

         this.posSVC.detallesventasForm = new DetalleVentas;
         this.posSVC.detallesventasForm = {
           iddetalleventas: 0,
           idventas: this.posSVC.ventasForm.idVentas,
           idproducto: 0,
           nombreservicio: '',
           claveservicio: '',
           nombreproducto: '',
           claveproducto: '',
           precioProducto: '',
           cantidad: '',
           subtotal: '',
           iva: '',
           total: '',
           Observaciones: '',
           tipocambio: '',
           precioProductodlls: '',
           cantidaddlls: '',
           subtotaldlls: '',
           ivadlls: '',
           totaldlls: '',
         }
     
         /* this.ordenservicioService.detalleservicioForm.idservicio = this.ordenservicioService.servicioForm.idServicio; */
    this.Estatus = this.posSVC.ventasForm.estatus;
    this.posSVC.addedit = 'Agregar'
    this.refreshTablaProductos();
      
        //this.ObtenerUltimoServicio();
      });
    });
  }


  pagar(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="80%";
    let dlg = this.dialog.open(PospagoventaComponent, dialogConfig);
    dlg.afterClosed().subscribe(resp=>{
    this.refreshTablaProductos();
    this.Estatus = this.posSVC.ventasForm.estatus;
    if (this.Estatus=='Pagada'){
      this.crearNuevaVenta();
    }
    })
  }

  onAddCliente(){

    this.posSVC.clientesForm = new Cliente();
    this.posSVC.addeditclientes = 'Agregar';

const dialogConfig = new MatDialogConfig();
dialogConfig.disableClose = false;
dialogConfig.autoFocus = true;
dialogConfig.width="70%";
let dlg = this.dialog.open(PosaddeditclientesComponent, dialogConfig);
dlg.afterClosed().subscribe(resp=>{
  let event = {isUserInput:true}
  this.onSelectionChange(this.posSVC.clientesForm, event)
})

  }


  verHistorial(){

    const dialogConfig = new MatDialogConfig();
dialogConfig.disableClose = false;
dialogConfig.autoFocus = true;
dialogConfig.width="70%";
let dlg = this.dialog.open(PoshistoricoventasComponent, dialogConfig);
dlg.afterClosed().subscribe(resp=>{
  /* let event = {isUserInput:true}
  this.onSelectionChange(this.posSVC.clientesForm, event) */
  console.log(resp);
  if (resp){

    this.posSVC.ventasForm = resp
    this.Estatus = this.posSVC.ventasForm.estatus;
    this.refreshTablaProductos();
  }
})

  }

  verSaldos(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width="70%";
    let dlg = this.dialog.open(PossaldosclientesComponent, dialogConfig);
    dlg.afterClosed().subscribe(resp=>{
      /* let event = {isUserInput:true}
      this.onSelectionChange(this.posSVC.clientesForm, event) */
      console.log(resp);
    
    })

  }


 
  



}
