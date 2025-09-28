import 'package:flutter/widgets.dart';

import '../models/daily_verse.dart';

const _devanagariLangs = {'hi', 'sa', 'mr', 'ne'};

bool isDevanagariLanguage(Locale locale) {
  final code = locale.languageCode.toLowerCase();
  return _devanagariLangs.contains(code);
}

String? verseTranslationForLocale(DailyVerse verse, Locale locale) {
  final code = locale.languageCode.toLowerCase();
  final fromMap = verse.translations?[code];
  return fromMap ?? verse.commentary;
}

