# Homepage Animation Sequence Timings

## Overview
The homepage animation sequence runs for **5 seconds** total, followed by a final phase that reveals interactive elements.

---

## Phase 1: Logo Animation
**Element:** `.logo`  
**Animation:** `logoSequence`  
**Duration:** 4 seconds  
**Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)`

| Time | Percentage | State | Description |
|------|------------|-------|-------------|
| 0s | 0% | Opacity: 0 | Hidden |
| 0.4s | 10% | Opacity: 1 | Fades in |
| 0.4s - 1.4s | 10% - 35% | Opacity: 1 | Fully visible |
| 1.4s - 2s | 35% - 50% | Opacity: 1 → 0 | Fades out |
| 2s - 4s | 50% - 100% | Opacity: 0 | Hidden |

**Total visible time:** ~1 second (0.4s - 1.4s)

---

## Phase 2: Symbol Animation
**Element:** `.symbol`  
**Animation:** `symbolSequenceDesktop` / `symbolSequenceTablet` / `symbolSequenceMobile`  
**Duration:** 5 seconds  
**Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)`

### Desktop Version
| Time | Percentage | State | Description |
|------|------------|-------|-------------|
| 0s - 2.5s | 0% - 50% | Opacity: 0 | Hidden (waiting for logo to finish) |
| 2.5s - 3s | 50% - 60% | Opacity: 0 | Still hidden |
| 3s - 3.5s | 60% - 70% | Opacity: 0 → 1 | Fades in, centered, width: 9vw |
| 3.5s - 4s | 70% - 80% | Opacity: 1 | Fully visible, centered, width: 9vw |
| 4s - 5s | 80% - 100% | Opacity: 1 | Moves to top (20px), shrinks to final size (81px) |

**Key transitions:**
- **Fade in:** 3s - 3.5s (60% - 70%)
- **Position change:** 4s - 5s (80% - 100%)
- **Size change:** 4s - 5s (80% - 100%)

### Tablet Version
- Same timing as desktop
- Initial size: `125px` (tablet)
- Final size: `63px` (tablet)
- Final position: `20px` from top (tablet)

### Mobile Version
- Same timing as desktop
- Initial size: `100px` (mobile)
- Final size: `62px` (mobile)
- Final position: `17px` from top (mobile)

### Mobile Landscape Version
- Same timing as desktop
- Initial size: `100px` (mobile)
- Final size: `42px` (mobile)
- Final position: `17px` from top (mobile)

---

## Phase 3: Final Phase (Interactive Elements)
**Trigger:** JavaScript timeout at **4.5 seconds** (after symbol animation completes)  
**Duration:** 1 second for each element  
**Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)`

All elements fade in simultaneously starting at **4.5s**:

| Element | Animation | Start Time | Duration | Description |
|---------|-----------|------------|----------|-------------|
| **Header** | `header-fade-in` | 4.5s | 1s | Header fades in from hidden state |
| **Text Wrap** | `finalPhaseFadeIn` | 4.5s | 1s | Intro text fades in (opacity: 0 → 1) |
| **Down Arrow** | `finalPhaseFadeIn` | 4.5s | 1s | Scroll arrow fades in (opacity: 0 → 1) |
| **Video Controls** | `finalPhaseFadeIn` | 4.5s | 1s | Video controls fade in (opacity: 0 → 1) |
| **Opacity Overlay** | `finalPhaseFadeOut` | 4.5s | 1s | Overlay opacity increases (becomes brighter) |

**Completion time:** All elements fully visible by **5.5s**

---

## Continuous Animations

### Down Arrow Bounce
**Element:** `.down-arrow svg`  
**Animation:** `arrowBounce`  
**Duration:** 2 seconds (infinite loop)  
**Start:** After fade-in completes (~5.5s)

| Time | Percentage | Transform |
|------|------------|-----------|
| 0s, 0.4s, 1s, 1.6s, 2s | 0%, 20%, 50%, 80%, 100% | `translateY(0)` |
| 0.8s | 40% | `translateY(-10px)` |
| 1.2s | 60% | `translateY(-5px)` |

---

## Timeline Summary

```
0.0s ──────────────────────────────────────────────────────────────→ 5.5s
│
├─ 0.0s - 0.4s: Logo fades in
├─ 0.4s - 1.4s: Logo visible
├─ 1.4s - 2.0s: Logo fades out
├─ 2.0s - 3.0s: Gap (both hidden)
├─ 3.0s - 3.5s: Symbol fades in (centered, large)
├─ 3.5s - 4.0s: Symbol visible (centered, large)
├─ 4.0s - 5.0s: Symbol moves to top & shrinks
├─ 4.5s: Final phase triggered (all interactive elements start fading in)
└─ 5.5s: All elements fully visible, arrow bounce begins
```

---

## Notes

1. **Logo and Symbol do not overlap** - Logo completes before symbol appears
2. **Symbol animation** is responsive with different sizes/positions for desktop, tablet, and mobile
3. **Final phase** is triggered via JavaScript timeout, not CSS animation delay
4. **Header** is hidden during the initial 4.5 seconds, then fades in
5. **All final phase animations** use the same 1-second fade-in duration
6. **Down arrow bounce** is a continuous loop that starts after the fade-in completes

