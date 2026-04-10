// lib/features/auth/presentation/screens/register_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:reactive_forms/reactive_forms.dart';
import 'package:studyhub/core/utils/validators.dart';
import 'package:studyhub/features/auth/providers/auth_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  final int? academyId;

  const RegisterScreen({super.key, this.academyId});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final form = FormGroup({
    'email': FormControl<String>(
        validators: [Validators.required, Validators.email]),
    'password': FormControl<String>(
        validators: [Validators.required, AppValidators.minLength(6)]),
    'confirm_password': FormControl<String>(validators: [Validators.required]),
    'full_name': FormControl<String>(validators: [Validators.required]),
    'phone': FormControl<String>(validators: [AppValidators.phone]),
    'role':
        FormControl<String>(validators: [Validators.required], value: 'admin'),
  }, validators: [
    _passwordsMatchValidator
  ]);

  static final Validator<dynamic> _passwordsMatchValidator =
      Validators.delegate((control) {
    if (control is! FormGroup) return null;

    final passwordControl = control.control('password');
    final confirmControl = control.control('confirm_password');

    if (passwordControl.value != confirmControl.value) {
      confirmControl.setErrors({'passwordMismatch': true});
    } else {
      confirmControl.removeError('passwordMismatch');
    }

    return null;
  });

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final isLoading = authState.isLoading;

    final availableRoles = widget.academyId == null
        ? ['admin']
        : ['admin', 'teacher', 'student', 'parent'];

    ref.listen<AuthState>(authNotifierProvider, (previous, next) {
      if (next.user != null && !next.isLoading) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Registration successful!'),
            backgroundColor: Colors.green,
          ),
        );
      } else if (next.errorMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.errorMessage!),
            backgroundColor: Colors.red,
          ),
        );
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Account'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: ReactiveForm(
        formGroup: form,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Icon(Icons.person_add,
                  size: 80, color: Theme.of(context).colorScheme.primary),
              const SizedBox(height: 16),
              Text(
                'Create Your Account',
                style: Theme.of(context).textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              if (widget.academyId != null) ...[
                const SizedBox(height: 8),
                Text(
                  'Academy ID: ${widget.academyId}',
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ],
              const SizedBox(height: 32),
              ReactiveTextField(
                formControlName: 'full_name',
                decoration: const InputDecoration(
                  labelText: 'Full Name *',
                  prefixIcon: Icon(Icons.person),
                  border: OutlineInputBorder(),
                ),
                validationMessages: {
                  ValidationMessage.required: (_) => 'Full name is required',
                },
              ),
              const SizedBox(height: 16),
              ReactiveTextField(
                formControlName: 'email',
                decoration: const InputDecoration(
                  labelText: 'Email *',
                  prefixIcon: Icon(Icons.email),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validationMessages: {
                  ValidationMessage.required: (_) => 'Email is required',
                  ValidationMessage.email: (_) => 'Enter a valid email',
                },
              ),
              const SizedBox(height: 16),
              ReactiveTextField(
                formControlName: 'phone',
                decoration: const InputDecoration(
                  labelText: 'Phone (optional)',
                  prefixIcon: Icon(Icons.phone),
                  border: OutlineInputBorder(),
                  hintText: '+1 234 567 8900',
                ),
                keyboardType: TextInputType.phone,
                validationMessages: {
                  'phone': (_) => 'Enter a valid phone number',
                },
              ),
              const SizedBox(height: 16), // Fixed
              ReactiveDropdownField<String>(
                formControlName: 'role',
                decoration: const InputDecoration(
                  labelText: 'Role *',
                  prefixIcon: Icon(Icons.badge),
                  border: OutlineInputBorder(),
                ),
                items: availableRoles.map((role) {
                  return DropdownMenuItem(
                    value: role,
                    child: Text(_getRoleDisplayName(role)),
                  );
                }).toList(),
                validationMessages: {
                  ValidationMessage.required: (_) => 'Role is required',
                },
              ),
              const SizedBox(height: 16), // Fixed
              ReactiveTextField(
                formControlName: 'password',
                decoration: const InputDecoration(
                  labelText: 'Password *',
                  prefixIcon: Icon(Icons.lock),
                  border: OutlineInputBorder(),
                  helperText: 'Minimum 6 characters',
                ),
                obscureText: true,
                validationMessages: {
                  ValidationMessage.required: (_) => 'Password is required',
                  'minLength': (error) {
                    final map = error as Map<String, dynamic>;
                    return 'Password must be at least ${map['requiredLength']} characters';
                  },
                },
              ),
              const SizedBox(height: 16),
              ReactiveTextField(
                formControlName: 'confirm_password',
                decoration: const InputDecoration(
                  labelText: 'Confirm Password *',
                  prefixIcon: Icon(Icons.lock_outline),
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validationMessages: {
                  ValidationMessage.required: (_) => 'Please confirm password',
                  'passwordMismatch': (_) => 'Passwords do not match',
                },
              ),
              const SizedBox(height: 24),
              isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                      onPressed: _submitForm,
                      style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16)),
                      child: const Text('Register'),
                    ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Already have an account?'),
                  TextButton(
                    onPressed: () => context.go('/login'),
                    child: const Text('Login'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getRoleDisplayName(String role) {
    return role[0].toUpperCase() + role.substring(1);
  }

  void _submitForm() {
    if (form.valid) {
      final data = form.value;
      ref.read(authNotifierProvider.notifier).register(
            email: data['email'] as String,
            password: data['password'] as String,
            fullName: data['full_name'] as String,
            phone: data['phone'] as String?,
            role: data['role'] as String,
            academyId: widget.academyId,
          );
    } else {
      form.markAllAsTouched();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill all required fields correctly'),
          backgroundColor: Colors.orange,
        ),
      );
    }
  }
}
