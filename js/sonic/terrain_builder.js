define([
         "util/classutils",
         "easeljs"
         ],
         function(classUtils, easeljs) {
	
	"use strict";
	
	return classUtils.create({
		
		canvas:null,
		tile_size:16,
		last_move:null,
		points:[],
		grid:null,
		line_shape:null,
		movement_bias:'x',
		
		init: function()
		{
			console.log("hello world 2");
			var self = this;
			self.canvas = new createjs.Stage("game_canvas");
			self.grid = new createjs.Shape();
			self.grid.alpha = .3;
			self.canvas.addChild(self.grid);
			self.grid.graphics.setStrokeStyle(1).beginStroke("#000000");
			for(var i = 0; i < 50; i++)
			{
				self.grid.graphics.moveTo(i*self.tile_size, 0);
				self.grid.graphics.lineTo(i*self.tile_size, 577);
			}
			for(var i = 0; i < 50; i++)
			{
				self.grid.graphics.moveTo(0, i*self.tile_size);
				self.grid.graphics.lineTo(944, i*self.tile_size);
			}
				
			self.line_shape = new createjs.Shape();
			self.canvas.addChild(self.line_shape);
			self.canvas.addEventListener('stagemousemove', function(e){self.mouse_move(e);});
			self.canvas.addEventListener('stagemousedown', function(e){self.mouse_down(e);});
		},
		
		mouse_move:function(e)
		{
			var self = this;
			if(self.last_move != null)
			{
				var x_diff = Math.abs(e.stageX - self.last_move.x);
				var y_diff = Math.abs(e.stageY - self.last_move.y);
				
				if(self.movement_bias == 'x')
					y_diff -= self.tile_size / 2;
				else
					x_diff -= self.tile_size / 2;
			}
			var cursor = {x:e.stageX, y:e.stageY};
			
			if(x_diff >= y_diff)
			{
				cursor.y = Math.round(cursor.y / self.tile_size) * self.tile_size;
				self.movement_bias = 'x';
			}	
			else
			{
				cursor.x = Math.round(cursor.x / self.tile_size) * self.tile_size;
				self.movement_bias = 'y';
			}
				
			self.last_move = cursor;
			
			self.line_shape.graphics.clear();
			self.line_shape.graphics.setStrokeStyle(2).beginStroke("#000000");
			
			if(self.points.length > 0)
			{				
				self.line_shape.graphics.moveTo(self.points[0].x, self.points[0].y);
				for(var i in self.points)
				{
					self.line_shape.graphics.lineTo(self.points[i].x, self.points[i].y);
				}
				self.line_shape.graphics.lineTo(cursor.x, cursor.y);
			}
			
			self.canvas.update();
		},
		
		mouse_down:function(e)
		{
			var self = this;
			self.points.push({x:self.last_move.x, y:self.last_move.y});
		}
	});
	
});