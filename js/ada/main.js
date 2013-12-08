define([
         "util/classutils",
         "util/loader",
			"ada/sprites",
         "ada/util/framemonitor",
			"ada/scene"
         ],
         function(classUtils, loader, SpriteManager, FrameMonitor, Scene) {
	
	"use strict";
	
	return classUtils.create({
		
		sprites:null,
		frame_monitor:null,
		scene:null,
		
		init: function()
		{
			var self = this;
			
			self.sprites = new SpriteManager();
			self.frame_monitor = new FrameMonitor();
			
			self.preload();
		},
	
		preload: function()
		{
			var self = this;
			
			var assets = [
			              'assets/images/animations/pixel/horacio_assets.png',
			              'assets/images/scenes/forest_temple.jpg'
			              ];
			
			for(var i in assets)
			{
				assets[i] = window.ada_base_url + assets[i];
			}	
			
			loader.get(assets, {all:self.preload_complete});
		},
		
		preload_complete: function()
		{
			var self = this;
			
			self.scene = new Scene();
		}
		
	});
	
});