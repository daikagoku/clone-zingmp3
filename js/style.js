// "use strict";
function createLocalStorage(namespace){
    const _STORAGE = JSON.parse(localStorage.getItem(namespace)) ?? {};
    function save(){
        localStorage.setItem(namespace,JSON.stringify(_STORAGE));
    }
    return {
        get(key){
            return _STORAGE[key] ?? undefined;
        },
        set(key,value){
            _STORAGE[key]=value;
            save();
        },
        delete(key){
            delete _STORAGE[key];
            save();
        }
    };
};
function scrollToView(content,element,align){
    switch (align) {
        case 'top':
            console.log({content})
            content.scrollTop=element.offsetTop-content.offsetTop;
            break;
        case 'bottom':
            content.scrollTop=element.offsetTop+element.offsetHeight-content.offsetTop-content.offsetHeight;
            break;
        case 'left':
            content.scrollLeft=element.offsetLeft-content.offsetLeft;
            break;
        case 'right':
            content.scrollTop=element.offsetLeft+element.offsetWidth-content.offsetLeft-content.offsetWidth;
            break;
        default:
            // statements_def
            break;
    }
}
function htmlToString(value){
    const object={
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;"
    };
    return value.replace(/([&<>\"'])/g,function(charReplace){
        return object[charReplace];
    })
};
(function customTheme(){
    const USER_STORAGE_THEME_KEY = "user_theme";
    const storage   = createLocalStorage(USER_STORAGE_THEME_KEY);
    const _main     = document.querySelector('#customThemeModal');
    const _items    = _main.querySelectorAll('.custom-theme-content-card') || [];
    const _theme    = storage.get('theme') ?? 'white';
    document.body.dataset.theme=_theme;
    if(_items.length > 0){
        Array.from(_items).forEach(function(element) {
            element.addEventListener('click',function(event){
                if(event.target.closest('.option-menu-custom-btn.apply')){
                    if(element.dataset.theme !== undefined){
                        document.body.dataset.theme=element.dataset.theme;
                        storage.set('theme',element.dataset.theme);
                    }
                }
            });
        });
    }
})();
(function History(object){
    const historyMenu = document.querySelector(object.name);
    const backBtn =historyMenu.querySelector(object.btn+".back");
    const forwardBtn =historyMenu.querySelector(object.btn+".forward");
    backBtn.addEventListener('click',function(){
        window.history.back();
    })
    forwardBtn.addEventListener('click',function(){
        window.history.forward();
    })
    console.log(window)
})({
    name:".history-menu-arrow",
    btn:".history-menu-arrow-btn"
});
const Search={
    define:function(){
        const _this=this;
        const USER_STORAGE_SEARCH_KEY = "user_search";
        _this.config=(function(){
            const storage = createLocalStorage(USER_STORAGE_SEARCH_KEY);
            const data = storage.get('search') ?? [];
            const maxLength = 4;
            return{
                get:function(){
                    return data;
                },
                set:function(value){
                    let hasIndex = data.findIndex(function(element){
                        return element==value;
                    });
                    if(hasIndex!=-1){
                        data.splice(hasIndex,1);
                    }else if(data.length>=maxLength){
                        data.pop();
                    }
                    data.unshift(value);
                    storage.set('search',data);
                }
            }
        })();
        const _form          = document.querySelector("#form-search");
        const _elements={
            form          :_form,
            label         :_form.querySelector(".header-form-search-input-label"),
            submitBtn     :_form.querySelector(".header-form-search-btn" + "[type='submit']"),
            resetBtn      :_form.querySelector(".header-form-search-btn" + "[type='reset']"),
            input         :_form.querySelector(".header-form-search-input"),
            recommendList :undefined
        }
        _this.addEvent  =function(selector,event,method){
            _elements[selector].addEventListener(event,method);
        };
        _this.set       =function(selector,callback){
            callback(_elements[selector]);
        };
        _this.getValue  =function(){
                let value = _elements.input.value.trim();
                return htmlToString(value);
        };
        _this.recommendList ={
            define:function(){
                const _main = document.createElement('div');
                _main.classList.add('header-form-search-recommend');

                const _title= document.createElement('div');
                _title.classList.add('header-form-search-recommend-title');

                const _menu= document.createElement('ul');
                _menu.classList.add("header-form-search-recommend-menu");

                _main.appendChild(_title);
                _main.appendChild(_menu);

                _elements.form.appendChild(_main);

                _elements.recommendList={
                    main:_main,
                    title:_title,
                    menu:_menu
                }
                this.default();
            },
            default:function(){
                _elements.recommendList.title.innerText="Gợi ý tìm kiếm:";
                _elements.label.innerText="Nhập tên bài hát, mv, ca sĩ, MV...";
            },
            setRecommendList:function(){
                let value = _this.getValue();
                if(value == ""){
                    this.currentRecommendList = _this.config.get() ?? [];
                }else{
                    this.currentRecommendList =  this.getRecommendList(value);
                }
            },
            getRecommendList:function(value){
                let list=_this.config.get();
                list=list.filter( function(element, index) {
                    return element.indexOf(value) != -1 
                });
                return list;
            },
            loadView:function(){
                const __this=this;
                _elements.recommendList.menu.innerHTML="";
                
                __this.setRecommendList();
                let valueInput  = _this.getValue();
                if(valueInput!=""){
                    _elements.recommendList.menu.innerHTML=__this.renderItem(valueInput,`Tìm kiếm "${valueInput}"`,'active');
                    _elements.label.innerHTML="";
                    __this.activeIndex = 0;
                }else {
                    _elements.label.innerHTML="Nhập tên bài hát, mv, ca sĩ, MV...";
                }
                if(this.currentRecommendList.length>0){
                    __this.currentRecommendList.forEach(function(value,index){ 
                        let valueRender =value.replace(valueInput,`<b>${valueInput}</b>`);
                        let itemHtml=__this.renderItem(value,valueRender);
                        _elements.recommendList.menu.innerHTML+=itemHtml;
                    });
                }
                else{
                    _elements.recommendList.menu.innerHTML+=__this.renderItem("",'Không có lịch sử tìm kiếm !!!','disabled');
                }
                
            },
            renderItem:function(value="",valueView="",status=""){
                return`
                    <li class="header-form-search-recommend-item ${status}"data-value="${value}">
                        <i class="icon fas fa-search"></i>
                        <a class="header-form-search-recommend-link">${valueView}</a>
                    </li>
                `
            },
        };
        _this.recommendList.define();
    },
    event:function(){
        const _this=this;
        _this.addEvent('form','submit', function(event) {
            event.preventDefault();
            let value=_this.getValue();
            if(value!=""){
                _this.config.set(value);
            };
            _this.recommendList.loadView();
        });
        _this.addEvent('submitBtn','mousedown', function(event) {
            event.preventDefault();
        });
        _this.addEvent('resetBtn','mousedown', function(event) {
            event.preventDefault();
        });
        _this.addEvent('resetBtn','click', function(event) {
             _this.set('input',function(element){
                element.value="";
            });
            _this.recommendList.setRecommendList();
            _this.recommendList.loadView();
        });

        _this.addEvent('input','focus', function(event) {
            _this.recommendList.loadView();

            _this.set('recommendList',function(element){
                Object.assign(element.main.style,{
                    display:"block",
                    animation:" animation-fade-down 0.2s linear 1 both"
                });
            });
            _this.set('input',function(element){
                Object.assign(element.style,{
                    borderBottomLeftRadius:"0",
                    borderBottomRightRadius:"0"
                });
            });
        });
        _this.addEvent('input','blur',function(event){         
            _this.set('recommendList',function(element){
                Object.assign(element.main.style,{
                    animation:" animation-hidden-up 0.2s linear 1 both"
                });
                setTimeout(function(){
                    element.main.style="";
                },
                200);
            });
            _this.set('input',function(element){
                setTimeout(function(){
                    element.style="";
                },
                200);
            });

        });
        _this.addEvent('input','input',function(event){
            _this.recommendList.setRecommendList();
            _this.recommendList.loadView();
        });
        _this.addEvent('input','change',function(event){
            _this.recommendList.setRecommendList();
            _this.recommendList.loadView();
        });
        _this.set('recommendList',function(element){
            element.main.addEventListener('mousedown', function(event) {
                event.preventDefault();
            });
            element.main.addEventListener('click',function(event){
                let target=event.target.closest(".header-form-search-recommend-item:not(.disabled)");
                if(target){
                    let value=target.dataset.value;
                    _this.set('input',function(element){
                        element.value = value;
                    });
                }
                _this.recommendList.loadView();
            });
        });
        _this.addEvent('form','keydown',function(event){
            switch (event.key) {
                case 'ArrowDown':{
                    let index =_this.recommendList.activeIndex;
                    _this.set('recommendList',function(element){
                       if(index != undefined){
                            element.menu.children[index].classList.remove('active');

                            index++;
                            if(index >= element.menu.children.length){
                                index = 0; 
                            }
                        }else{
                            index = 0;
                        }
                        element.menu.children[index].classList.add('active');
                    })
                    _this.recommendList.activeIndex=index;
                break;
                }
                case 'ArrowUp':{
                    let index =_this.recommendList.activeIndex;
                    _this.set('recommendList',function(element){
                       if(index != undefined){
                            element.menu.children[index].classList.remove('active');

                            index--;
                            if(index < 0 ){
                                index = element.menu.children.length - 1; 
                            }
                        }else{
                            index = element.menu.children.length - 1;
                        }
                        element.menu.children[index].classList.add('active');
                    })
                    _this.recommendList.activeIndex=index;
                break;
                }
                case 'Enter':{
                        let index =_this.recommendList.activeIndex;
                        _this.set('recommendList',function(element){
                            let value=element.menu.children[index].dataset.value;
                            _this.set('input',function(element){
                                element.value=value;
                            });
                        });
                        _this.recommendList.loadView();
                    break;
                }
                default:
                    
                    break;
            }
        });
    },
    start:function(){
        this.define();
        this.event();
        console.log(this);
    }
}
Search.start();

(function Slide(object) {
    const slide = document.querySelector(object.name +":not(.disabled)");
    const slideItems = slide.querySelectorAll(object.item +":not(.disabled)");
    const slideBackBtn = slide.querySelector(object.btn + ".left" +":not(.disabled)");
    const slideNextBtn = slide.querySelector(object.btn + ".right" +":not(.disabled)");


    let currentIndex = Array.from(slideItems).findIndex(function(element) {
        return element.classList.contains("active");
    });
    if(currentIndex == undefined){
        currentIndex = 0;
    }
    let isRuning = false;

    slideShow();

    let autoShow=setInterval(function() {
        if (!isRuning) {
            nextSlide();
        }
    }, object.delay);

    slideBackBtn.addEventListener('click', function(event) {
        if (!isRuning) {
            clearInterval(autoShow);
            backSlide();
            setTimeout(function() {
                autoShow=setInterval(function() {
                    if (!isRuning) {
                        nextSlide();
                    }
                }, object.delay);
            }, object.time);
        }
    });
    slideNextBtn.addEventListener('click', function(event) {
        if (!isRuning) {
            clearInterval(autoShow);
            nextSlide();
            setTimeout(function() {
                autoShow=setInterval(function() {
                    if (!isRuning) {
                        nextSlide();
                    }
                }, object.delay);
            }, object.time);
        }
    });

    function nextSlide() {
        slideItems[currentIndex].classList.remove('active');
        currentIndex++;
        if (currentIndex >= slideItems.length) currentIndex = 0;
            slideItems[currentIndex].classList.add('active');
        slideShow(1, 0);
    }

    function backSlide() {
        slideItems[currentIndex].classList.remove('active');
        currentIndex--;
        if (currentIndex < 0) currentIndex = slideItems.length - 1;
            slideItems[currentIndex].classList.add('active');
        slideShow(0, 1);
    }

    function slideShow(before = 1, after = 0) {
        isRuning = true;
        setTimeout(function() {
            isRuning = false;
        }, object.time);

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0)                  
            prevIndex = slideItems.length - 1;

        let nextIndex = currentIndex + 1;
        if (nextIndex >= slideItems.length) 
            nextIndex = 0;

        Array.from(slideItems).forEach(function(element, index) {
            switch (index) {
                case prevIndex:{
                    Object.assign(element.style, {
                        opacity: '1',
                        zIndex: `${2+before}`,
                        transition: `transform ${object.time / 1000}s linear`,
                        transform: `translate(-100%)`
                    });
                    break;
                }   
                case currentIndex:{
                    Object.assign(element.style, {
                        opacity: '1',
                        zIndex: '4',
                        transition: `transform ${object.time / 1000}s linear`,
                        transform: 'translate(0%)'
                    });
                    break;
                }
                case nextIndex:{
                    Object.assign(element.style, {
                        opacity: '1',
                        zIndex: `${2+after}`,
                        transition: `transform ${object.time / 1000}s linear`,
                        transform: `translate(100%)`
                    });
                    break;
                }
                default:{
                    Object.assign(element.style, {
                        opacity: '0',
                        zIndex: '2',
                        transition: `transform ${object.time / 1000}s linear,opacity 0s ${object.time / 1000}s`,
                        transform: `translate(0%)`
                    });
                    break;
                }
                    
            }
        });
    }
})({
    name: "#slide",
    item: ".slide-content-item",
    btn: ".slide-content-btn",
    delay: 4000,
    time: 1000
});
const audioControl={
    define:function(listSong){
        const USER_STORAGE_PLAYER_KEY   = "user_player";
        const _this                     =this;
        const _MAIN                     = document.querySelector("#audio");
        const _CONTROl                  = _MAIN.querySelector('.audio-control');

        _this.config=(function(){
            const storage   = createLocalStorage(USER_STORAGE_PLAYER_KEY);
            return {
                get:function(key){
                    return storage.get(key);
                },
                set:function(key,value){
                    storage.set(key,value);
                }
            }
        })();
        _this.controlAudio     = (function(){
            const _elements = {
                source : _MAIN.querySelector('.audio-source')
            };
            return {
                loadView:function(){
                    _elements.source.src = _this.song.currentSong.src;
                },
                default:function(){

                },
                addEvent:function(event,method){
                    _elements.source.addEventListener(event,method);
                },
                set:function(selector,value){
                    _elements.source[selector]=value;
                },
                get:function(selector){
                    return _elements.source[selector];
                },
                setMethod:function(callback){
                    callback(_elements.source);
                }
            }
        })();
        _this.controlBtn=(function(){
            const _elements={
                nextBtn   : _CONTROl.querySelector(".option-menu-btn.next"),
                backBtn   : _CONTROl.querySelector(".option-menu-btn.back"),
                likeBtn   : _CONTROl.querySelector(".option-menu-btn.like"),
                randomBtn : _CONTROl.querySelector(".option-menu-btn.random"),
                repeatBtn : _CONTROl.querySelector(".option-menu-btn.repeat"),
                playBtn   : _CONTROl.querySelector(".option-menu-btn.play"),
                moreBtn   : _CONTROl.querySelector(".option-menu-btn.more")
            };
            return {
                loadView:function(){
                    if(_this.song.currentSong.like==true)
                        _elements.likeBtn.classList.add('active');
                    else
                        _elements.likeBtn.classList.remove('active');

                    if(_this.controlAudio.get('paused')!=true)
                        _elements.playBtn.classList.add('active');
                    else
                        _elements.playBtn.classList.remove('active');
                },
                default:function(){
                    if(_this.config.get('isRandom') == true){
                        _elements.randomBtn.classList.add('active');
                    }else {
                        _elements.randomBtn.classList.remove('active');                    
                        }
                    if(_this.config.get('isRepeat') == true){
                        _elements.repeatBtn.classList.add('active');
                    }else {
                        _elements.repeatBtn.classList.remove('active');                    
                    }
                },
                addEvent:function(selector,event,method){
                    let element =this.getElement(selector);
                    if(element != undefined){
                       element.addEventListener(event,method);
                    }
                },
                set:function(selector,callback){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        callback(element);
                    }
                },
                getElement:function(selector){
                    return _elements[selector];
                }
            }
        })();
        _this.controlProgress=(function(){
            const _main           =_CONTROl.querySelector(".audio-control-time-bar");
            const _elements = {
                currentTime    :_main.querySelector(".audio-control-time.current"),
                endTime        :_main.querySelector(".audio-control-time.end"),
                progressRange  :_main.querySelector(".form-input-progress-range"),
                progressBar    :_main.querySelector(".form-input-progress-bar")
            };
            return{   
                default:function(){
                    _this.controlAudio.set('currentTime',_this.config.get('currentTime') ?? 0);
                    _elements.progressRange.setAttribute('min',"0");
                    _elements.progressRange.setAttribute('max',"100");
                },
                loadView:function(){
                    _elements.currentTime.innerText=this.formatTime(_this.controlAudio.get('currentTime') || 0);

                    _elements.endTime.innerText=this.formatTime(_this.controlAudio.get('duration') || 0);

                    let progress=(_this.controlAudio.get('currentTime') / _this.controlAudio.get('duration')) * 100;

                    _elements.progressRange.value=progress;
                    _elements.progressBar.setAttribute('style',`--progress:${progress}`);

                    _this.config.set('currentTime',_this.controlAudio.get('currentTime'));
                },
                addEvent(selector,event,method){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        element.addEventListener(event,method);
                    }
                },
                getElement(selector){
                    return _elements[selector];
                },
                formatTime:function(time){
                    let i       = Math.floor(time / 60);
                    let s       = Math.floor(time % 60);
                    let h       = Math.floor(i / 60);
                        i       = Math.floor(i % 60);
                    let text    = "";
                    if (h > 0)  text    += h;
                    if (i < 10) text    += "0" + i;
                    else text   += i;
                    text        += ":";
                    if (s < 10) text       += "0" + s;
                    else text   += s;
                    return text;
                }
            }
        })();
        _this.controlVolume=(function(){
            const _main          =_CONTROl.querySelector(".audio-control-volume-bar");
            const _elements={
                volumeRange   :_main.querySelector(".form-input-progress-range"),
                volumeBar     :_main.querySelector(".form-input-progress-bar"),
                volumeBtn     :_main.querySelector(".option-menu-btn.volume")
            };
            return {
                default:function(){
                    _this.controlAudio.set('volume',_this.config.get('volume') || 1);
                    _elements.volumeRange.setAttribute('min',"0");
                    _elements.volumeRange.setAttribute('max',"100");
                },
                loadView:function(){
                    let progress=(_this.controlAudio.get('volume')) * 100;
                    _elements.volumeRange.value=progress;
                    _elements.volumeBar.setAttribute('style',`--progress:${progress}`);
                    this.setVolumeBtn();

                    _this.config.set('volume',_this.controlAudio.get('volume'));
                },
                addEvent(selector,event,method){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        element.addEventListener(event,method);
                    }
                },
                getElement(selector){
                    return _elements[selector];
                },
                setVolumeBtn:function(){
                    if (_this.controlAudio.get('volume') == 0 || _this.controlAudio.get('muted')) {
                        _elements.volumeBtn.innerHTML = '<i class="icon icon-volume fas fa-volume-mute"></i>';
                        _elements.volumeBar.setAttribute('style', "--progress:0");
                    } else {
                        if (_this.controlAudio.get('volume') < 0.6) 
                            _elements.volumeBtn.innerHTML = '<i class="icon icon-volume fas fa-volume-down"></i>';
                        else 
                            _elements.volumeBtn.innerHTML = '<i class="icon icon-volume fas fa-volume-up"></i>';
                    }
                }
            }
        })();
        _this.viewList      = (function(){ 
            const _main = document.querySelector("#listSong");
            const _elements={
                content :_main.querySelector('.menu-song-content-body'),
                playingList:undefined,
                itemActive :undefined
            };
            function _render(song,index){
                    return `
                         <li class="menu-song-item "data-index="${index}">
                             <a href="#"data-type="button" class="menu-song-item-play">
                                 <span class="menu-song-item-thumbnail">
                                     <img src="${song.img || '../../img/zingmp3icon.png'}" alt="" >
                                 </span>
                                 <i class="icon-pause fas fa-play"></i>
                                 <i class="icon-play bi bi-soundwave"></i>
                             </a>
                             <div class="menu-song-item-body">
                                 <div><span class="menu-song-item-title">${song.name}</span></div>
                                 <div><a href="#"class="menu-song-item-singer">${song.singer}</a></div>
                             </div>
                             <ul class="option-menu menu-song-item-option">
                                 <li class="option-menu-item">
                                     <a href="#"data-type="button" class="option-menu-btn btn-circle like">
                                         <i class=" icon-like far fa-heart"></i>
                                         <i class=" icon-liked fas fa-heart"></i>
                                     </a>
                                 </li>
                                 <li class="option-menu-item">
                                     <a href="#"data-type="button" class="option-menu-btn btn-circle more">
                                         <i class=" fas fa-ellipsis-h"></i>
                                     </a>
                                 </li>
                             </ul>
                         </li>   
                     `
            } ;
            return {      
                default:function(){
                    const __this=this;
                    _elements.playingList=document.createElement('ul');
                    _elements.playingList.classList.add('menu-song');
                    _elements.content.appendChild(_elements.playingList);

                    listSong.forEach( function(song, index) {
                      _elements.playingList.innerHTML+=_render(song,index);
                    });
                }, 
                loadView:function(){
                    if(_elements.itemActive != undefined){
                        _elements.itemActive.item.classList.remove('active');
                        _elements.itemActive.playBtn.classList.remove('active');
                    }
                    _elements.itemActive=this.getItemByIndex(_this.song.getCurrentIndex());
                    _elements.itemActive.item.classList.add('active');
                    scrollToView(_elements.content,_elements.itemActive.item,'top');
                },
                getItemByIndex:function(index){
                    let item=_elements.playingList.querySelector(`[data-index="${index}"]`);
                    return {
                        item    :item,
                        playBtn :item.querySelector(".menu-song-item-play"),
                        likeBtn :item.querySelector(".option-menu-btn.like")
                    };
                },
                getActiveItem:function(){
                    return _elements.itemActive;
                },
                addEvent:function(selector,event,method){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        element.addEventListener(event,method);
                    }
                },
                set:function(selector,callback){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        callback(element);
                    }
                },
                getElement(selector){
                    return _elements[selector];
                }
            }         
        })();
        _this.viewSong=(function(){
            const _main   =_CONTROl.querySelector('.audio-control-view');
            const _elements={
                main   :_main,
                img    :_main.querySelector('.audio-control-view-thumbnail-img'),
                title  :_main.querySelector('.audio-control-view-title'),
                singer :_main.querySelector('.audio-control-view-singer')
            };
            return{
                default:function(){
                    _elements.img.src           ="../../img/zingmp3icon.png";
                    _elements.title.innerText   ="";
                    _elements.singer.innerText  ="";
                },
                addEvent:function(selector,event,method){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        element.addEventListener(event,method);
                    }
                },
                loadView:function(){
                    _elements.img.src           =_this.song.currentSong.img    || "../../img/zingmp3icon.png";
                    _elements.title.innerText   =_this.song.currentSong.name   || "";
                    _elements.singer.innerText  =_this.song.currentSong.singer || "";
                },
                set:function(selector,callback){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        callback(element);
                    }
                },
                getElement(selector){
                    return _elements[selector];
                }
            }
        })();
        _this.viewMore=(function(){
            const _main   = _CONTROl.querySelector('#moreContent');
            const _elements={
                img         : _main.querySelector('.more-content-view-thumbnail-img'),
                title       : _main.querySelector('.more-content-view-title'),
                singer      : _main.querySelector('.more-content-view-singer'),
                downloadBtn : _main.querySelector('.group-btn-item.download')
            }
            return{
                default:function(){
                    _elements.img.src            ="../../img/zingmp3icon.png";
                    _elements.title.innerText    ="";
                    _elements.singer.innerText   ="";
                },
                loadView:function(){
                    _elements.img.src               =_this.song.currentSong.img??"../../img/zingmp3icon.png";
                    _elements.title.innerText       =_this.song.currentSong.name;
                    _elements.singer.innerText      =_this.song.currentSong.singer;
                    _elements.downloadBtn.download  =_this.song.currentSong.src;
                    _elements.downloadBtn.href      =_this.song.currentSong.src;
                },
                addEvent:function(selector,event,method){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        element.addEventListener(event,method);
                    }
                },
                set:function(selector,callback){
                    let element =this.getElement(selector);
                    if(element != undefined){
                        callback(element);
                    }
                },
                getElement(selector){
                    return _elements[selector];
                }
            }
        })();
        _this.song=(function(){
            const _listPlayed         = {
                list    :new Array(listSong.length),
                length  :0
            };
            return{
                default:function(){
                    this.currentIndex       =_this.config.get('currentIndex') ?? 0;
                    this.loadCurrentSong();
                },
                getCurrentIndex(){
                    return this.currentIndex;
                },
                setCurrentSong:function(){
                    _this.config.set('currentIndex',this.currentIndex);
                    this.currentSong    = listSong[this.currentIndex];
                },
                getSongByIndex(index){
                    return listSong[index];
                },
                setSongByIndex(index,callback){
                    callback(listSong[index]);
                },
                theNextSong:function(){
                    this.currentIndex++;
                    if(this.currentIndex >= _listPlayed.list.length)
                        this.currentIndex = 0;
                    this.currentSong= listSong[this.currentIndex];
                    this.loadCurrentSong();
                },
                theBackSong:function(){
                    this.currentIndex--;
                    if(this.currentIndex < 0 )
                        this.currentIndex = listSong.length - 1;
                    this.currentSong= listSong[this.currentIndex];
                    this.loadCurrentSong();
                },
                theRandomSong:function(){
                    let newIndex=this.currentIndex;
                    do{
                        newIndex=Math.floor(Math.random() * _listPlayed.list.length);
                    }while(newIndex==this.currentIndex || _listPlayed.list[newIndex]);
                    this.currentIndex=newIndex;
                    this.loadCurrentSong();
                },
                loadSongByIndex:function(index){
                    this.currentIndex=index;
                    this.loadCurrentSong();
                },
                loadCurrentSong:function(){

                    if(_listPlayed.length >= _listPlayed.list.length-1){
                        _listPlayed.list=new Array(_listPlayed.list.length);
                        _listPlayed.length=0;
                    }
                    _listPlayed.length++;
                    _listPlayed.list[this.currentIndex]=true;

                    this.setCurrentSong();
                    _this.controlAudio.loadView();
                    _this.viewList.loadView();
                    _this.viewSong.loadView();
                    _this.viewMore.loadView();
                    _this.controlBtn.loadView();
                }
            }
        })();

        _this.viewList.default();
        _this.controlBtn.default();
        _this.controlAudio.default();
        _this.controlProgress.default();
        _this.controlVolume.default();
        _this.viewSong.default();
        _this.viewMore.default();
        _this.song.default();
        
    },
    default:function(){
        const _this=this; 
    },
    setAudioEvent:function(){
            const _this=this;
            _this.controlBtn.addEvent('likeBtn','click', function(event) {
                 _this.viewList.set('itemActive',function(element){
                    element.likeBtn.click();
                 })
            });
            _this.controlBtn.addEvent('randomBtn','click', function(event) {
                _this.config.set('isRandom',!_this.config.get('isRandom') ?? false);
                this.classList.toggle('active',_this.config.get('isRandom'));
            });
            _this.controlBtn.addEvent('repeatBtn','click', function(event) {
                _this.config.set('isRepeat',!_this.config.get('isRepeat') ?? false);
                this.classList.toggle('active',_this.config.get('isRepeat'));
            });
            _this.controlBtn.addEvent('nextBtn','click', function(event) { 
                _this.controlAudio.setMethod(function(element){
                    element.pause();
                });  
                if(_this.config.get('isRandom')){
                    _this.song.theRandomSong();
                }else{
                    _this.song.theNextSong();
                } 
                setTimeout(function(){
                    _this.controlAudio.setMethod(function(element){
                        element.play();
                    });
                },100); 

            });
            _this.controlBtn.addEvent('backBtn','click', function(event) {
                _this.controlAudio.setMethod(function(element){
                    element.pause();
                });  
                if(_this.config.get('isRandom')){
                    _this.song.theRandomSong();
                 }else{
                    _this.song.theBackSong();
                }
                setTimeout(function(){
                    _this.controlAudio.setMethod(function(element){
                        element.play();
                    });
                },100);
                
            });
            _this.controlBtn.addEvent('playBtn','click', function(event) {
                _this.controlAudio.setMethod(function(element){
                    if(element.paused == true){
                        element.play();
                    }else {
                        element.pause();
                    }
                });
            });
            _this.controlAudio.addEvent('canplay',function(event){
                _this.controlProgress.loadView();
                _this.controlVolume.loadView();
            });
            _this.controlAudio.addEvent('timeupdate',function(event){
                _this.controlProgress.loadView();
            });
            _this.controlAudio.addEvent('volumechange',function(event){
                _this.controlVolume.loadView();
            });
            _this.controlAudio.addEvent('play',function(event){
                _this.controlBtn.set('playBtn',function(element){
                    element.classList.add('active')
                });
                _this.viewSong.set('main',function(element){
                    element.classList.add('active')
                });
                _this.viewList.set('itemActive',function(element){
                    element.playBtn.classList.add('active');
                });
            });
            _this.controlAudio.addEvent('pause',function(event){
                _this.controlBtn.set('playBtn',function(element){
                    element.classList.remove('active');
                });
                _this.viewSong.set('main',function(element){
                    element.classList.remove('active');
                });
                _this.viewList.set('itemActive',function(element){
                    element.playBtn.classList.remove('active');
                });
            });
            _this.controlAudio.addEvent('ended',function(event){
                if(!_this.config.get('isRepeat')){
                    _this.controlBtn.set('nextBtn',function(element){
                        element.click();
                    });
                }
                else{
                    setTimeout(function(){
                        _this.controlAudio.setMethod(function(element){
                            element.play();
                        });
                    },100);
                }
            });
            _this.controlProgress.addEvent('progressRange','input',function(event){
                let time=(event.target.value * _this.controlAudio.get('duration')) / 100;
                _this.controlAudio.set('currentTime',time);
            });
            _this.controlVolume.addEvent('volumeRange','input',function(event){
                _this.controlAudio.set('muted',false);
                let volume=event.target.value / 100;
                _this.controlAudio.set('volume',volume);
            });
            _this.controlVolume.addEvent('volumeBtn','click',function(event){
                _this.controlAudio.set('muted',!_this.controlAudio.get('muted'));
            });

            _this.viewList.addEvent('playingList','click',function(event){
                let element = event.target.closest('.menu-song-item');
                if(element != undefined){
                    let index  = element.dataset.index;
                    let target =event.target;
                    if(target.closest('.menu-song-item-play')){
                        if(element.classList.contains('active')){
                            _this.controlBtn.set('playBtn',function(element){
                                element.click();
                            });
                        }else{
                            _this.song.loadSongByIndex(index);
                            setTimeout(function(){
                                _this.controlAudio.setMethod(function(element){
                                    element.play();
                                });
                            },100);
                        }
                    }else if(target.closest('.option-menu-btn.like')){
                        let item=_this.viewList.getItemByIndex(index);
                        _this.song.setSongByIndex(index,function(song){
                            song.like=!song.like;
                            item.likeBtn.classList.toggle('active',song.like ?? false);

                            _this.controlBtn.set('likeBtn',function(element){
                                element.classList.toggle('active',song.like ?? false);
                            });
                        });
                    }
                }
            });
    },
    start:function(){   
        const _this=this;
        const fakeFetch = new Promise(
            function(resolve,reject){
                resolve(
                [
                       {
                        "name": "KCT - La La La (Never Give It Up)",
                        "singer": "",
                        "src": "../../audio/KCT - La La La (Never Give It Up).mp3",
                        "type": "audio/mpeg",
                        "img": "../../img/img-song-1.jpg"
                    }, {
                        "name": "(Tik Tok Remix) Quan Sơn Tửu",
                        "singer": "Đẳng Thập Ma Quân",
                        "src": "../../audio/(Tik Tok Remix) Quan Sơn Tửu - Đẳng Thập Ma Quân.mp3",
                        "type": "audio/mpeg",
                        "img": "../../img/card4.jpg"
                    }, {
                        "name": "9420",
                        "singer": "",
                        "src": "../../audio/9420.mp3",
                        "type": "audio/mpeg",
                        "img": ""
                    }, {
                        "name": "[VIETSUB-FMV] Nhất tiếu khuynh thành",
                        "singer": "Bành Tiểu Nhiễm",
                        "src": "../../audio/[VIETSUB-FMV] Nhất tiếu khuynh thành -Công chúa Tây Châu Tiểu Phong- Bành Tiểu Nhiễm.mp3",
                        "type": "audio/mpeg",
                        "img": "../../img/card2.jpg"
                    }, {
                        "name": "Tình sầu thiên thu muôn lối",
                        "singer": "",
                        "src": "../../audio/tinhsauthienthumuonloi.mp3",
                        "type": "audio/mpeg",
                        "img": "../../img/card3.jpg"
                    }, {
                        "name": "Túy Hồng Nhan (Remix) ll OST Thủy Hử, China Mix",
                        "singer": "",
                        "src": "../../audio/Túy Hồng Nhan (Remix) ll OST Thủy Hử, China Mix.mp3",
                        "type": "audio/mpeg",
                        "img": "../../img/card4.jpg"
                    }, {
                        "name": "Luân Hồi Chi Cảnh 《轮回之境》 Critty",
                        "singer": "",
                        "src": "../../audio/Luân Hồi Chi Cảnh 《轮回之境》 Critty - Mỹ nhân Diễm Linh Cơ.mp3",
                        "type": "audio/mpeg",
                        "img": "../../img/card1.jpg"
                    }, {
                        "name": "[Vietsub] Tư Niệm Nhiễu Chỉ Tiêm - 海鸟飞鱼 - 思念绕指尖 (DJ名龙版)",
                        "singer": "Hải Điểu Phi Ngư (Remix)",
                        "src": "../../audio/[Vietsub] Tư Niệm Nhiễu Chỉ Tiêm - Hải Điểu Phi Ngư (Remix) 海鸟飞鱼 - 思念绕指尖 (DJ名龙版).mp3",
                        "type": "audio/mpeg",
                        "img": "../../img/card3.jpg"
                    }, {
                        "name": "Vọng xuyên bỉ ngạn",
                        "singer": "",
                        "src": "../../audio/vongxuyenbingan.mp3",
                        "type": "audio/mpeg",
                        "img": "../../img/card4.jpg"
                    }
                ]
            );
        });
        fakeFetch
            .then(function(data){
                return data;
            })
            .then(function(data){
                _this.define(data);
                _this.setAudioEvent();
            })
            .catch(function(data){
                _this.default(); 
            })
        console.log(this);
    }
};
audioControl.start();

