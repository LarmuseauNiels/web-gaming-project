
'use strict';

Game.Model = (function(module) {

  module.Projectile = function(params) {
    
    let self = Game.Model.Entity(params);
    
    // Private attributes
    
    let ps = {
    
      body : Matter.Bodies.rectangle(params.pos.x, params.pos.y, params.size.width, params.size.height, { id : params.id, isStatic : false, isSensor : false }),
      mass : (params.mass || 1),
      size : params.size,
      contactProfile : 0,
      scale : (params.scale || 1),
      boundingVolumeScale : (params.boundingVolumeScale || 1.0),
      
      stateGraph : {},
      currentState : null,
      currentAnimationSequence : null
    };
    
    
    // -----------------------------------------
    
    
    // Private states

    let right = function(params = {}) {
      
        let self = Game.Model.State(params);
        
        let state_ps = {
          
          theta : 0,
          initPos : {},
          posCurrent : {}
        };
        
        // Public interface
        
        self.enter = function(env, tDelta) {
        
          console.log("projectile  flying right...");
          
          ps.currentAnimationSequence = Game.Graphics.SequenceInstance({animationSequence : Game.Animation.sequence[ps.body.id]['right']});
          
          state_ps.theta = 0;
          state_ps.initPos = ps.body.position;
          state_ps.posCurrent = ps.body.position;
        }
        
        self.update = function(env, tDelta) {
          
          //ps.currentAnimationSequence.updateFrame(tDelta / 1000);
          //Matter.Body.translate(ps.body, { x : 3, y : 0 } );
          return true;
        }
        
        self.exit = function(env, tDelta) {
        
          console.log("...Projectile stopped");
        }
              
        return self;
      }
    
    let left = function(params = {}) {
      
      let self = Game.Model.State(params);
      
      let state_ps = {
        
        theta : 0,
        initPos : {},
        posCurrent : {}
      };
      
      // Public interface
      
      self.enter = function(env, tDelta) {
      
        console.log("Projectile flying left...");
        
        ps.currentAnimationSequence = Game.Graphics.SequenceInstance({animationSequence : Game.Animation.sequence[ps.body.id]['left']});
        
        state_ps.theta = 0;
        state_ps.initPos = ps.body.position;
        state_ps.posCurrent = ps.body.position;
      }
      
      self.update = function(env, tDelta) {
        
        //Matter.Body.translate(ps.body, { x : -3, y : 0 } );
                
        return true;
      }
      
      self.exit = function(env, tDelta) {
      
        console.log("...Projectile stopped");
      }
            
      return self;
    }
    
    
    // EndState typically terminates a host character / entity.  This provides a convinient realisation of state terminator in a state diagram.
    let EndState = function(params = {}) {
      
      let self = Game.Model.State(params);
      
      // Public interface
      
      self.update = function(env, tDelta) {
        
        return false;
      }
      
      return self;
    }
    
    
    // -----------------------------------------
    
    // Private API
    
    ps.stateGraph['right'] = right();
    ps.stateGraph['left'] = left();
    
    ps.currentState = ps.stateGraph[params.initState];
    
    Matter.Body.setMass(ps.body, ps.mass);
    Matter.Body.setInertia(ps.body, Number.POSITIVE_INFINITY);
    
    ps.body.hostObject = self;
    
    
   
    let draw = function(context, canvas) {
      
      // Draw main image rect
      context.save();
      
      context.translate(ps.body.position.x, ps.body.position.y);
      context.rotate(ps.body.angle);
      
      
      if (ps.currentAnimationSequence) {
        
        ps.currentAnimationSequence.drawCurrentFrame(ps.size, ps.scale, context);
        
      } else {
      
        context.fillStyle = 'rgb(0, 255, 0)';
        context.fillRect(-ps.size.width/2, -ps.size.height/2, ps.size.width, ps.size.height);
      }
      
      context.restore();
      
      if (Game.config.show_bounding_volume) {
      
        // Draw bounding volume (no model transform needed since already in world coords)
        
        let vertices = ps.body.vertices;
        
        context.beginPath();

        context.moveTo(vertices[0].x, vertices[0].y);
        
        for (let i = 1; i < vertices.length; ++i) {
        
          context.lineTo(vertices[i].x, vertices[i].y);
        }
        
        context.lineTo(vertices[0].x, vertices[0].y);
        
        context.lineWidth = 1;
        context.strokeStyle = '#FFF';
        context.stroke();
        
              
        // Draw player contact profile (again, already in world coords so no transform needed)
        
        context.beginPath();
        
        //console.log(ps.player.contactProfile);
        
        if ((ps.contactProfile & Game.Model.Contact.top) == Game.Model.Contact.top) {
          
          context.moveTo(ps.body.position.x - (ps.size.width / 2), ps.body.position.y - (ps.size.height / 2));
          context.lineTo(ps.body.position.x + (ps.size.width / 2), ps.body.position.y - (ps.size.height / 2));
        }
        if ((ps.contactProfile & Game.Model.Contact.bottom) == Game.Model.Contact.bottom) {
          
          context.moveTo(ps.body.position.x - (ps.size.width / 2), ps.body.position.y + (ps.size.height / 2));
          context.lineTo(ps.body.position.x + (ps.size.width / 2), ps.body.position.y + (ps.size.height / 2));
        }
        if ((ps.contactProfile & Game.Model.Contact.left) == Game.Model.Contact.left) {
          
          context.moveTo(ps.body.position.x - (ps.size.width / 2), ps.body.position.y - (ps.size.height / 2));
          context.lineTo(ps.body.position.x - (ps.size.width / 2), ps.body.position.y + (ps.size.height / 2));
        }
        if ((ps.contactProfile & Game.Model.Contact.right) == Game.Model.Contact.right) {
          
          context.moveTo(ps.body.position.x + (ps.size.width / 2), ps.body.position.y - (ps.size.height / 2));
          context.lineTo(ps.body.position.x + (ps.size.width / 2), ps.body.position.y + (ps.size.height / 2));
        }
        
        context.lineWidth = 8;
        context.strokeStyle = '#FFF';
        context.stroke();
      }
    }
    
    let update = function(env, tDelta) {
      
      return ps.currentState.update(env, tDelta);
    }
    
    let processTransitions = function(env, tDelta) {
      
      let transitionState = ps.currentState.evalTransitions(env, tDelta);
      
      if (transitionState.stateChanged) {
        
        // Process exit of current state
        ps.currentState.exit(env, tDelta);
        
        // Call the action function if defined for the transition that's occuring
        if (transitionState.transitionAction) {
        
          transitionState.transitionAction(env, tDelta);
        }
        
        // After existing state exit and transition actions have been performed, perform actual state change
        ps.currentState = transitionState.newState;
        
        // Once transition is complete, the first thing we do is call the new state's 'enter' method
        ps.currentState.enter(env, tDelta);
      }
    }
    
    let addToWorld = function(world) {
    
       Matter.World.add(world, ps.body);
    }

    let goright = function(force) {
      Matter.Body.applyForce(ps.body,ps.body.position,{x:force,y:0});
    }
    
    
    // Accessors
    
    let body = function() {
      
      return ps.body;
    }
    
    
    
    
    // Collision interface
    
    let doCollision = function(otherBody, env) {
      if (otherBody.collideWithBullet) {
      
        otherBody.collideWithBullet(this, {
          
          objA : env.objB,
          objB : env.objA,
          stage : env.stage,
          system : env.system
        });
      };
    }
    
    let collideWithPlayer = function(player, env) {
      if (player.collideWithBullet) {
        
        // triple dispatch (avoid duplicate functionality)
        player.collideWithBullet(this, {
          
          objA : env.objB,
          objB : env.objA,
          stage : env.stage,
          system : env.system
        });
      }
    }

   

    let collideWithCreature = function(creature, env) {
    
      console.log('hit creature!');
      let engine = env.physicsEngine();
      let world = engine.world;
      Composite.remove(world, ps.body);
      Composite.remove(world, creature);
      EndState();
    }
    
    
    
    // Pubic interface
    self.draw = draw;
    self.update = update;
    self.processTransitions = processTransitions;
    self.addToWorld = addToWorld;
    self.goright = goright;
    
    // Accessors
    self.body = body;    
    
    // Collision interface
    self.doCollision = doCollision;
    self.collideWithPlayer = collideWithPlayer;
    self.collideWithCreature = collideWithCreature;
    
    
    // Inital state entry
    ps.currentState.enter(self, params.env, params.tDelta);
    
    
    return self;
  }
  
  return module;

})((Game.Model || {}));
