function Search(object){

	const form 				=document.querySelector(object.name);
	const input 			=form.querySelector(object.input);
	const submitBtn 			=form.querySelector(object.btn+"[type='submit']");
	const resetBtn 			=form.querySelector(object.btn+"[type='reset']");
	const history 			=form.querySelector(object.history.name);
	const historyContent 	=form.querySelector(object.history.content);
	var historyList=[];
	var maxLengHistory=5;

	form.addEventListener('submit',function(event) {
		event.preventDefault();
		if(input.value.trim()!=""){
			var isOnly=historyList.some(function(element){
				return element==input.value;
			})

			if(!isOnly){
				if(historyList.length>=maxLengHistory){
					historyList.pop();		
				}
			 	historyList.unshift(input.value);
			}
		}
		

		renderHistoryList();	
	});
	input.addEventListener('focus',function(event){
		renderHistoryList();
	});
	// input.addEventListener('blur',function(event){
	// 	historyContent.innerHTML="";
	// });
	history.addEventListener('mousedown',function(event){
		event.preventDefault();
	});
	historyContent.addEventListener('click',function(event){
		var item=event.target.closest(object.history.item);
		if(item){
			input.value=item.querySelector(object.history.value).innerText;
		}
	});
	resetBtn.addEventListener('mousedown',function(event){
		event.preventDefault();
	});
	submitBtn.addEventListener('mousedown',function(event){
		event.preventDefault();
	});
	function renderHistoryList(){
		historyContent.innerHTML="";
		historyList.forEach(function(element) {
			historyContent.innerHTML+=object.history.render(element);
		});
	}
}
Search({
	name 	:"#form-search",
	input  	:".header-center-form-search-input",
	btn  	:".header-center-form-search-btn",
	history :{
		name 	:".header-center-form-search-history",
		content :".header-center-form-search-history-menu",
		item 	:".header-center-form-search-history-item",
		value 	:".header-center-form-search-history-link",
		render  :function(value){
			return `
			<li class="header-center-form-search-history-item">
				<i class="icon fas fa-search"></i>
				<a class="header-center-form-search-history-link"href="#">${value}</a>
			</li>
			`
		}
	}
});

function Slide(object){
	const slide  			=document.querySelector(object.name);

	const slideItems  		=slide.querySelectorAll(object.item);
	const slideBtnPrev  	=slide.querySelector(object.btn+".left");
	const slideBtnNext  	=slide.querySelector(object.btn+".right");

	var oldIndex 			=null;
	var currentIndex  		=Array.from(slideItems).findIndex(function(element){
		return element.classList.contains("active");
	});
	isRuning 				=false;
	slideShow();
	

	setInterval(function(){
		if(!isRuning){
			nextSlide();
		}
	},object.delay);

	slideBtnPrev.addEventListener('click',function(event){
		if(!isRuning){
			backSlide();
		}
	});
	slideBtnNext.addEventListener('click',function(event){
		if(!isRuning){
			nextSlide();
		}
	});
	function nextSlide(){
		slideItems[currentIndex].classList.remove('active');

		currentIndex++
		if(currentIndex 	>= 	slideItems.length)
			currentIndex 	= 	0;

		slideItems[currentIndex].classList.add('active');

		slideShow(1,0);
	}
	function backSlide(){
		slideItems[currentIndex].classList.remove('active');

		currentIndex--
		if(currentIndex 	< 	0)
			currentIndex  	=	slideItems.length-1;

		slideItems[currentIndex].classList.add('active');
		
		slideShow(0,1);

	}
	function slideShow(before=1,after=0){
		var prevIndex  	=	currentIndex-1;
		if(prevIndex  	< 	0)
			prevIndex  	=	slideItems.length-1;

		var nextIndex  	=	currentIndex+1;
		if(nextIndex 	>= 	slideItems.length)
			nextIndex 	= 	0;	

		isRuning  		=true;
		setTimeout(function(){

			isRuning 	=false;

		},object.time);
		Array.from(slideItems).forEach(function(element,index){
			if(index  	== 		prevIndex){
					Object.assign(element.style,{
						opacity 	: '1',
						zIndex 		: `${2+before}`,
						transition 	:`transform ${object.time / 1000}s linear`,
						transform 	:`translate(-100%)`
					});
			}else if(index==currentIndex){
					Object.assign(element.style,{
						opacity 	: '1',
						zIndex 		: '4',
						transition 	:`transform ${object.time / 1000}s linear`,
						transform 	:'translate(0%)'
					});
			}else if(index==nextIndex){
					Object.assign(element.style,{
						opacity 	: '1',
						zIndex 		: `${2+after}`,
						transition 	:`transform ${object.time / 1000}s linear`,
						transform 	:`translate(100%)`
					});
			}else{
					element.style 	="";
			}
		});		
	}
}
Slide({
	name 	:"#slide",
	item 	:".slide-content-item",
	btn 	:".slide-content-btn",
	delay 	:4000,
	time 	:1000
})


