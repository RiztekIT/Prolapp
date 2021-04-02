import { Component, OnInit } from '@angular/core';

declare function todo();

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styles: []
})
export class AgendaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    todo();
  

 
  }

}
