'use strict';


function dropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


function showModel(modelNum) {

    switch (modelNum) {
        case '1':
            scene.remove(model);
            modelPath = "/scripts/JS/models/private.stl";
            loadModel(modelPath, scene);
            break;
        case '2':
            scene.remove(model);
            modelPath = "/scripts/JS/models/model.stl";
            loadModel(modelPath, scene);
            break;
        case '3':
            scene.remove(model);
            modelPath = "/scripts/JS/models/wand.stl";
            loadModel(modelPath, scene);
            break;
        case '4':
            scene.remove(model);
            modelPath = "/scripts/JS/models/space.stl";
            loadModel(modelPath, scene);
            break;
        case '5':
            scene.remove(model);
            modelPath = "/scripts/JS/models/Torus.stl";
            loadModel(modelPath, scene);
            break;
    }
}

function enableWireframe() {

    var enableWireframeBtn = document.getElementById("enable-wireframe-btn");

    if (!enableWireframeBtn.classList.contains('selectedButton')) {
        enableWireframeBtn.classList.add('selectedButton');
        isWireframeEnabled = true;
        scene.remove(model);
        loadModel(modelPath, scene);
    }

    else {
        enableWireframeBtn.classList.remove('selectedButton');
        isWireframeEnabled = false;
        scene.remove(model);
        loadModel(modelPath, scene);

    }
}

