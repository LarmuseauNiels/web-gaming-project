

Game.Stages = (function(module) {

  module.SplashscreenStage = function(params = {}) {

    // Setup instance based on Stage base class
    let self = Game.Stages.Stage(params);

    const timeOut = 2000;

    self.enterStage = () => {
      console.log('enterStage')
      drawText("Press 'any' key to start");
      document.addEventListener('keypress', (e) => {
        self.leaveStage();
      },{once: true});
    }

    self.leaveStage = () => {
      console.log('leaveStage')

      // fadeOut

      let mainGame = Game.Stages.MainGameStage();
      Game.stageGraph = mainGame;
      Game.stageGraph.init({
        level: 0,
      });
    }

    let drawText = (text) => {
      Game.context.fillStyle = '#FFFFFF';
      Game.context.font = '48pt Amatic SC';
      let metrics = Game.context.measureText(text);
      Game.context.fillText(text, 512 - metrics.width/2, 384);
    }

    return self;
  }

  return module;

})((Game.Stages || {}))
