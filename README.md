# Cargo Chaos 🚢

A cooperative cargo-ship adventure. Crew a small vessel with friends, operate its equipment, keep the ship running, survive trouble at sea, and deliver a fragile package in one piece.

## Stage 1: Ship exploration prototype

The current browser prototype includes:
- A stylized 3D cargo ship, bridge, containers, deck crane and ocean.
- A walkable ship deck and a simple player character.
- First-person and third-person cameras.
- A working crane interaction prototype.
- A fragile package inspection prompt.
- Animated ocean and gentle ship movement.

## Play locally or publish

This is a no-build browser project. Open `index.html` through a static web host. Three.js is loaded from a CDN.

### GitHub Pages
1. Open the repository Settings.
2. Select **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**, then save.
5. Wait for GitHub Pages to publish the site.

## Controls

| Key | Action |
|---|---|
| WASD | Walk around the deck |
| Mouse | Look around |
| C | Switch first-person / third-person |
| E | Interact with nearby ship objects |
| ESC | Release mouse |
| Shift | Move faster |
| Arrow keys | Rotate crane while operating it |
| R / F | Lower / raise crane hook while operating it |

Click the game after boarding to capture the mouse. Press Escape to release it.

## Planned development

1. **Stage 1** – 3D ship and exploration prototype.
2. **Stage 2** – Online multiplayer rooms, joining friends, synchronized players.
3. **Stage 3** – Ship steering, throttle, engine and ship physics.
4. **Stage 4** – Functional crane and cargo handling.
5. **Stage 5** – Damage, repairs, fuel and ship systems.
6. **Stage 6** – Pirate encounters and defensive gameplay.
7. **Stage 7** – Storms, waves, fog and ocean hazards.
8. **Stage 8** – Delivery missions, package condition and rewards.

The multiplayer server will be added separately so the browser client can be hosted on GitHub Pages and the server on Render.
