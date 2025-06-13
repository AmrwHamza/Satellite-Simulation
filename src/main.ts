// src/main.ts

// This file acts as the "orchestrator" or "main controller" for our simulation application.
// It brings together all the components we've built and makes them work in harmony.

// First, we import all necessary components from our custom files and external libraries.

// ------------------------------------------------------------------------------------
// Core Three.js library (for fundamental 3D elements and time management):
// ------------------------------------------------------------------------------------
import * as THREE from 'three'; // Imports the entire Three.js library and assigns it to 'THREE'.
                                // This allows us to access core objects like THREE.Clock and THREE.Vector3.

// ------------------------------------------------------------------------------------
// Our custom-built classes and interfaces:
// ------------------------------------------------------------------------------------

// ThreeSceneManager class:
// This is our recently created class responsible for setting up and managing
// the core Three.js scene components (scene, camera, renderer, lighting, and camera controls).
import { ThreeSceneManager } from './core/threeSceneManager';

// Earth class:
// Represents the Earth planet with its 3D model and rotation.
import { Earth } from './objects/earth';

// Satellite class:
// Represents the satellite, holding its physics state, visual mesh, and trajectory line.
import { Satellite } from './objects/satellite';

// PhysicsEngine class:
// The engine that calculates the motion of satellites based on physical laws.
import { PhysicsEngine } from './physics/physicsEngine';

// Interfaces (type definitions):
// Define the "shapes" of data, such as the structure of a physics state
// and the initial satellite data.
import {  ISatelliteData } from './interfaces/ISatelliteData';

// Custom types:
// Defines specific types like the available physics integration methods.
import { IntegratorMethod } from './utils/types';

// Physics constants:
// Values like Earth's radius and the conversion factor between units.
import {
    EARTH_RADIUS_METERS,
    METERS_TO_THREE_UNITS_FACTOR
} from './physics/constants'; // Make sure this path is correct based on your folder structure

/**
 * MainApp Class
 *
 * This class is the central point for the satellite simulation application.
 * Its responsibilities include:
 * 1.  Managing the 3D scene (with the help of ThreeSceneManager).
 * 2.  Managing the Earth and Satellite objects.
 * 3.  Starting, pausing, and resetting the physical simulation (using PhysicsEngine).
 * 4.  Updating the visual state of objects in each frame.
 * 5.  Providing a programmatic interface (APIs) to control the simulation from outside this class.
 */
export class MainApp {
    // ------------------------------------------------------------------------
    // Class Properties (What does this main controller own?)
    // ------------------------------------------------------------------------

    // Three.js Scene Manager:
    // This object is MainApp's personal assistant for all Three.js related matters.
    private sceneManager: ThreeSceneManager;

    // Simulation Objects:
    private earth: Earth;                  // Object representing the Earth.
    private satellite: Satellite | null = null; // Object representing the satellite. (Might not exist initially).

    // Physics Calculation Engine:
    private physicsEngine: PhysicsEngine;    // The object responsible for calculating satellite motion.

    // Time Management and Simulation Control Tools:
    private clock: THREE.Clock;            // A Three.js clock to track elapsed time between frames.
    private isPaused: boolean = true;      // A flag (true/false) to determine if the simulation is currently paused. (Starts paused).
    private simulationSpeedFactor: number = 1000; // Factor to accelerate the simulation (e.g., 1000 means 1000 times faster than real time).
    private fixedDeltaTime: number = 0.01; // A fixed time step (in seconds) for each physics update.

    // Initial Satellite Data:
    // We store this data to allow resetting the satellite to its initial state.
    private initialSatelliteData: ISatelliteData | null = null;

