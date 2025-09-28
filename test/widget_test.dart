import 'package:dharma_daily/main.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  testWidgets('renders featured verse card', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: DharmaDailyApp()));

    expect(find.text("Today's Verse"), findsOneWidget);
    expect(find.textContaining('Recommended meditation'), findsWidgets);
  });
}
