import 'package:flutter/material.dart';

import '../core/personalization_constants.dart';

class ProfileTextField extends StatelessWidget {
  const ProfileTextField({
    super.key,
    required this.label,
    this.hint,
    this.initialValue,
    this.keyboardType,
    this.onChanged,
    this.validator,
    this.textInputAction,
  });

  final String label;
  final String? hint;
  final String? initialValue;
  final TextInputType? keyboardType;
  final void Function(String value)? onChanged;
  final String? Function(String? value)? validator;
  final TextInputAction? textInputAction;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      initialValue: initialValue,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: const OutlineInputBorder(),
      ),
      onChanged: onChanged,
      validator: validator,
    );
  }
}

class AgeSlider extends StatelessWidget {
  const AgeSlider({
    super.key,
    required this.age,
    required this.onChanged,
    this.min = 13,
    this.max = 100,
  });

  final int age;
  final int min;
  final int max;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Age', style: Theme.of(context).textTheme.labelLarge),
            Text('$age'),
          ],
        ),
        Slider(
          value: age.toDouble(),
          min: min.toDouble(),
          max: max.toDouble(),
          divisions: (max - min),
          label: '$age',
          onChanged: (v) => onChanged(v.round()),
        ),
      ],
    );
  }
}

class MultiSelectChips extends StatelessWidget {
  const MultiSelectChips({
    super.key,
    required this.options,
    required this.selected,
    required this.onChanged,
    this.wrapSpacing = 8,
    this.runSpacing = 8,
  });

  final List<String> options;
  final List<String> selected;
  final ValueChanged<List<String>> onChanged;
  final double wrapSpacing;
  final double runSpacing;

  @override
  Widget build(BuildContext context) {
    final sel = selected.toSet();
    return Wrap(
      spacing: wrapSpacing,
      runSpacing: runSpacing,
      children: [
        for (final opt in options)
          FilterChip(
            label: Text(opt),
            selected: sel.contains(opt),
            onSelected: (isSel) {
              final s = selected.toList();
              if (isSel) {
                if (!s.contains(opt)) s.add(opt);
              } else {
                s.remove(opt);
              }
              onChanged(s);
            },
          ),
      ],
    );
  }
}

class DropdownFormField<T> extends StatelessWidget {
  const DropdownFormField({
    super.key,
    required this.label,
    required this.items,
    required this.value,
    required this.onChanged,
    this.hint,
  });

  final String label;
  final String? hint;
  final List<DropdownMenuItem<T>> items;
  final T? value;
  final ValueChanged<T?> onChanged;

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<T>(
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: const OutlineInputBorder(),
      ),
      value: value,
      items: items,
      onChanged: onChanged,
    );
  }
}

class TimePickerTile extends StatelessWidget {
  const TimePickerTile({
    super.key,
    required this.title,
    required this.time,
    required this.onChanged,
  });

  final String title;
  final TimeOfDay? time;
  final ValueChanged<TimeOfDay?> onChanged;

  @override
  Widget build(BuildContext context) {
    final subtitle = time == null ? 'Not set' : formatTimeOfDay(time!);
    return ListTile(
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.access_time),
      onTap: () async {
        final now = TimeOfDay.now();
        final picked = await showTimePicker(
          context: context,
          initialTime: time ?? now,
        );
        onChanged(picked);
      },
    );
  }
}

class BoolSwitchTile extends StatelessWidget {
  const BoolSwitchTile({
    super.key,
    required this.title,
    required this.value,
    required this.onChanged,
    this.subtitle,
  });

  final String title;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      title: Text(title),
      subtitle: subtitle == null ? null : Text(subtitle!),
      value: value,
      onChanged: onChanged,
    );
  }
}

