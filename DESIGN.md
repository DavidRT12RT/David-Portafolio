---
name: David Arcos Melgarejo
description: A walk through Thomas Cole's city in afternoon light, where sun and haze carry the portfolio.
colors:
  ground: "#ebe5dd"
  ground-lit: "#f3eee7"
  stone: "#d3c7b8"
  stone-deep: "#b9aa97"
  ink: "#24170f"
  ink-soft: "#5a4535"
  ink-mute: "#76624f"
  gold: "#b4843f"
  gold-deep: "#85581f"
  gold-light: "#d9b06a"
  gold-ink: "#62421a"
  sienna: "#9c4a24"
  shade: "#21150e"
  shade-lit: "#2d1f15"
  shade-line: "#4a3828"
  marble: "#f7f2ea"
  marble-dim: "#cfc1ae"
  marble-mute: "#a59482"
typography:
  display:
    fontFamily: "Cormorant SC, serif"
    fontSize: "clamp(3.1rem, 6.4vw, 8rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "0.02em"
  sign-greek:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "min(clamp(3.25rem, 7.4vw, 6rem), calc((100vw - 2.5rem) * 1.36 / var(--glyphs, 6)))"
    fontWeight: 330
    lineHeight: 0.92
    letterSpacing: "0.04em"
    fontVariation: "'FLAR' 100, 'VOLM' 0"
  headline:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.3vw, 2.125rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 460
    lineHeight: 1.25
  body:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    fontVariation: "'FLAR' 0, 'VOLM' 0"
  body-note:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  button:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    letterSpacing: "0.01em"
  label:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.16em"
    fontFeature: "'tnum' 1"
  caption:
    fontFamily: "Commissioner, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  none: "0px"
  focus: "2px"
  scrollbar: "4px"
  full: "9999px"
spacing:
  gutter: "1.25rem"
  gutter-md: "2.5rem"
  container: "90rem"
  nav-height: "4rem"
  hit: "2.75rem"
  button-x: "1.35rem"
  button-height: "2.875rem"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 1.35rem"
    height: "2.875rem"
  button-solid-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
  button-solid-on-shade:
    backgroundColor: "{colors.marble}"
    textColor: "{colors.shade}"
  button-outline:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 1.35rem"
    height: "2.875rem"
  button-outline-hover:
    textColor: "{colors.gold-deep}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.marble}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
  button-ink-hover:
    backgroundColor: "{colors.gold-deep}"
  cartela:
    backgroundColor: "{colors.marble}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 1.25rem"
  guide-card:
    backgroundColor: "{colors.marble}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 0.875rem"
    width: "19.6875rem"
  nav-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-soft}"
    height: "4rem"
---

# Design System: David Arcos Melgarejo

## Overview

**Creative North Star: "The City in Afternoon Light"**

The site is a walk through the city of Thomas Cole's *The Consummation of Empire* (1836) late in the day. Every colour is taken from that painting: the hazy sky is the page's ground, sunlit marble carries labels, gilding marks what matters, and the umber of its deepest shade becomes the portico where the works stand, open onto Frederic Church's Parthenon. Rooms follow one another down a single scroll; each holds a marble cast from SMK's Royal Cast Collection, or a full-screen painting, standing in haze until the visitor's arrival lets the sun find it.

Depth is light, not chrome. Figures are lit in WebGL by a moving sun, a sky fill and a warm bounce; paintings are drawn from a depth map so near things move against far ones, the light relights their relief and the distance dissolves into the ground first. Text obeys the same law: it comes out of the haze as the room's light rises. Surfaces are square, flat slips of marble and hairlines of stone; there are no cards, no glass, no accent neon.

Density is low and the pacing is architectural: a room is a viewport or more, with the sign set large and the reading column narrow. Everything still reads with JavaScript, WebGL or motion off.

**Key Characteristics:**
- One palette, from one painting: sky ground, umber ink, gilding, sunlit marble, portico shade.
- Two tone contexts: umber on the sky, marble in the shade; components read tones, never fixed colours.
- Light and haze are the only gradients and the only motion grammar.
- Museum cartelas with real collection data are the component language.
- Bilingual room signage: the Greek name in flared Commissioner, the visitor's language beneath.
- Square corners everywhere; hairlines instead of boxes.

