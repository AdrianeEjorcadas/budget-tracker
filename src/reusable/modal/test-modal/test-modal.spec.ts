import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestModal } from './test-modal';

describe('TestModal', () => {
  let component: TestModal;
  let fixture: ComponentFixture<TestModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
