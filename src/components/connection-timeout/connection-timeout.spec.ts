import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionTimeout } from './connection-timeout';

describe('ConnectionTimeout', () => {
  let component: ConnectionTimeout;
  let fixture: ComponentFixture<ConnectionTimeout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionTimeout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionTimeout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
