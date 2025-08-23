import { AbstractControl, ValidationErrors } from "@angular/forms";

export function oneOrZeroValidator(control: AbstractControl): ValidationErrors | null{
    const value = control.value;
    return value === 0 || value === 1 ? null : { zeroOrOne: true };
}