const drop = {
    configHover:function(){
        const _this = this;
        const duration =300;
        const listDrop=document.querySelectorAll('.drop.drop-hover');
        Array.from(listDrop).forEach(function(drop){
            const dropBtn       = drop.querySelector('.drop-btn');
            const dropContent   = drop.querySelector('.drop-content');
             Object.assign(dropContent.style,{
                    animationDuration: duration/1000+'s',
                    animationTimingFunction: 'linear',
                    animationIterationCount: '1',
                    animationFillMode: 'forwards'
                });
            drop.addEventListener('mousemove',function(){
                    _this.eventDrop[drop.dataset.style].open(dropContent);
            });
            drop.addEventListener('mouseleave',function(){
                    _this.eventDrop[drop.dataset.style].close(dropContent);
                    setTimeout(function(){
                        dropContent.style.display="none";
                    },duration);
            });
        })
    },
    configClick:function(){
        const _this = this;
        const duration =300;
        const listDrop=document.querySelectorAll('.drop.drop-click');
        Array.from(listDrop).forEach(function(drop){
            const dropBtn       = drop.querySelector('.drop-btn');
            const dropContent   = drop.querySelector('.drop-content');
            Object.assign(dropContent.style,{
                    animationDuration: duration/1000+'s',
                    animationTimingFunction: 'linear',
                    animationIterationCount: '1',
                    animationFillMode: 'forwards'
                });
            dropBtn.addEventListener('click',function(event){
                if(this.classList.toggle('active')){
                    openDrop(drop,dropBtn,dropContent);
                }else{
                    closeDrop(drop,dropBtn,dropContent);
                };
            });
        });

        function openDrop(drop,dropBtn,dropContent){
            _this.eventDrop[drop.dataset.stype].open(dropContent);
        };
        function closeDrop(drop,dropBtn,dropContent){
            _this.eventDrop[drop.dataset.stype].close(dropContent);
            setTimeout(function(){
                dropContent.style.display="none";
            },duration);
        };
    },
    eventDrop:{
        dropup:{
            open:function(dropContent){
                Object.assign(dropContent.style,{
                    display:"block",
                    animationName:"animation-fade-up"
                });
            },
            close:function(dropContent){
                Object.assign(dropContent.style,{
                    animationName:"animation-hidden-down"
                });
            }
        },
        dropdown:{
            open:function(dropContent){
                Object.assign(dropContent.style,{
                    display:"block",
                    animationName:"animation-fade-down"
                });
            },
            close:function(dropContent){
                Object.assign(dropContent.style,{
                    animationName:"animation-hidden-up"
                });
            }
        },
        dropleft:{
            open:function(dropContent){
                Object.assign(dropContent.style,{
                    display:"block",
                    animation:"animation-fade-left 0.5s"
                });
            },
            close:function(dropContent){
                Object.assign(dropContent.style,{
                    animation:"animation-hidden-right 0.5s"
                });
            }
        },dropright:{
            open:function(dropContent){
                Object.assign(dropContent.style,{
                    display:"block",
                    animation:"animation-fade-right 0.5s"
                });
            },
            close:function(dropContent){
                Object.assign(dropContent.style,{
                    animation:"animation-hidden-left 0.5s"
                });
            }
        }
    },
    start:function(){
        this.configClick();
        this.configHover();
    }
};
drop.start();

