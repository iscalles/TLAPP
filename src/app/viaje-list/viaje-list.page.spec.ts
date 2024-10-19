import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeListPage } from './viaje-list.page';

describe('ViajeListPage', () => {
  let component: ViajeListPage;
  let fixture: ComponentFixture<ViajeListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
