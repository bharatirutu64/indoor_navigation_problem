# Campus Compass — Indoor Navigation Demo

This is a standalone browser prototype for corridor-based indoor navigation.

## Run

1. Extract the ZIP.
2. Open `index.html` in Chrome/Edge.

No Node.js, Python, database, API key, GPS, Google Maps or internet connection is required.

If Chrome blocks local behavior on your computer, run a tiny local server:

### Windows
Open Command Prompt in this folder and run:

    py -m http.server 8000

Then open:

    http://localhost:8000

## What works in this demo

- First-floor indoor floor plan
- Searchable start and destination
- Click a room to select it
- A* pathfinding
- Corridor-only graph routing
- Route drawn over the floor plan
- Current-location marker
- Simulated QR-code positioning
- Zoom in / zoom out / reset
- Basic turn-by-turn directions

## Important

The floor plan in this demo is a simplified digital reconstruction based on the supplied first-floor photograph. It is NOT a dimensionally surveyed CAD map.

For the real SITCOE system:

1. Replace the SVG geometry with the original CAD/DWG/DXF/PDF floor plan.
2. Precisely mark corridor centerlines.
3. Mark every room entrance.
4. Mark stairs and lifts.
5. Create accurate node/edge coordinates.
6. Add real QR-code IDs at known locations.
7. Add the second and later floors.
8. Connect stairs/lifts between floors.
9. Integrate this indoor engine into the existing Campus Compass application.

The important architecture is already demonstrated:

FLOOR PLAN + NAVIGATION GRAPH + A* = INDOOR ROUTE
