import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { GuardService } from '../guard.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let guardService: GuardService;

  beforeEach(async () => {
    const guardServiceMock = {
      getUserId: jasmine.createSpy('getUserId').and.returnValue(123),
      getUserById: jasmine.createSpy('getUserById').and.returnValue(of({ nombre: 'Usuario' }))
    };

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), HttpClientModule],
      providers: [
        { provide: GuardService, useValue: guardServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    guardService = TestBed.inject(GuardService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load user successfully', async () => {
    await component.loadUser();
    expect(component.user.nombre).toBe('Usuario');
    expect(guardService.getUserId).toHaveBeenCalled();
    expect(guardService.getUserById).toHaveBeenCalledWith(123);
  });

  it('should handle error when loading user', async () => {
    (guardService.getUserById as jasmine.Spy).and.returnValue(throwError('Error'));
    await component.loadUser();
    expect(component.user.nombre).toBe('Invitado');
    expect(guardService.getUserId).toHaveBeenCalled();
    expect(guardService.getUserById).toHaveBeenCalledWith(123);
  });

  it('should initialize the map and search box', fakeAsync(() => {
    spyOn(component, 'setupSearchBox');
    component.loadMap();
    tick(300); // Simula el paso del tiempo
    expect(component.setupSearchBox).toHaveBeenCalled();
  }));
});
