
		window.debug = true;
		window.is_mobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Kindle|Silk/i.test(navigator.userAgent) || (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Kindle|Silk/i.test(navigator.platform)));
		
		$(function()
		{
			$('head').append('<title>Sonic Prototype</title>\
					<meta charset="utf-8">\
					<meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0" />\
					<meta name="apple-mobile-web-app-capable" content="yes" />\
					<meta name="apple-mobile-web-app-status-bar-style" content="black" />\
					');
			$('body').append('\
			    <div id="wrapper" style="position:absolute; width:944px; height:577px;">\
		        	<canvas id="game_canvas" width="944" height="577" style="position:absolute; width:100%; height:100%"></canvas>\
		        </div>'
			);
			
			define("config", {
		         baseUrl: ""
		     });
			
			require.config({
				baseUrl: "js/",
				paths: {
		            "jquery": "thirdparty/jquery/jquery-1.8.3.min",
		            "TweenMax": "thirdparty/gsap/tweenmax.min",
		            "easeljs": "thirdparty/easeljs/easeljs-0.7.0.min"
		        },
		        deps: [
		               "jquery"
		               ],
		        urlArgs: "noCache=" + (function(){
						                   if (window.debug){
						                       return (new Date()).getTime();
						                   }else{
						                       return "false";
						                   }
	              						}()),
	            enforceDefine: true,
	            shim:{
	                "thirdparty/jquery/plugins/jquery.imagesloaded": {
	                    deps: ["jquery"],
	                    exports: "jQuery.fn.imagesLoaded"
	                },
					"util/loader": {
	                    deps: ["jquery", "thirdparty/jquery/plugins/jquery.imagesloaded"],
	                    exports: "jquery"
	                },
	                "easeljs": {
	                	exports:'createjs'
	                }
	            }
			});
			
			require(['js/sonic/main.js', 'js/sonic/maths.js'], function(Main, Maths){
				window.sonic = new Main();
				maths = new Maths();
			});
		});
