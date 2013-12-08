define([
         "util/classutils",
			"ada/scene/character_pixel",
			"ada/scene/data/andy_pixel_animations",
         ],
         function(classUtils, CharacterPixel, AndyPixelAnimations) {
	
	"use strict";
	
	return classUtils.create({
		
		body:null,
		character:null,
		target_x:0,
		walk_speed:10,
		run_speed:25,
		speed:null,
		
		init:function()
		{
			var self = this;
			
			self.character = new CharacterPixel(new AndyPixelAnimations());
			self.body = self.character.body;
			self.character.set_animation('stand');
		},
		
		set_in_scene: function(_x, _y, _scale)
		{
			var self = this;
			
			self.body.x = _x;
			self.body.y = _y;
			self.character.set_scale(_scale);
		
			self.target_x = _x;
			
			if(self.body.x < window.ada_width / 2)
				self.face_right();
			else
				self.face_left();
		},
		
		face_right:function()
		{
			this.character.body.scaleX = this.character.scale;
		},
		
		face_left:function()
		{
			this.character.body.scaleX = -(this.character.scale);
		},
		
		clicked:function(e)
		{
			var self = this;
			
			self.target_x = e.stageX;
			if(self.character.current_animation == 'stand')
			{	
				self.speed = self.walk_speed * self.character.scale;
				self.character.set_animation('walk');
			}	
		},
		
		update:function()
		{
			var self = this;
			self.character.update();
			
			if(self.character.body.x != self.target_x)
			{
				var set_stand = false;
				
				if(self.target_x < self.character.body.x)
				{
					self.face_left();
					self.character.body.x -= self.speed;
					if(self.target_x >= self.character.body.x)
					{
						set_stand = true;
					}
				}	
				else if(this.target_x > this.character.body.x)
				{
					self.face_right();
					self.character.body.x += self.speed;
					if(self.target_x <= self.character.body.x)
					{	
						set_stand = true;
					}
				}
				
				if(set_stand)
				{
					self.character.body.x = this.target_x;
					self.character.set_animation('stand');
				}
			}
		}

	});

});