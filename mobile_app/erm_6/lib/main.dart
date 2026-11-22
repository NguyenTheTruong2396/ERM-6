import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/screens/role_selection_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const Erm6App());
}

class Erm6App extends StatelessWidget {
  const Erm6App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ERM-6 Smart Learning Platform',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme.copyWith(
        snackBarTheme: SnackBarThemeData(
          backgroundColor: const Color(0xFF1D54E8),
          contentTextStyle: const TextStyle(
            color: Colors.white,
            fontSize: 13.5,
            fontWeight: FontWeight.w800,
          ),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
      home: const RoleSelectionScreen(),
    );
  }
}
