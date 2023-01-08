import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import blockInfo from "../static/textures"
import Blocks from './block'
import cadInfo from './cadInfo'
import propertiesWindow from './editWindows/properties'
import attrInfo from '../static/attrInfo'
//import nbt from 'nbt'

// let data = fs.readFileSync("C:\Users\jjoon\Downloads\18632.litematic");
// nbt.parse(data, function(error, data) {
//     if (error) { throw error; }

//     console.log(data.value.stringTest.value);
//     console.log(data.value['nested compound test'].value);
// });

if (WEBGL.isWebGLAvailable()) {
  cadInfo.blueprint = Array(20);
  for(let i = 0; i < 20; i++){
    cadInfo.blueprint[i]=Array(20);
    for(let j = 0; j < 20; j++){
      cadInfo.blueprint[i][j] = Array(20);
    }
  }
  console.log(cadInfo.blueprint);

  let block_selector = document.getElementById("block_selector");
  console.log(block_selector);

  //let offsetRight = document.querySelector("#right_container.edit_window_container");
  let container = document.querySelector("#left_container.edit_window_container");

  
  let camera, scene, renderer
  let plane
  let mouse,
    raycaster,
    isShiftDown = false

  let tool = 0
  let clickedMouseButton = -1
  let rollOverMesh, rollOverMaterial

  let objects = []
  
  for(let [block_id,block_info] of Object.entries(blockInfo)){
    console.log(block_info);
    let button = document.createElement("button");
    button.setAttribute("id",block_id);
    button.innerText = block_info.name;
    button.addEventListener("click",(e)=>{
      if(Blocks[e.target.id])
        cadInfo.curBlock = new Blocks[e.target.id](50)
      else if(Blocks[blockInfo[e.target.id].type]){
        cadInfo.curBlock = new Blocks[blockInfo[e.target.id].type](e.target.id,50,{"axis":1});
      }
      else{
        cadInfo.curBlock = new Blocks["block"](e.target.id);
      }

      propertiesWindow.makeWindow(cadInfo.curBlock, document)

    })
    block_selector.appendChild(button);
  }

  init()
  render()



  let saveButton = document.querySelector("button.save")
  console.log(saveButton);

  saveButton.addEventListener("click", (e)=>{
    let text = "";
      console.log("save");
      console.log(cadInfo.blueprint)
      for(let y = 0; y < cadInfo.blueprint.length; y++){
          for(let x = 0; x < cadInfo.mapSize; x++){
              for(let z = 0; z < cadInfo.mapSize; z++){
                  if(cadInfo.blueprint[y][x][z]){
                    console.log(`${x},${y},${z}`);
                    console.log(cadInfo.blueprint[y][x][z].id);
                    console.log(blockInfo[cadInfo.blueprint[y][x][z].id]);
                    text += `setblock ~${x} ~${y} ~${z} minecraft:${cadInfo.blueprint[y][x][z].id}`;
                    if(attrInfo[blockInfo[cadInfo.blueprint[y][x][z].id].type]){
                      text += '[';
                      for(let [attr] of Object.entries(attrInfo[blockInfo[cadInfo.blueprint[y][x][z].id].type])){
                        console.log(cadInfo.blueprint[y][x][z][attr]);
                        text+=`${attr}=${cadInfo.blueprint[y][x][z][attr]},`;
                      }
                      text += ']';
                    }
                    text += "\n";
                  }
              }
          }
      }
      saveToFile_Chrome("test.mcfunction",text);
  });

function saveToFile_Chrome(fileName, content) {
    let blob = new Blob([content], { type: 'text/plain' });
    let objURL = window.URL.createObjectURL(blob);
            
    // 이전에 생성된 메모리 해제
    if (window.__Xr_objURL_forCreatingFile__) {
      window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
    }
    window.__Xr_objURL_forCreatingFile__ = objURL;
    var a = document.createElement('a');
    a.download = fileName;
    a.href = objURL;
    a.click();
}





  function init() {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    camera.position.set(1000, 1000, 1000)
    camera.lookAt(0, 0, 0)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    let rollOverGeo = new THREE.BoxBufferGeometry(50, 50, 50)
    rollOverMaterial = new THREE.MeshBasicMaterial({
        transparent:true,
        color: "#c2ff83", 
    })
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
    //scene.add(rollOverMesh)

    let gridHelper = new THREE.GridHelper(cadInfo.blockSize * cadInfo.mapSize, cadInfo.mapSize)
    scene.add(gridHelper)

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    let geometry = new THREE.PlaneBufferGeometry(1000, 1000)
    geometry.rotateX(-Math.PI / 2)

    plane = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ visible: false })
    )
    scene.add(plane)

    objects.push(plane)

    let ambientLight = new THREE.AmbientLight(0x606060)
    scene.add(ambientLight)

    let directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 0.75, 0.5).normalize()
    scene.add(directionalLight)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, window.innerHeight)
    console.log(container.clientWidth)
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    
    /*0:Ratate
      1:Zoom
      2:Pan*/
    controls.mouseButtons = {
      LEFT: -1,
      MIDDLE: 0,
      RIGHT: -1
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false)
    document.addEventListener('mousedown', onDocumentMouseDown, false)
    document.addEventListener('mouseup', onDocumentMouseUp, false)
    document.addEventListener('keydown', onDocumentKeyDown, false)
    document.addEventListener('keyup', onDocumentKeyUp, false)
    window.addEventListener('resize', onWindowResize, false)
  }

  function onWindowResize() {
    camera.aspect = container.clientWidth/ window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, window.innerHeight)
  }

  function onDocumentMouseMove(event) {
    event.preventDefault()

    mouse.set(
      ((event.clientX) / (container.clientWidth)) * 2 - 1,
      -((event.clientY) / window.innerHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)

    switch(event.buttons){
      case 0:
        let intersects = raycaster.intersectObjects(objects)

        if (intersects.length > 0) {
          let intersect = intersects[0]
        
          rollOverMesh.position.copy(intersect.point).add(intersect.face.normal)
          rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
        }
        break

      case 1://left button
        break

      case 4://middle(wheel) button
        break

      case 2://right button
        break
    }

    

    render()
  }

  function onDocumentMouseUp(event){
    clickedMouseButton = 0
  }

  function onDocumentMouseDown(event) {
    event.preventDefault()

    console.log(event.buttons)
    clickedMouseButton = event.buttons
    mouse.set(
      (event.clientX / (container.clientWidth)) * 2 - 1,
      -(event.clientY / (window.innerHeight)) * 2 + 1
    )
    let intersects = raycaster.intersectObjects(objects)

    switch(event.buttons){
      case 1://left button
        if (intersects.length > 0) {
          let intersect = intersects[0]
        
          if (intersect.object !== plane) {
            let location = intersect.object.position.addScalar(-25).divideScalar(50);
            cadInfo.blueprint[location.y][location.x+cadInfo.mapSize/2][location.x+cadInfo.mapSize/2] = null;
            scene.remove(intersect.object)
          
            objects.splice(objects.indexOf(intersect.object), 1)
          }
          render()
        }
        break

      case 2://right button
        if (intersects.length > 0) {
            let intersect = intersects[0]
            
            console.log(cadInfo.curBlock);
            let location = new THREE.Vector3(intersect.point.x, intersect.point.y, intersect.point.z);
            location.add(intersect.face.normal).divideScalar(50).floor();
            console.log(location);
            let voxel = cadInfo.curBlock.build(location, 50);
            scene.add(voxel)
          
            objects.push(voxel)
            render()
        }
        break

      case 4://middle(wheel) button
        break

      
    }

    raycaster.setFromCamera(mouse, camera)
  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 16:
        isShiftDown = true
        break
    }
  }

  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      case 16:
        isShiftDown = false
        break
    }
  }

  function render() {
    renderer.render(scene, camera)
  }
} else {
  let warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