(function modal(object) {
    let openBtns = document.querySelectorAll(".modal-btn") || [];
    if (openBtns.length > 0) {
        Array.from(openBtns).forEach(function(openBtn){
              let modal = document.querySelector(openBtn.dataset.target);
            let closeBtn = modal.querySelector('.modal-cancel')
            let isOpen = openBtn.classList.contains('active');
            if (modal) {
                let modalContent = modal.querySelector(".modal-content");
                let modalOverlay = modal.querySelector(".modal-overlay");
                if (modalOverlay) {
                    modalOverlay.addEventListener('click', function(event) {
                        event.preventDefault();
                        openBtn.click();
                    })
                }
                openBtn.addEventListener('click', function(event) {
                    isOpen = this.classList.toggle('active');
                    if (isOpen) {
                        openModal(modal, modalContent, modalOverlay);
                    } else {
                        closeModal(modal, modalContent, modalOverlay);
                    }
                });
                if (closeBtn) {
                    closeBtn.addEventListener('click', function(event) {
                        if (isOpen) {
                            isOpen = false;
                            openBtn.classList.remove('active');
                            closeModal(modal, modalContent, modalOverlay);
                        }
                    });
                }
            }
        })
      
    };

    function openModal(modal, modalContent, modalOverlay) {
        modal.style.display="block";
        if (modalContent) {
           Object.assign(modalContent.style, {
                animation:'animation-fade 0.3s linear 1 both',
                display: 'block'
            });
        }
        if (modalOverlay) {
            modalOverlay.style.display = "block";
        }
    };
    function closeModal(modal, modalContent, modalOverlay) {
        
        if (modalContent) {
            Object.assign(modalContent.style, {
                animation:'animation-hidden 0.3s linear 1 both'
            });
            setTimeout(function(){
                modalContent.style="";
            },
            300);
        }
        if (modalOverlay) {
            modalOverlay.style.display = "none";
        }
        setTimeout(function(){
            modal.style.display="none";
        },300);
    };
})();

