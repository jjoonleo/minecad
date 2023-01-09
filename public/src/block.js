import * as THREE from 'three';
import textures from "../static/textures"
import cadInfo from './cadInfo';
import { cloneDeep } from 'lodash';
import { WEBGL } from './webgl';

class Block{
    constructor(id){
        this.id = id;
        this.size;
    }

    rotate() {
        console.log("rotate");
        return;
    }

    makeTexture(texture){
        let result = new Array(6)
        texture = texture.textures
        if(texture.side){
            let side_texture = new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load('static/textures/'+ texture.side.file),
                    transparent:true,
                    side:THREE.DoubleSide,
                    color: texture.side.color, 
                });
            for(let i = 0; i < 6; i++){
                result[i] = side_texture;
            }
        }
        if(texture.top){
            let top_texture = new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('static/textures/'+ texture.top.file),
                transparent:true,
                side:THREE.DoubleSide,
                color: texture.top.color, 
            });
            for(let i = 2; i < 4; i++){
                result[i] = top_texture;
            }
        }
        if(texture.bottom){
            let bottom_texture = new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('static/textures/'+ texture.bottom.file),
                transparent:true,
                side:THREE.DoubleSide,
                color: texture.bottom.color, 
            });
            result[3] = bottom_texture;
        
        }
        return result;
    }

    build(location, size){
        this.location = location;
        this.size = size;

        console.log("build");
        this.geometry = new THREE.BoxBufferGeometry(this.size, this.size, this.size);
        console.log(textures[this.id]);
        this.texture = this.makeTexture(textures[this.id]);
        this.mesh = new THREE.Mesh(this.geometry, this.texture);
        this.mesh.position.copy(location).multiplyScalar(size).addScalar(size/2);
        
        cadInfo.blueprint[location.y][location.x+cadInfo.mapSize/2][location.z+cadInfo.mapSize/2] = cloneDeep(this);
        console.log(`${location.x}, ${location.y}, ${location.z}`);

        return this.mesh;
    }
}

const Blocks={};

Blocks.block = class extends Block{
    constructor(id){
        super(id);
    }
}

Blocks.log = class extends Block{
    
    constructor(id,attr){
        super(id);
        if(attr && attr.axis){
            this.axis = attr.axis;
        }
        else{
            this.axis = "y";
        }
    }

    makeTexture(texture){
        if(texture.name)
            return super.makeTexture(texture);
        
        return texture;
    }

    build(location, size){
        this.mesh = super.build(location, size);
        let vector;
        if(this.axis){
            switch(this.axis){
                case "y":
                    vector = new THREE.Vector3(0,1,0);
                    break;

                case "x":
                    vector = new THREE.Vector3(0,0,1);
                    break;
                
                case "z":
                    vector = new THREE.Vector3(1,0,0);
                    break;
            }
            this.mesh = this.mesh.rotateOnAxis(vector,Math.PI/2);
        }
        return this.mesh;
    }

}

Blocks.grass_block = class extends Blocks.block{
    constructor(){
        super("grass_block");
        console.log(this.constructor.top_texture)
    }

    static top_texture = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('static/textures/grass_block_top.png'),transparent:true,side:THREE.DoubleSide,color: 0xc2ff83, });
    static side_texture = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('static/textures/grass_block_side.png'),transparent:true,side:THREE.DoubleSide,});
    static bottom_texture = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('static/textures/grass_block_top.png'),transparent:true,side:THREE.DoubleSide,color: 0xffb77e, });

    makeTexture(){
        let texture = [ 
            this.constructor.side_texture,
            this.constructor.side_texture,
            this.constructor.top_texture,
            this.constructor.bottom_texture,
            this.constructor.side_texture,
            this.constructor.side_texture
        ];
        console.log(texture)
        return texture;
    }

    // build(){
    //     console.log("build");
    //     this.geometry = new THREE.BoxBufferGeometry(this.size, this.size, this.size);
    //     console.log(textures[this.id]);
    //     this.texture = this.makeTexture(textures[this.id]);
    //     console.log(this.texture)
    //     let mesh = new THREE.Mesh(this.geometry, this.texture).rotateOnAxis(new THREE.Vector3(1,0,0),Math.PI/2);
    //     return mesh;
    // }
}

export default Blocks;