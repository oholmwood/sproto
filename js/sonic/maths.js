define([
         "util/classutils"
         ],
         function(classUtils) {
	
	"use strict";
	
	return classUtils.create({
		
		init:function()
		{

		},
		
		rads:function(degrees)
		{
			return degrees * ( Math.PI / 180 );
		},
		
		degs:function(radians)
		{
			return radians * ( 180 / Math.PI );
		},
		
		rand:function(min, max)
		{
			return min + (Math.random() * (max - min));
		},
		
		rand_int:function(min, max)
		{
			return Math.round(min + (Math.random() * (max - min)));
		},
		
		get_hypotenuse:function(x1, x2, y1, y2)
		{
			var x_distance = Math.abs(x1 - x2);
			var y_distance = Math.abs(y1 - y2);
			
			return Math.sqrt(Math.pow(x_distance, 2) + Math.pow(y_distance, 2));
		},
		
		get_angle_to_point:function( start_x, target_x, start_y, target_y)
		{
			var angle_in_radians = Math.atan2( target_y - start_y, target_x - start_x );

			if( angle_in_radians < 0 )
			{
				angle_in_radians = ( 2 * Math.PI ) + angle_in_radians;
			}

			return angle_in_radians; //+ get_radians(90);
		},
		
		get_increment_for_angle:function(radians, distance)
		{				
			return {x:-1 * (-Math.sin(radians) * distance), y:-1 * (Math.cos(radians) * distance)};
		},
		
		get_rotation_increment:function(start_radians, end_radians)
		{
			return Math.atan2(Math.sin(end_radians - start_radians), Math.cos(end_radians - start_radians));
		}
		
	});
});