import re
from typing import Tuple, Dict, Any

def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
    hex_code = hex_code.strip().lstrip('#')
    if len(hex_code) == 3:
        hex_code = ''.join([c*2 for c in hex_code])
    if len(hex_code) != 6:
        return (0, 0, 0)
    try:
        r = int(hex_code[0:2], 16)
        g = int(hex_code[2:4], 16)
        b = int(hex_code[4:6], 16)
        return (r, g, b)
    except ValueError:
        return (0, 0, 0)

def relative_luminance(rgb: Tuple[int, int, int]) -> float:
    def channel_lum(val: int) -> float:
        c = val / 255.0
        if c <= 0.04045:
            return c / 12.92
        return ((c + 0.055) / 1.055) ** 2.4

    r = channel_lum(rgb[0])
    g = channel_lum(rgb[1])
    b = channel_lum(rgb[2])
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def calculate_contrast_ratio(hex1: str, hex2: str) -> float:
    rgb1 = hex_to_rgb(hex1)
    rgb2 = hex_to_rgb(hex2)
    l1 = relative_luminance(rgb1)
    l2 = relative_luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    ratio = (lighter + 0.05) / (darker + 0.05)
    return round(ratio, 2)

def evaluate_wcag(fg_hex: str, bg_hex: str, is_large_text: bool = False) -> Dict[str, Any]:
    ratio = calculate_contrast_ratio(fg_hex, bg_hex)
    min_aa = 3.0 if is_large_text else 4.5
    min_aaa = 4.5 if is_large_text else 7.0

    passes_aa = ratio >= min_aa
    passes_aaa = ratio >= min_aaa

    return {
        "ratio": ratio,
        "foreground": fg_hex,
        "background": bg_hex,
        "is_large_text": is_large_text,
        "passes_aa": passes_aa,
        "passes_aaa": passes_aaa,
        "target_aa": min_aa,
        "target_aaa": min_aaa,
        "status": "PASS" if passes_aa else "FAIL",
        "description": f"Contrast ratio is {ratio}:1. {'Compliant with WCAG AA' if passes_aa else f'Fails WCAG AA minimum of {min_aa}:1.'}"
    }