    /**
     * Constructor for MainApp (How to start the application).
     *
     * @param containerElement - The HTML element (e.g., a <div>) where the Three.js canvas will be placed.
     */
    constructor(containerElement: HTMLElement) {
        console.log("MainApp: Starting initialization...");

        // 1. Initialize the Three.js Scene Manager:
        // We ask ThreeSceneManager to set up the 3D scene, camera, renderer, lighting,
        // and camera controls, placing the canvas within the provided HTML element.
        this.sceneManager = new ThreeSceneManager(containerElement);
        console.log("MainApp: ThreeSceneManager initialized.");

        // 2. Initialize the Earth object:
        // We create the Earth object. This object will asynchronously load its GLB model.
        this.earth = new Earth();
        // Note: We won't add the Earth directly to the scene here. We'll wait until its model
        // is fully loaded within the `animate` function to ensure it's ready.
        console.log("MainApp: Earth object created.");

        // 3. Initialize the Physics Engine:
        // We create our physics engine, responsible for all physics calculations.
        this.physicsEngine = new PhysicsEngine();
        console.log("MainApp: PhysicsEngine initialized.");

        // 4. Start the main animation loop:
        // This loop will make the simulation run and render continuously.
        // We use `THREE.Clock` to accurately measure time between frames.
        this.clock = new THREE.Clock();
        // And we call the `animate` function for the first time to start the loop.
        this.animate();
        console.log("MainApp: Animation loop started.");

        console.log("MainApp: Initialization complete. Waiting for user interaction or satellite creation.");
    }

    // ------------------------------------------------------------------------
    // Public Control Functions (How does the user interact with the application?)
    // ------------------------------------------------------------------------

    /**
     * Sets the initial satellite data.
     * This function must be called before attempting to create a satellite.
     * @param data - An object containing the initial satellite data (id, name, initial position, initial velocity).
     */
    public setInitialSatelliteData(data: ISatelliteData): void {
        this.initialSatelliteData = data;
        console.log(`MainApp: Initial satellite data set for '${data.name}'.`);
    }

    /**
     * Creates (or recreates) the satellite object in the scene.
     * If a satellite already exists, it will be removed before creating a new one.
     * Requires `initialSatelliteData` to have been set previously.
     */
    public createSatellite(): void {
        // First, check if we have the necessary data to create the satellite.
        if (!this.initialSatelliteData) {
            console.error("MainApp: Cannot create satellite. Initial satellite data has not been set.");
            return;
        }

        // If a satellite already exists in the scene, remove and clean it up first.
        if (this.satellite) {
            // Remove the satellite's visual mesh from the Three.js scene.
            // (We use `!` to assert to TypeScript that `this.satellite.mesh` will not be `null` here).
            if (this.satellite.mesh) { // Add an explicit check for safety
                this.sceneManager.scene.remove(this.satellite.mesh);
            }
            // Also remove the satellite's visual trajectory line.
            this.sceneManager.scene.remove(this.satellite.trajectoryLine.lineMesh);
            // Clear any remaining points in the trajectory line.
            this.satellite.trajectoryLine.clear();
            // Remove the reference to the old satellite.
            this.satellite = null;
            console.log("MainApp: Existing satellite and its trajectory removed from scene.");
        }

        // Now, create a new satellite object using the initial data.
        this.satellite = new Satellite(this.initialSatelliteData);
        // Note: The satellite's 3D model will be loaded asynchronously within the Satellite class itself.
        // We won't add it to the scene directly here. We'll wait until it's ready inside the `animate` function.
        console.log(`MainApp: New satellite '${this.initialSatelliteData.name}' object created. Waiting for its 3D model to load.`);
    }

    /**
     * Changes the physics integration method used by the physics engine.
     * @param method - The name of the new integration method (e.g., "eulerCromer", "rungeKutta4").
     */
    public setIntegratorMethod(method: IntegratorMethod): void {
        this.physicsEngine.setIntegrator(method);
        console.log(`MainApp: Integrator method set to: ${method}`);
    }

    /**
     * Resumes the physical simulation (unpauses it).
     */
    public playSimulation(): void {
        this.isPaused = false;
        console.log("MainApp: Simulation resumed.");
    }

    /**
     * Pauses the physical simulation.
     */
    public pauseSimulation(): void {
        this.isPaused = true;
        console.log("MainApp: Simulation paused.");
    }

