define([
         "util/classutils",
			"easeljs",
			"ada/andy",
			"ada/scene/data/scenes_data"
         ],
         function(classUtils, easeljs, Andy, ScenesData) {
	
	"use strict";
	
	return classUtils.create({
		
		scenes_data:null,
		
		background_canvas:null,
		scene_canvas:null,
		ui_canvas:null,
		
		background_image:null,
		andy:null,
		click_area:null,
		black_overlay:null,
		
		init: function()
		{
			var self = this;
			
			self.background_canvas = new createjs.Stage("ada_background_canvas");
			self.scene_canvas = new createjs.Stage("ada_scene_canvas");
			//self.ui_canvas = new createjs.Stage("ada_ui_canvas");
			//self.ui_canvas.mouseEnabled = false;
			
			self.andy = new Andy();
			self.scene_canvas.addChild(self.andy.body);
			
			self.click_area = new createjs.Shape();
			self.click_area.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#f00").drawRect(0,0,window.ada_width,window.ada_height));
			self.click_area.addEventListener("click", function(e){
				self.click_event(e);
			});
			self.scene_canvas.addChild(self.click_area);
			
			self.scenes_data = new ScenesData();
			self.create_scene('triassic0', 'right');
			
			self.play();
		},
		
		clear_scene: function()
		{
			
		},
		
		create_scene: function(scene_id, entrance)
		{
			var self = this;
			
			var data = self.scenes_data[scene_id];
			
			self.background_image = new createjs.Bitmap(data.background);
			self.background_canvas.addChild(self.background_image);
			self.background_canvas.update();
			
			self.andy.set_in_scene(data.entrances[entrance].x, data.entrances[entrance].y, data.andy_scale);
			
		},
		
		play: function()
		{
			var self = this;
			createjs.Ticker.addEventListener("tick", function(){self.update()});
		},
		
		pause: function()
		{
			var self = this;
			//TODO: figure out a good way of adding and removing the update listener
		},
		
		update: function()
		{
			var self = this;
			
			if(createjs.Ticker.getTicks() % window.ada.frame_monitor.frameskip == 0)
			{
				self.andy.update();
				self.scene_canvas.update();
			}
		},
		
		click_event: function(e)
		{
			var self = this;
			self.andy.clicked(e);
		}
		
	});
	
});