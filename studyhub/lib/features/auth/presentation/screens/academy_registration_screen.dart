// lib/features/auth/presentation/screens/academy_registration_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:reactive_forms/reactive_forms.dart';
import 'package:studyhub/core/utils/validators.dart';
import 'package:studyhub/features/academy/presentation/providers/academy_provider.dart';

class AcademyRegistrationScreen extends ConsumerStatefulWidget {
  const AcademyRegistrationScreen({super.key});

  @override
  ConsumerState<AcademyRegistrationScreen> createState() =>
      _AcademyRegistrationScreenState();
}

class _AcademyRegistrationScreenState
    extends ConsumerState<AcademyRegistrationScreen> {
  final form = FormGroup({
    'name': FormControl<String>(validators: [Validators.required]),
    'email': FormControl<String>(
        validators: [Validators.required, Validators.email]),
    'owner_name': FormControl<String>(validators: [Validators.required]),
    'phone': FormControl<String>(validators: [AppValidators.phone]),

    // ✅ ADD THESE
    'registration_number': FormControl<String>(),
    'address': FormControl<String>(),
    'city': FormControl<String>(),
    'state': FormControl<String>(),
    'country': FormControl<String>(),
    'postal_code': FormControl<String>(),
    'owner_phone': FormControl<String>(validators: [AppValidators.phone]),
    'owner_email': FormControl<String>(validators: [Validators.email]),
    'establishment_date': FormControl<DateTime>(),
    'website': FormControl<String>(validators: [AppValidators.url]),
    'description': FormControl<String>(),
  });

  @override
  Widget build(BuildContext context) {
    final academyState = ref.watch(createAcademyProvider);
    final isLoading = academyState.isLoading;

    ref.listen<CreateAcademyState>(createAcademyProvider, (previous, next) {
      if (next.academy != null && !next.isLoading) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Academy registered successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        context.go('/register/user', extra: next.academy!.id);
        ref.read(createAcademyProvider.notifier).reset();
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
        title: const Text('Register Academy'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/login'),
        ),
      ),
      body: ReactiveForm(
        formGroup: form,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Academy Information',
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 16),
              _buildRequiredTextField(
                  controlName: 'name',
                  label: 'Academy Name',
                  icon: Icons.school),
              const SizedBox(height: 16),
              _buildRequiredTextField(
                controlName: 'email',
                label: 'Academy Email',
                icon: Icons.email,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              _buildRequiredTextField(
                controlName: 'owner_name',
                label: 'Owner Full Name',
                icon: Icons.person,
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controlName: 'phone',
                label: 'Academy Phone',
                icon: Icons.phone,
                keyboardType: TextInputType.phone,
                hint: '+1 234 567 8900',
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controlName: 'registration_number',
                label: 'Registration Number',
                icon: Icons.numbers,
              ),
              const SizedBox(height: 24),
              Text('Address Details',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 16),
              _buildTextField(
                  controlName: 'address',
                  label: 'Street Address',
                  icon: Icons.location_on),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                      child: _buildTextField(
                          controlName: 'city',
                          label: 'City',
                          icon: Icons.location_city)),
                  const SizedBox(width: 12),
                  Expanded(
                      child: _buildTextField(
                          controlName: 'state',
                          label: 'State/Province',
                          icon: Icons.map)),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                      child: _buildTextField(
                          controlName: 'country',
                          label: 'Country',
                          icon: Icons.public)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildTextField(
                      controlName: 'postal_code',
                      label: 'Postal Code',
                      icon: Icons.markunread_mailbox,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text('Owner Contact Information',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 16),
              _buildTextField(
                controlName: 'owner_phone',
                label: 'Owner Phone',
                icon: Icons.phone_android,
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controlName: 'owner_email',
                label: 'Owner Email',
                icon: Icons.alternate_email,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 24),
              Text('Additional Information',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 16),
              ReactiveDatePicker(
                formControlName: 'establishment_date',
                builder: (context, field, child) => InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Establishment Date',
                    prefixIcon: Icon(Icons.calendar_today),
                    border: OutlineInputBorder(),
                  ),
                  child: Text(
                    field.value != null
                        ? DateFormat.yMMMd().format(field.value!)
                        : 'Select date',
                  ),
                ),
                firstDate: DateTime(1900),
                lastDate: DateTime.now(),
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controlName: 'website',
                label: 'Website',
                icon: Icons.language,
                keyboardType: TextInputType.url,
                hint: 'https://example.com',
              ),
              const SizedBox(height: 16),
              ReactiveTextField(
                formControlName: 'description',
                decoration: const InputDecoration(
                  labelText: 'Description',
                  prefixIcon: Icon(Icons.description),
                  border: OutlineInputBorder(),
                  alignLabelWithHint: true,
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => context.go('/login'),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : ElevatedButton(
                            onPressed: _submitForm,
                            child: const Text('Register Academy'),
                          ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => context.push('/register/user', extra: null),
                child: const Text('Already have an academy? Register as User'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRequiredTextField({
    required String controlName,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
  }) {
    return ReactiveTextField(
      formControlName: controlName,
      decoration: InputDecoration(
        labelText: '$label *',
        prefixIcon: Icon(icon),
        border: const OutlineInputBorder(),
      ),
      keyboardType: keyboardType,
      validationMessages: {
        ValidationMessage.required: (_) => '$label is required',
        ValidationMessage.email: (_) => 'Enter a valid email',
      },
    );
  }

  Widget _buildTextField({
    required String controlName,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
    String? hint,
  }) {
    return ReactiveTextField(
      formControlName: controlName,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon),
        border: const OutlineInputBorder(),
      ),
      keyboardType: keyboardType,
      validationMessages: {
        ValidationMessage.email: (_) => 'Enter a valid email',
        'phone': (_) => 'Enter a valid phone number',
        'url': (_) => 'Enter a valid URL',
      },
    );
  }

  void _submitForm() {
    if (form.valid) {
      final data = form.value;
      final establishmentDate = data['establishment_date'] as DateTime?;
      ref.read(createAcademyProvider.notifier).createAcademy({
        'name': data['name'],
        'email': data['email'],
        'owner_name': data['owner_name'],
        if (data['phone'] != null) 'phone': data['phone'],
        if (data['registration_number'] != null)
          'registration_number': data['registration_number'],
        if (data['address'] != null) 'address': data['address'],
        if (data['city'] != null) 'city': data['city'],
        if (data['state'] != null) 'state': data['state'],
        if (data['country'] != null) 'country': data['country'],
        if (data['postal_code'] != null) 'postal_code': data['postal_code'],
        if (data['owner_phone'] != null) 'owner_phone': data['owner_phone'],
        if (data['owner_email'] != null) 'owner_email': data['owner_email'],
        if (establishmentDate != null)
          'establishment_date':
              DateFormat('yyyy-MM-dd').format(establishmentDate),
        if (data['website'] != null) 'website': data['website'],
        if (data['description'] != null) 'description': data['description'],
      });
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
