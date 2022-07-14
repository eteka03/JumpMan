import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene{

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

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
                .setScrollFactor(1, 0)

        //create the group of platforms
        this.platforms =  this.physics.add.staticGroup()
        let i = 0
        while (i !== 5) {
            const x = Phaser.Math.Between(80 ,400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

        /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()

            i += 1
                }

        //create bunny
        this.player = this.physics.add.sprite(240,320,'bunny-stand')
        this.player.setScale(.5)
        this.cameras.main.startFollow(this.player)
        //for collision 
        this.physics.add.collider(this.platforms,this.player)
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.player.body.checkCollision.up = false
        
        

    }

    update(){

        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            
            const platform = child

            const scrollY = this.cameras.main.scrollY

            if(platform.y >= scrollY + 700){
                console.log('yes')
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }
        })
        // find out from Arcade Physics if the player's physics body
        // is touching something below it
        const touchingDown = this.player.body.touching.down

        if(touchingDown){
            //jump straight up
            this.player.setVelocityY(-200)
        }
    }
}