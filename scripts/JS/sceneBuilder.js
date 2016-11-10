"use strict";

var modelPath = "./scripts/JS/models/model.stl";
var scene, renderer, camera, model, controls, rotateControl, zoomControl, isWireframeEnabled;

initScene(); 
animate();

function initScene() {

    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({ alpha: true });

    var containerWidth = parseInt(document.getElementById('container').clientWidth, 10);
    var containerHeight = parseInt(document.getElementById('container').clientHeight, 10);

    renderer.setSize(containerWidth, containerHeight);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, containerWidth / containerHeight, 1, 10000);

    scene.add(camera);

    var axis = new THREE.AxisHelper(800);
    scene.add(axis);

    initRotateControl(camera, renderer.domElement, container);

    setLight(scene);

    loadModel(modelPath, scene);

    render();
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    rotateControl.update();
    render();
}


function initRotateControl(camera, element, container) {
    rotateControl = new THREE.OrbitControls(camera, element, element);
    zoomControl = new THREE.TrackballControls(camera, container);

    rotateControl.addEventListener('change', render);
    rotateControl.rotateSpeed = 1.0;
    rotateControl.scale = 1;
    rotateControl.noZoom = false;
    
}

function setLight(scene) {

    var light = new THREE.AmbientLight(0xffffff);

    var keyLight, fillLight, backLight;


    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(camera.position);

    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(255, 100%, 100%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(255, 100%, 100%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    scene.add(light);
    scene.add(new THREE.AmbientLight(0xfff));
    scene.add(directionalLight);
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
}

function loadModel(modelPath, scene) {

    var loader = new THREE.STLLoader();

    loader.load(modelPath, function (geometry) {

        var material = new THREE.MeshLambertMaterial({ color: 0x2F4F4F, wireframe: isWireframeEnabled });
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
        model.scale.set(0.5, 0.5, 0.5);
        geometry.center();
        camera.position.set(geometry.boundingBox.min.x,
                            geometry.boundingBox.min.y,
                            geometry.boundingBox.min.z);
        var hex = 0xff0000;
        var bbox = new THREE.BoundingBoxHelper(model, hex);
        bbox.update();
        scene.add(bbox);
        geometry.computeBoundingSphere();
        rotateControl.minDistance = geometry.boundingSphere.radius / 1.8;
        rotateControl.maxDistance = geometry.boundingSphere.radius * 4;

        render();
    });
  
}


