// lib/core/utils/validators.dart
import 'package:reactive_forms/reactive_forms.dart';

class AppValidators {
  static ValidatorFunction get required => (AbstractControl<dynamic> control) {
        final value = control.value;
        if (value == null || (value is String && value.trim().isEmpty)) {
          return {'required': true};
        }
        return null;
      };

  static ValidatorFunction get email => (AbstractControl<dynamic> control) {
        final value = control.value as String?;
        if (value == null || value.isEmpty) return null;
        final regex = RegExp(r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$');
        if (!regex.hasMatch(value)) {
          return {'email': true};
        }
        return null;
      };

  static Validator<dynamic> minLength(int min) =>
      Validators.delegate((control) {
        final value = control.value as String?;
        if (value == null || value.isEmpty) return null;
        if (value.length < min) {
          return {
            'minLength': {'requiredLength': min, 'actualLength': value.length}
          };
        }
        return null;
      });

  
  static Validator<dynamic> get phone => Validators.delegate((control) {
        final value = control.value as String?;
        if (value == null || value.isEmpty) return null;
        final regex = RegExp(r'^\+?[0-9]{7,15}$');
        if (!regex.hasMatch(value)) {
          return {'phone': true};
        }
        return null;
      });

  static Validator<dynamic> get url => Validators.delegate((control) {
        final value = control.value as String?;
        if (value == null || value.isEmpty) return null;
        final regex = RegExp(
          r'^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$',
          caseSensitive: false,
        );
        if (!regex.hasMatch(value)) {
          return {'url': true};
        }
        return null;
      });
}
