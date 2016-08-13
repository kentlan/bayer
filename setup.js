(function(config){

	
	
	// Creating our presentation and global namespace "app"
	window.app = new Presentation({
		globalElements: ['mainMenu'],
		type:'json',
		manageMemory: true
	});

	
	// Initiate modules
	app.scroller = new Slidescroller();
	AutoMenu.prototype.hide = function(){
		this.ele.addClass("hidden");
	};
	AutoMenu.prototype.show = function(){
		this.ele.removeClass("hidden");
	};
	app.menu = new AutoMenu({
		attachTo: 'storyboard',
		
		links: {
			s1s: {title: ' ', classname: 'home'},

		}
	});

	app.data = new Data(true);
	//builder.checkIfNeedToLoadPresentation();
	// Initialize presentation
	app.init('s1s', 'front_page');

	app.analytics.init(config);
})();




// Prevent vertical bouncing of slides
document.ontouchmove = function(event){
	event.preventDefault();
};

var ev = "touchend mouseup";

var nav_slide = 's8_1',
nav_dir = 's8_1s';


var prew = {
	"nviz1": {
		"nviz1": ["s1_1", "s1_2", "s1_3", "s1_4", "s1_5", "s1_6", "s1_7"],
		"class": "nviz1",
		"name": "nviz1",
		"prevId": "s1_1s"	
	},
	"nviz2": {
		"nviz2": ["s2_1", "s2_2","s2_3","s2_4","s2_5", "s2_6", "s2_7"],
		"class": "nviz2",
		"name": "nviz2",
		"prevId": "s2_1s"												
	},
	"nviz3": {
		"nviz3": ["s3_1", "s3_2","s3_3","s3_4","s3_5"],
		"class": "nviz3",
		"name": "nviz3",
		"prevId": "s3_1s"	
	},
	"nviz4": {
		"nviz4": ["s4_1", "s4_2", "s4_3", "s4_4", "s4_5", "s4_6", "s4_7"],
		"class": "nviz4",
		"name": "nviz4",
		"prevId": "s4_1s"
	},
	"nviz5": {
		"nviz5": ["s5_1", "s5_2", "s5_3", "s5_4", "s5_5", "s5_6", "s5_7"],
		"class": "nviz5",
		"name": "nviz5",
		"prevId": "s5_1s"
	},
	"nviz6": {
		"nviz6": ["s6_1", "s6_2", "s6_3", "s6_4", "s6_5"],
		"class": "nviz6",
		"name": "nviz6",
		"prevId": "s6_1s"
	}

	}