function alarm(object) {
    const alarm = document.querySelector(object.name);
    const saveBtn = alarm.querySelector(object.btn + ".save");
    const message = alarm.querySelector(object.message);
    const inputH = alarm.querySelector(object.input + ".h");
    const inputI = alarm.querySelector(object.input + ".i");
    const audio = document.querySelector(object.audio);
    let isRequired = false;
    let timeOclock;
    let clearTimeOclock;
    setRequiredInput();
    setMessenger();
    saveBtn.addEventListener('click', function(event) {
        if (!event.target.classList.contains("disabled")) {

            if(alarm.dataset.time!=0){
                clearTimeout(clearTimeOclock);
                clearInterval(timeOclock);
            };
            let time = parseInt(inputH.value) * 3600 + parseInt(inputI.value) * 60;
            alarm.setAttribute('data-time', time);
            timeOclock = setInterval(function() {
                alarm.dataset.time -= 1;
            }, 1000);
            clearTimeOclock=setTimeout(function() {
                audio.pause();
                clearInterval(timeOclock);
            }, time * 1000);
        }
    })
    inputH.addEventListener('input', function(event) {
        setRequiredInput();
        setMessenger();
        this.value = formatNumber(limitNumber(this.value, this.min, this.max));
    });
    inputI.addEventListener('input', function(event) {
        setRequiredInput();
        setMessenger();
        this.value = formatNumber(limitNumber(this.value, this.min, this.max));
    });

    function setRequiredInput() {
        if (parseInt(inputH.value) == 0 && parseInt(inputI.value) == 0) {
            isRequired = false;
            saveBtn.classList.add('disabled');
        } else {
            isRequired = true;
            saveBtn.classList.remove('disabled');
        }
    }

    function setMessenger() {
        if (isRequired) {
            let date = new Date();
            date = new Date(date.getTime() + parseInt(inputH.value) * 3600000 + parseInt(inputI.value) * 60000);
            message.innerText = "Thời gian dừng phát nhạc:" + formatDate(date);
        } else {
            message.innerText = "Chọn thời gian để dừng phát nhạc";
        }
    }

    function formatDate(date) {
        let dateFormat = "";
        dateFormat += date.getHours() + ":" + formatNumber(date.getMinutes()) + " " + formatNumber(date.getDate()) + "/" + formatNumber(date.getMonth() + 1) + "/" + date.getFullYear();
        return dateFormat;
    }

    function limitNumber(number, min, max) {
        number = parseInt(number);
        min = parseInt(min);
        max = parseInt(max);
        if (number < min) {
            number = min;
        } else if (number > max) {
            number = max;
        }
        return number;
    }

    function formatNumber(number) {
        number = parseInt(number);
        if (number < 10) return "0" + number;
        else return number;
    }
}
alarm({
    name: "#alarmModal",
    audio: ".audio-source",
    input: ".alarm-content-time-step",
    message: ".alarm-content-decription",
    btn: ".alarm-content-btn"
});

