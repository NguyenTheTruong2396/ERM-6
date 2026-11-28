import 'package:flutter/material.dart';

class ChildInfo {
  final String id;
  final String name;
  final String className;
  final String schoolName;

  const ChildInfo({
    required this.id,
    required this.name,
    required this.className,
    required this.schoolName,
  });
}

void showChildSelectorSheet({
  required BuildContext context,
  required List children,
  required int selectedIndex,
  required ValueChanged onSelect,
}) {
  const Color primaryBlue = Color(0xFF1D54E8);
  const Color textPrimary = Color(0xFF0F172A);
  const Color textSecondary = Color(0xFF64748B);

  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (ctx) {
      return Padding(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Chọn học sinh theo dõi',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: textPrimary),
            ),
            const SizedBox(height: 4),
            const SizedBox(height: 16),
            for (int i = 0; i < children.length; i++) ...[
              Builder(
                builder: (_) {
                  final child = children[i] as ChildInfo;
                  final isSelected = i == selectedIndex;
                  return GestureDetector(
                    onTap: () {
                      onSelect(i);
                      Navigator.pop(ctx);
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFF0F7FF) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected ? primaryBlue : const Color(0xFFE2E8F0),
                          width: isSelected ? 1.5 : 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: isSelected ? primaryBlue : const Color(0xFFE2E8F0),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Icon(
                              Icons.school_rounded,
                              color: isSelected ? Colors.white : textSecondary,
                              size: 22,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  child.name,
                                  style: const TextStyle(
                                    fontSize: 14.5,
                                    fontWeight: FontWeight.w800,
                                    color: textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${child.className} • ${child.schoolName}',
                                  style: const TextStyle(fontSize: 12, color: textSecondary),
                                ),
                              ],
                            ),
                          ),
                          Icon(
                            isSelected ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                            color: isSelected ? primaryBlue : const Color(0xFFCBD5E1),
                            size: 22,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      );
    },
  );
}