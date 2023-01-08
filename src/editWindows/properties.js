import blockState from "../../static/attrInfo";
import blockInfo from "../../static/textures";

const propertiesWindow = {};

propertiesWindow.makeWindow = (block, document) => {
    let edit_window = document.getElementById("properties");
    if(edit_window === undefined) return;
    edit_window.innerHTML = '';


    let block_type = blockInfo[block.id].type;
    console.log(block_type);
    if (block_type){

        for(let [state_name, state_info] of Object.entries(blockState[block_type])){
            let element = document.createElement("div");
            let text = document.createElement("h4");
            let states = document.createElement("div");
            text.innerText = state_name;
            switch(state_info.type){
                case "choice":
                    for(let [value, vlaue_code] of Object.entries(state_info.values)){
                        let button = document.createElement("button");
                        button.addEventListener("click",(e)=>{
                            block.axis = vlaue_code;
                            console.log(vlaue_code);
                        })
                        button.innerText = value;
                        states.appendChild(button);
                    }

            }
            element.appendChild(text);
            element.appendChild(states);
            
            
            edit_window.appendChild(element);
            console.log(edit_window)
        }
    }

}

export default propertiesWindow;