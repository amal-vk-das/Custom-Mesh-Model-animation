import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/loaders/GLTFLoader.js";
import { TrackballControls } from "https://cdn.jsdelivr.net/npm/three@0.161/examples/jsm/controls/TrackballControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(-8,15, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableDamping = true;
controls.dampingFactor = 0.06;
// controls.enablePan = false;
// controls.minDistance = 2;
// controls.maxDistance = 20;
// controls.minPolarAngle = 0.5;
// controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
// controls.target = new THREE.Vector3(0, 1, 0);
controls.update();


const controls2 = new TrackballControls(camera, renderer.domElement);
controls2.noRotate = true;
controls2.noPan = true;
controls2.noZoom = false;
controls2.zoomSpeed = 5;

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const geometry = new THREE.BufferGeometry();

const positions = [
5, 0, 0,    // v1
0, 5, 0,   // v2
0, 0, 5,  // v3
];

geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
geometry.computeVertexNormals();

const object = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide
}) );
scene.add(object);
object.castShadow= true

const spotLight = new THREE.SpotLight(0xffffff, 3500, 100, 0.2, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const spotLight4 = new THREE.SpotLight(0xffffff, 4500, 100, 0.2, 1);
spotLight4.position.set(0, 15, 0);
spotLight4.castShadow = true;
spotLight4.shadow.bias = -0.0001;
scene.add(spotLight4);

const spotLight5 = new THREE.SpotLight(0xffffff, 4500, 100, 0.2, 1);
spotLight5.position.set(5, 15, 15);
spotLight5.castShadow = true;
spotLight5.shadow.bias = -0.0001;
scene.add(spotLight5);

let mixer;
const gltfLoader = new GLTFLoader();
const url = "public/butterfly/test.gltf";
gltfLoader.load(url, (gltf) => {
  const root = gltf.scene;
  root.scale.set(10,10,10);
  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  root.position.set(0, .5, 0);
  scene.add(root);
  mixer = new THREE.AnimationMixer(root);
  const clips = gltf.animations;
  // const clip = THREE.AnimationClip.findByName(clips, "Fly");
  // const action = mixer.clipAction(clip);
  // action.play();
  clips.forEach((clip)=>{
    const action = mixer.clipAction(clip);
    action.play();
  })
});

//ambientLight
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
const ambientLight2 = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight2);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  mixer.update(clock.getDelta());
  controls.update();
  if (controls2) {
    const target = controls.target;
    controls2.target.set(target.x, target.y, target.z);
    controls2.update();
  }
  renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
  console.log('Window resized');
  console.log('New window size:', window.innerWidth, window.innerHeight);
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