## Colors

Afternoon in Cole's city: a warm, low-chroma sky, umber for everything written, and gilding used sparingly as the light's own mark.

### Primary
- **Gilding** (#b4843f): the light made visible. Hover fill of solid buttons, the experience route as it fills, the navigation's active underline, Skills leader lines, the scrollspy handle, scrollbar hover. Never set as small text on the sky.
- **Deep Gold** (#85581f): the sky context's accent for type. Greek room signs, dates and step numbers, cartela inventory lines, outline-button hover, focus ring, caret.
- **Light Gold** (#d9b06a): the shade context's accent. Greek signs and numerals over paintings and in the portico; also the text-selection fill and the brightest stop of the name's glint.
- **Gilding for Ink** (#62421a): gold deep enough for small type laid directly over a painting's sky (the hero's role line).

### Secondary
- **Sienna** (#9c4a24): kept for rare emphasis. It is defined but not currently placed on any surface; leave it unused rather than spending it decoratively.

### Neutral
- **Hazy Sky** (#ebe5dd): the page ground, painted on `html`. It is also the colour every painting and figure dissolves into, so it must stay identical in CSS, the painting renderer and the gallery scene.
- **Lit Sky** (#f3eee7): the slightly brighter ground of the scrollspy tray.
- **Stone** (#d3c7b8): hairlines and dividers on the sky.
- **Deep Stone** (#b9aa97): cartela borders, fallback-print frames, scrollbar thumb.
- **Umber Ink** (#24170f): strong text on the sky, the solid button's block, the ink button in any light.
- **Soft Umber** (#5a4535): secondary text, notes, the local half of room signs.
- **Mute Umber** (#76624f): tertiary text, tags, credits, inactive steps.
- **Portico Shade** (#21150e): the ground of the shade context; the portico's roof and floor and the shade behind the ΕΡΓΑ sign over Church's view; the reduced-motion method room.
- **Lit Shade** (#2d1f15) and **Shade Line** (#4a3828): a lifted shade surface and the hairline colour in shade.
- **Sunlit Marble** (#f7f2ea): cartelas, the guide card, the open menu, and strong text in shade.
- **Dim Marble** (#cfc1ae) and **Mute Marble** (#a59482): soft and mute text in shade.

### Named Rules
**The One Painting Rule.** Every colour on the page exists in Cole's painting. A new colour needs a source in one of the site's paintings, not in a UI kit.

**The Tone Context Rule.** Components read `tone`, `tone-soft`, `tone-mute`, `tone-line`, `tone-accent` and `tone-ground`, never ink or marble directly. On the sky (`:root`) the tones resolve to umber, stone and deep gold over the sky; inside `.on-shade` they resolve to marble, shade line and light gold over the portico shade. The only fixed-colour components are the cartela family (always marble and ink) and the ink button (always umber with marble).

**The Gold Ladder Rule.** Gold is chosen by what it sits on: gilding for fills and lines, deep gold for type on the sky, gilding-for-ink for small type over a painting's sky, light gold for type in shade.

## Typography

**Display Font:** Cormorant SC 600 (with serif fallback), for the name only.
**Body Font:** Commissioner (with ui-sans-serif, system-ui fallback), a variable face by the Greek designer Kostas Bartsokas with Greek script, loaded with the FLAR, VOLM and slnt axes.

**Character:** Commissioner does all the reading plain (FLAR 0) and all the signage flared (FLAR 70 to 100), so one family moves from text to inscription along its own axis. Cormorant SC appears once, as the name set in the painting's sky.

### Hierarchy
- **Display** (Cormorant SC 600, clamp(3.1rem, 6.4vw, 8rem), line-height 0.9, uppercase, 0.02em; 12.6vw on phones): the name in the first viewport, umber with a lit lower edge and a soft cast shadow.
- **Greek Sign** (Commissioner 330, FLAR 100, clamp(3.25rem, 7.4vw, 6rem), line-height 0.92, 0.04em): the room's Greek name, in the tone accent, mixed toward the ground by the room's light. Long names shrink to fit the phone's width: the size is capped at (100vw - 2.5rem) x 1.36 divided by the name's letter count (`--glyphs`, set by the sign), so ΓΙΓΑΝΤΟΜΑΧΙΑ never overflows.
- **Headline** (Commissioner 300, clamp(1.5rem, 2.3vw, 2.125rem), line-height 1.1, -0.01em): the room's local-language title beneath the Greek; its highlighted phrase steps up to 500 in the strong tone.
- **Title** (Commissioner 460, 1.375rem, tight): job roles, Athena's capabilities, the viewer's project title. Painting-stage step titles use 440 at clamp(1.6rem, 2.4vw, 2.25rem).
- **Narration** (Commissioner 360, clamp(1.3rem, 2.1vw, 2rem), line-height 1.3, FLAR 50; 38ch, centred): the single lines spoken over the animated giants. The oracle's side captions run 1.0625rem to clamp(1.0625rem, 1.3vw, 1.25rem) at 1.6 in the soft tone, 46ch.
- **Body** (Commissioner 400, 1rem to 1.0625rem, line-height 1.75; measure 62 to 64ch): history and about text. Room notes run 1.0625rem at 1.55 with a 46ch measure.
- **Label** (Commissioner 500, 0.75rem, 0.16em, uppercase, tabular figures): cartela inventory lines and method detail labels; dates use 0.8125rem at 0.1em.
- **Caption** (Commissioner 400, 0.75rem, line-height 1.45): painting credits and figure captions, in the mute tone with the work's title in the soft tone as `cite`.

### Named Rules
**The Flare Axis Rule.** Signage flares, reading never does. Body sets FLAR 0; narration over a painting takes a little flare (FLAR 50 for the giants' lines, 60 for the oracle's step titles), the hero tagline FLAR 70, the about statement FLAR 80, Greek signs and the method's step numerals FLAR 100.

**The Own Slant Rule.** Transliterations lean on Commissioner's slant axis (slnt -10), never a synthesized italic.

**The One Name Rule.** Cormorant SC is the name's face and nothing else's.

**The Room Sign Naming Rule.** Each room carries one capitalised Ancient Greek noun with its transliteration and gloss: ΛΟΓΟΣ (about), ΟΔΥΣΣΕΙΑ (experience), ΜΕΘΟΔΟΣ (method), ΤΕΧΝΗ (skills), ΜΑΝΤΕΙΟΝ (the oracle), ΕΡΓΑ (projects), ΓΙΓΑΝΤΟΜΑΧΙΑ (the battle of the giants), ΧΑΙΡΕ (contact). The Greek is marked `lang="el"`, sits above the existing local-language title as part of the same heading, and never replaces it.

## Layout

Paintings and figures take turns down the page: Cole's city (first viewport), ΛΟΓΟΣ with Plato, ΟΔΥΣΣΕΙΑ opened by Rubens and kept by Homer, ΜΕΘΟΔΟΣ on Bayeu, ΤΕΧΝΗ with the discus thrower and the treasury's coin cabinet beneath him, ΜΑΝΤΕΙΟΝ on Miola's *The Oracle* and then Athena, ΕΡΓΑ before Church's Parthenon, ΓΙΓΑΝΤΟΜΑΧΙΑ on Jordaens' animated *Fall of the Giants*, ΧΑΙΡΕ with Apollo. A painting room ends by receding into the haze straight into the next room.

A single column of rooms inside a 90rem container with 1.25rem gutters on phones and 2.5rem from 768px. Room rhythm is measured in viewport units, not a spacing scale: rooms open 24 to 26vh below their top on desktop and close with 12 to 30vh. Within a room, text takes one side (44 to 54% of the width) and the figure stands on the other; `data-guide-side` names which bottom corner the guide card takes.

Pinned scenes are built on one primitive, a scroll stage: a tall section with a sticky 100svh stage whose progress (0 to 1) drives the scene. Observed heights: the first viewport 165svh, the Rubens opening 190svh, Skills 230vh, the colonnade 100svh plus 70svh per further work (the Parthenon view beneath it holds still for the same span and reaches 24svh beyond it at each end), the Bayeu walk 100svh plus 52svh per shot, the oracle 100svh plus 58svh per stop (six stops), the giants 440svh. With reduced motion, the painting stages collapse to 100svh or a still layout.

Below 768px each figure stands alone above its room (a 58svh band with its cartela at its feet), and the room's text slides over it on a curtain of the tone ground, feathered 5rem at the top and 4rem at the bottom. The navigation bar is 4rem tall; touch targets are at least 2.75rem.

## Elevation & Depth

Depth comes from light in the scene, not from stacked UI. The page is flat: hairlines separate, and the only lifted objects are marble slips that hang in the light, the cartelas, which get a lit top edge and a soft umber cast shadow. In shade their border drops away and the shadow deepens to black. The gallery itself is lit by a warm sun (#fff4e4) as a key spotlight that follows the pointer, a hemisphere sky fill and a warm bounce, rendered with neutral tone mapping; every material's final colour is mixed toward its room's ground by the haze uniform after tone mapping, so a fully hazed surface is exactly the page colour.

Paintings sit under scrims taken from their own umber (rgba(28, 16, 9) at 0.5 to 0.9; Jordaens' darker storm takes rgba(20, 12, 7) at 0.55 to 0.9), deepened only where words stand, and fading out as the camera pulls back. The portico frames Church's Parthenon in the portico shade instead (rgba(33, 21, 14)): its roof falls from 0.88 at the top to clear by 42% of the height, its floor from 0.82 to clear by 32%, and an extra shade gathers behind the room's sign on arrival (a radial pool at the top left, a top-down band on phones) and leaves with the sign. Beyond the stage the view eases into the sky through ground-coloured feathers.

In the colonnade each screenshot stands bare on its capital, with no frame (the owner's call), a softly self-lit panel (diffuse #9e9e9e, emissive at 0.5) under its own shaft of sun: an additive beam in gilded shaft light (#f2c27a) with 80 motes of dust turning in it, strongest in its lower stretch, that comes down onto the work and fades away across its upper part, over straight lines on screen from the work's top edge to a little under halfway down it (both projected to drawing-buffer pixels each frame). Where it lands, the light is multiplied over the screenshot: warm at the top edge, falling off down the work and toward its sides into the portico's shade (0.8 at its foot), so it lights the work without ever washing it out. The column's spotlight takes the same warm colour and lights the capital. On desktop the panels hang 23% down the viewport, low enough for each shaft to be seen falling from the roof.

### Shadow Vocabulary
- **Cartela on the sky** (`box-shadow: 0 1px 0 rgba(255,255,255,0.7) inset, 0 18px 36px -22px rgba(60,36,16,0.45), 0 2px 6px rgba(60,36,16,0.12)`): every museum label in sunlight.
- **Cartela in shade** (`box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 40px -18px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.35)`): labels on the colonnade.
- **Name in the sky** (`text-shadow: 0 1px 0 rgba(255,248,236,0.45), 0 14px 34px rgba(60,36,16,0.2)`): the display name only.
- **Fallback print** (`box-shadow: 0 24px 50px -30px rgba(60,36,16,0.6)`): SMK photographs shown when WebGL is absent.

### Named Rules
**The Light and Haze Rule.** Light and haze are the only gradients. Anything the sun has not reached dissolves into its room's ground: figures through the haze uniform, paintings distance-first through their depth map, text through `--room-light` mixing its colour toward the ground. Vapour, storm cloud and lightning are the same weather, drawn in the painting's own renderer rather than in CSS.

**The Lit Slip Rule.** Only marble slips cast shadows, and always soft and umber (black in shade). No other surface is lifted.

## Shapes

Square corners throughout: buttons, cartelas, the guide card, the menu, the viewer and the colonnade's panels have no radius. Rounding appears only where the form is round: the 7px route stations of the history, the scrollspy's gold handle (fully round), the focus ring's 2px softening and the 4px scrollbar thumb. Borders are 1px hairlines in the tone line colour; outline buttons draw theirs at 38% of the strong tone. Architecture supplies the silhouettes: Ionic columns with volutes, egg-and-dart, bead-and-reel, 24 flutes and Attic bases, with a 20-flute Doric shaft as the fallback.

## Components

### Buttons
Quiet, square blocks that take the room's tone.
- **Shape:** square (0px), at least 2.875rem tall, 1.35rem side padding, 0.6rem icon gap.
- **Solid:** the strong tone as a block with the ground as text (umber on the sky, marble in shade). Hover fills with gilding and umber text.
- **Outline:** a 1px border at 38% of the strong tone; hover turns border and text to the tone accent. Also used square (3rem, 3.5rem from 768px) for arrow controls over a translucent ground at 80%.
- **Ink:** always umber with marble text, for labels that must read in either light (the colonnade's "view screens"); hover deepens to deep gold.
- **States:** 0.35s ease-out-expo on colour, border and transform; pressed drops 1px. Focus is a 2px tone-accent outline offset 3px.

### Cartela (signature)
The museum label is the component language of every exhibit.
- **Background / text:** sunlit marble with umber ink in both contexts.
- **Border:** 1px deep stone at 60% on the sky; none in shade.
- **Content:** title in Title weight, an inventory line in Label style in deep gold (SMK inventory numbers, project tags joined with middots), then description in soft umber.
- **Uses:** colonnade labels (min(80vw, 23rem); min(26vw, 23rem) from 768px; padding 1rem 1.25rem; the focused label opens its description by animating grid rows), phone figure captions (34ch, 0.5rem 0.75rem), the guide card and the open menu.

### Room Sign
The heading of every room: the Greek name as a flared inscription and the local title beneath, in one heading element with a 0.35em gap, optionally followed by a 46ch note in the mute tone.

### Navigation
- **Bar:** fixed, 4rem, clear over the first painting so its sky reaches the top; once the hero has passed it takes the tone ground at 92% with a tone-line bottom border (500ms transition).
- **Links:** 0.875rem in the soft tone; the current room is strong with a 1px gilding underline that grows to full width. The current room carries `aria-current="location"`.
- **Language toggle:** ES / EN at 0.8125rem and 0.12em; the active language strong, the other mute.
- **Mobile:** a square 2.75rem trigger that morphs open into a cartela listing each room with its Greek name.

### Guide Card and Floor Plan
A 19.6875rem marble card in the bottom corner named by the room: the room's title, its Greek name in deep gold, the slanted transliteration and gloss, then the figure's title, medium, origin and SMK inventory. It hides at the entrance, at the credits, while two rooms share the screen, and over any element marked `data-guide-cover` (every painting stage).

### Painting Stage
A painting filling its room, drawn by a plain WebGL2 renderer from the painting and its depth map, with the plain image placed identically underneath until the canvas takes over (and instead of it without WebGL). Its camera is directed by a function of scroll progress and viewport size that returns a shot:
- **Direction:** a function of scroll progress, viewport width and height, and `time` in seconds (which runs only while motion is allowed), returning a shot.
- **Shot:** `center` (a point of the painting) held at `anchor` (a point of the screen), `zoom` (1 covers the screen), optional `dolly` toward `dollyToward`, `haze` (0 clear, 1 dissolved into the ground), `spot` (the rest falls into shade around the anchor), `mist`, `vapor` (a column rising from a point of the painting, at a strength), the resting `light`, and for animated paintings `layers` (each figure's offset and rotation), `storm` (cloud over the far sky), `flash`, `bolt` and `shake`.
- **Animated paintings:** an artwork may declare a `plate` (the painting with its figures painted out) and `layers` (premultiplied cut-outs, each with its rect, depth and pivot). Layers are projected through the same camera window and parallax as the plate and lit by the same spot, sun, flash and haze, so a moving figure never leaves the painting's light. Lightning is drawn in its own additive pass over the figures. The plain image always keeps the whole, unmoving painting.
- **Conventions:** wide screens hold details right of centre, clear of text on the left; tall screens hold them low, under text at the top. Moves use smoothstep or smootherstep easing; long travels dip the zoom mid-flight. Each room ends by hazing the painting into the ground. A 1.06 overscan keeps parallax from running out of canvas; phones decode at most 2560px.
- **Credit:** every painting is credited on screen in Caption style (artist, cited title, date, collection).

### Narrated Painting (ΜΑΝΤΕΙΟΝ, ΓΙΓΑΝΤΟΜΑΧΙΑ)
A painting walked in stops, with text only while the camera holds. The room's sign stands low on the left over a bottom scrim; then each stop shows a title and its text revealed word by word out of blur (8 to 10px, 18 to 30ms per word), plus a detail label in Label style. Wide screens set the oracle's captions at 36% width on the side away from the detail, with the scrim following that side; tall screens hold the detail high and the words at the foot. The giants' walk works the same way, its captions on the side away from the detail, each closing on an "In practice" line that names the project where the practice runs and links to its column (the last links back to the works). While the camera travels, no text shows. The credit sits top right on phones and bottom right from 768px. In the first room the renderer also keeps Cole's city alive. Smoke rises from the altars and braziers he painted (several plumes, each with its height, width, growth, wind drift and seed). His own seven clouds sail on the same wind: lifted off the sky (LaMa painted the sky back behind them, their colour unmixed from it so they composite back exactly), drawn as sky-masked layers that show only where the depth map's blue channel marks open sky, the high ones fastest (about 12px a second on a wide screen); each starts where he painted it, leaves past the edge of the city and returns from behind the column. Gulls circle Athena's column: one small 3D model (a turned body with head, beak and fanned tail; each wing an arm and a hand jointed at shoulder and wrist, pale grey above with black tips, white beneath) drawn instanced in a multisampled pass, flapping in bursts and gliding with lowered hands between them, banked into their turns, lit by the painting's sun, sky and warm bounce with light glowing through the wings, and hidden wherever the painting stands nearer, so on the far side of a circle a gull passes behind the statue. The green channel marks the water; its ripples and glints are built but switched off at the owner's request, to keep Cole's still harbour. Miola's oracle gives way to Athena, whose four capabilities, introduced by one lead line, are hairline-ruled entries: title, text, a deep-gold tag line and a link to the work that runs it, which scrolls the colonnade to that column. Jordaens' giants move on their own, under drifting storm cloud and thunderbolts that make the struck giant flinch and the camera shudder.

### Coin Cabinet (ΤΕΧΝΗ)
The stack itself, in the second half of ΤΕΧΝΗ: above it the discus thrower only names each part of the craft at its place on the figure, with the metal its coins are struck in beneath the name in Label style. The cabinet stands in the treasury's shade: the room fades from the sky ground into umber over 24vh (interpolated in oklab) and back over 22vh below. It has no sign of its own; a lead paragraph in light 340 weight opens it, aligned with the coins. Below are four hairline-ruled trays, one per part of the craft, each in its metal: AI in gold, frontend in silver, backend in bronze, cloud and DevOps in electrum. The tray label is the skills category title with the metal in Label style beneath it, and the coins sit in an auto-fill grid (7.5rem minimum, 6.25rem on phones) so every tray shares one coin size. Each coin rests in a well cut into the tray, a dark recess 7% wider than the coin with an inset shadow, and carries its name below, a detail taken from the stack's own entry where it had one (Agents SDK, Object Detection, PHP, CI/CD, AWS's services), and, where a project's tags name it, "In the works" with a stacked link per project that scrolls the colonnade to that column. Under each tray an "Also" line lists the stack's entries no coin carries (the AI practices, REST APIs and microservices, serverless functions), so nothing of the stack is lost. The room's guide steps aside while the cabinet fills the screen. The coins are struck at runtime from the brands' Simple Icons marks (CC0 path data; no credit line on screen, at the owner's request), with no image files: a height field holds the irregular flan, raised rim, 52 beads, the rim legend in Cormorant SC and the emblem, softly rounded with a faint grain. From it come a normal map, a colour map (polished on the high relief, patina in the hollows) and a roughness map. A legend-only coin (YOLO) carries its name as the emblem. They are drawn in metal, in an orthographic canvas over the vitrine that exists only while it is near, reflecting a vitrine environment: a dark case, a warm lamp above, a lit room behind the visitor and a cool side window. A warm lamp follows the pointer at 320px (230px on phones) and hangs from the viewport's ceiling for touch, so the light rakes across the relief as the visitor moves or walks by. It brightens with the room's light. The coin under the pointer, or holding focus, lifts 24px, grows 7% and turns toward the pointer, its soft shadow falling away from the lamp. Until a coin is struck, and wherever WebGL2 is missing, a flat coin in its metal with the emblem stands in the well.

### Colonnade (ΕΡΓΑ)
A pinned horizontal colonnade in a portico whose roof and floor are in shade and which opens onto Church's *The Parthenon*, laid beneath the gallery canvas (PorticoView) with its own camera: close on the temple's front, pulling back to the Acropolis, then panning with the colonnade more slowly, and receding into the haze at the end. One Ionic column per project, each carrying its screenshot under its own shaft of sun, with a cartela mounted below the capital, arrow buttons, a live counter on a small slip of shade (the tone ground at 85%, so it reads inside the focused work's shaft of light) and a full-screen viewer (a native modal dialog in the shade context that locks page scroll, steps images with arrow keys and announces "image n of m" politely). The controls fade with the square of the room's light, since bright labels on dark shade outlast the hazing stone. Once the sign steps aside (by 10% of the stage), the Parthenon's credit appears top right in Caption style; on phones the counter takes over the sign's place above the first panel at the same moment, while wide screens show sign and counter together.

### Method Walk (ΜΕΘΟΔΟΣ)
Bayeu's painting walked one detail per step: a large FLAR 100 numeral in the tone accent, the step title and text, and a detail label in Label style, beside a light pool on the detail. A six-column rail at the painting's foot jumps the scroll to each step and marks the current one with `aria-current="step"`. When the last step has been held, the whole painting recedes into the haze and the page goes straight on to ΤΕΧΝΗ.

## Do's and Don'ts

### Do:
- **Do** take every colour from the tone context: write `tone-*` utilities and wrap shaded rooms in `.on-shade`.
- **Do** bring new content in with light: tie it to `--room-light` (the `.lit` / `.lit-dim` mixes) or the haze uniform, and keep it fully visible by default.
- **Do** label every exhibit with real data in a cartela: SMK inventory for casts, real tags for projects, artist, title, date and collection for paintings.
- **Do** mark each painting stage with `data-guide-cover`, give it an `sr-only` heading or list carrying the same words its captions show one at a time, and use `aria-live="polite"` for counters that change with scroll.
- **Do** give every reduced-motion path a still layout: stages stop pinning; the method, oracle and giants rooms become the whole painting (70svh, on the portico shade) above a hairline-ruled list; layers, storm and lightning stop with the clock; pointer light and parallax stop; the treasury's coins lie still under a fixed lamp.
- **Do** ship every raster with its provenance written by `impeccable embed-prompt`, recording origin, licence, processing and use: a `<file>.json` sidecar beside each WebP (paintings, depth maps, statues, colonnade plates, and the SAM cut-out layers and LaMa-filled plates of animated paintings), an `impeccable:prompt` metadata entry inside PNG and JPEG files (project screenshots, the Open Graph card).
- **Do** keep the sky colour identical in CSS, the painting renderer and the gallery scene, so haze lands exactly on the page.

### Don't:
- **Don't** use gradients other than light and haze: the name's glint, scrims taken from a painting's own umber, the portico's shaded roof and floor over its view and the shade behind its sign, the feathers that ease that view into the sky, and the curtain's mask are the whole list.
- **Don't** round corners on buttons, cartelas, cards or panels.
- **Don't** set the name's Cormorant SC anywhere but the name, or let reading text flare.
- **Don't** set small gold type on the sky in gilding or light gold; use deep gold, or gilding-for-ink over a painting.
- **Don't** shadow anything but marble slips, and never with hard or offset shadows.
- **Don't** replace a room's local-language title with its Greek name.