var presentetion = {
	bgImg: [],
	popups: [],	
	bgStyle: function(img, slide, count) {
		for (var i = 1; i <= count; i++) {
			bgImg = document.getElementsByClassName(slide + i);
			bgImg[0].style.backgroundImage = "url('content/img/"+ img + "/" + img + "_" + i + ".png')";
		}
	},
	popup: function(id) {
		var id = document.getElementById(id);
		presentetion.popups = document.getElementsByClassName('popups');		
		for (var i = 0; i < presentetion.popups.length; i++) {
			presentetion.popups[i].removeClass('active');
		};
		id.addClass('active');
	},
	closePopup: function() {
		for (var i = 0; i < presentetion.popups.length; i++) {
			if(presentetion.popups.length !== 0) {
				presentetion.popups[i].removeClass('active');
			};
		};
		presentetion.popups = [];
	},
	animationBlocks: function(id, arrow) {
		var id = document.getElementById(id);
		var arrow = document.getElementById(arrow);		
		setTimeout(function(){
			id.toggleClass('active');
			arrow.toggleClass('active');
		}, 300)

	},
	openAccordeon: function(id) {
		var id = document.getElementById(id);
		var blocks = document.getElementsByClassName('blocks');

		if(!(id.hasClass('active')))	{		
			for (var i = 0; i < blocks.length; i++) {
				blocks[i].removeClass('active');
			};	
			id.addClass('active');
		} else {
			id.removeClass('active');
		}				
	},
	secondId: '',
	firstId: '',
	prev: function(presId, groupId, slideId) {
		if(presId === 'empty') {
			document.getElementById('thumbs').classList.add('hiddenThrumbs');
			document.getElementById('thumbs').classList.remove("active");
		} else {
			document.getElementById('thumbs').classList.remove('hiddenThrumbs');				
			presentetion.firstId = groupId;

			var handle_middle = document.getElementById("handle_middle");
			var preview_container = document.getElementById("preview_container");				
			var slide_id = "",
					prev_id;

			handle_middle.classList.add(prew[presId]["class"]);

			if(presentetion.firstId !== presentetion.secondId) {

				removeChildrenRecursively(handle_middle);
				removeChildrenRecursively(preview_container);			

				for(var i = 0; i< prew[presId][groupId].length; i++) {

					var slideTrumb = document.createElement('div');
					slideTrumb.classList.add("indicator");
					slideTrumb.id = prew[presId][groupId][i] + '_indicator';

					handle_middle.appendChild(slideTrumb);

					var slidePrev = document.createElement('li');
					slidePrev.innerHTML = '<li class="prev" id="' + prew[presId][groupId][i] + '_prev" onclick="app.goTo(\''+ prew[presId]["prevId"] + '\',\'' + prew[presId][groupId][i] + '\')" ><img  src="content/img/thumbs/' + prew[presId][groupId][i] + '.jpg"></li>'				
					preview_container.appendChild(slidePrev);
				};
				presentetion.secondId = groupId;
				slide_id = document.getElementById(slideId + '_indicator');
				prev_id = document.getElementById(slideId + '_prev');
				slide_id.classList.add("active");
				prev_id.classList.add("active");

				} else {
					var indicator = document.getElementsByClassName("indicator"), 
					prev = document.getElementsByClassName("prev");	
					slide_id = document.getElementById(slideId + '_indicator');
					prev_id = document.getElementById(slideId + '_prev');			
					for (var i = 0; i<indicator.length; i++) {
						indicator[i].classList.remove("active");
					};
					for (var i = 0; i<prev.length; i++) {
						prev[i].classList.remove("active");
					};

					slide_id.classList.add("active");
					prev_id.classList.add("active");			
				}
		}

		},

		openPrev: function() {
			var thumbs = document.getElementById("thumbs");

			if(!thumbs.hasClass("active")) {
				thumbs.classList.add("active");
			} else if(thumbs.hasClass("active")){
				thumbs.classList.remove("active");
			};

		},
		menuTop: function(product){
			var menu = document.getElementById('mainMenu');
			if(product == 'empty') {
				menu.innerHTML = '<nav id="menuTop" class=""></nav>';
			};	
			if(product == 'Flex') {
				menu.innerHTML = '<nav id="menuTop" class="">\
				<ul id="menu-1" class="menu_top menu_Flex">\
					<li class="home-menu menu_top_1" onclick="app.goTo(\'s1s\', \'s1\')"><span ontouchend="app.goTo(\'s1s\', \'s1\')"><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
					<li class="menu_top_2" ontouchend="app.goTo(\'s3_1s\', \'s3_2\')"><span>Семейство<br/> Джес<sup>&reg;</sup></span></li>\
					<li class="menu_top_3" ontouchend="app.goTo(\'s3_1s\', \'s3_3\')"><span>Джес<sup>&reg;</sup> во флекс-<br/>картридже</span></li>\
					<li class="menu_top_4" ontouchend="app.goTo(\'s3_1s\', \'s3_4\')"><span>Новый<br/>режим</span></li>\
					<li class="menu_top_5" ontouchend="app.goTo(\'s3_1s\', \'s3_7\')"><span>Клик<br/>(Clyk)</span></li>\
					<li class="menu_top_6" ontouchend="app.goTo(\'s3_1s\', \'s3_12\')"><span>Профиль кровотечений<br/> и тромбозы</span></li>\
					<li class="menu_top_7" ontouchend="app.goTo(\'s3_1s\', \'s3_16\')"><span>Эффективность</span></li>\
					<li class="menu_top_8" ontouchend="app.goTo(\'s3_1s\', \'s3_18\')"><span>Дисменорея</span></li>\
					<li class="menu_top_9" ontouchend="app.goTo(\'s3_1s\', \'s3_19\')"><span>Кому Джес<sup>&reg;</sup> во флекс-<br/>картридже и Клик(Clyk)</span></li>\
				</ul></nav>';
			};
			if(product == 'Jass') {
				menu.innerHTML = '<nav id="menuTop" class="">\
					<ul id="menu-1" class="menu_top menu_Jass">\
						<li class="home-menu menu_top_1" onclick="app.goTo(\'s1s\', \'s1\')"> <span><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
						<li class="menu_top_2" ontouchend="app.goTo(\'s3_1s\', \'s3_2\')"><span>Для кого?</span></li>\
						<li class="menu_top_3" ontouchend="app.goTo(\'s3_1s\', \'s3_6\')"><span>Эффективность</span></li>\
						<li class="menu_top_4" ontouchend="app.goTo(\'s3_1s\', \'s3_12\')"><span>Длительность</span></li>\
						<li class="menu_top_5" ontouchend="app.goTo(\'s3_1s\', \'s3_15\')"><span>Безопасность</span></li>\
						<li class="menu_top_6" ontouchend="app.goTo(\'s3_1s\', \'s3_23\')"><span>Акне</span></li>\
						<li class="menu_top_7" ontouchend="app.goTo(\'s3_1s\', \'s3_24\')"><span>СПКЯ</span></li>\
						<li class="menu_top_8" ontouchend="app.goTo(\'s3_1s\', \'s3_38\')"><span>ПМС</span></li>\
						<li class="menu_top_9" ontouchend="app.goTo(\'s3_1s\', \'s3_40\')"><span>FAQ</span></li>\
					</ul></nav>';
			};
			if(product == 'Ang') {
				menu.innerHTML = '<nav id="menuTop" class="">\
				<ul id="menu-1" class="menu_top menu_Ang">\
					<li class="home-menu menu_top_0" ontouchend="app.goTo(\'s1s\', \'s1\')"> <span><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
					<li class="menu_top_1" ontouchend="app.goTo(\'s1_1s\', \'s1_1\')"><span>Схемы<br>назначения</span></li>\
					<li class="menu_top_2" ontouchend="app.goTo(\'s1_1s\', \'s1_2\')"><span>Эффективность</span></li>\
					<li class="menu_top_3" ontouchend="app.goTo(\'s1_1s\', \'s1_3\')"><span>Безопасность</span></li>\
					<li class="menu_top_4" ontouchend="app.goTo(\'s1_1s\', \'s1_7\')"><span>Качество<br> жизни</span></li>\
					<li class="menu_top_5" ontouchend="app.goTo(\'s1_1s\', \'s1_8\')"><span>Дополнительные<br>преимущества</span></li>\
					<li class="menu_top_6" ontouchend="app.goTo(\'s1_1s\', \'s1_17\')"><span>Анжелик<sup>&reg;</sup> <br>vs Фемостон</span></li>\
					<li class="menu_top_7" ontouchend="app.goTo(\'s1_1s\', \'s1_18\')"><span>Кому <br>Анжелик<sup>&reg;</sup></span></li>\
					<li class="menu_top_8" ontouchend="app.goTo(\'s1_1s\', \'s1_21\')"><span>Ультранизкая<br>доза</span></li>\
					<li class="menu_top_9" ontouchend="app.goTo(\'s1_1s\', \'s1_25\')"><span>Кому<br>Анжелик<sup>&reg;</sup> Микро</span></li>\
					<li class="menu_top_10" ontouchend="app.goTo(\'s1_1s\', \'s1_35\')"><span>Ультра доза vs<br>Фитоэстрогены</span></li>\
					<li class="menu_top_11" ontouchend="app.goTo(\'s1_1s\', \'s1_36\')"><span>Длительность</span></li>\
					</ul></nav>';
			};
			if(product == 'Ang_M') {
				menu.innerHTML = '<nav id="menuTop" class=""><ul id="menu-1" class="menu_top menu_Ang_M"><li class="home-menu menu_top_1" ontouchend="app.goTo(\'s1s\', \'s1\')"> <span><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li><li class="menu_top_2" ontouchend="app.goTo(\'s4_1s\', \'s4_2\')"><span>Ультранизкая<br/> доза</span></li><li class="menu_top_3" ontouchend="app.goTo(\'s4_1s\', \'s4_5\')"><span>Ультра доза vs<br/>Фитоэстрогены</span></li>				<li class="menu_top_4" ontouchend="app.goTo(\'s4_1s\', \'s4_6\')"><span>Эффективность</span></li>				<li class="menu_top_5" ontouchend="app.goTo(\'s4_1s\', \'s4_7\')"><span>Переносимость</span></li>				<li class="menu_top_6" ontouchend="app.goTo(\'s4_1s\', \'s4_8\')"><span>Дополнительные<br/>преимущества</span></li>				<li class="menu_top_7" ontouchend="app.goTo(\'s4_1s\', \'s4_9\')"><span>Безопасность</span></li>				<li class="menu_top_8" ontouchend="app.goTo(\'s4_1s\', \'s4_10\')"><span>Кому<br/>Анжелик<sup>&reg;</sup> Микро</span></li>    <li class="menu_top_9" ontouchend="app.goTo(\'s4_1s\', \'s4_23\')"><span>Длительность</span></li>     <li class="menu_top_10" ontouchend="app.goTo(\'s4_1s\', \'s4_24\')"><span>Схемы<br/>назначения</span></li></ul></nav>';
			};
			if(product == 'Mir') {
				menu.innerHTML = '<nav id="menuTop" class="">\
					<ul id="menu-1" class="menu_top menu_Mir">\
						<li class="home-menu menu_top_1" ontouchend="app.goTo(\'s1s\', \'s1\')"><span ontouchend="app.goTo(\'s1s\', \'s1\')"><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
						<li class="menu_top_2" ontouchend="app.goTo(\'s4_1s\', \'s4_2\')"><span>Что такое <br>ВМС Мирена<sup>&reg;</sup>?</span></li>\
						<li class="menu_top_3" ontouchend="app.goTo(\'s4_1s\', \'s4_4\')"><span>Эффективность</span></li>\
						<li class="menu_top_4" ontouchend="app.goTo(\'s4_1s\', \'s4_5\')"><span>Безопасность<br/>и переносимость</span></li>\
						<li class="menu_top_5" ontouchend="app.goTo(\'s4_1s\', \'s4_11\')"><span>ОМК</span></li>\
						<li class="menu_top_6" ontouchend="app.goTo(\'s4_1s\', \'s4_17\')"><span>Компонент МГТ</span></li>\
						<li class="menu_top_7" ontouchend="app.goTo(\'s4_1s\', \'s4_21\')"><span>Портреты<br>пациенток</span></li>\
						<li class="menu_top_8" ontouchend="app.goTo(\'s4_1s\', \'s4_36\')"><span>Мирабель</span></li>\
						<li class="menu_top_9" ontouchend="app.goTo(\'s4_1s\', \'s4_42\')"><span>Что выбирают<br>эксперты?</span></li>\
					</ul></nav>';
			};
			if(product == 'rviz2') {
				menu.innerHTML = '<nav id="menuTop" class="">\
					<ul id="menu-1" class="menu_top menu_rviz2">\
						<li class="home-menu menu_top_1" ontouchend="app.goTo(\'s1s\', \'s1\')"><span ontouchend="app.goTo(\'s1s\', \'s1\')"><img ontouchend="app.goTo(\'s1s\', \'s1\')" src="content/img/menu/home-button.png"></span></li>\
						<li class="menu_top_2" ontouchend="app.goTo(\'s5_1s\', \'s5_2\')"><span>Что такое <br>ВМС Мирена<sup>&reg;</sup>?</span></li>\
						<li class="menu_top_3" ontouchend="app.goTo(\'s5_1s\', \'s5_4\')"><span>Эффективность</span></li>\
						<li class="menu_top_4" ontouchend="app.goTo(\'s5_1s\', \'s5_5\')"><span>Безопасность<br/>и переносимость</span></li>\
						<li class="menu_top_5" ontouchend="app.goTo(\'s5_1s\', \'s5_11\')"><span>ОМК</span></li>\
						<li class="menu_top_6" ontouchend="app.goTo(\'s5_1s\', \'s5_17\')"><span>Компонент МГТ</span></li>\
						<li class="menu_top_7" ontouchend="app.goTo(\'s5_1s\', \'s5_21\')"><span>Портреты<br>пациенток</span></li>\
						<li class="menu_top_8" ontouchend="app.goTo(\'s5_1s\', \'s5_36\')"><span>Мирабель</span></li>\
						<li class="menu_top_9" ontouchend="app.goTo(\'s5_1s\', \'s5_42\')"><span>Что выбирают<br>эксперты?</span></li>\
					</ul></nav>';
			}
			scrolNav();	
		},




		menuTopSelected: function(selectLi) {
			var menu_top_before;
			if(selectLi != menu_top_before) {
				$("#menuTop li").removeClass('selected');
				$("." + selectLi).addClass('selected');
				menu_top_before = selectLi;
			};
		}

	}

	function removeChildrenRecursively(node)
	{
		if (!node) return;
		while (node.hasChildNodes()) {
			removeChildrenRecursively(node.firstChild);
			node.removeChild(node.firstChild);
		}
	};

