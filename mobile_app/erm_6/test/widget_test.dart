import 'package:flutter_test/flutter_test.dart';
import 'package:erm_6/main.dart';

void main() {
  testWidgets('Erm6App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const Erm6App());
    expect(find.text('Bắt đầu cùng ERM-6'), findsOneWidget);
  });
}