function Audio(object){
	const audio 				=document.querySelector(object.name);
	const viewList 				=document.querySelector(object.viewList.name);


	const viewListPlaying 		=viewList.querySelector(object.viewList.target);
	var currentViewActive 		=viewListPlaying.querySelector(object.viewList.item+".active");

	const control  				=audio.querySelector(object.control);
	const thumbnail  			=audio.querySelector(object.view.thumbnail);

	const progress 				=audio.querySelector(object.progress.control);
	const progressRange 		=progress.querySelector(object.progress.range);
		progressRange.setAttribute('value',0);
		progressRange.setAttribute('min',0);
		progressRange.setAttribute('max',100);

	const progressBar  			=progress.querySelector(object.progress.bar);
		progressBar.setAttribute('style',"--progress:0");
	


	const volume    			=audio.querySelector(object.volume.control);
	const volumeRange  			=volume.querySelector(object.volume.range);
		 volumeRange.setAttribute('value',100);
		 volumeRange.setAttribute('min',0);
		 volumeRange.setAttribute('max',100);
	const volumeBar  			=volume.querySelector(object.volume.bar);
		 volumeBar.setAttribute('style',"--progress:100");

	const volumeBtn  			=audio.querySelector(object.btn+".volume");

	const nextBtn  				=audio.querySelector(object.btn+".next");
	const backBtn  				=audio.querySelector(object.btn+".back");

	const likeBtn 				=audio.querySelector(object.btn+".like");

	const randomBtn  			=audio.querySelector(object.btn+".random");
	var isRandom  				=randomBtn.classList.contains('active');


	const repeatBtn  			=audio.querySelector(object.btn+".repeat");
	var isRepeat  				=repeatBtn.classList.contains('active');

	const playBtn  				=audio.querySelector(object.btn+".play");

	var currentIndex 			=0;

	var listSongPlayed  		={
		songPlayed:new Array(object.songs.length),
		lengthPlayed:0
	};

	renderListSong();
	renderCurrentSong();

	control.addEventListener('play',function(event){
		thumbnail.classList.add('play');
		playBtn.classList.add('active');

		if(currentViewActive){
			currentViewActive.querySelector(object.viewList.btn).classList.add('active');
	}

	});
	control.addEventListener('pause',function(event){
		thumbnail.classList.remove('play');
		playBtn.classList.remove('active');

		if(currentViewActive){
			currentViewActive.querySelector(object.viewList.btn).classList.remove('active');
	}

	});
	control.addEventListener('canplay',function(event){
		if(this.duration)
			audio.querySelector(object.progress.end).innerText  	=formatTime(this.duration);
		control.volume 												=volumeRange.getAttribute('value') / 100;
	});
	control.addEventListener('timeupdate',function(event){	
		if(this.duration){
			audio.querySelector(object.progress.current).innerText	=formatTime(this.currentTime);
			progressRange.setAttribute('value',(this.currentTime/this.duration) * 100);
			progressBar.setAttribute('style',"--progress:"+(this.currentTime / this.duration) * 100);
		}
	});


	control.addEventListener('volumechange',function(event){
		 if(event.target.volume == 0 || control.muted)
		 	{
		 		volumeBtn.innerHTML  		='<i class="icon-volume fas fa-volume-mute"></i>';
		 		volumeBar.setAttribute('style',"--progress:0");
		 	}
		 else
		 	{
		 		if(event.target.volume<0.6)
		 			volumeBtn.innerHTML 	='<i class="icon-volume fas fa-volume-down"></i>';
		 		else
		 			volumeBtn.innerHTML 	='<i class="icon-volume fas fa-volume-up"></i>';

		 		volumeBar.setAttribute('style',"--progress:"+(this.volume * 100));
		 		volumeRange.setAttribute('value',(this.volume * 100));
		 	}
	});

	control.addEventListener('ended',function(event){
		if(isRepeat){
			control.load();
		}else{
			NextSong();	
		}
		control.play();
	});


	progressRange.addEventListener('input',function(event){
		control.currentTime  				=(event.target.value * control.duration) / 100;
	});

	volumeRange.addEventListener('input',function(event){
		control.muted  						=false;
		control.volume  					=(event.target.value)/100;
	});


	

	function playCurrentSong(event){
		if(control.paused){
			control.play();				
		}else{
			control.pause();
		}
	}
	playBtn.addEventListener('click',function(event){
		playCurrentSong();
	});

	viewListPlaying.addEventListener('click',function(event){
		var elementTarget=event.target;
		if(elementTarget.closest(".audio-list-menu-item-option")){

			elementTarget.closest(object.btn).classList.toggle("active");

		}else if(elementTarget.closest(".audio-list-menu-item-body")){
			
		}else if(elementTarget.closest(".audio-list-menu-item-play")){

			if(elementTarget.closest(object.viewList.item+".active")){

				playCurrentSong();

			}else{

				currentIndex=elementTarget.closest(object.viewList.item).dataset.index;
				renderCurrentSong();
				control.play();

			}
		}
	})

	nextBtn.addEventListener('click',function(event){
		NextSong();
		control.play();
	});
	backBtn.addEventListener('click',function(event){
		BackSong();
		control.play();
	});
	volumeBtn.addEventListener('click',function(event){
		if(control.muted){		
			control.muted 				=false;
		}else{
			control.muted 				=true;
		}	
	});
	likeBtn.addEventListener('click',function(event){
		this.classList.toggle('active');
	});
	randomBtn.addEventListener('click',function(event){
		isRandom 		=this.classList.toggle('active');
	});
	repeatBtn.addEventListener('click',function(event){
		isRepeat  		=this.classList.toggle('active');
	});


	function formatTime(time){
		var i 		=	Math.floor(time / 60);
		var s 		=	Math.floor(time % 60);
		var h 		=	Math.floor(i / 60);
		i 			=	Math.floor(i % 60);

		var text 	=  	"";
		if( h > 0 )	
			text 	+= 	h;
		if( i < 10 )
			text 	+=	"0"	 + 	i;
		else
			text 	+=	i;

		text 		+=	":";
		if(s < 10)
			text 	+=	"0"	 +	s;
		else
			text 	+=	s;

		return text;
	}
	function renderCurrentSong(){
		if(currentViewActive)
			{
				currentViewActive.classList.remove('active');
				currentViewActive.querySelector(object.viewList.btn).classList.remove('active');
			}
		currentViewActive  		=viewListPlaying.querySelector(object.viewList.item+`[data-index='${currentIndex}']`);
		currentViewActive.classList.add('active');


		control.currentTime  							   =0;
		control.src  									   =object.songs[currentIndex].src  ||	 "";
		audio.querySelector(object.view.img).src  		   =object.songs[currentIndex].img  ||  "../../img/zingmp3icon.png";
		audio.querySelector(object.view.title).innerText   =object.songs[currentIndex].name ||  "";
		audio.querySelector(object.view.auth).innerText    =object.songs[currentIndex].auth ||  "";
	}
	function renderListSong(){
		object.songs.forEach( function(element, index) {
			object.viewList.render(viewListPlaying,element, index);
		});

	}
	function RandomSong(){
		if(listSongPlayed.lengthPlayed 		=== 	listSongPlayed.songPlayed.length-1){
				listSongPlayed.songPlayed  		=new Array(listSongPlayed.songPlayed.length);
				listSongPlayed.lengthPlayed 	=0;
			}
		listSongPlayed.songPlayed[currentIndex] 		=true;
		listSongPlayed.lengthPlayed++;

		var newIndex 							=currentIndex;
		while (newIndex	  ===  currentIndex || listSongPlayed.songPlayed[newIndex]) {
				newIndex  						=Math.floor(Math.random() * object.songs.length);
		}
		currentIndex 									=newIndex;
		renderCurrentSong();
	}
	function NextSong(){
		if(isRandom)
			RandomSong();
		else {
			currentIndex++;

			if(currentIndex 	>= 	 object.songs.length)
				currentIndex 							=0;
			renderCurrentSong();
		}
	}
	function BackSong(){
		if(isRandom)
			RandomSong();
		else{
			currentIndex--;

			if(currentIndex  <  0)
				currentIndex 							=object.songs.length-1;
			renderCurrentSong();
		} 
			
	}

}

