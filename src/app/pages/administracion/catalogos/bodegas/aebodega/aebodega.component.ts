import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { BodegasService } from '../../../../../services/catalogos/bodegas.service';
import { Bodega } from '../../../../../Models/catalogos/bodegas-model';
import { Form, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aebodega',
  templateUrl: './aebodega.component.html',
  styleUrls: ['./aebodega.component.css']
})
export class AEBodegaComponent implements OnInit {

  BodegaInfo;
  tipoAE;
  tipo;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public BodegaService: BodegasService,
    public dialogbox: MatDialogRef<AEBodegaComponent>,
    ) { }

  ngOnInit() {
    this.BodegaInfo = this.data;
    this.tipoAE = this.BodegaInfo.tipo

    this.tipo = this.tipoAE;

    console.log(this.BodegaInfo.data);
    console.log('this.tipoAE: ', this.tipoAE);

    this.IdentificartipoModal(this.BodegaInfo.data, this.tipoAE)
  }

  IdentificartipoModal(bodegaInfo: Bodega, tipoAE: string){

if(tipoAE == 'Editar'){

  this.ModalEdit(bodegaInfo);
}
// en este caso no se requirio el identificar agregar ya que debe estar los campos en blancos y 
// no requiere alguna funcion en especifico


  }

  ModalEdit(bodegainfo: Bodega){
    console.log(bodegainfo);
    this.BodegaService.formData = bodegainfo
  }




  BotonAE(){
    if (this.tipoAE == 'Editar') {
      console.log('this.BodegaService.formData: ', this.BodegaService.formData);
      this.BodegaService.editBodega(this.BodegaService.formData).subscribe(res=> {
        console.log(res);
      })
      Swal.fire({
        title: 'Bodega Actualizada',
        icon: 'success',
        timer: 1000
      })
      
    } else {
      console.log('this.BodegaService.formData: ', this.BodegaService.formData);
      this.BodegaService.formData.IdBodega = 0;
      this.BodegaService.addBodega(this.BodegaService.formData).subscribe(res=> {
        console.log(res);
      })
      
      Swal.fire({
        title: 'Bodega Agregada',
        icon: 'success',
        timer: 1000
      })
    }
    
    this.BodegaService.filter('Register click');
    this.resetForm()
    this.onClose();
  }

  resetForm(form?: NgForm) {
    if (form != null)
   form.resetForm();
   this.BodegaService.formData  = {
     IdBodega: 0,
     Nombre: '',
     Direccion: '',
     Origen: ''
   }

  }

  onClose() {
    this.dialogbox.close();
    this.resetForm()
    
  }



}