/*функция скроллинга*/
function scrolNav() {
	var preview = document.getElementsByClassName("touch_scroll"); 
	var scrollStartPos=0;
	for(var i = 0, j=preview.length; i<j; i++){


		preview[i].addEventListener("touchstart", function(event) { 
			scrollStartPos=this.scrollTop+event.touches[0].pageY; 
		},false); 

		preview[i].addEventListener("touchmove", function(event) { 
			this.scrollTop=scrollStartPos-event.touches[0].pageY; 
		},false); 
	};


};

/*верхнее меню*/

/*запуск / остановка видео*/

function playVideo(video){
	document.getElementById('video_' + video).style.cssText="display:block;";
	document.getElementById('stop_video_' + video).style.cssText="display:block;";
	document.getElementById('video_' + video).play();
};	


function stopVideo(video){
	document.getElementById('video_' + video).pause();
	document.getElementById('video_' + video).style.cssText="display:none";
	document.getElementById('stop_video_' + video).style.cssText="display:none;";
};

	

/*счетчик колличества символов*/
function textareaLength(val){
	var maxLength = $('#comment' + val).attr('maxlength'); 
	$('#comment' + val).on('keyup', function() {
		var curLength = $('#comment' + val).val().length;
		$("#free_symbols" + val).text(maxLength - curLength);
	});

};


