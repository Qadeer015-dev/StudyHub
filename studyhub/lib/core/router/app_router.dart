// lib/core/router/app_router.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod/riverpod.dart';
import 'package:studyhub/features/auth/presentation/screens/login_screen.dart';
import 'package:studyhub/features/auth/presentation/screens/register_screen.dart';
import 'package:studyhub/features/auth/presentation/screens/academy_registration_screen.dart';
import 'package:studyhub/features/auth/providers/auth_provider.dart';
import 'package:studyhub/features/auth/domain/entities/user_role.dart';

final goRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authNotifierProvider);
  final isLoggedIn = authState.user != null;
  final userRoles = authState.user?.roles ?? [];

  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final location = state.matchedLocation;
      final isLoggingIn = location == '/login';
      final publicRoutes = [
        '/login',
        '/register/academy',
        '/register/user',
      ];

      final isPublic = publicRoutes.contains(location);

// Allow public routes without authentication
      if (isPublic) return null;

      // Redirect to login if not authenticated and not already on login
      if (!isLoggedIn && !isLoggingIn) return '/login';

      // Redirect to role-based home if logged in and on login page
      if (isLoggedIn && isLoggingIn) return _roleBasedHome(userRoles);

      // Allow navigation to other routes if authenticated
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register/academy',
        builder: (context, state) => const AcademyRegistrationScreen(),
      ),
      GoRoute(
        path: '/register/user',
        builder: (context, state) {
          final academyId = state.extra as int?;
          return RegisterScreen(academyId: academyId);
        },
      ),
      GoRoute(
        path: '/admin',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('Admin Dashboard'))),
      ),
      GoRoute(
        path: '/teacher',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('Teacher Dashboard'))),
      ),
      GoRoute(
        path: '/student',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('Student Dashboard'))),
      ),
      GoRoute(
        path: '/parent',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('Parent Dashboard'))),
      ),
    ],
  );
});

String _roleBasedHome(List<UserRole> roles) {
  if (roles.contains(UserRole.admin)) return '/admin';
  if (roles.contains(UserRole.teacher)) return '/teacher';
  if (roles.contains(UserRole.student)) return '/student';
  if (roles.contains(UserRole.parent)) return '/parent';
  return '/login';
}
