import *as THREE from "three";
import { SceneManager } from "./world/scene";
import { CameraManager } from "./world/camera";
import { RendererManager } from "./world/renderer"; 


let sceneManager ; 
let cameraManager; 
let rendererManager ;



function init() {
// اول شي 
const width = window.innerWidth;
const height = window.innerHeight;

  sceneManager = new SceneManager(); 

}