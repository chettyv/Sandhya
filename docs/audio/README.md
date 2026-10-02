# Audio contract

Audio is a core learning promise, but this checkout does not contain approved
recordings or an installed playback dependency. The app therefore exposes a
manifest-backed resolver and an explicit unavailable state; it does not render
a dead play button and does not treat a remote URL as proof of rights or
pronunciation quality.

## Playback choice

The selected Expo-compatible direction is **`expo-audio`**, using the version
matched by the Expo SDK 54 installer when dependency work is explicitly
approved. It is not installed in this wave: the current mobile package is
Expo SDK 54 without a media package, and adding the native module requires a
separate package/version review plus physical iOS and Android verification.

When approved, the player must own play/pause, seek, interruption cleanup,
background pause/resume, clear/slow selection, and loading/error/unavailable
states. It must consume `AudioAsset` values from `apps/mobile/src/lib/audio.ts`
and never accept a URL copied into a screen.

## Asset and rights gate

`manifest.csv` is the internal media/provenance ledger. A row is not ready for
the public core profile until a named human reader and reviewer have confirmed
pronunciation against the displayed Devanagari, IAST, and “Say it” text, the
asset has a rights record, and both clear and slow repeat-after-me passes are
available for the learnable item. Synthetic devotional speech is not an
accepted substitute.

The manifest is intentionally empty in this wave. Physical-device playback
checks remain a Q1 gate; no launch claim may rely on the resolver tests alone.