function menuClick(object) {
    const menu = document.querySelector(object.name);
    const label     = menu.querySelector(object.label);
    let activeItem   = menu.querySelector(object.item + ".active");

    const listItem = menu.querySelectorAll(object.item);

    Array.from(listItem).forEach(function(item) {
        item.addEventListener('click', function(event) {
            activeItem = menu.querySelector(object.item + ".active");
            if (activeItem) {
                activeItem.classList.remove('active');
            }
            item.classList.add('active');
            if(label){
            }
        });
    });

    function setLabel(item){
        label.style.width = item.offsetWidth + "px";
        label.style.height = item.offsetHeight + "px";
        label.style.top = item.offsetTop + "px";

    }
}
menuClick({
    name: "#menu-left",
    item: ".menu-link",
    label:".menu-label"
});
function tabClick(object) {
    const main      = document.querySelector(object.name);
    const listBtn   = main.querySelectorAll(object.btn);            
    const label     = main.querySelector(object.label);
    let activeBtn   = main.querySelector(object.btn + ".active");
    setLabel(activeBtn);
    Array.from(listBtn).forEach(function(btn) {
        activeBtn   = main.querySelector(object.btn + ".active");
        btn.addEventListener('click', function(event) {
            if (activeBtn) {
                activeBtn.classList.remove('active');
            }
            activeBtn=this;
            setLabel(activeBtn)

        });
    });
    function setLabel(btn){
        let _fontSize = Number(window.getComputedStyle(btn).getPropertyValue('font-size').match(/\d+/)[0]);
        btn.classList.add('active');
        label.style.width = btn.offsetWidth / _fontSize + "em";
        label.style.height = btn.offsetHeight / _fontSize + "em";
        label.style.left = btn.offsetLeft / _fontSize + "em";
        console.log();
    }
}
tabClick({
    name: ".audio-content-head-left",
    btn: ".option-menu-tab-item-link",
    label: ".option-menu-tab-label"
});
tabClick({
    name: ".menu-song-toggle",
    btn: ".option-menu-tab-item-link",
    label: ".option-menu-tab-label"
});
(function nextViewItem(object){
    const groupView = document.querySelectorAll(object.name);
    Array.from(groupView).forEach(function(view,index){
        const content = view.querySelector(object.content);
        const listItem=content.children;
        let indexView = 0;
        
        const nextBtn =view.querySelector(object.nextBtn);
        nextBtn.addEventListener('click',function(event){    
            
        });
        const backBtn =view.querySelector(object.backBtn);
        backBtn.addEventListener('click',function(event){    
           
        });
    });
})({});


