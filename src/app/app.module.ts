import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PdfUploaderComponent } from './pdf-uploader/pdf-uploader.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReactiveFormsModule, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    PdfUploaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PdfViewerModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