    /**
     * Resets the simulation to its initial state.
     * The satellite will be reset to its initial position and velocity.
     */
    public resetSimulation(): void {
        this.pauseSimulation(); // Pause the simulation temporarily before resetting.

        // If we have a satellite and know its initial data, reset it.
        if (this.satellite && this.initialSatelliteData) {
            this.satellite.reset(
                this.initialSatelliteData.initialPosition,
                this.initialSatelliteData.initialVelocity
            );
            console.log("MainApp: Satellite state reset to initial conditions.");
        } else {
            // If no satellite exists or its initial data is unknown, try creating a new one.
            this.createSatellite();
            console.log("MainApp: Satellite recreated for reset.");
        }
        console.log("MainApp: Simulation reset.");
    }

    /**
     * Changes the simulation speed factor (how many times faster than real-time it will run).
     * @param factor - The new speed factor (e.g., 1000 for 1000x real speed).
     */
    public setSimulationSpeed(factor: number): void {
        if (factor < 0) {
            console.warn("MainApp: Simulation speed factor cannot be negative. Setting to 0 if negative value provided.");
            this.simulationSpeedFactor = 0; // Or you could throw an error
            return;
        }
        this.simulationSpeedFactor = factor;
        console.log(`MainApp: Simulation speed set to ${factor}x.`);
    }

    // ------------------------------------------------------------------------
    // Main Application Loop (Animation Loop) - executed repeatedly
    // ------------------------------------------------------------------------

    /**
     * This function is the "heartbeat" of the application.
     * It's called repeatedly (typically 60 times per second) by the browser (via `requestAnimationFrame`).
     * This is where all physics and visual updates occur.
     * We use an arrow function (`=>`) to correctly preserve the `this` context.
     */
    private animate = (): void => {
        // 1. First, we request the browser to call this function again in the next frame.
        // This creates an infinite loop of updates and rendering.
        requestAnimationFrame(this.animate);

        // 2. Update camera controls.
        // We ask the scene manager to update its controls (e.g., to respond to mouse movement).
        this.sceneManager.updateControls();

        // 3. Calculate the "elapsed time" since the last call to this function.
        // This makes our motion smooth and independent of the frame rate.
        const deltaTime = this.clock.getDelta(); // Time in seconds.

        // 4. Update and display the Earth.
        // Check if the Earth's model has been loaded and is ready for display.
        if (this.earth.isLoaded && this.earth.mesh) {
            // If Earth is ready and not yet added to the scene, add it.
            if (!this.sceneManager.scene.children.includes(this.earth.mesh)) {
                this.sceneManager.scene.add(this.earth.mesh);
                console.log("MainApp: Earth model added to Three.js scene.");
            }
            // Ask the Earth object to update its rotation (to make it spin).
            this.earth.updateRotation(deltaTime);
        }

        // 5. Update and display the satellite (only if the simulation is not paused).
        // Check if the satellite object exists, its model has been loaded, and the simulation is not paused.
        if (this.satellite && this.satellite.isLoaded && this.satellite.mesh && !this.isPaused) {
            // If the satellite is ready and not yet added to the scene, add it and its trajectory line.
            if (!this.sceneManager.scene.children.includes(this.satellite.mesh)) {
                this.sceneManager.scene.add(this.satellite.mesh);
                this.sceneManager.scene.add(this.satellite.trajectoryLine.lineMesh);
                console.log("MainApp: Satellite model and trajectory line added to Three.js scene.");
            }

            // Here, the physics engine calculates the satellite's new position and velocity.
            // We pass the satellite's current physics state (its position and velocity),
            // and the fixed time step multiplied by the simulation speed factor.
            this.satellite.physicsState = this.physicsEngine.updateSatelliteState(
                this.satellite.physicsState,
                this.fixedDeltaTime * this.simulationSpeedFactor
            );

            // After the physics engine has updated the satellite's position and velocity,
            // we ask the satellite object to update its visual representation on the screen
            // and to add a new point to its trajectory line.
            this.satellite.updateVisuals();
        } else if (this.satellite && !this.satellite.isLoaded) {
             // If the satellite object exists but its model hasn't loaded yet,
             // we can optionally log a message to the console (can be disabled to avoid spam).
             // console.log(`MainApp: Waiting for satellite model to load...`);
        }

        // 6. Render the entire scene.
        // We ask the scene manager to perform the actual rendering of everything in the scene,
        // from the perspective of the camera.
        this.sceneManager.renderScene();
    };
}