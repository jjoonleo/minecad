import cadInfo from '../src/cadInfo';

let saveButton = document.querySelector("button.save")
console.log(saveButton);

saveButton.addEventListener("click", (e)=>{
    console.log("save");
    // for(let y = 0; y < cadInfo.blueprint.length; y++){
    //     for(let x = 0; x < cadInfo.mapSize; x++){
    //         for(let z = 0; z < cadInfo.mapSize; z++){
    //             if(cadInfo.blueprint[y][x][z]){
    //                 let block = cadInfo.blueprint[y][x][z];
    //                 console.log(block.id);
    //             }
    //         }
    //     }
    // }
    saveToFile_Chrome("test.txt","hi");
});

function saveToFile_Chrome(fileName, content) {
    var blob = new Blob([content], { type: 'text/plain' });
    objURL = window.URL.createObjectURL(blob);
            
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