import Phaser from '../lib/phaser.js'
import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene{

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    /** @type {Phaser.Physics.Arcade.Group} */
    carrots

    constructor(){
        super('game')
    }


    preload(){

        this.load.image('background','assets/images/bg_layer1.png')
        this.load.image('platform','assets/images/ground_grass.png')
        this.load.image('bunny-stand','assets/images/bunny1_stand.png')
        this.load.image('carrot','assets/images/carrot.png')

        this.cursors = this.input.keyboard.createCursorKeys()

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

        //for collision 
        this.physics.add.collider(this.platforms,this.player)
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false
        this.player.body.checkCollision.up = false
        
        /* cameras */
        this.cameras.main.startFollow(this.player)
        // set the horizontal dead zone to 1.5x game width
        this.cameras.main.setDeadzone(this.scale.width * 1.5)

        //create  carrots
        this.carrots = this.physics.add.group({classType: Carrot})
        this.carrots.get(240,320,'carrot')

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

        //left and right
        if(this.cursors.left.isDown && !touchingDown){
            this.player.setVelocityX(-200)
        }else if(this.cursors.right.isDown && !touchingDown){
            this.player.setVelocityX(200)
        }else{
            //stop to move if no movement
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)
    }

    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth
        }else if(sprite.x > gameWidth + halfWidth){
            sprite.x = -halfWidth
        }
    }
}