define([
         "util/classutils",
			"easeljs"
         ],
         function(classUtils) {
	
	"use strict";
	
	return classUtils.create({
		
		animation_data:null,
		body:null,
		body_parts:{},
		current_frame:0,
		current_animation:null,
		scale:1,
		
		init: function(_animation_data)
		{
			var self = this;
			
			self.animation_data = _animation_data;
			
			self.body = new createjs.Container();
			self.body.x = 0;
			self.body.y = 0;
			self.body.scaleX = self.scale;
			self.body.scaleY = self.scale;
			
			for(var i in self.animation_data.parts)
			{
				var image_data = self.animation_data.parts[i].image;
				var bmp = new createjs.Bitmap(image_data.sheet);
				bmp.sourceRect = new createjs.Rectangle(image_data.x, image_data.y, image_data.width, image_data.height);
				bmp.name = i;
				self.body_parts[i] = bmp;
			}
		},
		
		set_scale:function(_scale)
		{
			var self = this;
			self.scale = _scale;
			self.body.scaleX = self.body.scaleY = self.scale;
		},
		
		set_animation:function(animation)
		{
			var self = this;
			
			while(self.body.getNumChildren() > 0)
			{
				self.body.removeChild(self.body.getChildAt(0));
			}	
			
			for(var i in self.animation_data.animations[animation].parts)
			{
				self.body.addChild(self.body_parts[i]);
			}
			
			self.current_animation = animation;
			self.current_frame = 0;
		},
		
		update:function()
		{
			var self = this;
			
			if(self.current_animation != null)
			{
				var parts = self.animation_data.animations[self.current_animation].parts;
				
				for(var i in parts)
				{
					var graphic = self.body_parts[i];
					var props = parts[i][self.current_frame];
					
					if(props != null)
					{
						if(props.hidden != undefined)
							graphic.visible = false;
						else if(!graphic.visible)
							graphic.visible = true;
						
						if(props.x != undefined)
							graphic.x = props.x;
						
						if(props.y != undefined)
							graphic.y = props.y;
						
						if(props.r != undefined)
							graphic.rotation = props.r;
						
						if(props.w != undefined)
							graphic.scaleX = props.w / self.animation_data.parts[i].default_size.w;
						
						if(props.h != undefined)
							graphic.scaleY = props.h / self.animation_data.parts[i].default_size.h;
					}	
				}	
				
				self.current_frame+=1;
				if(self.current_frame >= self.animation_data.animations[self.current_animation].frames)
				{
					self.current_frame = 0;
				}
			}
		}
		
	});
	
});