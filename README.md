# Cargo Chaos 🚢

A stylised co-op cargo adventure. The crew starts at a working port, loads the ship, collects a fragile package and then heads out across the ocean. Nobody is assigned a permanent job: players are free to take the wheel, operate cranes, repair systems or defend the ship.

## Current build: Port Departure foundation

This is a redesigned single-player browser prototype focused on the game's opening location.

### Included
- A larger docked cargo ship with bridge, cargo deck, containers, railings and boarding ramp.
- A port terminal with a warehouse, office, yard markings, storage areas and a large shore-based gantry crane.
- Four large, coloured metal cargo containers staged on the dock; the ship deck starts empty.
- An elevated crane operator platform reached by a climbable ladder. The crane moves independently while the operator stays at the controls.
- Crates can be loaded onto the ship by carrying them over the cargo deck before releasing.
- A special package inside the warehouse that the player can collect and carry aboard.
- A departure checklist tracking all four crates and the special package.
- First-person and third-person cameras, mouse look, jumping and on-foot movement. The character's face is hidden in first person so it does not block the view.
- A shove key placeholder for the later multiplayer player-physics feature.

### Controls

| Key | Action |
|---|---|
| WASD | Walk around the port and ship |
| Mouse | Look around |
| C | Switch first-person / third-person |
| E | Interact, collect package, use crane, attach/release cargo |
| F | Shove placeholder (multiplayer feature later) |
| Shift | Move faster |
| Space | Jump |
| ESC | Release mouse |
| **Crane mode** | |
| W / S | Move crane bridge along the dock |
| A / D | Move crane trolley across the ship |
| R / F | Lower / raise hook (R lowers, F raises) |
| E | Attach a nearby crate or release the held crate |
| Q | Exit crane controls and return to walking |
| W / S near the crane ladder | Climb up / down |

Click the game after entering the port to capture the mouse. Mouse look also works while operating the crane. Press Escape to release the mouse.

## Technology

- Three.js from a CDN
- Plain HTML, CSS and JavaScript
- No build step or local installation
- Intended for GitHub Pages frontend hosting
- Planned Node.js + Socket.IO multiplayer server on Render

## Roadmap

1. **Port Departure foundation** – port, larger ship, movement, shore crane, four crates and special package.
2. **Polish and physics** – reliable collisions, better character movement, crate physics, crane feedback, ship boarding and interaction improvements.
3. **Multiplayer** – online rooms, friends joining, synchronized players and shared world interactions.
4. **Ship operations** – steering, throttle, engine room, anchor, fuel and ship physics.
5. **Cargo and damage systems** – package condition, securing cargo, hull damage, repairs and pumps.
6. **Pirate encounters** – non-graphic arcade-style ship defence and NPC behaviour.
7. **Ocean conditions** – storms, waves, fog, shallow water and navigation hazards.
8. **Voyages and progression** – deliveries, rewards, routes and new ports.

The crew has no fixed jobs or permanent captain. Anyone can take over an available control, and teamwork is rewarded rather than enforced.
