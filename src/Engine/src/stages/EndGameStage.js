
Game.Stages = (function(module) {

  module.EndGameStage = function(params = {}) {

    let self = Game.Stages.Stage(params);

    let ps = {
        score: params.score || 0,
    };

    self.enterStage = () => {
        console.log('EndGameStage enterStage');
        requestAnimationFrame(drawHighscore);

        document.addEventListener('keypress', handleKeyPress);
    };

    self.leaveStage = () => {
        document.removeEventListener('keypress', handleKeyPress);

        let splashStage = Game.Stages.SplashscreenStage();
        Game.stageGraph = splashStage;
        Game.stageGraph.enterStage();
    }

    self.restartGame = () => {
        let mainGameStage = Game.Stages.MainGameStage();

        Game.stageGraph = mainGameStage;
        Game.stageGraph.init({
            level: 0,
        });
    }

    let handleKeyPress = (e) => {
        console.log('keypressed');
    }

    let drawHighscore = (score) => {
      Game.context.fillStyle = '#FFFFFF';
      Game.context.font = '48pt Amatic SC';
      let text = `You've finished the game with ${ps.score} points`;
      let metrics = Game.context.measureText(text);
      Game.context.fillText(text, 512 - metrics.width/2, 384);
  }

    return self;
  }

  return module;

})((Game.Stages || {}));
