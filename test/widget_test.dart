import 'package:dharma_daily/main.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Home loads and shows header', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: DharmaDailyApp()));
    await tester.pumpAndSettle();
    expect(find.text('Weekly Streak'), findsOneWidget);
  });
}
