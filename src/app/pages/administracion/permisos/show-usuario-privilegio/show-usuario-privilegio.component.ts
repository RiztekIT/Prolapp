import { Component, OnInit, ViewChild } from '@angular/core';
import { ProcesoService } from '../../../../services/permisos/procesos.service';
import { Proceso } from '../../../../Models/proceso-model';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-show-usuario-privilegio',
  templateUrl: './show-usuario-privilegio.component.html',
  styleUrls: ['./show-usuario-privilegio.component.css']
})
export class ShowUsuarioPrivilegioComponent implements OnInit {

arrayArea: Array<any> = [];

  constructor(public service: ProcesoService) {

    this.service.listen().subscribe((m: any) => {
      // console.log(m);
      this.refreshProcesosList();
    });

  }




  ngOnInit() {
    this.refreshProcesosList();
  }

  refreshProcesosList() {

    this.service.getProcesoList().subscribe(data => {

     for (var i = 0; i < data.length; i++) {
       this.arrayArea.push(data[i].Area)
       }
    });
  
  

  }


}
