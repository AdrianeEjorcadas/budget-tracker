import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerDownError } from './server-down-error';

describe('ServerDownError', () => {
  let component: ServerDownError;
  let fixture: ComponentFixture<ServerDownError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerDownError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerDownError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