Audio({
	name: 			"#audio",
	control: 		".audio-control",	
	btn: 			".option-menu-btn",
	view:{
		thumbnail: 	".audio-control-view-thumbnail",
		title: 		".audio-control-view-title",
		auth: 		".audio-control-view-auth",
		img: 		".audio-control-view-thumbnail-img"
	},
	progress:{
		control:    ".audio-content-time-bar",
		range:      ".form-input-progress-range",
		bar:        ".form-input-progress-bar",
		current:    ".audio-content-time.current",
		end:        ".audio-content-time.end"
	},
	volume:{
		control:    ".audio-content-volume-bar",
		range:  	".form-input-progress-range",
		bar: 		".form-input-progress-bar"
	},
	viewList:{
		name: 		"#listSongModal",
		target: 	"#listSongPlaying",
		btn: 		".audio-list-menu-item-play",
		item: 		".audio-list-menu-item",
		render:function(target,song,index){
			target.innerHTML+=`
					<li class="audio-list-menu-item "data-index="${index}">
						<a href="#"type="button" class="audio-list-menu-item-play">
							<span class="audio-list-menu-item-thumbnail">
								<img src="${song.img}" alt="" >
							</span>
							<i class="icon-pause fas fa-play"></i>
							<i class="icon-play bi bi-soundwave"></i>
						</a>
						<div class="audio-list-menu-item-body">
							<div><span class="audio-list-menu-item-title">${song.name}</span></div>
							<div><a href="#"class="audio-list-menu-item-auth">${song.auth}</a></div>
						</div>
						<ul class="option-menu audio-list-menu-item-option">
							<li class="option-menu-item">
								<a href="#"type="button" class="option-menu-btn btn-circle like">
									<i class=" icon-like far fa-heart"></i>
									<i class=" icon-liked fas fa-heart"></i>
								</a>
							</li>
							<li class="option-menu-item">
								<a href="#"type="button" class="option-menu-btn btn-circle more">
									<i class=" fas fa-ellipsis-h"></i>
								</a>
							</li>
						</ul>
					</li>	
				`
		}
	},
	songs:[
		
		{
			name:"(Tik Tok Remix) Quan Sơn Tửu",
			auth:"Đẳng Thập Ma Quân",
			src:"../../audio/(Tik Tok Remix) Quan Sơn Tửu - Đẳng Thập Ma Quân.mp3",
			type:"audio/mpeg",
			img:"../../img/card2.jpg"
		},
		{
			name:"9420",
			auth:"",
			src:"../../audio/9420.mp3",
			type:"audio/mpeg",
			img:"../../img/card2.jpg"
		},
		{
			name:"[VIETSUB-FMV] Nhất tiếu khuynh thành",
			auth:"Bành Tiểu Nhiễm",
			src:"../../audio/[VIETSUB-FMV] Nhất tiếu khuynh thành -Công chúa Tây Châu Tiểu Phong- Bành Tiểu Nhiễm.mp3",
			type:"audio/mpeg",
			img:"../../img/card2.jpg"
		},
		{
			name:"[Vietsub] Thời Không Sai Lệch -- 错位时空 - 艾辰",
			auth:"Ngải Thần",
			src:"../../audio/[Vietsub] Thời Không Sai Lệch - Ngải Thần - 错位时空 - 艾辰.mp3",
			type:"audio/mpeg",
			img:"../../img/card1.jpg"
		},
		{
			name:"Túy Hồng Nhan (Remix) ll OST Thủy Hử, China Mix",
			auth:"",
			src:"../../audio/Túy Hồng Nhan (Remix) ll OST Thủy Hử, China Mix.mp3",
			type:"audio/mpeg",
			img:"../../img/card2.jpg"
		},
		{
			name:"Luân Hồi Chi Cảnh 《轮回之境》 Critty",
			auth:"",
			src:"../../audio/Luân Hồi Chi Cảnh 《轮回之境》 Critty - Mỹ nhân Diễm Linh Cơ.mp3",
			type:"audio/mpeg",
			img:"../../img/card2.jpg"
		},
		{
			name:"KCT - La La La (Never Give It Up)",
			auth:"",
			src:"../../audio/KCT - La La La (Never Give It Up).mp3",
			type:"audio/mpeg",
			img:"../../img/card2.jpg"
		},
		{
			name:"[Vietsub] Tư Niệm Nhiễu Chỉ Tiêm - 海鸟飞鱼 - 思念绕指尖 (DJ名龙版)",
			auth:"Hải Điểu Phi Ngư (Remix)",
			src:"../../audio/[Vietsub] Tư Niệm Nhiễu Chỉ Tiêm - Hải Điểu Phi Ngư (Remix) 海鸟飞鱼 - 思念绕指尖 (DJ名龙版).mp3",
			type:"audio/mpeg",
			img:"../../img/card2.jpg"
		},
		{
			name:"[VIETSUB] ♫ Chiết Phong Độ Dịch Remix ♫ - - - 折风渡夜 - 泽国同学 - - ♪ Tik Tok ♪",
			auth:"Trạch Quốc Đồng Học",
			src:"../../audio/[VIETSUB] ♫ Chiết Phong Độ Dịch Remix ♫ - Trạch Quốc Đồng Học - - 折风渡夜 - 泽国同学 - - ♪ Tik Tok ♪.mp3",
			type:"audio/mpeg",
			img:"../../img/card2.jpg"
		}
	]
})



