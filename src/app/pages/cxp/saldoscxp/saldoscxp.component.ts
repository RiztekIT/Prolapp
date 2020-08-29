import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-saldoscxp',
  templateUrl: './saldoscxp.component.html',
  styles: []
})
export class SaldoscxpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  fileContent: string = '';

  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function(x) {
      self.fileContent = fileReader.result;
    }
    fileReader.readAsText(file);
  }

}
