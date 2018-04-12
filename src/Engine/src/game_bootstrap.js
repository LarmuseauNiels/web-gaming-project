

// Main game bootstrap

Game = (function(module) {

  module.bootstrap = function(params) {
    console.log('bootstrap');

    Game.canvas = $('#canvas')[0];
    Game.context = Game.canvas.getContext('2d');
    Game.system = Game.System();

    // Create and run game stage graph
    const splash = Game.Stages.SplashscreenStage();

    Game.stageGraph = splash;
    Game.stageGraph.enterStage();
  }

  return module;

})((window.Game || {}));
