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
  pdfSrc:string = null;
  types = ['select-type', 'true/false', 'MCQ']
  selectedFile:File = null;
  myForm: FormGroup;
  imgArray:string[] = new Array(1);
  imgindex = 0;
  score = 0;
  results:string[] = new Array(1);
  qno = 0;
  i = 0;
  bulkSelectedFiles:File[] = null;
  newresults:string[][] = new Array(1);
  
  constructor(private http: HttpClient){
   this.myForm = new FormGroup({
    xref11: new FormControl(0),
    yref11: new FormControl(0),
    xref21: new FormControl(0),
    yref21: new FormControl(0),
    uid : new FormControl(1),
    ans : new FormControl('-'),
    page: new FormControl(0),
    qtype: new FormControl(this.types[0])
   });
   this.imgArray[0] = "../assets/default.jpg";
   this.results[0] = "Not Evaluated";
   this.newresults = [["NA"]];
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
    this.http.get('http://localhost:3000/startapp').subscribe(
      res =>{
        console.log(res);
      },
      err=>{
        console.log(err);
      }
     );
    //does this -- $img.files[0] work?? Check later.
  }
  showcoord(event){
     this.x = (event.pageX - document.getElementById("pdfdisplay").offsetLeft);

    this.y = (event.pageY - document.getElementById("pdfdisplay").offsetTop);

    console.log("X:" + (event.pageX - document.getElementById("pdfdisplay").offsetLeft));
    
    console.log("Y:" + (event.pageY - document.getElementById("pdfdisplay").offsetTop));
  }
  OnSend(){
    console.log("Send button working");
    this.qno = this.qno + 1;
    const fd = new FormData();
    this.myForm.patchValue({page:this.imgindex});
    fd.append('page', this.myForm.get('page').value);
    fd.append('xref11', this.myForm.get('xref11').value);
    fd.append('yref11', this.myForm.get('yref11').value);
    fd.append('xref21', this.myForm.get('xref21').value);
    fd.append('yref21', this.myForm.get('yref21').value);
    fd.append('roll', this.myForm.get('uid').value);
    fd.append('ans',this.myForm.get('ans').value);
    fd.append('qtype', this.myForm.get('qtype').value);
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
    this.http.get<any>('http://localhost:3000/setdate').subscribe( 
      res =>{
        if( res.status==true){

          this.http.post<any>('http://localhost:3000/upload', fd).subscribe(res =>{
            console.log(res);

            if(res.status == true){
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
                });
             }

          });

        }
      });
    
    
    
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

  Finish(){
    document.getElementById('split-right').style.display='none';
    document.getElementById('uploadpdf').style.display='none';
    document.getElementById('eval').style.display='inline-block';
    document.getElementById('pdfdisplay').style.display='none';
    document.getElementById('devs').style.position='relative';
    document.getElementById('devs').style.top='50%';
  }
 onFileSelectedMultiple(event:any){
   this.bulkSelectedFiles = event.target.files;
   console.log("Files selected in Bulk");
   console.log(this.bulkSelectedFiles);
 }
 OnUploadMultiple(){
   this.http.get<any>('http://localhost:3000/setdate').subscribe(
     res=>{
       if(res.status == true){
         var payload  = new FormData;
         for(var i = 0; i<this.bulkSelectedFiles.length;i++){
             payload.append('pdf', this.bulkSelectedFiles[i], this.bulkSelectedFiles[i].name);
           }
         this.http.post<any>('http://localhost:3000/uploadmultiple', payload).subscribe(
             res=>{
               if(res.status==true){
                this.http.get<any>('http://localhost:3000/startprocess').subscribe(
                  res=>{
                    if(res.status==true){

                    }
                    console.log(res);
                  });
               }
               console.log(res);
          });
       }
      console.log(res);
    });
   
 }
 Evaluate(){
   console.log("new evaluate starts")
    this.http.get<any>('http://localhost:3000/startml2').subscribe(
      res=>{
        console.log(res);
    });
 }
 ShowResult(){
   this.http.get<any>('http://localhost:3000/fetchar').subscribe(res=>
   {
     this.newresults = [];
     this.newresults.push(res.newar);
     document.getElementById('score').style.display='inline-block';
     console.log(res);
   });
 }
 Align(){
   this.http.get<any>('http://localhost:3000/align').subscribe(
      res =>{
        if(res.status==true){
          document.getElementById('final').style.display='inline-block';
        }
        console.log(res);
      });
 }
}