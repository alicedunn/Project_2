if(typeof(Control)=="undefined"){Control={}}var $proc=function(a){return typeof(a)=="function"?a:function(){return a}};var $value=function(a){return typeof(a)=="function"?a():a};Object.Event={extend:function(a){a._objectEventSetup=function(b){this._observers=this._observers||{};this._observers[b]=this._observers[b]||[]};a.observe=function(d,b){if(typeof(d)=="string"&&typeof(b)!="undefined"){this._objectEventSetup(d);if(!this._observers[d].include(b)){this._observers[d].push(b)}}else{for(var c in d){this.observe(c,d[c])}}};a.stopObserving=function(c,b){this._objectEventSetup(c);if(c&&b){this._observers[c]=this._observers[c].without(b)}else{if(c){this._observers[c]=[]}else{this._observers={}}}};a.observeOnce=function(d,c){var b=function(){c.apply(this,arguments);this.stopObserving(d,b)}.bind(this);this._objectEventSetup(d);this._observers[d].push(b)};a.notify=function(g){this._objectEventSetup(g);var d=[];var b=$A(arguments).slice(1);try{for(var c=0;c<this._observers[g].length;++c){d.push(this._observers[g][c].apply(this,b)||null)}}catch(f){if(f==$break){return false}else{throw f}}return d};if(a.prototype){a.prototype._objectEventSetup=a._objectEventSetup;a.prototype.observe=a.observe;a.prototype.stopObserving=a.stopObserving;a.prototype.observeOnce=a.observeOnce;a.prototype.notify=function(h){if(a.notify){var c=$A(arguments).slice(1);c.unshift(this);c.unshift(h);a.notify.apply(a,c)}this._objectEventSetup(h);var c=$A(arguments).slice(1);var f=[];try{if(this.options&&this.options[h]&&typeof(this.options[h])=="function"){f.push(this.options[h].apply(this,c)||null)}var b=this._observers[h];for(var d=0;d<b.length;++d){f.push(b[d].apply(this,c)||null)}}catch(g){if(g==$break){return false}else{throw g}}return f}}}};Element.addMethods({observeOnce:function(c,d,b){var a=function(){b.apply(this,arguments);Element.stopObserving(c,d,a)};Element.observe(c,d,a)}});var IframeShim=Class.create({initialize:function(){this.element=new Element("iframe",{style:"position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);display:none",src:"javascript:void(0);",frameborder:0});$(document.body).insert(this.element)},hide:function(){this.element.hide();return this},show:function(){this.element.show();return this},positionUnder:function(a){var a=$(a);var c=a.cumulativeOffset();var b=a.getDimensions();this.element.setStyle({left:c[0]+"px",top:c[1]+"px",width:b.width+"px",height:b.height+"px",zIndex:a.getStyle("zIndex")-1}).show();return this},setBounds:function(a){for(prop in a){a[prop]+="px"}this.element.setStyle(a);return this},destroy:function(){if(this.element){this.element.remove()}return this}});if(typeof(Prototype)=="undefined"){throw"Control.ScrollBar requires Prototype to be loaded."}if(typeof(Control.Slider)=="undefined"){throw"Control.ScrollBar requires Control.Slider to be loaded."}if(typeof(Object.Event)=="undefined"){throw"Control.ScrollBar requires Object.Event to be loaded."}Control.ScrollBar=Class.create({initialize:function(b,a,c){Control.ScrollBar.instances.push(this);this.enabled=false;this.notificationTimeout=false;this.container=$(b);this.boundMouseWheelEvent=this.onMouseWheel.bindAsEventListener(this);this.boundResizeObserver=this.onWindowResize.bind(this);this.track=$(a);this.handle=this.track.firstDescendant();this.options=Object.extend({active_class_name:"scrolling",apply_active_class_name_to:this.container,notification_timeout_length:125,handle_minimum_length:25,scroll_to_smoothing:0.01,scroll_to_steps:15,scroll_to_precision:100,proportional:true,custom_event:null,custom_event_handler:null,scroll_axis:"vertical",fixed_scroll_distance:-1,slider_options:{}},c||{});this.slider=new Control.Slider(this.handle,this.track,Object.extend({axis:this.options.scroll_axis,onSlide:this.onChange.bind(this),onChange:this.onChange.bind(this)},this.options.slider_options));this.recalculateLayout();Event.observe(window,"resize",this.boundResizeObserver);if(this.options.custom_event){if(Object.isFunction(this.options.custom_event_handler)){this.container.observe(this.options.custom_event,this.options.custom_event_handler)}else{this.container.observe(this.options.custom_event,this.boundResizeObserver)}}this.handle.observe("mousedown",function(){if(this.auto_sliding_executer){this.auto_sliding_executer.stop()}}.bind(this))},destroy:function(){Event.stopObserving(window,"resize",this.boundResizeObserver);if(this.options.active_class_name){$(this.options.apply_active_class_name_to).removeClassName(this.options.active_class_name)}if(this.options.custom_event){this.container.stopObserving(this.options.custom_event)}},scrollLength:function(){return(this.options.scroll_axis=="vertical")?this.container.scrollHeight:this.container.scrollWidth},offsetLength:function(){return(this.options.scroll_axis=="vertical")?this.container.offsetHeight:this.container.offsetWidth},enable:function(){this.enabled=true;this.container.observe("mouse:wheel",this.boundMouseWheelEvent);this.slider.setEnabled();this.track.show();if(this.options.active_class_name){$(this.options.apply_active_class_name_to).addClassName(this.options.active_class_name)}this.notify("enabled")},disable:function(){this.enabled=false;this.container.stopObserving("mouse:wheel",this.boundMouseWheelEvent);this.slider.setDisabled();this.track.hide();if(this.options.active_class_name){$(this.options.apply_active_class_name_to).removeClassName(this.options.active_class_name)}this.notify("disabled");this.reset()},reset:function(){this.slider.setValue(0)},recalculateLayout:function(){if(this.scrollLength()<=this.offsetLength()){this.disable()}else{this.enable();this.slider.trackLength=this.slider.maximumOffset()-this.slider.minimumOffset();if(this.options.proportional){this.slider.handleLength=Math.max(this.offsetLength()*(this.offsetLength()/this.scrollLength()),this.options.handle_minimum_length);if(this.options.scroll_axis=="vertical"){this.handle.style.height=this.slider.handleLength+"px"}else{this.handle.style.width=this.slider.handleLength+"px"}}this.scrollBy(0)}},onWindowResize:function(){this.recalculateLayout();this.scrollBy(0)},onMouseWheel:function(a){if(this.auto_sliding_executer){this.auto_sliding_executer.stop()}if(this.options.fixed_scroll_distance>0){this.slider.setValueBy(-(this.options.fixed_scroll_distance*a.memo._delta/(this.scrollLength()-this.slider.trackLength)))}else{this.slider.setValueBy(-(a.memo._delta/20))}a.stop();return false},onChange:function(b){var a=Math.round(b/this.slider.maximum*(this.scrollLength()-this.offsetLength()));if(this.options.scroll_axis=="vertical"){this.container.scrollTop=a}else{this.container.scrollLeft=a}if(this.notification_timeout){window.clearTimeout(this.notificationTimeout)}this.notificationTimeout=window.setTimeout(function(){this.notify("change",b)}.bind(this),this.options.notification_timeout_length)},getCurrentMaximumDelta:function(){return this.slider.maximum*(this.scrollLength()-this.offsetLength())},getContainerOffset:function(a){var b=a.positionedOffset();while(a.getOffsetParent()!=this.container){a=a.getOffsetParent();b[0]+=a.positionedOffset()[0];b[1]+=a.positionedOffset()[1];b.top+=a.positionedOffset().top;b.left+=a.positionedOffset().left}return b},getDeltaToElement:function(a){if(this.options.scroll_axis=="vertical"){return this.slider.maximum*((this.getContainerOffset(a).top+(a.getHeight()/2))-(this.container.getHeight()/2))}else{return this.slider.maximum*((this.getContainerOffset(a).left+(a.getWidth()/2))-(this.container.getWidth()/2))}},scrollTo:function(g,b){var a=this.options.scroll_to_precision,d=this.getCurrentMaximumDelta();if(a=="auto"){a=Math.pow(10,Math.ceil(Math.log(d)/Math.log(10)))}if(g=="top"){g=0}else{if(g=="bottom"){g=d}else{if(typeof(g)!="number"){g=this.getDeltaToElement($(g))}}}if(this.enabled){g=Math.max(0,Math.min(g,d));if(this.auto_sliding_executer){this.auto_sliding_executer.stop()}var c=g/d;var f=this.slider.value;var e=(c-f)*d;if(b){this.auto_sliding_executer=new PeriodicalExecuter(function(){if(Math.round(this.slider.value*a)/a<Math.round(c*a)/a||Math.round(this.slider.value*a)/a>Math.round(c*a)/a){this.scrollBy(e/this.options.scroll_to_steps)}else{this.auto_sliding_executer.stop();this.auto_sliding_executer=null;if(typeof(b)=="function"){b()}}}.bind(this),this.options.scroll_to_smoothing)}else{this.scrollBy(e)}}else{if(typeof(b)=="function"){b()}}},scrollBy:function(a){if(!this.enabled){return false}this.slider.setValueBy(a/(this.getCurrentMaximumDelta()==0?1:this.getCurrentMaximumDelta()))}});Object.extend(Control.ScrollBar,{instances:[],findByElementId:function(a){return Control.ScrollBar.instances.find(function(b){return(b.container.id&&b.container.id==a)})}});Object.Event.extend(Control.ScrollBar);