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
		tiles:[],
		
		init: function()
		{
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
				self.tiles[i] = [];
			}
			for(var i = 0; i < 50; i++)
			{
				self.grid.graphics.moveTo(0, i*self.tile_size);
				self.grid.graphics.lineTo(944, i*self.tile_size);
				
				for(var j = 0; j < 50; j++)
				{
					self.tiles[j][i] = {};
				}
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
				/*			
				self.line_shape.graphics.moveTo(self.points[0].x, self.points[0].y);
				for(var i in self.points)
				{
					self.line_shape.graphics.lineTo(self.points[i].x, self.points[i].y);
				}*/
				self.line_shape.graphics.moveTo(self.points[self.points.length-1].x, self.points[self.points.length-1].y);
				self.line_shape.graphics.lineTo(cursor.x, cursor.y);
			}
			
			self.canvas.update();
		},
		
		mouse_down:function(e)
		{
			var self = this;
			self.points.push({x:Math.round(self.last_move.x), y:Math.round(self.last_move.y)});
			if(self.points.length > 1)
			{				
				self.convert_lines_to_tiles(self.points[self.points.length-2], self.points[self.points.length-1]);
			}
		},
		
		convert_lines_to_tiles:function(start, end)
		{
			var self = this;
			self.calculate_line_in_tile(start, end);
		},
		
		calculate_line_in_tile:function(start, end)
		{
			var self = this;
			
			var x = start.x % self.tile_size;
			var y = start.y % self.tile_size;
			
			if(start.x > end.x && x == 0)
				x = self.tile_size;
				
			if(start.y > end.y && y == 0)
				y = self.tile_size;
			
			var x_length_in_square = (self.tile_size - x);
			if(start.x > end.x)
			{
				x_length_in_square = -x;
				if(x_length_in_square == 0)
					x_length_in_square = -(self.tile_size);
			}
			
			var y_length_in_square = (self.tile_size - y);
			if(start.y > end.y)
			{
				y_length_in_square = -y;
				if(y_length_in_square == 0)
					y_length_in_square = -(self.tile_size);
			}

			var x_to_y_percent = (end.x - start.x) / (end.y - start.y);
			var y_to_x_percent = (end.y - start.y) / (end.x - start.x);
			
			var x_end = Math.round(y_length_in_square * x_to_y_percent);
			var y_end = Math.round(x_length_in_square * y_to_x_percent);
			
			
			self.line_shape.graphics.setStrokeStyle(1).beginStroke("#FF3929");
			self.line_shape.graphics.moveTo(start.x, start.y);
			self.line_shape.graphics.lineTo(start.x, start.y + y_length_in_square);
			self.line_shape.graphics.lineTo(start.x + x_end, start.y + y_length_in_square);
			self.line_shape.graphics.moveTo(start.x, start.y);
			self.line_shape.graphics.lineTo(start.x + x_length_in_square, start.y);
			self.line_shape.graphics.lineTo(start.x + x_length_in_square, start.y + y_end);
			
			var ret = {sx:x, sy:y, ex:0, ey:0};
			
			if(Math.abs(Math.round(y_end)) < Math.abs(Math.round(x_end)))
			{
				ret.ey = y + y_end;
				ret.ex = start.x < end.x ? self.tile_size : 0;
			}
			else if(Math.abs(Math.round(y_end)) > Math.abs(Math.round(x_end)))
			{
				ret.ex = x + x_end;
				ret.ey = start.y < end.y ? self.tile_size : 0;
			}
			else
			{
				ret.ex = x + x_end;
				ret.ey = y + y_end;
			}
				
			console.log("start: x: " + ret.sx + ", y: " + ret.sy + " end: x: " + ret.ex + " y: " + ret.ey);	
			

			self.canvas.update();
		},
		
		get_tile:function(val)
		{
			var self = this;
			return Math.round(val / self.tile_size) * self.tile_size;
		}
	});
	
});