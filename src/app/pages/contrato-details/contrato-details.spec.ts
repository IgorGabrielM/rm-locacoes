import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoDetails } from './contrato-details';

describe('ContratoDetails', () => {
  let component: ContratoDetails;
  let fixture: ComponentFixture<ContratoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContratoDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratoDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
