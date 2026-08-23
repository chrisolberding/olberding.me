---
title: "Building a Custom DAW: Architecture and Staged Plan"
description: "Design decisions, plugin strategy, and a build order for a native macOS DAW with a first-class agent layer."
---

*Planning document · August 2026 · decisions settled, open questions flagged at the end*

**Contents**

1. [Thesis and what this is](#1-thesis-and-what-this-is)
2. [Platform and shape](#2-platform-and-shape)
3. [The plugin layer](#3-the-plugin-layer)
4. [The project document and the op log](#4-the-project-document-and-the-op-log)
5. [The FL-derived document model](#5-the-fl-derived-document-model)
6. [Time, transport, and the engine core](#6-time-transport-and-the-engine-core)
7. [Recording and disk](#7-recording-and-disk)
8. [The engine to UI boundary](#8-the-engine-to-ui-boundary)
9. [The AI layer and what it costs](#9-the-ai-layer-and-what-it-costs)
10. [Staged plan](#10-staged-plan)
11. [Explicitly out of scope](#11-explicitly-out-of-scope)
12. [Open questions](#12-open-questions)
13. [Sources](#footnote-label)

## <span class="n">1</span> Thesis and what this is

The prompt for this project was Greysound, a browser-native DAW with a built-in
mixing engineer: you drag stems in, type an instruction, and it levels, pans, and
applies effects. It also ships synths and samplers with no plugin hosting,
generates editable MIDI, and splits reference tracks into stems. Non-AI features
are free forever; you buy credits for the AI.[^1]

That pricing model reveals the strategy. Their moat is the AI. The DAW is the cost
of entry, and it is also roughly 95% of the engineering.

This project inverts that emphasis deliberately.

> The thesis is FL Studio's document model, done better where FL is weak. The op
> log is a non-negotiable architectural constraint, not the headline bet. The AI
> capability arrives as a consequence of the constraint rather than as the reason
> for the project.

Four reasons for that ordering:

1. The stated goal is a tool worth making music in. Usability lives in the document
   model and editing ergonomics, not in the AI.
2. The op log costs almost nothing extra if committed to on day one, because undo
   has to be built regardless. Making undo *be* the op log is a discipline, not a
   feature.
3. The downside is asymmetric. If the AI disappoints, there is still a DAW. If the
   AI is the thesis and it disappoints, there is an architecture diagram.
4. Motivation is the real limiting resource on a multi-year solo project, and
   nothing sustains one like using the thing.

### <span class="n">1.1</span> Why an op log and an FL model are not alternatives

These read as competing choices but they sit at different layers. The op log is a
*substrate* decision: how does state change. The FL model is a *schema* decision:
what is the state.

They are actively synergistic. A pattern-based document is far friendlier to an
agent than a linear-track one, because patterns are named, discrete, addressable
objects. "Give pattern 3 a shuffle" is a clean operation with an unambiguous
target. "Adjust the audio between 1:23 and 1:47 on track 4" is not. The FL
instincts and the AI ambition want the same document model.

## <span class="n">2</span> Platform and shape

Third-party plugin hosting is a hard requirement, which settles the platform
question: this is a native macOS application, not a browser tab. A browser can
never host VST3 or AU, and browser audio round-trip latency of roughly 15 to 30ms
is playable for pads and wrong for anything percussive.

The shape, then:

| Layer | Choice | Rationale |
|---|---|---|
| Engine | Rust | Graph, transport, DSP, project document, op log |
| Audio IO | cpal over CoreAudio | Real latency, roughly 5 to 8ms round trip at 128 frames |
| UI | Web stack in a webview | Dense surfaces are far cheaper in DOM and Canvas than in any native toolkit |
| Shell | Tauri | Native window, native menus, filesystem, plugin host process |
| Secondary target | WASM engine build | A linkable demo, with the latency caveat stated |

The UI decision deserves defending, because it cuts against the latency argument.
A DAW interface is dense: piano roll, playlist, mixer, step sequencer, all
high-interaction and mostly custom-drawn. Building that in JUCE, egui, or Iced is
months of widget plumbing. Putting the UI in a webview and the engine in Rust gets
both halves right, and the AI chat surface then costs nothing to add.

### <span class="n">2.1</span> The cost of the webview decision

Plugin editor GUIs are native OS views. A VST3 or AU editor is an `NSView` the
plugin draws into, and it cannot render inside a webview. Plugin windows will be
sibling native windows whose position and z-order the app manages itself. The mixer
strip lives in HTML and the plugin floats above it as a separate OS window.

Every webview-UI DAW has this seam. It is livable, and it is a real cost.

## <span class="n">3</span> The plugin layer

### <span class="n">3.1</span> The four formats, from a host author's seat

**VST2** is unavailable. Steinberg stopped issuing SDK licenses in 2018, so a new
host cannot legally support it.[^6] Anything in the library that is VST2-only is
permanently unreachable, and the practical workaround is to freeze those parts to
audio in FL and import.

**VST3** is the current universal default and where most of the library lives. It
is dual-licensed under GPLv3 or a free-of-charge Steinberg agreement that requires
registration. Technically it is C++ COM: reference counting, `queryInterface`,
vtable ABI. Binding it from Rust means reimplementing COM semantics across the C++
ABI, which is unpleasant and poorly trodden on the host side specifically.

**AU** is Apple's format, macOS only, and worth taking seriously even though the AU
builds have historically gone uninstalled. It gives the host a second route to the
same plugin, which is a genuinely useful debugging affordance when a VST3
misbehaves in a half-finished host.

**CLAP** is MIT licensed, a pure C header, no COM, no license agreement, and no
registration. It is extension-based, so capabilities are queried by string ID and
the format grows without breaking ABI. Per-note modulation and expression are
first-class. Most importantly for a first host: the threading contract is written
down in the spec rather than implied by convention.[^5]

### <span class="n">3.2</span> Coverage math

As of 2026, CLAP is supported by 15 DAWs and 93 plugin vendors across 394 plugins,
with u-he, FabFilter, TAL, and the Surge Synth Team leading adoption. FL Studio
added CLAP in FL 2024, Reaper since v7, Bitwig from the start. VST3 nevertheless
remains the default and is not being displaced.[^2][^3]

So CLAP alone does not cover the library. It is the wrong choice as the only
adapter and the right choice as the first one.

### <span class="n">3.3</span> The design

One internal plugin interface, CLAP-shaped, with adapters behind it.

CLAP is roughly the cleanest superset of the four formats. Shape the internal
`PluginInstance` trait after it and VST3 and AU map on reasonably. Shape it after
VST3 and the other two fight back the whole way.

| Adapter | Implementation | When |
|---|---|---|
| CLAP | Pure Rust via `clack` | First. Teaches the model in a weekend |
| VST3 and AU | Thin C++ shim, flat C ABI | Second, and soon |

For the second adapter, JUCE can be used purely as a plugin-hosting library. Its
`AudioPluginFormatManager` handles VST3, AU, AUv3, LV2, and AAX. Wrapped behind
roughly 500 lines of C ABI, JUCE never touches the engine, the UI, or the
architecture. It is a plugin-loading dependency and nothing more, and it saves
months.

Note that JUCE does not host CLAP natively. A community module exists but its own
author describes it as super-alpha.[^4] That is fine, because CLAP is handled in
Rust anyway.

License flag: JUCE is GPLv3 or AGPLv3 or commercial. For a personal tool this is
not an issue. Shipping closed-source later would require a paid license.

### <span class="n">3.4</span> The parts that will bite

- **Scan out of process.** One crashy plugin must not take the DAW down. FL runs a
  separate scanner process; this should too, with results cached to a plugin
  database.
- **Sample-offset events.** The plugin receives an event list where notes and
  parameter changes carry an offset *within* the block. This is the mechanism
  behind sample-accurate automation.
- **Bidirectional parameters.** Host to plugin for automation, and plugin to host
  when the user turns a knob in the plugin's own GUI. Without that second path,
  automation recording does not work and undo has a silent hole.
- **Latency reporting and PDC.** Plugins declare latency in samples and can change
  it at runtime, for instance when a compressor toggles lookahead, forcing a live
  graph recompute. This is the most bug-prone area in any DAW.
- **State is an opaque blob**, which collides with the diffable-project ambition.
  Store each plugin instance's chunk as a sidecar file so the rest of the document
  stays readable.

## <span class="n">4</span> The project document and the op log

Every mutation to the project goes through one operation layer. The UI emits
operations. The agent emits the same operations. Nothing mutates state by any other
path.

What falls out of that single rule:

| Capability | How it falls out |
|---|---|
| Undo and redo | The log, played backwards |
| Inspectable AI edits | Show the operations before committing them |
| Undoable AI edits | Free, same mechanism as any edit |
| Diffable projects | The document is text, so git works |
| Deterministic tests | Replay a log, compare the render |
| Multiplayer | Operations merge; opaque blobs do not |

Existing DAWs cannot retrofit this. Their project formats are opaque binary and
their mutation model is UI-driven, which is exactly why their AI features feel
bolted on.

### <span class="n">4.1</span> Where the log does not reach

Worth writing down, because the boundaries are real:

- **Plugin internal state** is an opaque chunk. It cannot be diffed or partially
  reverted. Sidecar files per instance.
- **Recorded audio** is immutable on disk. Undoing a take removes the reference,
  not the file.
- **Media in general** lives in a media folder, referenced by small operations. A
  recording produces a large binary artifact plus a tiny operation naming its
  position and length.

### <span class="n">4.2</span> Optimistic local state

The failure mode is the UI flooding the operation queue during drags. Dragging 200
notes must not emit 200 operations per mouse move. The UI holds optimistic local
state, renders it, and commits one operation on mouse up. Knob drags throttle to
frame rate with last-value-wins, since a high-poll-rate mouse fires roughly 1000
events per second. Automation strokes coalesce into one operation carrying a point
array.

## <span class="n">5</span> The FL-derived document model

Almost every DAW tutorial and open-source DAW teaches the Logic and Ableton model,
where a track is an instrument plus its insert chain plus its clips, all welded
together. FL is genuinely different, and building the common model would mean being
annoyed by one's own software forever.

Four FL-isms to keep deliberately:

1. **Generators are decoupled from mixer inserts.** A channel points at an insert
   number. Routing is many-to-one and explicit. Ten channels can share insert 4.
   This alone shapes the graph design.
2. **Patterns are multi-channel and first-class.** An FL pattern holds notes for
   many channels at once and is placed in the playlist as a reusable object. An
   Ableton clip is one track's worth. Very different sequencer core.
3. **Playlist tracks are untyped.** Audio, pattern clips, and automation clips go
   on any lane. Most DAWs hard-type their tracks.
4. **Automation clips are playlist items**, not lanes hidden under a disclosure
   triangle.

### <span class="n">5.1</span> Where to overshoot

Comping and take management is the weakest part of FL. Since the goal is the DAW
one wishes existed rather than a clone of the one in use, that is the natural place
to aim past the daily driver rather than match it.

## <span class="n">6</span> Time, transport, and the engine core

### <span class="n">6.1</span> Time representation

The most irreversible decision in the project.

**Canonical musical position is f64 beats**, with an explicit tempo map and
time-signature map, and a per-object flag for musical versus absolute anchoring. A
recorded take pinned to wall-clock time behaves differently from a pattern that
should follow tempo.

Rejected alternatives: samples make tempo changes impossible; integer PPQN bakes in
quantization artifacts and starts an unwinnable argument about resolution.

Conversion between beats and samples integrates the tempo map. Linear tempo ramps
need the actual integral rather than a piecewise-constant approximation, with a
cached lookup table for speed. Getting this right on day one is what makes tempo
automation and, later, audio warping possible at all.

### <span class="n">6.2</span> Real-time discipline

The audio thread does no allocation, no locks, no syscalls, and no drops of
heap-owning objects. Communication with the rest of the app is through bounded,
preallocated lock-free structures.

- **Control operations, UI to engine:** a bounded SPSC ring buffer, drained at the
  top of each callback. Anything requiring allocation happens on a worker thread,
  which hands a fully built object across as a pointer. The audio thread ships the
  old one back across a return ring so it is dropped off-thread.
- **Continuous state, engine to UI:** atomics or a triple buffer. Never a queue. If
  the UI stalls for 200ms a queue grows stale entries and the display renders the
  past; a triple buffer always hands over the newest.

### <span class="n">6.3</span> Parallelism

The graph is a DAG with explicit dependencies from day one, even though v1 renders
single-threaded. Multicore rendering means atomic dependency counters and a
work-stealing pool of real-time-priority workers parked at init. That is not needed
early, but retrofitting parallelism into a graph that assumes sequential execution
is a rewrite, so the data structure has to anticipate it.

### <span class="n">6.4</span> Testability as an architectural requirement

A headless, deterministic offline-render target is a first-class build, not an
afterthought. If the engine can render a project faster than realtime with
bit-identical output, then null tests, golden-file DSP tests, and op-log replay
tests all become cheap. Audio is miserable to test unless this is planned for, and
near-impossible to bolt on later.

Internal sample format is f32, with f64 reserved for places where accumulation
demands it, such as long IIR state and metering integration.

## <span class="n">7</span> Recording and disk

Two facts frame the whole subsystem: the audio thread cannot touch the disk, and
captured audio arrives late by a knowable number of samples.

### <span class="n">7.1</span> The capture path

Input arrives on the same duplex callback as output. The audio thread performs one
memcpy into a preallocated ring and returns; a normal-priority writer thread drains
it to disk. One to two seconds of ring per channel absorbs disk hiccups, which at
48k and 32-bit is roughly 384KB per mono channel.

Overrun handling is not optional. If the disk stalls long enough to fill the ring,
the audio thread drops samples rather than blocking, sets an atomic flag, and the
UI reports it and marks the take. A DAW that silently records corrupted audio is
worse than one that refuses to record.

### <span class="n">7.2</span> Record latency compensation

Captured audio arrives late by the full round trip: output buffer, DAC, device
safety offset, the air or cable, ADC, input buffer, input safety offset. Stamping
incoming samples at the current playhead makes every take late by that amount,
typically 5 to 15ms at small buffers. On a shaker that is obviously wrong; on a
vocal it is a subtle smear that takes weeks to diagnose.

CoreAudio exposes device latency, safety offsets, and stream latency, but USB
interfaces frequently report incomplete numbers. Ship a **loopback calibration**:
play a click, have the user patch output to input, cross-correlate to find the
actual sample delay, store it per device. Roughly 100 lines, and it is the
difference between a DAW that records tight and one where something feels off.

Build it early, because it makes every subsequent recording test trustworthy.

### <span class="n">7.3</span> Monitoring, punch, and one free feature

Three monitoring modes matter and they are genuinely different: hardware direct
monitoring at zero latency with the DAW uninvolved, software monitoring through the
graph so amp sims are audible, and off. With software monitoring, a plugin chain
carrying 40ms of lookahead makes the path unusable, so compensation is reduced or
bypassed on armed tracks.

**Retrospective record** deserves its own line. Keep a rolling ring of the last
roughly 30 seconds of input, always running even when not armed, so the warmup take
that turned out to be the good one is still capturable. Given the ring buffer
already exists, this is nearly free, and it has the best effort-to-delight ratio in
the feature set.

### <span class="n">7.4</span> Files

32-bit float by default, so recording hot cannot clip and gain staging inside the
DAW stays lossless. Plain RIFF WAV dies at 4GB, so write RF64 or auto-upgrade on
overflow. Flush recoverable headers periodically so a crash mid-take leaves a
playable file. Recorded files are never modified: a take is an immutable file plus
a timeline reference.

Playback is the mirror problem. A reader thread pre-fetches into per-clip ring
buffers and the audio thread only ever reads RAM. Transport jumps flush and refill,
which is why every DAW hiccups slightly on locate.

## <span class="n">8</span> The engine to UI boundary

Roughly 3 to 12 audio callbacks occur per UI frame, so the two sides cannot share a
schedule. The audio thread never touches IPC; it writes to memory, and something
else reads that memory on the UI's cadence.

Bulk data crosses as binary, request and response, computed on a worker thread.
Per-frame state crosses as **one coalesced binary message carrying everything**.
Playhead plus 64 tracks of peak and RMS is roughly 1KB, which at 60fps is 60KB per
second and free. The same payload as JSON is only 3 to 4KB, so bandwidth is not the
issue; the issue is minting hundreds of JS numbers 60 times a second and eating the
eventual garbage-collection pause, which shows up as playhead stutter. Decode into
preallocated typed arrays and reuse them.

`SharedArrayBuffer` is not an escape hatch. WKWebView runs web content in a
separate process by design, so there is no shared memory with the Rust heap.

Two details separate a real meter bridge from a decorative one:

- **Peak-hold happens in the engine.** Sampling at 60Hz sees one instant out of
  every 3 to 12 callbacks and misses transients entirely. The audio thread tracks
  max-since-last-read into an atomic that the read resets. Clip detection is a
  sticky flag cleared only by the user.
- **The playhead is extrapolated, not transmitted.** Rendering whatever position
  arrives produces jitter, because IPC delivery is not frame-aligned. Send sample
  position plus a timestamp and let the UI run its own clock, predicting where the
  playhead is now and correcting gently toward each update. This is client-side
  prediction, and it is the whole difference between a playhead that glides and one
  that judders.

Waveforms never cross the boundary as samples. Three minutes of stereo 48k is 69MB
as f32. Compute a peak file on a worker thread at import, cache it to disk, and
serve the visible range at display resolution: a 2000px view needs roughly 16KB.

## <span class="n">9</span> The AI layer and what it costs

The agent is a producer of operations against the same interface the UI uses.
Nothing about it is a special subsystem.

Build order, which is roughly the reverse of Greysound's emphasis:

1. **Generative MIDI.** Cheapest, easiest, lowest risk. The model emits notes,
   notes are data, and the piano roll already exists.
2. **Agent drives the DAW.** Once the operation vocabulary is stable. This is where
   the architecture cashes out.
3. **Mixing engineer.** Last. It needs credible built-in effects, audio feature
   extraction, and taste, and it is the most likely of the three to disappoint.

### <span class="n">9.1</span> Never send audio

Feature extraction runs locally and for free: LUFS, crest factor, spectral
centroid, peak and RMS per track. A 16-track feature dump is roughly 3K tokens. The
audio itself would be gigabytes and would not help. Stem splitting, transient
detection, and analysis are all local work; only the symbolic reasoning needs a
frontier model, and that is the cheap part.

### <span class="n">9.2</span> Cost model

Anthropic list pricing at the time of writing: Claude Opus 5 at $5 per million
input tokens and $25 per million output; Claude Sonnet 5 at $3 and $15; Claude
Haiku 4.5 at $1 and $5. Cache reads run at roughly 0.1x input cost.[^7]

Per-interaction estimates, assuming prompt caching on the stable system prompt and
operation schema:

| Interaction | Opus 5 | Sonnet 5 |
|---|---|---|
| Generate a bassline | ~$0.09 | ~$0.05 |
| Agent task, 5 tool turns | ~$0.38 | ~$0.22 |
| Mix pass, 16 tracks | ~$0.15 | ~$0.09 |

Monthly, assuming a blend averaging roughly $0.20 per call:

| Usage | Calls per month | Opus 5 |
|---|---|---|
| Light | 50 | ~$10 |
| Moderate | 160 | ~$32 |
| Heavy | 900 | ~$180 |

These are estimates under stated assumptions, not quotes. Real figures depend
mostly on how much project context each call carries.

### <span class="n">9.3</span> Three things that would blow the budget

- **Not caching.** The system prompt, operation schema, and tool definitions are
  stable across a session. Cached they cost roughly a tenth. Verify with
  `cache_read_input_tokens`; if it is zero, something volatile such as a timestamp
  or a UUID is silently invalidating the prefix.
- **Runaway agent loops.** A task budget gives the agent a token ceiling it is
  aware of, so it paces itself and finishes gracefully instead of spiralling.
- **Not routing by difficulty.** Haiku is fine for intent parsing and simple
  parameter changes; reserve the expensive model for musical reasoning.

## <span class="n">10</span> Staged plan

Each stage ends in something musically real, which is the point.

| Stage | Build | Ends with |
|---|---|---|
| 0 | Duplex stream, sample-accurate clock | A metronome that does not drift |
| 1 | Block graph, transport, command ring, headless render | The same render twice, bit-identical |
| 2 | Op log, project schema, undo, save and load | A project file that diffs in git |
| 3 | Sampler and one synth, voice allocation | A drum loop from a step sequencer |
| 4 | Patterns, playlist, piano roll | An arranged 8-bar loop |
| 5 | Mixer, built-in effects, PDC | A mixed loop |
| 6 | CLAP adapter, then VST3 and AU shim | Your own plugins in your own DAW |
| 7 | Recording, calibration, retrospective take | A recorded part, in time |
| 8 | Generative MIDI, then the agent | An instruction that edits the project |

MIDI input should land earlier than it feels necessary, somewhere around stage 3.
CoreMIDI supplies timestamps that convert to sample offsets within the current
block, and playing notes by hand surfaces timing bugs that no test will.

## <span class="n">11</span> Explicitly out of scope

For a solo project this section matters more than the feature list.

| Not building | Reason |
|---|---|
| Notation and score editing | Enormous, and unused |
| Video sync | Different product |
| Surround and Atmos | Different product |
| VST2 hosting | Legally unavailable[^6] |
| AAX | Requires Avid partnership |
| Browser as a primary target | Plugins settle it |
| Audio warping in v1 | See below |

**Audio warping is deferred, not rejected.** Clips play at their recorded rate in
v1, which means setting tempo before tracking, as one would when playing to a
click. This avoids a time-stretch algorithm, transient detection, and warp markers
entirely. The f64-beats time model in section 6 is what keeps the door open, and
adding warping later is then a feature rather than a rewrite.

## <span class="n">12</span> Open questions

1. **Name.** Unresolved.
2. **VST2-only exposure.** Auditing the plugin folders will show how much of the
   library is unreachable. If a favourite synth is on that list it is a real
   constraint to design around.
3. **Comping design.** Identified as the place to beat FL, but the actual take-lane
   and comp model is unspecified.
4. **Stretch algorithm**, whenever warping arrives. Rubber Band is GPL or
   commercial, elastique is licensed, and writing a phase vocoder or WSOLA is a
   deep DSP learning area in its own right.
5. **Agent tool schema.** How the project document is serialised into model context
   is undesigned, and it will determine both quality and per-call cost.
6. **Sample rate conversion** for samples that do not match the project rate.

[^1]: Greysound, "Studio quality music. Human-made, AI-assisted." [greysound.ai](https://greysound.ai/)
[^2]: "CLAP vs VST3 (2026): Which DAWs Support CLAP & Is It Worth It?" Spectral Colors, 2026. [spectral-colors.com](https://spectral-colors.com/news/clap-vs-vst3-2026/)
[^3]: "CLAP Plugin Format: Everything Music Producers Need to Know in 2026." ProducerGrid. [producergrid.com](https://producergrid.com/blog/clap-plugin-format-everything-you-need-to-know/)
[^4]: Jatin Chowdhury, "juce_clap_hosting: CLAP plugin hosting in JUCE." GitHub. [github.com](https://github.com/jatinchowdhury18/juce_clap_hosting)
[^5]: "CLever Audio Plug-in." Wikipedia. [en.wikipedia.org](https://en.wikipedia.org/wiki/CLever_Audio_Plug-in)
[^6]: "Virtual Studio Technology." Wikipedia. [en.wikipedia.org](https://en.wikipedia.org/wiki/Virtual_Studio_Technology)
[^7]: "Pricing." Anthropic. [anthropic.com](https://www.anthropic.com/pricing)
