import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-documentoscliente',
  templateUrl: './documentoscliente.component.html',
  styleUrls: ['./documentoscliente.component.css']
})
export class DocumentosclienteComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  token;

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
  }

}