function scrollPage(object){
	const pages = document.querySelectorAll(object.name);
	if(pages){
		Array.from(pages).forEach(function(element,index){
			const btnLeft=element.querySelector(object.btn+".left");
			const btnRight=element.querySelector(object.btn+".right");
			const content =element.querySelector(object.content);
			setScroll();
			function setScroll(){
				if(btnLeft){
					if(content.scrollLeft==0)
						btnLeft.classList.add('disabled');
					else
						btnLeft.classList.remove('disabled');
				}
				if(btnLeft){
					if(content.scrollLeft==content.scrollWidth-content.offsetWidth)
						btnRight.classList.add('disabled');
					else
						btnRight.classList.remove('disabled');
				}
			}
			content.addEventListener('scroll',function(event){
				setScroll();
			});
			if(btnLeft){
				btnLeft.addEventListener('click',function(event){
					if(event.target.closest(object.btn+":not(.disabled)")){
						
						content.scrollLeft-=content.offsetWidth;
				
					}
				});
			}
			if(btnRight){
				btnRight.addEventListener('click',function(event){
					if(event.target.closest(object.btn+":not(.disabled)")){
						
						content.scrollLeft+=content.offsetWidth;
				
					}
				});
			}

		});
	};

}

scrollPage({
	name:".group-card-content",
	btn:".group-card-menu-arrow-btn",
	content:".group-card-body",
	item:".group-card-item"
});






