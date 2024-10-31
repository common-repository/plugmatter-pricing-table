'use strict';
(function ($) {
  var css_val, colmn_indx, col_text_align,temp_params;
  var $pmpt_column_editor = null;
  var $this_col = null;
  var shadow_color; 
  $.fn.col_editor = function() {
  
  if($("#pmpt_column_editor").length < 1) {
    var column_editr = "<ul id='pmpt_column_editor' class='pmpt_toolbox' style='display:none'>"+   
      "<li id='pmpt_text_align' class='pmpt_col_edit pmpt_tooltip' data-title='Text-Alignment' data-alt='text-align'><i class='fa fa-align-left'></i></li>"+    
      "<li id='pmpt_font_color_col' class='pmpt_col_edit pmpt_tooltip' data-title='Font Color'><i class='fa fa-font'></i></li>"+       
      "<li id='pmpt_back_color_col' class='pmpt_col_edit pmpt_tooltip' data-title='Background Color'><i class='fa fa-eyedropper'></i></li>"+       
      "<li id='pmpt_col_border' class='pmpt_col_edit pmpt_tooltip' data-title='Border'></li>"+       
      "<li id='pmpt_col_shadow' class='pmpt_col_edit pmpt_tooltip' data-title='Shadow'></li>"+
      "<select class='pmpt_fontsize pmpt_col_change' id='pmpt_col_fontsize' alt='fontsize'>"+
      "<option value=''>select</option>";

      for(var fs = 8; fs <= 30; fs++){
        column_editr += "<option value='"+fs+"'>"+fs+"</option>"; 
      }
      column_editr += "</select>"+                       
      "<select class='select_fonts pmpt_col_change' id='pmpt_col_fontname' alt='fontname'>"+
      "<option value=''>select</option>";
        for ( var i = 0; i < pmpt_fonts.length; i++) { 
          var fam = pmpt_fonts[i]["family"];
          var variants = pmpt_fonts[i]["variants"];
          column_editr += "<option value='"+fam+"' variants='"+variants+"'>"+fam+"</option>";
        }
      column_editr += "</select>"+
      "<div id='border_options' class='pmpt_inner_box'>"+
        "<label for='pmpt_width_slider'>Border-width: <span id='pmpt_border_display'></span>px</label>"+   
        "<input type='range' name='pmpt_width_slider' value='0' min='0' max='10' step='1' id='pmpt_width_slider' class='pmpt_col_slider'/>"+   
        "<label for='pmpt_radius_slider'>Border-radius: <span id='pmpt_radius_display'></span>%</label>"+   
        "<input type='range' name='pmpt_radius_slider' value='0' min='0' max='100' step='1' id='pmpt_radius_slider' class='pmpt_col_slider'/>"+ 
        "<label for='pmpt_col_border_color'>Select Border Color:</label>"+   
        "<label id='pmpt_b_c'><input type='text' name='pmpt_col_border_color' class='pmpt_col_change' id='pmpt_col_border_color' style='margin-left:10px'/></label>"+  
      "</div>"+  
      "<div id='pmpt_shadow_options' class='pmpt_inner_box'>"+
        "<label for='hlslider'> Horizontal-length: <span id='hldisplay'></span>px</label>"+   
        "<input type='range' name='hlslider' value='0' min='-10' max='10' step='1' id='hlslider' class='pmpt_shadow_opt pmpt_col_slider'/>"+   
        "<label for='vlslider'>Vertical-length: <span id='vldisplay'></span>px</label>"+   
        "<input type='range' name='vlslider' value='0' min='-10' max='10' step='1' id='vlslider' class='pmpt_shadow_opt pmpt_col_slider'/>"+   
        "<label for='brslider'>Blur-radius: <span id='brdisplay'></span>px</label>"+   
        "<input type='range' name='' value='0' min='0' max='100' step='1' id='brslider' class='pmpt_shadow_opt pmpt_col_slider'/>"+   
        "<label for='srslider'>Spread-radius: <span id='srdisplay'></span>px</label>"+   
        "<input type='range' name='srslider' value='0' min='0' max='10' step='1' id='srslider' class='pmpt_shadow_opt pmpt_col_slider'/>"+   
        "<label for='blur_colorpicker'>Select Shadow Color: </label>"+   
        "<label id='pmpb_s_c'><input type='text' name='blur_colorpicker' class='pmpt_col_change' id='blur_colorpicker' style='margin-left:10px'/></label>"+  
      "</div>"+   
      "<label id='pmpt_f'><input type='text' name='font_color_val_col' class='pmpt_col_change' id='font_color_val_col'/></label>"+ 
      "<label id='pmpt_b'><input type='text' name='back_color_val_col' class='pmpt_col_change' id='back_color_val_col'/></label>"+  
      "</ul>";
    $(column_editr).appendTo('body');
    $pmpt_column_editor = $("#pmpt_column_editor");
    $pmpt_column_editor.on("click", '.pmpt_col_edit', function(e){ // all the click events
      e.stopPropagation();
      $pmpt_column_editor.find('#border_options').hide();
      $pmpt_column_editor.find('#pmpt_shadow_options').hide();

      var col_click_case = $(this).attr('id'); 
      
      switch (col_click_case) {

        case "pmpt_text_align":
          var ab = $this_col.css('text-align');
          if (ab == 'start' || ab == 'left') {
            $this_col.css('text-align','center');
            $(this).find('i').removeClass().addClass('fa fa-align-center');
          }else if(ab == 'center') {
            $this_col.css('text-align','right');
            $(this).find('i').removeClass().addClass('fa fa-align-right');
          }else if(ab == 'right'){
            $this_col.css('text-align','left');
            $(this).find('i').removeClass().addClass('fa fa-align-left');
          }
          col_text_align = $this_col.css("text-align");
          pmpt_update_col( col_text_align, "text_align" );     
        break;
        case "pmpt_font_color_col":
          //$('#pmpt_f .wp-picker-container').show();
          $('.pmpt_f_color').click();
          var get_font_color =  rgb2hex($this_col.css('color'));
          $('#font_color_val_col').val(get_font_color);
          $('#font_color_val_col').each(function(){
            $(this).wpColorPicker({
              change: function(event,ui){
                var hexcolor = $(this).wpColorPicker('color');
                $this_col.css('color',hexcolor);  
                var col_font_color = hexcolor;
                pmpt_update_col( col_font_color, "color" ); 
              }
            });
          });
          
        break;
        case "pmpt_back_color_col":
          //$('#pmpt_b .wp-picker-container').show();
          $('.pmpt_b_color').click();
          var get_back_color;
          get_back_color = $this_col.css('background-color');
          if(pmpt_temp_type == 'STEPS'){
            get_back_color = $this_col.find('.pmpt_header').css('background-color');
          }
          var pmpt_get_back_color = rgb2hex(get_back_color);
          $('#back_color_val_col').val(pmpt_get_back_color);  
          $('#back_color_val_col').each(function(){
            $(this).wpColorPicker({
              change: function(event,ui){
                var hexcolor = $(this).wpColorPicker('color');
                if(pmpt_temp_type == 'STEPS'){
                  $this_col.find('.pmpt_header').css('background-color',hexcolor);  
                }else{                  
                  $this_col.css('background-color',hexcolor); 
                }           
                var col_background_color = hexcolor;
                pmpt_update_col( col_background_color, "background_color" ); 
              }
            });
          });
        break;  

        case "pmpt_col_border":
          $('#pmpt_shadow_options').hide();
          $('#border_options').toggle();
          $('#pmpt_col_border_color').wpColorPicker();
          $('#pmpt_b_c .wp-color-result').attr('title','Border-Color');
          var get_border   = $this_col.css('border');
          if(get_border){
            var split_border = get_border.split(" ");
            $('#pmpt_width_slider').val(split_border[0].slice(0,-2));
            $('#pmpt_border_display').text(split_border[0].slice(0,-2));
            var bod_color = split_border[2]+split_border[3]+split_border[4];
            $('#pmpt_b_c .wp-color-result').css('background-color',bod_color);
            var pmpt_bod_color = rgb2hex(bod_color);
            $('#pmpt_col_border_color').val(pmpt_bod_color);
            $("#pmpt_border_color_show").text(pmpt_bod_color);
          }
          var get_radius = $this_col.css('border-radius');
          if(get_radius){
            $('#pmpt_radius_slider').val(get_radius.slice(0,-2));
            $('#pmpt_radius_display').text(get_radius.slice(0,-2));  
          }
          if($('#pmpt_f .wp-color-result').hasClass('wp-picker-open')){
            $('#pmpt_f .wp-color-result').click();
          }
          if($('#pmpt_b .wp-color-result').hasClass('wp-picker-open')){
            $('#pmpt_b .wp-color-result').click();
          }
          $('#pmpt_col_border_color').each(function(){
            $(this).wpColorPicker({
              change: function(event,ui){
                var hexcolor = $(this).wpColorPicker('color');
                $this_col.css('border-color', hexcolor);  
                var pmpt_b_clr = hexcolor;
                pmpt_update_col( pmpt_b_clr, "border_color" ); 
              }
            });
          });
        break;  

        case "pmpt_col_shadow":
          $('#pmpt_shadow_options').toggle();
          $('#border_options').hide();
          if($('#pmpt_f .wp-color-result').hasClass('wp-picker-open')){
            $('#pmpt_f .wp-color-result').click();
          }
          if($('#pmpt_b .wp-color-result').hasClass('wp-picker-open')){
            $('#pmpt_b .wp-color-result').click();
          }
          $('#blur_colorpicker').wpColorPicker();
          $('#pmpb_s_c .wp-color-result').attr('title','Shadow-color');

          var get_shadow_color;
          if(temp_params["pmpt_packages"][colmn_indx]["pmpt_featured"]==false){
            get_shadow_color = temp_params["pmpt_packages"][colmn_indx]["pmpt_style"]['box_shadow'];  
          }else{
            get_shadow_color = temp_params["pmpt_packages"][colmn_indx]["pmpt_featured_style"]['box_shadow'];  
          }
          $('#blur_colorpicker').each(function(){
            $(this).wpColorPicker({
              change: function(event,ui){
                var hexcolor = $(this).wpColorPicker('color');
                shadow_color = hexcolor;
                
              }
            });
          });
          if(get_shadow_color!=undefined){
            var get_shadow = get_shadow_color.split(' ');
            $('#hldisplay').text(get_shadow[0].slice(0,-2));
            $('#vldisplay').text(get_shadow[1].slice(0,-2));
            $('#brdisplay').text(get_shadow[2].slice(0,-2));
            $('#srdisplay').text(get_shadow[3].slice(0,-2));  
            $('#hlslider').val(get_shadow[0].slice(0,-2));
            $('#vlslider').val(get_shadow[1].slice(0,-2));
            $('#brslider').val(get_shadow[2].slice(0,-2));
            $('#srslider').val(get_shadow[3].slice(0,-2));
            $('#blur_colorpicker').val(shadow_color);
            $("#pmpt_shadow_color_show").text(get_shadow[4]);

          } else{
            $('#hldisplay').text(0);
            $('#vldisplay').text(0);
            $('#brdisplay').text(0);
            $('#srdisplay').text(0);  
            $('#hlslider').val(0);
            $('#vlslider').val(0);
            $('#brslider').val(0);
            $('#srslider').val(0);
            $('#blur_colorpicker').val(0);
            $("#pmpt_shadow_color_show").text(0);
          }
        break;  
      }
    });

    $pmpt_column_editor.on("change", '.pmpt_col_change', function(e){ // all the change events
      e.stopPropagation();
      var col_change_case = $(this).attr('id'); 
      switch (col_change_case) {

        case "pmpt_col_fontname":
          var get_font_name = $(this).val();  
          $this_col.css('font-family', get_font_name);
          pmpt_col_font_links( get_font_name, colmn_indx );
          pmpt_update_col( get_font_name, "font_family" ); 
        break;

        // case "font_color_val_col":
        //   $this_col.css('color',$(this).val());   
        //   var col_font_color = $(this).val();
        //   pmpt_update_col( col_font_color, "color" ); 
        // break;

        // case "pmpt_col_border_color":
        //   var pmpt_b_clr = $(this).val();
        //   $this_col.css('border-color', pmpt_b_clr);  
        //   $("#pmpt_border_color_show").text(pmpt_b_clr);
        //   pmpt_update_col( pmpt_b_clr, "border_color" ); 
        // break;  

        case "blur_colorpicker":
          update_box_shadow();
        break;  

        case "pmpt_col_fontsize":
          var pmpt_fsize = $(this).val() + 'px';
          $this_col.css('font-size', pmpt_fsize);          
          pmpt_update_col(pmpt_fsize, 'font_size');
        break;  
      }
    });
    
    $pmpt_column_editor.on("input", '.pmpt_col_slider', function(e){ // all the click events
      e.stopPropagation();
      var col_range_case = ($(this).hasClass('pmpt_shadow_opt'))? 'pmpt_shadow_opt': $(this).attr('id'); 
      switch (col_range_case) {
        case "pmpt_radius_slider":
          var pmpt_border_radius = $(this).val();
          $('#pmpt_radius_display').text(pmpt_border_radius);
          pmpt_border_radius = pmpt_border_radius+'px';
          $this_col.css('border-radius', pmpt_border_radius);
          pmpt_update_col( pmpt_border_radius, "border_radius" ); 
        break;

        case "pmpt_width_slider":
          var pmpt_bdr_width = $(this).val();
          $('#pmpt_border_display').text(pmpt_bdr_width); 
          var bdr_clr = $("#pmpt_col_border_color").val();
          bdr_clr = (bdr_clr)? bdr_clr : "#000000";
          $this_col.css('border', pmpt_bdr_width+'px solid '+ bdr_clr); 
          pmpt_bdr_width = pmpt_bdr_width+'px';
          pmpt_update_col( pmpt_bdr_width, "border_width" );
          pmpt_update_col( "solid", "border_style" );     
        break;
        case "pmpt_shadow_opt":
          update_box_shadow();
        break;  
      }
    });

    $("#pmpt_col_fontname").on("focusin",function(e){
      $pmpt_column_editor.find('#border_options').hide();
      $pmpt_column_editor.find('#pmpt_shadow_options').hide();
      e.stopPropagation();
    });
  }

  $(this).on('click',function(e) {
    colmn_indx = $(this).data("col-index");
    $this_col = $(".pmpt_column[data-col-index="+colmn_indx+"]");
    $( '#pmpt_button_editor' ).hide();
    $( '#pmpt_cell_editor' ).hide();
    $pmpt_column_editor.find('#border_options').hide();
    $pmpt_column_editor.find('#pmpt_shadow_options').hide();
    $pmpt_column_editor.hide();
    $('#font_color_val_col').wpColorPicker();
    $('#pmpt_f .wp-color-result').addClass('pmpt_f_color');
    // $('#pmpt_f .wp-picker-container').hide();
    $('.pmpt_f_color').attr('title','Font-Color');

    $('#back_color_val_col').wpColorPicker();
    // $('#pmpt_b .wp-picker-container').hide();
    $('#pmpt_b .wp-color-result').addClass('pmpt_b_color');
    $('.pmpt_b_color').attr('title','Background-Color');
    var position = $(this).offset();
    var fntasm_icon_val;
    $pmpt_column_editor.css({"top": position.top + parseInt($(this).height()),"left": (position.left-16)});
    $pmpt_column_editor.show();
    e.stopPropagation();

    $pmpt_column_editor.on("click",function(e){ 
      e.stopPropagation();
    });

    var get_font_name; 
    $('#pmpt_col_fontsize').val($this_col.css('font-size').slice(0,-2));
    temp_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;
    if(temp_params["pmpt_packages"][colmn_indx]["pmpt_featured"] == false){
      get_font_name = temp_params["pmpt_packages"][colmn_indx]["pmpt_style"]['font_family'];
    } else {
      get_font_name = temp_params["pmpt_packages"][colmn_indx]["pmpt_featured_style"]['font_family'];
    }
    (get_font_name != undefined)? $('#pmpt_col_fontname').val(get_font_name): $('#pmpt_col_fontname').val('select');
    if(get_font_name != undefined){
      $('#pmpt_col_fontname').val(get_font_name);
    }
    
    $(document).one("click", function(e) {
      e.stopPropagation();
      $pmpt_column_editor.find('#border_options').hide();
      $pmpt_column_editor.find('#pmpt_shadow_options').hide();
      $pmpt_column_editor.hide();
    });
  });  

  $(document).on("keydown", function(e) {
    if ( e.keyCode == 27 ) {
      $pmpt_column_editor.find('#border_options').hide();
      $pmpt_column_editor.find('#pmpt_shadow_options').hide();
      $pmpt_column_editor.hide();

    }
  });

  $('#radiusdisplay').text($('#radiusslider').val());
  $('#borderdisplay').text($('#widthslider').val());
  $('#hldisplay').text($('#hlslider').val());
  $('#vldisplay').text($('#vlslider').val());
  $('#brdisplay').text($('#brslider').val());
  $('#srdisplay').text($('#srslider').val());

  function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    var x1 = hex(rgb[1]);
    var x2 = hex(rgb[2]);
    var x3 = hex(rgb[3]);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#"+String(x1)+String(x2)+String(x3);
  }


  function pmpt_col_font_links(family, indx){
    var cur_font = family.replace(/ /g,"+");
    col_fonts[indx] = cur_font;
      var fnt_list = "";
      for(var fnt in col_fonts) {
        if(col_fonts[fnt]){
          fnt_list = fnt_list + col_fonts[fnt] + "|"; 
        }
      }
    fnt_list = fnt_list.substring(0,fnt_list.length - 1);
    var filename = "//fonts.googleapis.com/css?family="+fnt_list;     
    pmpt_col_font_link.setAttribute("href", filename);      
  } 
  
  function update_box_shadow () {
    var hlslider = $('#hlslider').val();
    var vlslider = $('#vlslider').val();
    var brslider = $('#brslider').val();
    var srslider = $('#srslider').val();
    //var shadow_color = $('#blur_colorpicker').val();
    
    $('#hldisplay').text(hlslider);
    $('#vldisplay').text(vlslider);
    $('#brdisplay').text(brslider);
    $('#srdisplay').text(srslider);  
    $('#pmpt_shadow_color_show').text(shadow_color);

    var box_css_val = hlslider+'px '+ vlslider+'px '+ brslider+'px '+ srslider+'px '+ shadow_color;
    $this_col.css('box-shadow', box_css_val);
    pmpt_update_col( box_css_val, "box_shadow" ); 
  }

  function pmpt_update_col( update_value, update_style ) {
    pmpt_params = (pmpt_params == null)? pmpt_default_params: pmpt_params;
    
    var pmpt_update_value = update_value;
    var pmpt_update_style = update_style;
    if(pmpt_params["pmpt_packages"][colmn_indx]['pmpt_featured']){
       pmpt_params["pmpt_packages"][colmn_indx]["pmpt_featured_style"][pmpt_update_style] = pmpt_update_value; 
    }else{
      pmpt_params["pmpt_packages"][colmn_indx]["pmpt_style"][pmpt_update_style] = pmpt_update_value;    
    }
    
  }
}
})(jQuery);