import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Auto - Grader Project';
  x = 0; 
  y = 0;
  zoom_to = 1;
  pdfSrc:string = null;
  myForm:FormGroup;
  types = ['single-correct', 'multiple-correct', 'true/false']

 constructor(){
 	this.myForm = this.createFormGroup();
 }

 createFormGroup(){
 	return new FormGroup({
 		xref11: new FormControl(),
 		yref11: new FormControl(),
 		page: new FormControl(),
 		type: new FormControl(),
 	});
 }
 
 
  setRef1(event){
  	
  }






  onFileSelected2(){
  let $img: any = document.querySelector('#file');

  if (typeof (FileReader) !== 'undefined') {
    let reader = new FileReader();

    reader.onload = (event: any) => {
      this.pdfSrc = event.target.result;
    };

    reader.readAsArrayBuffer($img.files[0]);
  	}

  }
  showcoord(event){
  	this.x = event.clientX;
  	this.y = event.clientY;
  }
  zoom_in(){
  	this.zoom_to = this.zoom_to + 0.1;
  }
  zoom_out(){
  	if(this.zoom_to > 0.5){
  		this.zoom_to = this.zoom_to - 0.1;
  	}
  }
  
}
