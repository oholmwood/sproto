define([
         "util/classutils",
         "util/loader",
         "sonic/terrain_builder"
         ],
         function(classUtils, loader, TerrainBuilder) {
	
	"use strict";
	
	return classUtils.create({
		
		
		init: function()
		{
			var self = this;
			self.preload();
		},
	
		preload: function()
		{
			var self = this;
			
			var assets = [];
			
			for(var i in assets)
			{
				assets[i] = assets[i];
			}	
			
			loader.get(assets, {all:self.preload_complete});
			
			if(assets.length == 0)
			{
				self.preload_complete();
			}
		},
		
		preload_complete: function()
		{
			var self = this;
			
			var terrain_builder = new TerrainBuilder();
		}
		
	});
	
});