function modal(object){
	function openModal(modal,modalContent,modalOverlay){

		if(modalContent){
			object.open(modalContent);
		}
		if(modalOverlay){
			modalOverlay.style.display="block";
		}


	}
	function closeModal(modal,modalContent,modalOverlay){
		if(modalContent){
			object.close(modalContent);
		}
		if(modalOverlay){
			modalOverlay.style.display="none";
		}




	}
	var btn=document.querySelector(object.name);
	if(btn){
		var modal  						=document.querySelector(btn.dataset.target);
		if(modal){
			var modalContent 				=modal.querySelector(".modal-content");

			var modalOverlay 				=modal.querySelector(".modal-overlay");
			
			
			if(modalOverlay){

				modalOverlay.addEventListener('click',function(event){
					btn.click();
				})
			}

		}			
		btn.addEventListener('click',function(event){

			if(this.classList.toggle('active')){

				openModal(modal,modalContent,modalOverlay);

			}else{

				closeModal(modal,modalContent,modalOverlay);

			}

		});
	};
}
modal({
	name:".option-menu-btn.list.modal-btn",
	open:function(modalContent){
		modalContent.style.transition  		= 'transform 1s';
		modalContent.style.transform 		= 'translateX(-100%)';
	},
	close:function(modalContent){
		modalContent.style.transition  		= 'transform 1s';
		modalContent.style.transform 		= 'translateX(0%)';
	}
});
modal({
	name:".option-menu-btn.alarm.modal-btn",
	open:function(modalContent){
		modalContent.style.display		= 'block';
	},
	close:function(modalContent){
		modalContent.style.display		= 'none';
	}
});


