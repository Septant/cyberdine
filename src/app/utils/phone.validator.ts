import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // если поле пустое, не валидируем (добавьте required отдельно)
    }

    // Удаляем все нецифровые символы
    const cleanValue = control.value.replace(/\D/g, '');

    const patterns = [
      /^(\+?7|8)[0-9]{10}$/, // Россия
      /^(\+?375)[0-9]{9}$/, // Беларусь
    ];

    const isValid = patterns.some((pattern) => pattern.test(cleanValue));

    return isValid ? null : { invalidPhone: true };
  };
}
