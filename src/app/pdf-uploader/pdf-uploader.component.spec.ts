import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfUploaderComponent } from './pdf-uploader.component';

describe('PdfUploaderComponent', () => {
  let component: PdfUploaderComponent;
  let fixture: ComponentFixture<PdfUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
