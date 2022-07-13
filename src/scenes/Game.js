import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene{

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    constructor(){
        super('game')
    }


    preload(){

        this.load.image('background','assets/images/bg_layer1.png')
        this.load.image('platform','assets/images/ground_grass.png')
        this.load.image('bunny-stand','assets/images/bunny1_stand.png')

    }

    create(){
        this.add.image(240,320,'background')

        //create the group of platforms
        const platforms =  this.physics.add.staticGroup()
        let i = 0
        while (i !== 5) {
            const x = Phaser.Math.Between(80 ,400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = platforms.create(x, y, 'platform')
            platform.scale = 0.5

        /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()

            i += 1
                }

        //create bunny
        this.player = this.physics.add.sprite(240,320,'bunny-stand')
        this.player.setScale(.5)
        
        //for collision 
        this.physics.add.collider(platforms,this.player)
        
    }

    update(){

    }
}