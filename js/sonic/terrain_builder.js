define([
         "util/classutils",
         "easeljs"
         ],
         function(classUtils, easeljs) {
	
	"use strict";
	
	return classUtils.create({
		
		canvas:null,
		grid:null,
		
		draw_line:false,
		draw_line_from:null,
		draw_line_to:null,
		draw_line_shape:null,
		draw_line_movement_bias:'x',
		
		tiles:[],
		tile_size:16,
		tile_shape:null,
		
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
					self.tiles[j][i] = null;
				}
			}
			self.canvas.update();
			
			self.tile_shape = new createjs.Shape();
			self.canvas.addChild(self.tile_shape);
				
			self.draw_line_shape = new createjs.Shape();
			self.canvas.addChild(self.draw_line_shape);
			
			self.canvas.addEventListener('stagemousemove', function(e){self.mouse_move(e);});
			self.canvas.addEventListener('stagemousedown', function(e){self.mouse_down(e);});
			self.canvas.addEventListener('stagemouseup', function(e){self.mouse_up(e);});
		},
		
		mouse_move:function(e)
		{
			var self = this;
			if(self.draw_line)
			{
				var x_diff = Math.abs(e.stageX - self.draw_line_to.x);
				var y_diff = Math.abs(e.stageY - self.draw_line_to.y);
				
				if(self.draw_line_movement_bias == 'x')
					y_diff -= self.tile_size / 2;
				else
					x_diff -= self.tile_size / 2;
						
				self.draw_line_to = {x:Math.round(e.stageX), y:Math.round(e.stageY)};
				
				if(x_diff >= y_diff)
				{
					self.draw_line_to.y = self.get_tile(self.draw_line_to.y);
					self.draw_line_movement_bias = 'x';
				}	
				else
				{
					self.draw_line_to.x = self.get_tile(self.draw_line_to.x);
					self.draw_line_movement_bias = 'y';
				}
				
				self.draw_line_shape.graphics.clear();
				self.draw_line_shape.graphics.setStrokeStyle(2).beginStroke("#000000");
				self.draw_line_shape.graphics.moveTo(self.draw_line_from.x, self.draw_line_from.y);
				self.draw_line_shape.graphics.lineTo(self.draw_line_to.x, self.draw_line_to.y);
				
				self.canvas.update();
			}
		},
		
		mouse_down:function(e)
		{
			var self = this;
			
			var point = {x:e.stageX, y:e.stageY};
			if(Math.abs(self.get_tile(point.x) - point.x) <= Math.abs(self.get_tile(point.y) - point.y))
				point.x = self.get_tile(point.x);
			else
				point.y = self.get_tile(point.y);
			
			self.draw_line_from = {x:Math.round(point.x), y:Math.round(point.y)};
			self.draw_line_to = {x:Math.round(point.x), y:Math.round(point.y)};
			
			self.draw_line = true; 
		},
		
		mouse_up:function(e)
		{
			var self = this;
			self.draw_line = false;
			if(self.draw_line_from.x != self.draw_line_to.x || self.draw_line_from.y != self.draw_line_to.y)
			{
				/*var x_distance_in_tiles = Math.abs(Math.floor((self.draw_line_to.x - self.draw_line_from.x) / self.tile_size)); 
				var y_distance_in_tiles = Math.abs(Math.floor((self.draw_line_to.y - self.draw_line_from.y) / self.tile_size));
				console.log("x: " + x_distance_in_tiles + ", y: " + y_distance_in_tiles);*/
				//var current_x_tile = 0;
				//var current_y_tile = 0;
				var current = {x:self.draw_line_from.x, y:self.draw_line_from.y};
				var count = 0;
				var current_tile = {x:Math.floor(current.x / self.tile_size), y:Math.floor(current.y / self.tile_size)};
				
				if(self.draw_line_to.x < current.x && current.x % self.tile_size == 0)
					current_tile.x -=1;
				if(self.draw_line_to.y < current.y && current.y % self.tile_size == 0)
					current_tile.y -=1;
					
				var target_tile = {x:Math.floor(self.draw_line_to.x / self.tile_size), y:Math.floor(self.draw_line_to.y / self.tile_size)};
				
				if(current.x < self.draw_line_to.x && self.draw_line_to.x % self.tile_size == 0)
					target_tile.x -=1;
				if(current.y < self.draw_line_to.y && self.draw_line_to.y % self.tile_size == 0)
					target_tile.y -=1;
				
				console.log("NEW LINE");
				
				var building_line = true;
				
				//while(Math.round(current.x) != Math.round(self.draw_line_to.x) || Math.round(current.y) != Math.round(self.draw_line_to.y))
				while(building_line)
				{
					if(current_tile.x == target_tile.x && current_tile.y == target_tile.y)
						building_line = false;
					
					count ++;
					if(count > 100)
						break;
					var results = self.calculate_line_in_tile(current, self.draw_line_to);
					
					console.log("tile: " + current_tile.x + ", " + current_tile.y + ". target tile: " + target_tile.x + ", " + target_tile.y + " start: x: " + results.sx + ", y: " + results.sy + " end: x: " + results.ex + " y: " + results.ey);	
					
					/*if(results.ex < results.sx && results.ey < results.sy)
						self.tiles[current_tile.x][current_tile.y] = {sx:results.ex, sy:results.ey, ex:results.sx, ey:results.sy};
					else*/
						self.tiles[current_tile.x][current_tile.y] = {sx:results.sx, sy:results.sy, ex:results.ex, ey:results.ey};
						
					var next_results = self.calculate_line_in_tile({}, self.draw_line_to);
						
					if(results.ex == 0)
					{
						current.x = current_tile.x * self.tile_size;
						
						if(next_results.ex != 0)
							current_tile.x -= 1;
					}
					else if(results.ex == self.tile_size)
					{
						if(next_results.ex != self.tile_size)
							current_tile.x += 1;
						
						current.x = current_tile.x * self.tile_size;
					}
					else
					{
						current.x = (current_tile.x * self.tile_size) + results.ex;
					}
					
					if(results.ey == 0)
					{
						current.y = current_tile.y * self.tile_size;
						
						if(next_results.ey != 0)
							current_tile.y -= 1;
					}
					else if(results.ey == self.tile_size)
					{
						if(next_results.ey != self.tile_size)
							current_tile.y += 1;
						
						current.y = current_tile.y * self.tile_size;
					}
					else
					{
						current.y = (current_tile.y * self.tile_size) + results.ey;
					}
					
					

					//self.draw_line_shape.graphics.setStrokeStyle(1).beginStroke("#FF3929");
					//self.draw_line_shape.graphics.moveTo(current.x, current.y);
										
					//current.x += results.ex - results.sx;
					//current.y += results.ey - results.sy;
										
					//self.draw_line_shape.graphics.lineTo(current.x, current.y);
				}
				if(count >= 100)
					console.log("There's been a bit of a cock-up in the bravado department");
				
				self.draw_tiles();	
				self.canvas.update();
				
			}
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
			
			/*
			if(count == 4)
			{
				self.draw_line_shape.graphics.setStrokeStyle(1).beginStroke("#27a21a");
				self.draw_line_shape.graphics.moveTo(start.x, start.y);
				self.draw_line_shape.graphics.lineTo(start.x, start.y + y_length_in_square);
				self.draw_line_shape.graphics.lineTo(start.x + x_end, start.y + y_length_in_square);
				self.draw_line_shape.graphics.moveTo(start.x, start.y);
				self.draw_line_shape.graphics.lineTo(start.x + x_length_in_square, start.y);
				self.draw_line_shape.graphics.lineTo(start.x + x_length_in_square, start.y + y_end);
			}*/
			
			var ret = {sx:x, sy:y, ex:0, ey:0};
			
			//if(Math.abs(Math.round(y_end)) < Math.abs(Math.round(x_end)))
			if((x + x_end > self.tile_size && y + y_end <= self.tile_size) || (x + x_end < 0 && y + y_end >= 0))
			{
				ret.ey = y + y_end;
				ret.ex = start.x < end.x ? self.tile_size : 0;
			}
			else if((y + y_end > self.tile_size && x + x_end <= self.tile_size) || (y + y_end < 0 && x + x_end >= 0))
			//else if(Math.abs(Math.round(y_end)) > Math.abs(Math.round(x_end)))
			{
				ret.ex = x + x_end;
				ret.ey = start.y < end.y ? self.tile_size : 0;
			}
			else
			{
				ret.ex = x + x_end;
				ret.ey = y + y_end;
			}
			
			/*
			if(ret.ex > self.tile_size)
				ret.ex = self.tile_size;
			if(ret.ey > self.tile_size)
				ret.ey = self.tile_size;*/
				
			//console.log("start: x: " + ret.sx + ", y: " + ret.sy + " end: x: " + ret.ex + " y: " + ret.ey);	
			
			return ret;
			
		},
		
		get_tile:function(val)
		{
			var self = this;
			return Math.round(val / self.tile_size) * self.tile_size;
		},
		
		draw_tiles:function()
		{
			var self = this;
			
			//self.draw_line_shape.graphics.clear();
			self.tile_shape.graphics.clear();
			self.tile_shape.graphics.setStrokeStyle(1).beginStroke("#FF3929");
			
			for(var i in self.tiles)
			{
				for(var j in self.tiles[i])
				{
					if(self.tiles[i][j] != undefined)
					{
						//console.log( ((self.tile_size*i) + self.tiles[i][j].sx) + ", " + ((self.tile_size*j) + self.tiles[i][j].sy) + ", " + ((self.tile_size*i) + self.tiles[i][j].ex) + ", " + ((self.tile_size*j) + self.tiles[i][j].ey));
						self.tile_shape.graphics.moveTo( (self.tile_size*i) + self.tiles[i][j].sx, (self.tile_size*j) + self.tiles[i][j].sy );
						self.tile_shape.graphics.lineTo( (self.tile_size*i) + self.tiles[i][j].ex, (self.tile_size*j) + self.tiles[i][j].ey );
					}
				}
			}
		}
	});
	
});