// /*отправка статистики*/
// var response_value = "",
// question_value = "",
// label_id = 0;
// function submitDataFlex(){
// 	ag.submit.data({
// 		unique: true,
// 		category: "CLM_Beauty_line_1cycle_2016",
// 		categoryId: label_id,
// 		label: question_value,
// 		value: response_value,
// 		valueType: "text",
// 		labelId: label_id,
// 		path: app.getPath()
// 	});
// 	console.log("label_id = " + label_id + ": " + question_value + ": " + response_value);
// };

// function submitData(val, question){
// 	ag.submit.data({
// 		unique: true,
// 		category: "CLM_VITA_line_1cycle_2016",
// 		categoryId: "CLM_VITA_line_1cycle_2016",
// 		label: question,
// 		value: val,
// 		valueType: "text",
// 		labelId: "Id",
// 		path: app.getPath()
// 	});
// 	console.log(val + ": "+ question);
// };

var response_value = "",
question_value = "",
label_id = 0;

function getValQuestionnaire(id, name, question, text) {
	label_id = '';
	response_value = '';
	question_value = '';

	label_id = id;
	$('input[name="'+name+'"]:checked').each(function() {

		response_value = response_value + this.value + ", ";
	});	
	question_value = question;
	if($('#checkbox_' + id).is(":checked")){
		console.log($('#' + text));
		response_value = response_value + $('#' + text).val();
	} 

	submitData();
}

/*отправка статистики*/

function submitData(){
	ag.submit.data({
		unique: true,
		category: "A CLM_Beauty_line_2cycle_2016",
		categoryId: label_id,
		label: question_value,
		value: response_value,
		valueType: "text",
		labelId: label_id,
		path: app.getPath()
	});
	alert("label_id = " + label_id + ": " + question_value + ": " + response_value);
};