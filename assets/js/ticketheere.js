var org=djh.org;
var ev=djh.ev;
var med=djh.med;
var useTunnel = true;
var tunnelurl = djh.tunnelUrl;

var baseurl = 'https://shop.ticketheere.nl/'+djh.set;
var geocoder;
var map;
if(useTunnel==null) {
    var useTunnel=false; 
}
if(tunnelurl==null) {
    var tunnelurl=''; 
}
if(med==null) {
    var med=''; 
}
function gMapsCallback() { }

var jonckheere = function() {
   // Bart var org, ev, sessieid, ticketid, aantal, transactieid, bestellingid, page;
   var org, ev, med, sessieid, ticketid, aantal, transactieid, bestellingid, page;
   var vars = new Object();
   
   var cart = new Object();
   
   this.init= function(org,ev,med) {
       
       var hash = window.location.hash;
       
       var splithash = hash.replace('#',' ').split('&');
       
       jQuery.each(splithash, function(k,v) {
            if(v!='') {
                var splitvar = v.replace(' ','').split('=');
                vars[splitvar[0]] = splitvar[1]; 
            }
       });
       
       this.org = org;
       this.ev = ev;
	   this.med = med;
       
       if(vars.page!=null) {
            this.page = vars.page; 
            this.ev = vars.ev; 
			this.med = vars.med;
       }
       
       if(vars.bid!=null) {
            this.bestellingid   = vars.bid; 
            this.transactieid   = vars.tid; 
       }
       
       if(vars.s==null) {
            this.register();   
       } else {
            this.sessieid       = vars.s; 
            this.pageinit();
       }
       if(jQuery('#share_summary').length>0) {
           jQuery('#share_summary').live('keyup',function(data) {
                this.update_share();
           });
       }
       
   }
   
   this.update_share = function() {
       jQuery('#facebookshare').attr('href','https://www.facebook.com/sharer.php?s=100'+
        '&p[url]='+jQuery('#url').val()+
        '&p[images][0]='+jQuery('#image').val()+
        '&p[title]='+jQuery('#title').val()+
        '&p[summary]='+jQuery('#share_summary').val());
        
        jQuery('#twittershare').attr('href',' https://twitter.com/intent/tweet?text='+jQuery('#share_summary').val()+jQuery('#url').val());
        
        jQuery('#googleshare').attr('href',' https://plus.google.com/share?url='+jQuery('#url').val());
   }
   
   this.reinit = function() {
        this.init(this.org,this.ev,this.med);
   }
   
   this.loadpage = function(vars) {
       var h = '';
       h+='s='+this.sessieid+'&';
       jQuery.each(vars,function(k,v) {
            h+=k+'='+v+'&';
       });
       window.location.hash = h;
   }
   /*
   this.updatehash = function(page) {
       var hash = this.sessieid+':'+page+':'+this.ev;
       window.location.hash = hash;
   }
   */
   
   this.pageinit = function() {
       if(vars.ct!=null&&vars.ct!='') {
           this.load_page3(); 
       } else if(this.page=='tickets'||(this.page==null||this.page=='')&&(this.ev!=null||this.ev!='')) {
            this.load_page2();
       } else if(this.page=='locatie') {
            this.show_locatie(this.ev);   
       } else if(this.page=='contact') {
            this.show_contact(this.ev);   
       } else if(this.page=='cart') {
            this.load_page3();   
       } else if(this.page=='overview') {
            this.load_page4();   
       } else if(this.page=='download'&&this.bestellingid!=null&&this.bestellingid!='') {
            this.load_order();   
       } else if((this.page==null||this.page=='')&&(this.ev==null||this.ev=='')) {
            this.load_errorpage();   
       }  
       delete(vars['bid']);
       delete(vars['tid']);
   };
   
   this.callback = function(page) {
       if(typeof(callbackJonckheere) == 'function' && page != null && page!='') { 
            callbackJonckheere(page); 
       }   
       
   }
   
   this.register = function() {
        
        this.crossbrowser_get(baseurl+'includes/register.php',function(sesid) {
           
           jhobj.sessieid = sesid;
           //document.location = document.location+'#s='+sesid;
           
           jhobj.pageinit();
        });
        /*
        if (window.XDomainRequest) {
                var xdr = new XDomainRequest();
                if (xdr) {
                    xdr.onload = function() {   
                       jhobj.sessieid = xdr.responseText;
                       //document.location = document.location+'#s='+sesid;
                       
                       jhobj.pageinit();
                    }
                    xdr.open('GET', baseurl+'includes/register.php');
                    xdr.send();
                }
        } else {
            $.get(baseurl+'includes/register.php',function(sesid) {
               jhobj.sessieid = sesid;
               //document.location = document.location+'#s='+sesid;
               
               jhobj.pageinit();
            }); 
        }
        */
       
                
       
       
   }
   
   this.load_page1 = function() {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/page1.php?sessieid='+this.sessieid+'&org='+this.org,'page1'); 
       //this.updatehash('');
   } 
   
   this.load_errorpage = function() {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/error.php?sessieid='+this.sessieid+'&org='+this.org,'errorpage'); 
       //this.updatehash('');
   } 
   
   this.load_page2 = function() {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/page2.php?sessieid='+this.sessieid+'&org='+this.org+'&ev='+this.ev+'&med='+this.med,'page2'); 
      // this.updatehash('tickets');
	  jQuery('#jonckheere').removeClass();
	  jQuery('#jonckheere').addClass('tickets');
   }
   
   this.load_page3 = function() {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/page3.php?sessieid='+this.sessieid+'&org='+this.org+'&ev='+this.ev+'&c='+vars['c']+'&t='+vars['t']+'&ct='+vars['ct'],'page3');
       //this.updatehash('cart');
	   jQuery('#jonckheere').removeClass();
	   jQuery('#jonckheere').addClass('tickets gegevens');
       vars.ct = '';
       vars.c = '';
       vars.t = '';
   }
   
   this.add_cart = function() {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/page3.php?sessieid='+this.sessieid+'&org='+this.org+'&ev='+this.ev+'&ticketid='+this.ticketid+'&aantal='+this.aantal+'&act=add');
       //this.updatehash('cart');
   }
   
   this.load_page4 = function() {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/page4.php?sessieid='+this.sessieid+'&org='+this.org+'&ev='+this.ev+'&bid='+vars['bid']+'&tid='+vars['tid'],'page4');
       //this.updatehash('overview');
	   jQuery('#jonckheere').removeClass();
	   jQuery('#jonckheere').addClass('tickets gegevens betalen');
   }
   
   this.load_order = function() {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/order.php?sessieid='+this.sessieid+'&transactieid='+this.transactieid+'&bestellingid='+this.bestellingid,'download');
	   jQuery('#jonckheere').removeClass();
	   jQuery('#jonckheere').addClass('tickets gegevens betalen print');
   }
   
   this.load_betaling = function() {
      
       this.crossbrowser_get(baseurl+'includes/betaling.php?sessieid='+this.sessieid+'&org='+this.org+'&url='+encodeURIComponent(document.location),function(url) {
            //alert(url);
            document.location = url;   
       });
   }
   
   this.submit_kortingscode = function() {

       jQuery('#kortingerror').html('');   
       this.crossbrowser_get(baseurl+'includes/kortingscode.php?sessieid='+this.sessieid+'&org='+this.org+'&code='+$('#kortingscode').val(),function(data) {
            if(data=='success') {
                jhobj.load_page3();   
            } else {
                jQuery('#kortingerror').html(data);   
            }
       }); 
   };
   
   this.add_extra = function(extraid,el) {
       var aantal = $(el).parent().find('.aantal').val();
       this.crossbrowser_load('#jonckheere',baseurl+'includes/page3.php?sessieid='+this.sessieid+'&org='+this.org+'&ev='+this.ev+'&extraid='+extraid+'&aantal='+aantal+'&act=addextra','page3'); 
   }
   
   this.update_aantal = function(id,aantal,type) {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/page3.php?sessieid='+this.sessieid+'&org='+this.org+'&ev='+this.ev+'&id='+id+'&aantal='+aantal+'&act=edit&type='+type,'page3'); 
   }
   
   this.delete_cart = function(id,type) {
       this.crossbrowser_load('#jonckheere',baseurl+'includes/page3.php?sessieid='+this.sessieid+'&org='+this.org+'&ev='+this.ev+'&id='+id+'&act=delete&type='+type,'page3');
   }
   
   this.crossbrowser_load = function(el,url,page) {
       if(page==null) {
            var page = '';   
       }
       if(useTunnel==true) {
            jQuery(el).load(tunnelurl+'tunnel.php?url='+escape(url.replace(baseurl,'')),function() {
                jhobj.callback(page);   
            }); 
       } else {
           if (window.XDomainRequest) {
                var xdr = new XDomainRequest();
                if (xdr) {
                    xdr.onload = function() {   
                       $(el).html(xdr.responseText);
                       jhobj.callback(page);
                    }
                    xdr.open('GET', url);
                    xdr.send();
                }
            } else {
                $(el).load(url,function() {
                    jhobj.callback(page);
                }); 
            }
       }
   }
   
   this.crossbrowser_get = function(url,func) {
       if(page==null) {
            var page = '';   
       }
       if(useTunnel==true) {
            jQuery.get(tunnelurl+'tunnel.php?url='+escape(url.replace(baseurl,'')),function(data) {
                func(data); 
                jhobj.callback(page);  
            });
       } else {
           if (window.XDomainRequest) {
                var xdr = new XDomainRequest();
                if (xdr) {
                    xdr.onload = function() {   
                       func(xdr.responseText);
                        jhobj.callback(page);
                    }
                    xdr.open('GET', url);
                    xdr.send();
                }
           } else {
                $.get(url,function(data) {
                    func(data);   
                    jhobj.callback(page);
                });
           }
       }
       
   }
   
    this.crossbrowser_post = function(url,data,func,page) {
       if(page==null) {
            var page = '';   
       }
       if(useTunnel==true) {
            jQuery.post(
                tunnelurl+'tunnel.php?type=post&url='+escape(url.replace(baseurl,'')),
                data,
                function(data) {
                    func(data);
                    jhobj.callback(page);
                }
            );
           
           
       } else {
           if (window.XDomainRequest) {
                var xdr = new XDomainRequest();
                if (xdr) {
                    xdr.onload = function() {   
                       func(xdr.responseText);
                       jhobj.callback(page);
                    }
                    xdr.open('POST', url);
                    xdr.send(data);
                    
                }
           } else {
                jQuery.post(
                    url,
                    data,
                    function(data) {
                        func(data);
                        jhobj.callback(page);
                    }
                 );
           }
           }
   }
   
   this.load_event = function(ev,med) {
       
       this.ev = ev;
	   this.med = med;
       
       this.load_page2();
   }  
   
   this.order_tickets = function(ticketid) {
        
        this.ticketid = ticketid;
        this.aantal = parseInt(jQuery('#ticket'+ticketid).val());
        if(this.aantal>0) {
            
            this.add_cart(); 
        }
   }
   
   this.submit_klant = function() {
        jQuery('.error').removeClass('error');
        jQuery('.charerror').hide();
        var error = false;
        jQuery('.verplicht').each(function() {
            
            if(jQuery(this).attr('type')=='text'||jQuery(this).attr('type')=='email'||jQuery(this).attr('type')=='textarea'||jQuery(this).attr('type')=='') {
                if(jQuery(this).val()=='') {
                    error = true;
                    jQuery(this).parent().addClass('error');
                }
            }
            
            if(jQuery(this).attr('type')=='checkbox') {
                if(!jQuery(this).is(':checked')) {
                    error = true;
                    jQuery(this).parent().addClass('error');
                }
            }
            
            if(jQuery(this).attr('type')=='radio') {
               
                if(jQuery(this).parent().find('input:checked').length==0) {
                    error = true;
                    jQuery(this).parent().addClass('error');
                }
            }
        });
        
        jQuery('input[type=text], textarea').each(function() {
            
            if(jQuery(this).attr('min')!=null) {
                
                if(jQuery(this).val().length<parseInt(jQuery(this).attr('min'))&&jQuery(this).val()!='') {
                    jQuery(this).parent().find('.charerror').html('U moet minimaal '+jQuery(this).attr('min')+' karakters invoeren').show();
                    error=true;
                }
            }
            
            if(jQuery(this).attr('max')!=null) {
                if(jQuery(this).val().length>parseInt(jQuery(this).attr('max'))) {
                    jQuery(this).parent().find('.charerror').html('U kunt maximaal '+jQuery(this).attr('max')+' karakters invoeren').show();
                    error=true;
                }
            }
            
        });
        
        if(error==true) {
            return false;   
        }
       
        var data = jQuery('#klantform').serialize();
        this.crossbrowser_post(
            baseurl+'includes/saveklantdata.php?sessieid='+this.sessieid,
            data,
            function(data) {
                if(data=='error') {
                    alert('U heeft niet alle verplichte velden ingevoerd.');   
                } else {
                    
                    jhobj.loadpage({
                        page:'overview',
                        ev:jhobj.ev
                    });   
                }
            }
         )
       
   }
   
   this.bestel = function() {
        if(jQuery('.bankkeuze').length>0&&jQuery('.bankkeuze').val()=='') { 
            alert('Kies eerst een bank');
            return;
        }
        this.crossbrowser_post(
            baseurl+'includes/savebankdata.php?sessieid='+this.sessieid,
            'bank='+jQuery('.bankkeuze').val(),
            function(data) {
                jhobj.load_betaling();   
            }
         )
	    
        jQuery('.bestelbutton').attr('disabled',true);
		jQuery('.bestelbutton').addClass('disabled');
		jQuery('.loading').show(200);
   }
   
   this.show_locatie = function(evid) {
        this.crossbrowser_load('#jonckheere',baseurl+'includes/locatie.php?org='+this.org+'&ev='+evid,'locatie');      
        //this.updatehash('locatie');
   }
   this.show_contact = function(evid) {
        this.crossbrowser_load('#jonckheere',baseurl+'includes/contact.php?org='+this.org+'&ev='+evid,'contact');      
   }
   
   this.show_gmap = function(adres) {
        
        geocoder = new google.maps.Geocoder();
        
        geocoder.geocode( { 'address': adres}, function(results, status) {
            
            if (status == google.maps.GeocoderStatus.OK) {
                var mapOptions = {
                    zoom: 16,
                    center: results[0].geometry.location,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                
                map = new google.maps.Map(document.getElementById('jonckheere_gmap'),mapOptions);
                
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            }
        });
        
   }
  
   this.read_more = function(el) {
        jQuery(el).parent().parent().parent().find('.toelichting').slideToggle();
   }
   
   this.meer_info_extra = function(el) {
       jQuery(el).parent().parent().find('.toelichting').slideToggle();
       
   }
   this.sendMobile = function() {
        var data = jQuery('#mobileform').serialize();
        
        this.crossbrowser_get(
            baseurl+'includes/mobilesend.php?sessieid='+this.sessieid+'&'+data,
            function(data) {
                jQuery('#mobilemessage').html('Uw kaartjes zijn verzonden.');
            }
         )
        
        return false;    
    }
 
    
};

var jhobj;
jQuery(document).ready(function($) {
    var ver = getInternetExplorerVersion();
	
    $('head').append('<link rel="stylesheet" type="text/css" href="'+baseurl+'css/main.css" />');
  	$('head').append('<link rel="stylesheet" type="text/css" href="'+baseurl+'css/main.css.php?org='+org+'&ev='+ev+'&med='+med+'" />');
	if (ver > -1 && ver <= 8.0) {
       $('head').append('<link rel="stylesheet" type="text/css" href="'+baseurl+'css/ie8.css" />'); 
    }
    
    $('head').append('<script src="https://maps.google.com/maps/api/js?sensor=false&callback=gMapsCallback"></script>');
    
    jhobj = new jonckheere();
    jhobj.init(org,ev,med);
});

function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

var prevHash = window.location.hash;
window.setInterval(function () {
   if (window.location.hash != prevHash) {
		prevHash = window.location.hash;
         
		jhobj.reinit();
          
	}
}, 100);
