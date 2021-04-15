import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProcesoService } from '../../../../services/permisos/procesos.service';
import { Proceso } from '../../../../Models/proceso-model';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UsuariosServieService } from 'src/app/services/catalogos/usuarios-servie.service';
import { procesoMasterDetalle } from '../../../../Models/procesomaster-model';
import { Privilegio } from '../../../../Models/privilegio-model';
import { CalendarioService } from '../../../../services/calendario/calendario.service';
import { Calendario } from '../../../../Models/calendario/calendario-model';
import { SidebarService } from '../../../../services/shared/sidebar.service';




@Component({
  selector: 'app-show-usuario-privilegio',
  templateUrl: './show-usuario-privilegio.component.html',
  styleUrls: ['./show-usuario-privilegio.component.css']
})
export class ShowUsuarioPrivilegioComponent implements OnInit {

  arrayArea: Array<any> = [];
  id:number;
  PermisoBool :boolean;

  constructor(public service: ProcesoService, private service2:UsuariosServieService, public dialogbox: MatDialogRef<ShowUsuarioPrivilegioComponent>,
     private dialog: MatDialog, public CalendarioService: CalendarioService, private SidebarService:SidebarService) {


  }




  ngOnInit() {
    this.refreshProcesosList()
    // console.log(this.service.master);



    // if (this.service.formData.IVA == '0.16'){
      // this.iva = true;
    // }else{
      // this.iva = false;
    // }

  }

  onClose() {
    this.dialogbox.close();
    // this.service.filter('Register click');
  }

  checkbox(event,f,i,b){
  //  console.log(event);
  //  console.log(f);
  //  console.log(i);
   if (event.checked){
     this.service.master[f].Modulo[i].NombreProcesos[b].PermisoBool = true;
     this.onAdd(this.service2.formData.IdUsuario, this.service.master[f].Modulo[i].NombreProcesos[b].IdProcesos)
   }else{
    this.service.master[f].Modulo[i].NombreProcesos[b].PermisoBool = false;
    this.onDelete(this.service2.formData.IdUsuario, this.service.master[f].Modulo[i].NombreProcesos[b].IdProcesos)
   }
  }

  onDelete(f,i){
    //solo se pasa como parametro la posicion en la que esta ya que estas indican el usuario y el proceso
  this.service.PermisoDelete(f, i).subscribe(res =>{
    console.log('%c%s', 'color: #7f2200', res);
    
    this.SidebarService.filter('Register click');
    // this.refreshProcesosList();
 })
  }

onAdd(f,i){
  // console.log(f, i);
  this.service.PermisoPost(f,i).subscribe(res =>{
    
    this.SidebarService.filter('Register click');
    console.log('%c%s', 'color: #994d75', res);
    //Obtener nombre de usuario
    this.CalendarioService.getUsuarioId(f).subscribe(usuarioId=>{
      // console.log(usuarioId[0]);
      //Verificar si ya existe un calendario para ese usuario en ese modulo en especifico
      this.service.GetProcesoIdProceso(i).subscribe(proc=>{
        // console.log(proc[0]);
        this.CalendarioService.getCalendarioProceso(usuarioId[0].NombreUsuario, proc[0].Area, proc[0].NombreProceso).subscribe(resCalendario=>{
          // console.log(resCalendario);
          if(resCalendario.length>0){
            // console.log('YA EXISTE CALENDARIO USUARIO');
          }else{
            // console.log('NO EXISTE CALENDARIO USUARIO');
        let calendario = new Calendario();
        calendario.Modulo = proc[0].Area;
        calendario.NombreCalendario = proc[0].Area;
        calendario.NombreUsuario = usuarioId[0].NombreUsuario;
        this.CalendarioService.addCalendario(calendario).subscribe(resCa=>{
          // console.log(resCa);
        })
          }
        });
      });
    });
    //si no existe, se crea
    //si existe, no pasa nada
    // this.refreshProcesosList();
  });
}


