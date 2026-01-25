import { TestBed } from '@angular/core/testing';
import { AlertService, AlertIcon, AlertOptions } from './alert.service';
import Swal from 'sweetalert2';

describe('AlertService', () => {
  let service: AlertService;
  let swalFireSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService]
    });
    service = TestBed.inject(AlertService);

    // Mock Swal.fire
    swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('alert', () => {
    it('should show success alert', () => {
      const options: AlertOptions = {
        title: 'Success!',
        text: 'Operation successful',
        icon: AlertIcon.Success
      };

      service.alert(options);

      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Success!',
        html: 'Operation successful',
        icon: 'success'
      }));
    });

    it('should show error alert', () => {
      const options: AlertOptions = {
        title: 'Error!',
        text: 'Something went wrong',
        icon: AlertIcon.Error
      };

      service.alert(options);

      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Error!',
        html: 'Something went wrong',
        icon: 'error'
      }));
    });

    it('should show warning alert', () => {
      const options: AlertOptions = {
        title: 'Warning!',
        text: 'Be careful',
        icon: AlertIcon.Warning
      };

      service.alert(options);

      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Warning!',
        html: 'Be careful',
        icon: 'warning'
      }));
    });

    it('should show info alert with default icon', () => {
      const options: AlertOptions = {
        title: 'Info',
        text: 'Just so you know'
      };

      service.alert(options);

      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Info',
        html: 'Just so you know',
        icon: AlertIcon.Information
      }));
    });
  });

  describe('alertPopup', () => {
    it('should show popup with timer', () => {
      const options: AlertOptions = {
        title: 'Saved!',
        icon: AlertIcon.Success
      };

      service.alertPopup(options);

      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Saved!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      }));
    });
  });

  describe('toastAlert', () => {
    it('should show toast alert', () => {
      const options: AlertOptions = {
        title: 'Toast Message',
        icon: AlertIcon.Success
      };

      service.toastAlert(options);

      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Toast Message',
        icon: 'success',
        toast: true,
        timer: 3000,
        showConfirmButton: false
      }));
    });
  });

  describe('yesOrNoAlert', () => {
    it('should return true when confirmed', async () => {
      swalFireSpy.and.returnValue(Promise.resolve({ isConfirmed: true } as any));

      const options: AlertOptions = {
        title: 'Confirm',
        text: 'Are you sure?'
      };

      const result = await service.yesOrNoAlert(options);

      expect(result).toBe(true);
      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Confirm',
        html: 'Are you sure?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }));
    });

    it('should return false when cancelled', async () => {
      swalFireSpy.and.returnValue(Promise.resolve({ isConfirmed: false } as any));

      const options: AlertOptions = {
        title: 'Confirm',
        text: 'Are you sure?'
      };

      const result = await service.yesOrNoAlert(options);

      expect(result).toBe(false);
    });

    it('should return false when dismissed', async () => {
      swalFireSpy.and.returnValue(Promise.resolve({ isConfirmed: false, isDismissed: true } as any));

      const options: AlertOptions = {
        title: 'Delete',
        text: 'Delete this item?'
      };

      const result = await service.yesOrNoAlert(options);

      expect(result).toBe(false);
    });

    it('should work with question icon', async () => {
      swalFireSpy.and.returnValue(Promise.resolve({ isConfirmed: true } as any));

      const options: AlertOptions = {
        title: 'Question',
        text: 'Continue?',
        icon: AlertIcon.Question
      };

      const result = await service.yesOrNoAlert(options);

      expect(result).toBe(true);
      expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'question'
      }));
    });
  });
});
