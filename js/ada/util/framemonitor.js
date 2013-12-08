define([
         "util/classutils",
         "easeljs",
         "jquery"
         ],
         function(classUtils, easelJS, $) {
	
	"use strict";
	
	return classUtils.create({
		
		frameskip:1,
		assess_history:null,
		update:null,
		counter:null,
		
		/*
		 * TODO:
		 * - Add show and hide visual fps counter functions
		 */
		
		init:function()
		{
			var self = this;
			
			if(window.ada_debug)
			{
				self.feedback = $('<div id="fps_counter"></div>');
				self.feedback.css({
					'position':'absolute',
					'width':'100px',
					'height':'50px',
					'left':'0px',
					'background-color':'#000000',
					'color':'#FFFFFF'
				});
				$('#ada_wrapper').append(self.feedback);
			}	
			
			this.monitor();
		},
	
		monitor: function()
		{
			var self = this;

			self.assess_history = [];
			
			self.update = function()
			{
				if(createjs.Ticker.getTicks() % 5 == 0)
				{	
					self.assess_history.push(createjs.Ticker.getMeasuredFPS());
					
					if(self.assess_history.length >= 3)
					{
						var total = 0;
						
						for(var i = 0; i < self.assess_history.length; i++)
						{
							total+= self.assess_history[i];
						}
						
						var average = Math.round(total/self.assess_history.length);
						
						if(self.frameskip > 1 && average > createjs.Ticker.getFPS() / Math.round(self.frameskip/2))
						{	
							self.frameskip = Math.round(self.frameskip/2);
						}
						else
						{
							self.frameskip = Math.round(createjs.Ticker.getFPS() / average);
						}
						
						while(self.assess_history.length > 0)
						{
							self.assess_history.splice(0, 1);
						}
					}
				}
				
				if(window.ada_debug == true)
				{
					self.feedback.html(Math.round(createjs.Ticker.getMeasuredFPS()) + "/" + Math.round(createjs.Ticker.getFPS()) + "/" + self.frameskip);
				}
			};
			
			createjs.Ticker.addEventListener("tick", self.update);
		},
		
		cease_monitoring: function()
		{
			var self = this;
			if(self.update != null)
			{	
				createjs.Ticker.removeEventListener("tick", self.update);
			}
		}
		
	});
});