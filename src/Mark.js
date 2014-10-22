BasicGame = {
    // Phaser.AUTO / Phaser.CANVAS / Phaser.WEBGL
    RENDERER: Phaser.AUTO,
    
    // Maximum count of units running on screen at the same time
    UNITS_COUNT: 100,

    // Screen size: both side are the same
    SCREEN_SIZE: 800,

    // Tween interval
    TWEEN_INTERVAL: 5000
};

BasicGame.Mark = function (game) {}

BasicGame.Mark.prototype = {

    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.game.time.advancedTiming = true;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true);
        this.scale.refresh();

        this.fps = document.querySelector('#fps');
        this.units = document.querySelector('#units');
        this.units.innerHTML = 'Units: ' + BasicGame.UNITS_COUNT;
    },

    preload: function () {
        this.game.load.spritesheet('megaman', 'images/megaman.png', 75, 68);
    },

    create: function () {
        this.game.stage.backgroundColor = 0x53cb4d;
        var units = this.game.add.group();
        units.createMultiple(BasicGame.UNITS_COUNT, 'megaman');
        units.callAll('animations.add', 'animations', 'run');
        units.callAll('animations.play', 'animations', 'run', 5, true);

        this.game.time.events.loop(BasicGame.TWEEN_INTERVAL / BasicGame.UNITS_COUNT, function() {
            var unit = units.getFirstDead();
            if(!unit) return;
            unit.reset(0, this.game.rnd.between(0, BasicGame.SCREEN_SIZE));
            this.game.add.tween(unit)
                .to( { x: BasicGame.SCREEN_SIZE, y: this.game.rnd.between(0, BasicGame.SCREEN_SIZE) }, BasicGame.TWEEN_INTERVAL, Phaser.Easing.Linear.None, true)
                .onComplete.add(function() {
                    unit.kill(true);
                }, unit);
        }, this);
    },

    update: function() {
        this.fps.innerHTML = 'FPS: ' + this.game.time.fps || '--';
    }

};