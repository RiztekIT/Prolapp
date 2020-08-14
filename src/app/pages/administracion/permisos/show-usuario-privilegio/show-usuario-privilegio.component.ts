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
     private dialog: MatDialog, public CalendarioService: CalendarioService) {


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
    this.service.filter('Register click');
  }

  checkbox(event,f,i){
  //  console.log(event);
  //  console.log(f);
  //  console.log(i);
   if (event.checked){
     this.service.master[f].NombreProcesos[i].PermisoBool = true;
     this.onAdd(this.service2.formData.IdUsuario, this.service.master[f].NombreProcesos[i].IdProcesos)
   }else{
    this.service.master[f].NombreProcesos[i].PermisoBool = false;
    this.onDelete(this.service2.formData.IdUsuario, this.service.master[f].NombreProcesos[i].IdProcesos)
   }
  }

  onDelete(f,i){
    //solo se pasa como parametro la posicion en la que esta ya que estas indican el usuario y el proceso
  this.service.PermisoDelete(f, i).subscribe(res =>{
    this.refreshProcesosList();
 })
  }

onAdd(f,i){
  // console.log(f, i);
  this.service.PermisoPost(f,i).subscribe(res =>{
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
    this.refreshProcesosList();
  });
}


   refreshProcesosList() {
     this.service.master = [];
     this.service.showAreaPrivilegio().subscribe(data => {
       
       
       for (let i = 0; i < data.length; i++) {
         this.arrayArea.push(data[i].Area)
         this.service.master[i] = data[i]


         this.service.master[i].NombreProcesos = [];
           this.service.GetProcesoNombre(data[i].Area, this.service2.formData.IdUsuario).subscribe(res =>{
        
             for (let l = 0; l <=res.length-1; l++){
              //  console.log(res[l].IdUsuario);
              // this.checkbox(res[l].IdUsuario);
              //  this.PermisoBool=true;

              this.service.master[i].NombreProcesos.push(res[l]);
              //por default el valor de permisobool sera true
              this.service.master[i].NombreProcesos[l].PermisoBool = true
              if(res[l].IdUsuario == null ){
                    this.service.master[i].NombreProcesos[l].PermisoBool = false
              }else{
                this.service.master[i].NombreProcesos[l].PermisoBool = true
              }
              // console.log(res);
             }
            }) //fin del for anidado
          } //fin del main for


          
         
     });


   }







}