(function offcanvs() {
    let openBtns = document.querySelectorAll(".canvas-btn") || [];
    if (openBtns.length > 0) {
        Array.from(openBtns).forEach(function(openBtn){
            let canvas = document.querySelector(openBtn.dataset.target);
            let isOpen = openBtn.classList.contains('active');
            if (canvas) {
                let canvasContent = canvas.querySelector(".canvas-content");
                openBtn.addEventListener('click', function(event) {
                    isOpen = this.classList.toggle('active');
                    if (isOpen) {
                        openCanvas(canvasContent,object[canvas.dataset.style].open);
                    } else {
                        closeCanvas(canvasContent,object[canvas.dataset.style].close);
                    }
                });
            }
        })
    };
    const object={
        'canvas-left':{
            open:{
                transition:"transform 0.5s linear",
                transform : 'translateX(100%)'
            },
            close:{
                transition:"transform 0.5s linear",
                transform : 'translateX(0%)'
            }
        },
        'canvas-right':{
            open:{
                transition:"transform 0.5s linear",
                transform : 'translateX(-100%)'
            },
            close:{
                transition:"transform 0.5s linear",
                transform : 'translateX(0%)'
            }
        },
        'canvas-up':{
            open:{
                transition:"transform 0.5s linear",
                transform : 'translateY(-100%)'
            },
            close:{
                transition:"transform 0.5s linear",
                transform : 'translateY(0%)'
            }
        },
        'canvas-bottom':{
            open:{
                transition:"transform 0.5s linear",
                transform : 'translateX(100%)'
            },
            close:{
                transition:"transform 0.5s linear",
                transform : 'translateX(0%)'
            }
        }
    };
    function openCanvas(canvasContent,style) {
        if (canvasContent) {
            Object.assign(canvasContent.style,style);
        }
    }
    function closeCanvas(canvasContent,style) {
        if (canvasContent) {
            Object.assign(canvasContent.style,style);
        }
    }
})();
















