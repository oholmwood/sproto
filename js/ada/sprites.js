define([
         "util/classutils",
			"easeljs"
         ],
         function(classUtils) {
	
	"use strict";
	
	return classUtils.create({
		
		init:function(){
			
		},
		
		get_data:function(sheet, sprite)
		{
			if(this[sheet])
			{
				if(this[sheet].sprites[sprite])
				{
					return {	sheet:this[sheet].sheet, 
								x:this[sheet].sprites[sprite][0],
								y:this[sheet].sprites[sprite][1],
								width:this[sheet].sprites[sprite][2],
								height:this[sheet].sprites[sprite][3]
								}
				}
			}
			
			console.log("Requested sprite (sheet:" + sheet + ", sprite:" + sprite + " not found)");
			return null;
		},
		
		get_bitmap:function(sheet, sprite)
		{
			var data = this.get_data(sheet, sprite);
			
			if(data)
			{
				var bmp = new createjs.Bitmap(data.sheet);
				bmp.sourceRect = new createjs.Rectangle(data.x, data.y, data.width, data.height);
				return bmp;
			}
			
			return null;
		},
		

//___SPRITE DATA
		
		andy_character:{
								sheet:window.ada_base_url + 'assets/images/animations/pixel/horacio_assets.png',
								sprites:{
									arm_bottom:[2, 2, 18, 51],
									arm_top:[22, 2, 28, 65],
									back_arm_hand:[52, 2, 35, 44],
									back_leg_shoe:[89, 2, 45, 19],
									bottom_body:[136, 2, 50, 58],
									front_arm_hand:[188, 2, 20, 36],
									front_leg_shoe:[2, 69, 46, 27],
									groin:[50, 69, 46, 40],
									head:[98, 69, 55, 67],
									leg_bottom:[155, 69, 35, 81],
									leg_top:[192, 69, 36, 84],
									neck:[230, 69, 21, 24],
									shadow:[2, 155, 168, 27],
									top_body:[172, 155, 46, 64]
								}
							}
		
	});

});