import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProcesoService } from '../../../../services/permisos/procesos.service';
import { Proceso } from '../../../../Models/proceso-model';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UsuariosServieService } from 'src/app/services/catalogos/usuarios-servie.service';
import { procesoMasterDetalle } from '../../../../Models/procesomaster-model';



@Component({
  selector: 'app-show-usuario-privilegio',
  templateUrl: './show-usuario-privilegio.component.html',
  styleUrls: ['./show-usuario-privilegio.component.css']
})
export class ShowUsuarioPrivilegioComponent implements OnInit {

  arrayArea: Array<any> = [];
  id:number;
  PermisoBool :boolean;

  constructor(public service: ProcesoService, private service2:UsuariosServieService, public dialogbox: MatDialogRef<ShowUsuarioPrivilegioComponent>, private dialog: MatDialog) {


  }




  ngOnInit() {
    this.refreshProcesosList()
    console.log(this.service.master);



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
   console.log(event);
   console.log(f);
   console.log(i);
   if (event.checked){
     this.service.master[f].NombreProcesos[i].PermisoBool = true;
   }else{
    this.service.master[f].NombreProcesos[i].PermisoBool = false;
   }
console.log(this.service.master);


  }

   refreshProcesosList() {
     this.service.master = [];
     this.service.showAreaPrivilegio().subscribe(data => {
       console.log(data);
       
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
              this.service.master[i].NombreProcesos[l].PermisoBool = true
              if(res[l].IdUsuario == null ){
                    // this.service.master[i].PermisoBool = false;
                    this.service.master[i].NombreProcesos[l].PermisoBool = false
              }else{
                // this.service.master[i].PermisoBool = true;
                this.service.master[i].NombreProcesos[l].PermisoBool = true
              }
              // console.log(res);
             }
            })
          }
          
         
     });


   }







}
