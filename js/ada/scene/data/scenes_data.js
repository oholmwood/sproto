define([
         "util/classutils"
         ],
         function(classUtils) {
	
	"use strict";
	
	return classUtils.create({
		
		init:function()
		{
			this.triassic0 =
			{
				andy_scale:0.7,
				background:window.ada_base_url + "assets/images/scenes/forest_temple.jpg",
				entrances:
				{
					left:{x:100, y:400, link:{scene:'triassic1', entrance:'right'}},
					right:{x:844, y:400, link:{scene:'triassic1', entrance:'left'}}
				},
				paths:
				[
					[[0, 300], [250, 200], [400, 250], [944, 300]]
				]
			},

			this.triassic1 = 
			{
				andy_scale:0.9,
				background:window.ada_base_url + "assets/images/scenes/forest_temple.jpg",
				entrances:
				{
					left:{x:100, y:400, link:{scene:'triassic0', entrance:'right'}},
					right:{x:844, y:400, link:{scene:'triassic0', entrance:'left'}}
				},
				paths:
				[
					[[0, 300], [500, 500], [700, 450], [944, 500]]
				]
			}
		}
		

		
	});

});