   refreshProcesosList() {
     this.service.master = [];
     this.service.showAreaPrivilegio().subscribe(data => {
      //  console.log('%c⧭', 'color: #00b300', data);
       
       
       for (let i = 0; i < data.length; i++) {
         this.arrayArea.push(data[i].Area)
         this.service.master[i] = data[i]


         this.service.master[i].Modulo = [];
         this.service.GetProcesoNombre(data[i].Area, this.service2.formData.IdUsuario).subscribe(res =>{
          //  console.log('%c⧭', 'color: #1d5673', res);
           
           for (let l = 0; l <=res.length-1; l++){
             //  console.log(res[l].IdUsuario);
             // this.checkbox(res[l].IdUsuario);
             //  this.PermisoBool=true;
            //  this.service.master[i].Modulo.forEach((element,p) => {               
              //  console.log(this.service.master[i].Modulo[p].Modulo.find(modulo => modulo == res[l].Modulo));
            // });
            //  console.log(this.service.master[i].Modulo.find(modulo => modulo.Modulo == res[l].Modulo));
             if(this.service.master[i].Modulo.find(modulo => modulo.Modulo == res[l].Modulo)){
              //  console.log('SE ENCONTRO VALOR. NO HACER PUSH');
              }else{
                // console.log('NO HAY VALORES. HACER PUSH');
                let nombreModulo = {
                  Modulo: res[l].Modulo,
                  NombreProcesos: []
                } 
                this.service.master[i].Modulo.push(nombreModulo);                
                // let index = this.service.master[i].Modulo.indexOf(this.service.master[i].Modulo.find(modulo => modulo.Modulo == res[l].Modulo));
                // console.log(index);
                // this.service.master[i].Modulo[index].NombreProcesos = new Array();            
                // this.service.master[i].Modulo[l] = res[l].Modulo;                
              }
              // this.service.master[i].Modulo[l].NombreProcesos = [];
              
              // this.service.master[i].NombreProcesos.push(res[l]);
              //por default el valor de permisobool sera true
              // this.service.master[i].NombreProcesos[l].PermisoBool = true
              // if(res[l].IdUsuario == null ){
                //       this.service.master[i].NombreProcesos[l].PermisoBool = false
                // }else{
                  //   this.service.master[i].NombreProcesos[l].PermisoBool = true
                  // }
                  // console.log(res);
                }
                // console.log(this.service.master[i].Modulo);
                // this.service.master[i].Modulo.forEach((element, b )=> {
                //   this.service.master[i].Modulo[b].NombreProcesos = [];                                  
                // });
                res.forEach((element, a) => {            
                  // var index:number = this.array.indexOf(this.array.find(x => x.idP == id));      
                  let index = this.service.master[i].Modulo.indexOf(this.service.master[i].Modulo.find(modulo => modulo.Modulo == res[a].Modulo));
                  if(res[a].IdUsuario == null ){
                    element.PermisoBool = false;
                  }else{
                    element.PermisoBool = true;
                  }
                  this.service.master[i].Modulo[index].NombreProcesos.push(element);
                });

              
              }) //fin del for anidado
            } //fin del main for
            console.log('%c⧭', 'color: #f200e2', this.service.master);             


          
         
     });


   }

  //  refreshProcesosList() {
  //    this.service.master = [];
  //    this.service.showAreaPrivilegio().subscribe(data => {
  //      console.log('%c⧭', 'color: #00b300', data);
       
       
  //      for (let i = 0; i < data.length; i++) {
  //        this.arrayArea.push(data[i].Area)
  //        this.service.master[i] = data[i]


  //        this.service.master[i].NombreProcesos = [];
  //          this.service.GetProcesoNombre(data[i].Area, this.service2.formData.IdUsuario).subscribe(res =>{
  //          console.log('%c⧭', 'color: #1d5673', res);
        
  //            for (let l = 0; l <=res.length-1; l++){
  //             //  console.log(res[l].IdUsuario);
  //             // this.checkbox(res[l].IdUsuario);
  //             //  this.PermisoBool=true;

  //             this.service.master[i].NombreProcesos.push(res[l]);
  //             //por default el valor de permisobool sera true
  //             this.service.master[i].NombreProcesos[l].PermisoBool = true
  //             if(res[l].IdUsuario == null ){
  //                   this.service.master[i].NombreProcesos[l].PermisoBool = false
  //             }else{
  //               this.service.master[i].NombreProcesos[l].PermisoBool = true
  //             }
  //             // console.log(res);
  //            }
  //           }) //fin del for anidado
  //         } //fin del main for


          
         
  //    });


  //  }







}
