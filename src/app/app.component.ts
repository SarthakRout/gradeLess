import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  selectedFile:File = null;
  myForm: FormGroup;

 constructor(private http: HttpClient){
 	this.myForm = new FormGroup({
 		xref11: new FormControl(0),
 		yref11: new FormControl(0),
 		type: new FormControl(this.types[0])
 	});

 }

 
  
  setRef1(){
  	//this.myForm.setValue(xref11:)
  	console.log("function is called");
  	this.myForm.patchValue({xref11:this.x,yref11:this.y});
  }
  onFileSelected2(event){
  let $img: any = document.querySelector('#file');

  if (typeof (FileReader) !== 'undefined') {
    let reader = new FileReader();

    reader.onload = (event: any) => {
      this.pdfSrc = event.target.result;
    };

    reader.readAsArrayBuffer($img.files[0]);
  	}
    this.selectedFile=<File>event.target.files[0];
    //does this -- $img.files[0] work?? Check later.
  }
  showcoord(event){
  	this.x = event.clientX;
  	this.y = event.clientY;
  	console.log("X:" + this.x);
  	console.log("Y:" + this.y);
  	console.log("X:" + event.screenX);
  	console.log("Y:" + event.screenY);
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
    console.log("Send button working");
    const fd = new FormData();
    fd.append('xref11', this.myForm.get('xref11').value);
    fd.append('yref11', this.myForm.get('yref11').value);
    fd.append('qtype', this.myForm.get('type').value);
    this.http.post('http://localhost:3000', fd).subscribe(
      res =>{
      console.log(res);
    });
  }
  cord(event){
  	console.log("working");
  	console.log("X:" + this.x);
  	console.log("Y:" + this.y);
  }
  onUpload(){
    console.log("Upload button working");
    const fd = new FormData();
    fd.append('pdf', this.selectedFile, this.selectedFile.name);
    this.http.post('localhost:3000', fd).subscribe(res =>{
      console.log(res);
    });
  }
  
}
