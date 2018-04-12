Game.Animation = (function(module) {

	module.spritesheet = (module.spritesheet || {});
	module.sequence = (module.sequence || {});



	module.spritesheet[''] = Game.Graphics.SpriteSheet({

		imageURL : 'Assets/Images/knife.png',
		frameWidth : 32,
		frameHeight : 13,
		framesPerSecond : 1
	});


	module.sequence['bullet'] = (module.sequence['bullet'] || {});
	module.sequence['bullet']['left'] = Game.Graphics.AnimationSequence({

		spriteSheet : module.spritesheet[''],
		startFrame : 0,
		endFrame : 0,
		oscillate : false,
		flipHorizontal : true,
		flipVertical : false
	});

	module.sequence['bullet'] = (module.sequence['bullet'] || {});
	module.sequence['bullet']['right'] = Game.Graphics.AnimationSequence({

		spriteSheet : module.spritesheet[''],
		startFrame : 0,
		endFrame : 0,
		oscillate : false,
		flipHorizontal : false,
		flipVertical : false
	});

	return module;

})((Game.Animation || {}));