import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';

class TtsPlayer extends StatefulWidget {
  const TtsPlayer({
    super.key,
    required this.text,
    this.autoplay = false,
    this.language,
    this.speechRate = 0.5,
    this.pitch = 1.0,
    this.volume = 1.0,
  });

  final String text;
  final bool autoplay;
  final String? language;
  final double speechRate;
  final double pitch;
  final double volume;

  @override
  State<TtsPlayer> createState() => _TtsPlayerState();
}

class _TtsPlayerState extends State<TtsPlayer> {
  final FlutterTts _tts = FlutterTts();
  bool _speaking = false;

  @override
  void initState() {
    super.initState();
    _configure();
    if (widget.autoplay) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _speak());
    }
    _tts.setCompletionHandler(() => setState(() => _speaking = false));
    _tts.setErrorHandler((message) => setState(() => _speaking = false));
    _tts.setCancelHandler(() => setState(() => _speaking = false));
  }

  Future<void> _configure() async {
    if (widget.language != null) {
      await _tts.setLanguage(widget.language!);
    }
    await _tts.setSpeechRate(widget.speechRate);
    await _tts.setPitch(widget.pitch);
    await _tts.setVolume(widget.volume);
  }

  Future<void> _speak() async {
    if (_speaking) return;
    setState(() => _speaking = true);
    await _tts.speak(widget.text);
  }

  Future<void> _pause() async {
    await _tts.pause();
    setState(() => _speaking = false);
  }

  Future<void> _stop() async {
    await _tts.stop();
    setState(() => _speaking = false);
  }

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            IconButton(
              tooltip: _speaking ? 'Pause' : 'Play',
              icon: Icon(_speaking ? Icons.pause_circle_filled : Icons.play_circle_fill),
              onPressed: _speaking ? _pause : _speak,
            ),
            IconButton(
              tooltip: 'Stop',
              icon: const Icon(Icons.stop_circle),
              onPressed: _stop,
            ),
          ],
        ),
        Text(
          'Text-to-speech',
          style: Theme.of(context).textTheme.labelMedium,
        ),
      ],
    );
  }
}

