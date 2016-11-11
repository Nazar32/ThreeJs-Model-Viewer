

var scene, 
    renderer,
    camera,
    model,
    controls,
    rotateControl,
    zoomControl,
    isWireframeEnabled = false,
    modelPath = "./scripts/JS/models/model.stl",
    modelContainer = document.getElementById('container'),
    axis,
    isAlphaActive = true,
    isZoomDisabled = false;

const PI = 3.141592,
      BLACK = 0x000,
      WHITE = 0xfff,
      RED = 0xff0000,
      MODEL_PLANE_DISTANCE_FACTOR = .001,
      NOTATION = 10,
      PLANE_OPACITY = .5,
      AXIS_HELPER_SIZE = 800,
      MODEL_MATERIAL_COLOR = 0x2F4F4F,
      CAMERA_POSITION_FACTOR = 5,
      CAMERA_FOV = 70,
      CAMERA_NEAR = 1,
      CAMERA_FAR = 10000,
      PLANE_SIZE_MAX_FACTOR = 9,
      PLANE_WIDTH_SEGMENTS = 32,
      ROTATE_SPEED = 1.0,
      ROTATE_CONTROL_SCALE = 1.0,
      MODEL_SCALE_X = .5,
      MODEL_SCALE_Y = .5,
      MODEL_SCALE_Z = .5,
      CAMERA_DEFAULT_LIGHT = 0xffffff,
      LIGHT_INTENSITY = 1.0,
      FILL_LIGHT_INTENSITY = 0,
      BOUNDING_BOX_HELPER_COLOR = 0xff0000,
      KEY_LIGHT_POSITION_X = -100,
      KEY_LIGHT_POSITION_Y = 0,
      KEY_LIGHT_POSITION_Z = 100,
      FILL_LIGHT_POSITION_X = 100,
      FILL_LIGHT_POSITION_Y = 0,
      FILL_LIGHT_POSITION_Z = 100,
      BACK_LIGHT_POSITION_X = 100,
      BACK_LIGHT_POSITION_Y = 0,
      BACK_LIGHT_POSITION_Z = -100,
      ROTATE_CONTROL_MIN_DISTANCE_DIV_FACTOR = 1.8,
      ROTATE_CONTROL_MAX_DISTANCE_MULT_FACTOR = 4;
      


initScene(); 
animate();

function initScene() {

    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({ alpha: isAlphaActive });

    var containerWidth = parseInt(modelContainer.clientWidth, NOTATION);
    var containerHeight = parseInt(modelContainer.clientHeight, NOTATION);

    renderer.setSize(containerWidth, containerHeight);
    modelContainer.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(CAMERA_FOV, containerWidth / containerHeight, CAMERA_NEAR, CAMERA_FAR);

    scene.add(camera);

    axis = new THREE.AxisHelper(AXIS_HELPER_SIZE);
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
    rotateControl.rotateSpeed = ROTATE_SPEED;
    rotateControl.scale = ROTATE_CONTROL_SCALE;
    rotateControl.noZoom = isZoomDisabled;
    
}

function setLight(scene) {

    var light = new THREE.AmbientLight(CAMERA_DEFAULT_LIGHT),
        keyLight,
        fillLight, 
        backLight,
        directionalLight = new THREE.DirectionalLight(CAMERA_DEFAULT_LIGHT, LIGHT_INTENSITY);

    directionalLight.position.set(camera.position);

    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(255, 100%, 100%)'), LIGHT_INTENSITY);
    keyLight.position.set(KEY_LIGHT_POSITION_X,
                          KEY_LIGHT_POSITION_Y,
                          KEY_LIGHT_POSITION_Z);

    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(255, 100%, 100%)'), FILL_LIGHT_INTENSITY); 
    fillLight.position.set(FILL_LIGHT_POSITION_X,
                           FILL_LIGHT_POSITION_Y,
                           FILL_LIGHT_POSITION_Z);

    backLight = new THREE.DirectionalLight(CAMERA_DEFAULT_LIGHT, LIGHT_INTENSITY);
    backLight.position.set(BACK_LIGHT_POSITION_X,
                           BACK_LIGHT_POSITION_Y, 
                           BACK_LIGHT_POSITION_Z)
                           .normalize();

    scene.add(light);
    scene.add(new THREE.AmbientLight(CAMERA_DEFAULT_LIGHT));
    scene.add(directionalLight);
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);
}

function loadModel(modelPath, scene) {

    var loader = new THREE.STLLoader();

    loader.load(modelPath, function (geometry) {

        var material = new THREE.MeshLambertMaterial({ color: MODEL_MATERIAL_COLOR, wireframe: isWireframeEnabled });
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
        model.scale.set(MODEL_SCALE_X, MODEL_SCALE_Y, MODEL_SCALE_Z);
        geometry.center();
        camera.position.set(geometry.boundingBox.min.x,
                            geometry.boundingBox.min.y,
                            geometry.boundingBox.min.z);
        
        var bbox = new THREE.BoundingBoxHelper(model, BOUNDING_BOX_HELPER_COLOR);
        bbox.update();
        scene.add(bbox);
        geometry.computeBoundingSphere();
        rotateControl.minDistance = geometry.boundingSphere.radius / 
                                    ROTATE_CONTROL_MIN_DISTANCE_DIV_FACTOR;

        rotateControl.maxDistance = geometry.boundingSphere.radius * 
                                    ROTATE_CONTROL_MAX_DISTANCE_MULT_FACTOR;

        render();
    });
  
}


