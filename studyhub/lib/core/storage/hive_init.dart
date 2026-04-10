import 'package:hive_flutter/hive_flutter.dart';

class HiveBoxes {
  static const String user = 'user';
  static const String academies = 'academies';
  static const String classes = 'classes';
  static const String students = 'students';
  static const String attendance = 'attendance';
  // Add more as needed
}

Future<void> initHive() async {
  await Hive.initFlutter();
  // Register adapters (will do when models are created)
  // Hive.registerAdapter(UserAdapter());

  await Hive.openBox(HiveBoxes.user);
  await Hive.openBox(HiveBoxes.academies);
  await Hive.openBox(HiveBoxes.classes);
  await Hive.openBox(HiveBoxes.students);
  await Hive.openBox(HiveBoxes.attendance);
}