function alarm(object){
	const alarm = document.querySelector(object.name);
	const saveBtn =alarm.querySelector(object.btn+".save");
	const message =alarm.querySelector(object.message);
	const inputH = alarm.querySelector(object.input+".h");
	const inputI = alarm.querySelector(object.input+".i");


	var isRequired =false;

	setSaveBtn();
	setMessenger();

	saveBtn.addEventListener('click',function(event){
		if(!event.target.classList.contains("disabled")){
			alarm.setAttribute('data-time',parseInt(inputH.value)*3600000+parseInt(inputI.value)*60000);
		}
	})
	inputH.addEventListener('input',function(event){
		setSaveBtn();
		setMessenger();	
		this.value=formatNumber(limitNumber(this.value,this.min,this.max));
	});
	inputI.addEventListener('input',function(event){
		setSaveBtn();
		setMessenger();
		this.value=formatNumber(limitNumber(this.value,this.min,this.max));
	});

	function setSaveBtn(){
		if(parseInt(inputH.value) == 0 && parseInt(inputI.value) == 0){
			isRequired=false;
			saveBtn.classList.add('disabled');
		}else{
			isRequired=true;
			saveBtn.classList.remove('disabled');
		}
	}
	function setMessenger(){
		if(isRequired){
			var date=new Date();
			date =new Date(date.getTime()+parseInt(inputH.value)*3600000+parseInt(inputI.value)*60000);
			console.log(date);
			message.innerText="Thời gian dừng phát nhạc:"+formatDate(date);
		}else{
			message.innerText="Chọn thời gian để dừng phát nhạc";
		}
	}
	function formatDate(date){
		var dateFormat="";

		dateFormat+=date.getHours()
		+":"+formatNumber(date.getMinutes())
		+" "+formatNumber(date.getDate())
		+"/"+formatNumber(date.getMonth()+1)
		+"/"+date.getFullYear()
		;

		return dateFormat;
	}
	function limitNumber(number,min,max){
		number=parseInt(number);
		min=parseInt(min);
		max=parseInt(max);
		if(number<min){
			number=min;
		}else if(number>max){
			number=max;
		}
		return number;
	}
	function formatNumber(number){
		number=parseInt(number);
		
		if(number<10)
			return "0"+number;
		else 
			return number;
	}
}

alarm({
	name:"#alarmModal",
	input:".alarm-content-time-step",
	message:".alarm-content-decription",
	btn:".alarm-content-btn"
});






















document.querySelectorAll("[type*='button']").forEach(function(element){
	element.addEventListener('click',function(event){
		event.preventDefault();
	});
});