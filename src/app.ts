// src/app.ts

// This file serves as the main entry point for our application.
// It initializes the MainApp and sets up the initial simulation.

// First, we import the MainApp class which encapsulates our entire simulation logic.
import { MainApp } from "./main";

// We also need the Three.js Vector3 for defining initial positions and velocities.
import * as THREE from "three";

// Import necessary interfaces for defining initial satellite data.
import { ISatelliteData } from "./interfaces/ISatelliteData";
import { EARTH_RADIUS_METERS } from "./physics/constants";

// ----------------------------------------------------
// Main application setup function
// ----------------------------------------------------

/**
 * Initializes and starts the satellite tracking application.
 * This function will be called when the HTML document is fully loaded.
 */
function initializeApp(): void {
  console.log("App: Initializing application...");

  // 1. Get the HTML container element.
  // We expect an HTML element with the ID 'app' to exist in index.html.
  const appContainer = document.getElementById("app");
  if (!appContainer) {
    console.error(
      "App: HTML element with ID 'app' not found. Cannot initialize application."
    );
    return;
  }

  // 2. Create an instance of our MainApp.
  // We pass the appContainer to MainApp so it knows where to render the 3D scene.
  const app = new MainApp(appContainer);
  console.log("App: MainApp instance created.");

  // 3. Define initial satellite data.
  // This is a sample satellite. You can change these values later.
  // Position and velocity are in meters and meters/second, respectively.
  // Convert to kilometers for display consistency if needed, but physics engine works in meters.
  const initialPosition = new THREE.Vector3(
    // EARTH_RADIUS_METERS + 5000 * 1000, // Earth's radius + 500 km altitude
    15000000,
    0,
    0
  );
  // Initial velocity to achieve a roughly circular orbit (approx. 7.6 km/s at LEO).
  // The exact orbital speed depends on altitude, this is just a starting estimate.
  // This velocity is perpendicular to the position vector for a circular orbit.
  const initialVelocity = new THREE.Vector3(
    0,
    6000, // approx. 7.6 km/s in meters/second
    500
  );

  const sampleSatelliteData: ISatelliteData = {
    id: "satellite-001",
    name: "My First Satellite",
    initialPosition: initialPosition,
    initialVelocity: initialVelocity,
    selectedIntegrator: "Euler-Cromer",
  };

  // 4. Set the initial satellite data in the MainApp.
  app.setInitialSatelliteData(sampleSatelliteData);
  console.log("App: Initial satellite data set.");

  // 5. Create the satellite in the simulation.
  app.createSatellite();
  console.log("App: Satellite created in simulation.");

  // 6. Optionally, set the integrator method and simulation speed (already set in MainApp constructor, but can be changed here).
  // app.setIntegratorMethod("rungeKutta4"); // Uncomment to use Runge-Kutta 4th order
  // app.setSimulationSpeed(2000); // Uncomment to change speed (e.g., 2000x)

  // 7. Play the simulation (it starts paused by default in MainApp).
  app.playSimulation();
  console.log("App: Simulation started.");

  // ----------------------------------------------------
  // Optional: Expose the app instance to the window for debugging
  // This allows you to access `app` from your browser's console (e.g., `window.app.pauseSimulation()`)
  // ----------------------------------------------------
  (window as any).app = app;
  console.log("App: MainApp instance exposed as window.app for debugging.");
}

// ----------------------------------------------------
// Event Listener: Start the app when the DOM is fully loaded
// ----------------------------------------------------
// This ensures that our HTML element with ID 'app' is available before we try to access it.
document.addEventListener("DOMContentLoaded", initializeApp);
console.log("App: DOMContentLoaded listener registered.");
