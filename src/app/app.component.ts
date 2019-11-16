import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'Auto - Grader Project';
  x = 0; 
  y = 0;
  zoom_to = 0.75;
  pdfSrc:string = null;
  types = ['select-type', 'true/false','single-correct', 'multiple-correct']
  selectedFile:File = null;
  myForm: FormGroup;
  imgArray:string[] = new Array(1);
  imgindex = 0;
  
  constructor(private http: HttpClient){
 	this.myForm = new FormGroup({
 		xref11: new FormControl(0),
 		yref11: new FormControl(0),
    xref21: new FormControl(0),
    yref21: new FormControl(0),
 		type: new FormControl(this.types[0]),
    uid : new FormControl(1)
 	});
   this.imgArray[0]= "http://localhost:3000/default.jpg";
 }

 getSrc(){
   return this.imgArray[this.imgindex];
 }
  setRef1(){
  	//this.myForm.setValue(xref11:) will not work; set Value requires all fields.
  	console.log("function 1 is called");
  	this.myForm.patchValue({xref11:this.x,yref11:this.y});
  }
  
  setRef2(){
    console.log("function 2 is called");
    this.myForm.patchValue({xref21:this.x,yref21:this.y});
  }
  onFileSelected2(event){
  /*let $img: any = document.querySelector('#file');

  if (typeof (FileReader) !== 'undefined') {
    let reader = new FileReader();

    reader.onload = (event: any) => {
      this.pdfSrc = event.target.result;
    };

    reader.readAsArrayBuffer($img.files[0]);
  	}*/
    this.selectedFile=<File>event.target.files[0];
    
    //does this -- $img.files[0] work?? Check later.
  }
  showcoord(event){
   	this.x = (event.pageX - document.getElementById("pdfdisplay").offsetLeft);

  	this.y = (event.pageY - document.getElementById("pdfdisplay").offsetTop);

    console.log("X:" + (event.pageX - document.getElementById("pdfdisplay").offsetLeft));
    
    console.log("Y:" + (event.pageY - document.getElementById("pdfdisplay").offsetTop));
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
    fd.append('xref21', this.myForm.get('xref21').value);
    fd.append('yref21', this.myForm.get('yref21').value);
    fd.append('qtype', this.myForm.get('type').value);
    fd.append('roll', this.myForm.get('uid').value);
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
    this.http.post('http://localhost:3000/upload', fd).subscribe(res =>{
      console.log(res);
    });
    
    this.http.get<any>('http://localhost:3000/process').subscribe(
      res =>{
        for(var i = 0; i< res.length; i++){
          this.imgArray[i] = res.imgArr[i];
        }
        console.log(res);
        //console.log(this.imgArray);
        this.show();
        },
      err=>{
        console.log(err);
      }
      );
  }
  currimg : any="";
  show(){
    //console.log(this.imgArray[this.imgindex]);
    document.getElementById('show_image').setAttribute('src', this.imgArray[this.imgindex]);
  }
  next(){
    if(this.imgindex<this.imgArray.length-1){
      this.imgindex = this.imgindex  + 1;
    }
    this.show();
    
  }
  prev(){
    if(this.imgindex>0){
      this.imgindex = this.imgindex - 1;
    }
    this.show();
  }
  Evaluate(){
    console.log("Evaluate function working");
    this.http.get('http://localhost:3000/startml').subscribe(
      res =>{
          console.log(res);
      },
      err =>{
        console.log("Error: " + err);
      }
    )
  }
  
}
