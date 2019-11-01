import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

function hello() {
    alert('Hello!!!');
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Auto - Grader Project';
  x = 0; 
  y = 0;
  zoom_to = 0.75;
  pdfSrc:string = null;
  types = ['select-type', 'true/false','single-correct', 'multiple-correct']

 myForm: FormGroup;

 constructor(){
 	this.myForm = new FormGroup({
 		xref11: new FormControl(0),
 		yref11: new FormControl(0),
 		type: new FormControl(this.types[0])
 	});
 }
 
  coord = {
 	'xref11': this.x,
 	'yref11': this.y
 };
  setRef1(){
  	//this.myForm.setValue(xref11:)
  	console.log("function is called");
  	this.myForm.patchValue({xref11:this.x,yref11:this.y});
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
  OnSubmit(){
  	hello();
  }
  cord(event){
  	console.log("working");
  	console.log("X:" + this.x);
  	console.log("Y:" + this.y);
  }
  
}
