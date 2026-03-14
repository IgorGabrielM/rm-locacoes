import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContrato } from './form-contrato';

describe('FormContrato', () => {
  let component: FormContrato;
  let fixture: ComponentFixture<FormContrato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormContrato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormContrato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
