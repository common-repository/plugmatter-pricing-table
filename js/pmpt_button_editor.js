'use strict';
(function ($) {
  var btn_col_indx = '';
  var $this_button = null;
  var $pmpt_button_editor = null;
  var temp_params,get_bg_color,get_hv_color;
  $.fn.button_editor = function() {
  
    if($("#pmpt_button_editor").length < 1) {
      $('<div/>', { id: 'pmpt_button_editor',class:'pmpt_button_editor',style:'display:none'}).appendTo('body');
      var btns_gallery = "<ul id='pmpt_btn_tabs'>"+
        "<li class='pmpt_active' data-toggle='#pmpt_btn_details'> Details </li>"+
        "<li data-toggle='#pmpt_btn_design'> Design </li>"+
        "</ul><div id='pmpt_btn_details' class='pmpt_tab'>"+
        "<table>"+
        "<tr><td><label for='pmpt_btn_txt_main'>Main Text: </label></td><td><input type='text' name='pmpt_btn_txt_main' id='pmpt_btn_txt_main' class='pmpt_btn_edit' style='margin-bottom:10px;'></td></tr>" +
        "<tr><td><label for='pmpt_btn_txt_sub'>Sub Text: </label></td><td><input type='text' name='pmpt_btn_txt_sub' id='pmpt_btn_txt_sub' class='pmpt_btn_edit' style='margin-bottom:10px;'></td></tr>" +      
        "<tr><td><label for='pmpt_btn_url'>Action URL: </label></td><td><input type='text' name='pmpt_btn_url' id='pmpt_btn_url' class='pmpt_btn_edit' style='margin-bottom:10px;' placeholder='http://somedomain.com'></td></tr>" +
        "<tr><td colspan=2> <strong> Font-Awesome ( <a href='http://fortawesome.github.io/Font-Awesome/icons/' class='get_font_icon' target='_blank'>Find Icon </a> )</strong></td></tr>"+
        "<tr><td colspan=2><table width='100%'><tr><td><label for='pmpt_btn_left_ico'>Left Icon: </label><br/><input type='text' name='pmpt_btn_left_ico' id='pmpt_btn_left_ico' size='10' class='pmpt_btn_edit' style='margin-bottom:10px;' placeholder='Font Awesome icon class'></td><td>" +
        "<label for='pmpt_btn_right_ico'>Right Icon: </label><br/><input type='text' name='pmpt_btn_right_ico' id='pmpt_btn_right_ico' size='10' class='pmpt_btn_edit' style='margin-bottom:10px;' placeholder='Font Awesome icon class'></td></tr></table></td></tr>" +
        "</table>"+
        "</div>"+
        "<div id='pmpt_btn_design' class='pmpt_tab' style='display:none;'><div id='pmpt_btn_tbl'>"+
        "<div><label id='pmpt_btn_b_clr'>"+
          "<input type='text' name='pmpt_btn_bg_clr' id='pmpt_btn_bg_clr' class='pmpt_bg_edit'  style='margin:10px 0px;'>&nbsp;"+
        "</label>"+
        "<label id='pmpt_btn_hr_clr'>"+
          "<input type='text' name='pmpt_btn_bghover_clr' id='pmpt_btn_bghover_clr' class='pmpt_bg_edit' style='margin:10px 0px;'>" +
         "</label></div>Flat Buttons:"+
        "<ul style='border-bottom:1px dashed #ddd;'>";
          for(var flat=1; flat<=5; flat++){
           btns_gallery += "<li><a href='#' id='pmpt_btn_flat_"+flat+"' class='pmpt_btn_flat_"+flat+" pmpt_btn' ><span class='pmpt_btn_txt'><span class='pmpt_btn_txt_main'>Txt</span></span></a></li>";
          }
           btns_gallery += "</ul>Ghost Buttons:<ul style='border-bottom:1px dashed #ddd;'>";
          for(var ghost=1; ghost<=3; ghost++){
           btns_gallery += "<li><a href='#' id='pmpt_btn_ghost_"+ghost+"' class='pmpt_btn_ghost_"+ghost+" pmpt_btn' ><span class='pmpt_btn_txt'><span class='pmpt_btn_txt_main'>Txt</span></span></a></li>";
          }
          btns_gallery += "</ul>Regular Buttons:<ul>";
          
          for(var fat=1; fat<=15; fat++){
           btns_gallery += "<li><a href='#' id='pmpt_btn_fat_"+fat+"' class='pmpt_btn_fat_"+fat+" pmpt_btn' ><span class='pmpt_btn_txt'><span class='pmpt_btn_txt_main'>Txt</span></span></a></li>";
          }
          btns_gallery += "</ul></div></div>";
      $(btns_gallery).appendTo('#pmpt_button_editor');
    
      $pmpt_button_editor = $("#pmpt_button_editor");
      
      $pmpt_button_editor.on('click','#pmpt_btn_tabs li',function() {
        var pmpt_show_tab = $(this).data('toggle');
        $(this).siblings().removeClass('pmpt_active');
        $(this).addClass('pmpt_active');
        $pmpt_button_editor.find('.pmpt_tab').hide();
        $(pmpt_show_tab).show();
      });  
      $pmpt_button_editor.on('focusout','.pmpt_btn_edit',function(){
        var pmpt_case = $(this).attr('id');
        switch (pmpt_case) {
          case 'pmpt_btn_url':
            var btn_url = $(this).val();
            var re = /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?/;
            if (re.test(btn_url)) {
              $this_button.attr('href',btn_url);
              pmpt_update_button( btn_url, "pmpt_url" );
            } else{
              alert("please provide valid url");
              return false;
            }
          break;
        }  
      });

      $pmpt_button_editor.on('keyup','.pmpt_btn_edit',function(){
        var pmpt_case = $(this).attr('id');
        var position = $this_button.offset();
        var check_icon;
        switch (pmpt_case) {
          case 'pmpt_btn_txt_main':
            var btn_txt = $(this).val();
            $pmpt_button_editor.css({"top": position.top + parseInt( $this_button .css( "height" ).slice(0,-2)), "left" : position.left });
            $this_button.find("span.pmpt_btn_txt_main").text(btn_txt);
            pmpt_update_button( btn_txt, "pmpt_btn_txt_main" );
            break;
          case 'pmpt_btn_txt_sub':
            var btn_txt = $(this).val();
            $pmpt_button_editor.css({"top": position.top + parseInt( $this_button .css( "height" ).slice(0,-2)), "left" : position.left });
            $this_button.find("span.pmpt_btn_txt_sub").text(btn_txt);
            pmpt_update_button( btn_txt, "pmpt_btn_txt_sub" );

            break;
          case 'pmpt_btn_left_ico':
            var btn_txt = 'fa '+$(this).val().trim();
            $this_button.find("span.pmpt_btn_ico").first().children('i').removeClass().addClass(btn_txt);
            pmpt_update_button( btn_txt, "pmpt_btn_left_ico" );
            break;
          case 'pmpt_btn_right_ico':
            var btn_txt = 'fa '+$(this).val().trim();
            if(btn_txt!=""){
              check_icon = btn_txt;
              $this_button.find("span.pmpt_btn_ico").last().css('max-width','15%');
              $this_button.find("span.pmpt_btn_txt").css('max-width','68%');
            }else{
              if($this_button.find("span.pmpt_btn_ico").first().css('max-width')!='15%'){
                $this_button.find("span.pmpt_btn_ico").last().css('max-width','0%');
                $this_button.find("span.pmpt_btn_txt").css('max-width','100%');
              }
            }
            $this_button.find("span.pmpt_btn_ico").last().children('i').removeClass().addClass(btn_txt);
            pmpt_update_button( btn_txt, "pmpt_btn_right_ico" );
            break;    
        }
      });
      
      //$pmpt_button_editor.on('click','#pmpt_btn_bg_clr',function(){
        //alert('x');
        $('#pmpt_btn_bg_clr').each(function(){
          $(this).wpColorPicker({
            change: function(event,ui){
              var pmpt_bg_clr = $(this).wpColorPicker('color');
               
              $("a[id^='pmpt_btn_flat_']").css('background-color',pmpt_bg_clr);
              $("a[id^='pmpt_btn_ghost_']").css('border-color',pmpt_bg_clr);
               $("a[id^='pmpt_btn_ghost_']").css('color',pmpt_bg_clr);
              pmpt_update_button( pmpt_bg_clr, "pmpt_bg_clr" );      
            }
          });
        });

        $('#pmpt_btn_bghover_clr').each(function(){
          $(this).wpColorPicker({
            change: function(event,ui){
              var pmpt_bghover_clr = $(this).wpColorPicker('color');
              pmpt_update_button( pmpt_bghover_clr, "pmpt_bghover_clr" );

              var pmpt_bg_clr = $("a[id^='pmpt_btn_flat_']").css('background-color');
              $("a[id^='pmpt_btn_flat_']").hover(function(e) { 
                $(this).css("background-color",pmpt_bghover_clr); 
              },function(e){
                $(this).css("background-color",pmpt_bg_clr);
              });
              $("a[id^='pmpt_btn_ghost_']").hover(function(e) { 
                $(this).css({"background-color": pmpt_bghover_clr,"border-color":pmpt_bghover_clr,"color": "white"}); 
              },function(){
                $(this).css({"background-color": "transparent","border-color":pmpt_bg_clr,"color": pmpt_bg_clr});
              });
            }
          });
        });

      
      $pmpt_button_editor.on("click","a",function(e) {   
        var btn_class = $(this).attr("class");    
           
        if(btn_class != 'get_font_icon'){ // get_font_icon is class for font awesome's site link
          e.preventDefault();
            var btn_cur_cls = btn_class+" pmpt_btn_"+btn_col_indx; 
            $this_button.removeClass().addClass(btn_cur_cls); 
            pmpt_update_button( btn_class, "pmpt_btn_class" );
            
            var ghost_patt = /ghost/i;
            var flat_patt = /flat/i;
            var pmpt_custom_btn_css;

            if(ghost_patt.test(btn_class)){

              if(pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bg_clr']){
                pmpt_custom_btn_css = ".pmpt_btn_"+btn_col_indx+" {"; 
                pmpt_custom_btn_css     += 'color:'+pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bg_clr']+' !important;';
                pmpt_custom_btn_css     += 'background-color: transparent !important;';
                pmpt_custom_btn_css     += "}"; 
              }
              if(pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bghover_clr']){

                pmpt_custom_btn_css += ".pmpt_btn_"+btn_col_indx+":hover{"; 
                pmpt_custom_btn_css += 'background-color:'+pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bghover_clr']+" !important;";
                pmpt_custom_btn_css += 'color: white !important;';
                pmpt_custom_btn_css += "}";     
              }
              
            }

            if(flat_patt.test(btn_class)){
              if(pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bg_clr']){ 
                pmpt_custom_btn_css = ".pmpt_btn_"+btn_col_indx+" {"; 
                pmpt_custom_btn_css     += 'background-color:'+pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bg_clr']+" !important;";
                pmpt_custom_btn_css     += 'color: white !important;';
                pmpt_custom_btn_css     += "}"; 
              }
              
              if(pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bghover_clr']){
                
                pmpt_custom_btn_css += ".pmpt_btn_"+btn_col_indx+":hover{"; 
                pmpt_custom_btn_css += 'background-color:'+pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bghover_clr']+" !important;";
                pmpt_custom_btn_css     += 'color: white !important;';
                pmpt_custom_btn_css += "}";   
              }
            }
            pmpt_custom_inline_style.appendChild(document.createTextNode(pmpt_custom_btn_css));  
        }
       
      });    
  }
  
  var prev_click = null;
  this.on('click',function(e) {
    e.preventDefault();

    $this_button = $(this);
    btn_col_indx = $this_button.data( "col-index" );
    e.preventDefault();
    e.stopPropagation();
    $('#pmpt_column_editor').hide();
    $('#pmpt_cell_editor').hide();
    $('#tooltip_box').hide();
    $pmpt_button_editor.hide();
    $pmpt_button_editor.show();
    $('#pmpt_btn_bg_clr').wpColorPicker();
    $('#pmpt_btn_bghover_clr').wpColorPicker();
    $('#pmpt_btn_b_clr .wp-color-result').addClass('pmpt_btn_b_c');
    $('#pmpt_btn_hr_clr .wp-color-result').addClass('pmpt_btn_hr_c');
    $('.pmpt_btn_b_c').attr('title','Background/Border').css('height','auto');;
    $('.pmpt_btn_hr_c').attr('title','Hover').css('height','auto');

    var position = $(this).offset();
    
    /*--------------sameer ----------------------*/ 
    if(prev_click==null){
      prev_click = $this_button.attr('class');
    }else{
      var this_click = $this_button.attr('class');
    }
    
    if(this_click!=prev_click){
      $("a[id^='pmpt_btn_flat_']").css('background-color','');
      prev_click = this_click;
    }
    
    temp_params   = (pmpt_params!=null)?pmpt_params:pmpt_default_params;
    get_bg_color  = temp_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bg_clr'];
    get_hv_color  = temp_params["pmpt_packages"][btn_col_indx]["pmpt_button"]['pmpt_bghover_clr'];
    $('.pmpt_btn_b_c').css('background-color',get_bg_color);
    $('.pmpt_btn_hr_c').css('background-color',get_hv_color);
    if(get_bg_color != ''){
      $("#pmpt_btn_bg_clr").val(get_bg_color);  
      $("a[id^='pmpt_btn_flat_']").css('background-color',get_bg_color);
    }else{
      $("#pmpt_btn_bg_clr").val("#000000");  
    }

    if(get_hv_color != ''){
      $("#pmpt_btn_bghover_clr").val(get_hv_color);  
    }else{
      $('body').find("#pmpt_btn_bghover_clr").val("#000000");  
    }
    
    /*--------------sameer ----------------------*/
            
    $pmpt_button_editor.css({"top": position.top + parseInt( $( this ).css( "height" ).slice(0,-2)), "left" : position.left });
    e.stopPropagation();
    $pmpt_button_editor.on( "click", function(e){ 
      e.stopPropagation();
    });

    var pmpt_btn_txt_main = $this_button.find("span.pmpt_btn_txt_main").text();
    $("#pmpt_btn_txt_main").val(pmpt_btn_txt_main);
    
    var pmpt_btn_secondary_txt = $this_button.find(".pmpt_btn_txt_sub").text();
    $("#pmpt_btn_txt_sub").val(pmpt_btn_secondary_txt);

    var pmpt_btn_url = $this_button.attr("href");
    $("#pmpt_btn_url").val(pmpt_btn_url);

    var left_ico = $this_button.find("span.pmpt_btn_ico").first().children('i').attr('class').slice(3);
    $("#pmpt_btn_left_ico").val(left_ico);

    var right_ico = $this_button.find("span.pmpt_btn_ico").last().children('i').attr('class').slice(3);
    $("#pmpt_btn_right_ico").val(right_ico);
    
    $( document ).one("click", function() {
      $('#pmpt_button_editor').hide();
    });

    $( document ).on( 'keydown', function ( e ) {
      if ( e.keyCode === 27 ) {
        $('#pmpt_button_editor').hide();
      }
    });
        
  });

  function pmpt_update_button( update_value, update_param ) {
    if(pmpt_params == null){
      pmpt_params = pmpt_default_params;
    }
    var pmpt_update_value = update_value;
    var pmpt_update_param = update_param;
    pmpt_params["pmpt_packages"][btn_col_indx]["pmpt_button"][pmpt_update_param] = pmpt_update_value;  
  } 
}
})(jQuery);