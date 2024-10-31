/******* Global Variables ********/

var pmpt_handlebar_template = null;
var dragging_elem = null;
var drag_item = null;
var dragging_elem_class = null;
var drag_cell_index = '';
var pmpt_pkg_len = null;
var cell_fonts = [];
var col_fonts = []; 
var pmpt_codemirror = '';
var pmpt_en_sort= 0;
/********************************/

jQuery( document ).ready( function($) { 

  
  /* ---------------------------------------------------------------------------*/
  /*                    carousel start                                          */  
  /* ---------------------------------------------------------------------------*/
    var current = 0;
    $preview = $('#preview');
    $carouselEl = $( '#pm_carousel' );
    $carouselItems = $carouselEl.children("li");
    
    carousel = $( '#pm_carousel' ).elastislide( {
      speed:1000,
      minItems : 2,
      maxItems:2,
      start:0,
      easing : 'ease-in-out',
      onClick : function( el, pos, evt ) {
        changeImage( el, pos );
        evt.preventDefault();
      },
      onReady : function() {
        changeImage( $carouselItems.eq( current ), current );
      }
    });

    function changeImage( el, pos ) {
      $preview.attr( 'src', el.data( 'preview') );
      $carouselItems.removeClass( 'current-img' );
      el.addClass( 'current-img' );
      carousel.setCurrent( pos );
    }

  /*-------------carousel end-----------------*/

  /** -------------------------------------------------------------------------**/
  /*                       handlebar custom function helpers                    */
  /** -------------------------------------------------------------------------**/
  
  Handlebars.registerHelper('container_editor',function(feature_value,flag){
    return '1';
  });
  
  Handlebars.registerHelper('column_space', function( feature_value, flag ) {
    if((feature_value == 'pmpt_overlaped' && flag) || (feature_value == 'pmpt_overlaped' && !flag)){
      return '';
    }else {
      return feature_value;
    }
  });

  Handlebars.registerHelper('overlap_space', function( feature_value, flag ) {
    if(feature_value == 'pmpt_overlaped' && flag){
      return 'pmpt_overlaped';
    }else {
      return '';
    }
  });
  
  Handlebars.registerHelper('feature_name', function( feature_list, index ) {
    return feature_list[index].pmpt_value;  
  });

  Handlebars.registerHelper('t_text', function( feature_value,index) {
    if(feature_value.toLowerCase() == 'yes' || feature_value.toLowerCase()=='no'){
      return 'pmpt_hide_cell';
    } else if(feature_value != 'yes' || feature_value !='no'){
      return  'pmpt_show_cell';
    }
  });
  
  Handlebars.registerHelper('t_icon', function( feature_value, icon_no ) {
    if(feature_value.toLowerCase() == 'yes'){
      return  'icon-pmpt-ico-check'+ icon_no;
    }else if(feature_value.toLowerCase() == 'no'){
      return 'icon-pmpt-ico-cross'+ icon_no;    
    } 
  });
 
 
  /** -------------------------------------------------------------------------**/
  /*                       handlebar custom function helpers ends                  */
  /** --------------------------------------------------------------------------*/


  pmpt_in_style = document.createElement( "link" );
  pmpt_in_style.setAttribute( "rel", "stylesheet" );
  pmpt_in_style.setAttribute( "type", "text/css" );
  document.getElementsByTagName( "head" )[0].appendChild( pmpt_in_style );

  pmpt_cell_font_link = document.createElement("link");
  pmpt_cell_font_link.setAttribute("rel", "stylesheet");
  pmpt_cell_font_link.setAttribute("type", "text/css");
  document.getElementsByTagName("head")[0].appendChild( pmpt_cell_font_link );

  pmpt_col_font_link = document.createElement("link");
  pmpt_col_font_link.setAttribute("rel", "stylesheet");
  pmpt_col_font_link.setAttribute("type", "text/css");
  document.getElementsByTagName("head")[0].appendChild( pmpt_col_font_link );

  pmpt_inline_font_link = document.createElement("link");
  pmpt_inline_font_link.setAttribute("rel", "stylesheet");
  pmpt_inline_font_link.setAttribute("type", "text/css");
  document.getElementsByTagName("head")[0].appendChild( pmpt_inline_font_link );

  pmpt_custom_style = document.createElement("STYLE");
  pmpt_custom_style.setAttribute("id", "pmpt_custom_style");
  pmpt_custom_style.type = 'text/css';
  document.getElementsByTagName('head')[0].appendChild(pmpt_custom_style);

  pmpt_custom_inline_style = document.createElement("STYLE");
  pmpt_custom_inline_style.setAttribute("id", "pmpt_custom_inline_style");
  pmpt_custom_inline_style.type = 'text/css';
  document.getElementsByTagName('head')[0].appendChild(pmpt_custom_inline_style);
  
  pmpt_codemirror = CodeMirror.fromTextArea(document.getElementById("pmpt_custom_css"), {
                      lineNumbers: true,
                      mode: "css"
                    });
  

  
  jQuery("#pmpt_add_custom_css").on("click",function(event){
    event.preventDefault();
    jQuery("#pmpt_form_table").find(".CodeMirror").toggle();
  });
  
  jQuery("#pmpt_form_table").find(".CodeMirror").hide(); 

  pmpt_codemirror.on("blur", function(pmpt_codemirror){
    var pmpt_icss = pmpt_codemirror.getValue();
    if (pmpt_custom_style.styleSheet){
        pmpt_custom_style.styleSheet.cssText = pmpt_icss;
    } else {
        pmpt_custom_style.appendChild(document.createTextNode(pmpt_icss));
    }
    document.getElementsByTagName('head')[0].appendChild(pmpt_custom_style);
  });
  
  jQuery("#pmpt_form_table").on("click",'.pmpt_ttype',function(){
    if(jQuery(".pmpt_container").length > 0){
      var col_style = jQuery(this).attr("id");
      if(pmpt_params != null){
        pmpt_params['pmpt_ttype'] = col_style;
      }else{
        pmpt_default_params['pmpt_ttype'] = col_style;
      }
      pmpt_compile_template();
    }else{
      alert("select base template");
    }
  });
  
  jQuery('#pmpt_enable_sort').attr('checked', false);  

  jQuery( "#pmpt_enable_sort" ).on("click",function() {
    if(jQuery(".pmpt_container").length > 0){
      pmpt_en_sort = jQuery(this).val();

      if ( pmpt_en_sort == 0 ) {
        jQuery(this).val("1"); // enable sorting
       pmpt_compile_template();  
        pmpt_en_sort = 1;
      } else if(pmpt_en_sort == 1) {
        $(this).val("0"); // disable sorting
        pmpt_en_sort = 0;
        pmpt_compile_template();  
      }
    }else{
      alert("Select base template first!");
      return false;
    }
  });
  
  if(pmpt_params != null){ // edit template
    var template_name = pmpt_params.pmpt_base_template;
    pmpt_temp_type = pmpt_params.pmpt_temp_type;
    var edit_custom_css = pmpt_params.pmpt_custom_css;
        
    if(pmpt_temp_type == 'MATRIX'){
      var tc = pmpt_params.pmpt_tc;
      jQuery('#pmpt_used_tc span:first').removeClass().addClass('icon icon-pmpt-ico-check'+tc);
      jQuery('#pmpt_used_tc span:last').removeClass().addClass('icon icon-pmpt-ico-cross'+tc);
      jQuery('#pmpt_tick_cross_con').show();
    } else {
      jQuery('#pmpt_tick_cross_con').hide();
    }

    var filename = pmpt_plugin_url+'templates/'+template_name+"/style.css";
    pmpt_in_style.setAttribute( "href", filename ); 

    jQuery( '#ajax_load_temp' )
      .html( "<div class = 'pm_loading' style = 'width:100%; height:300px; background:url( "+pmpt_plugin_url+"images/loading.gif"+" ) no-repeat scroll center;'>&nbsp;</div>")
      .show();

    jQuery.post( wp_admin_url + "?action=pmpt_load_template", {"temp_name":template_name}, function( result ) {
      pmpt_handlebar_template = result;

      jQuery.post( wp_admin_url + "?action=inlinecss_for_edit_template", {"pmpt_params": pmpt_params},function( inlinecss){
        var cssinline = jQuery.parseJSON(inlinecss);
        var gfonts = cssinline.pmpt_gfonts;
        var fnt_list="";
        for(var fnt in gfonts) {
          if(gfonts[fnt]){
            fnt_list = fnt_list + gfonts[fnt] + "|";    
          }          
        } 
        fnt_list = fnt_list.substring(0,fnt_list.length - 1);
        var inline_cusotm_css = cssinline.pmpt_custom_css;
        if(fnt_list != ''){
          pmpt_custom_style.appendChild(document.createTextNode("@import url('http://fonts.googleapis.com/css?family="+fnt_list+"');"));  
        }
        
        pmpt_custom_style.appendChild(document.createTextNode(inline_cusotm_css));
        document.getElementsByTagName('head')[0].appendChild(pmpt_custom_style);
      });

      if(String(edit_custom_css) != ""){
        var pmpt_codemirror_value = edit_custom_css; 
      } else{
        var pmpt_codemirror_value = ""; 
      }
      pmpt_codemirror.setValue(pmpt_codemirror_value);
      pmpt_compile_template();    
      jQuery('#pmpt_clear_json').hide();
    });  
  }
 
  jQuery( "#pm_carousel" ).on('click','a', function(event){
    event.stopPropagation();
    jQuery(document).click();
    var template_name = this.id;
    
    pmpt_default_params = (function () {
      var pmpt_json = null;
      jQuery.ajax({
        'async': false,
        'global': false,
        'url': pmpt_plugin_url+'templates/'+template_name+"/template.json?v=1",
        'dataType': "json",
        'success': function (data) {
          pmpt_json = data;
        }
      });
      return pmpt_json;
    })(); 
    
    pmpt_temp_type = pmpt_default_params.pmpt_temp_type;
    if(pmpt_params != null){
      if(pmpt_temp_type != pmpt_params['pmpt_temp_type']){
        pmpt_params['pmpt_temp_type'] = pmpt_temp_type;
      }
    }
    var pmpt_col_type = (pmpt_params != null)? pmpt_params.pmpt_ttype : pmpt_default_params.pmpt_ttype;
    
    var pmpt_con_width = jQuery("#pmpt_con_width").val();
    var pmpt_tmargin = jQuery("#pmpt_tmargin").val();
    var pmpt_bmargin = jQuery("#pmpt_bmargin").val();
    
    jQuery("#base_temp_name").val(template_name);

    pmpt_default_params.pmpt_con_width = pmpt_con_width;
    pmpt_default_params.pmpt_tmargin = pmpt_tmargin;
    pmpt_default_params.pmpt_bmargin = pmpt_bmargin;
    
    jQuery('.pmpt_ttype').removeClass('pmpt_active_col_type');
    jQuery("#"+pmpt_col_type).addClass('pmpt_active_col_type');
    jQuery("#pmpt_ttype").val(pmpt_col_type);
    
    if(pmpt_temp_type == 'MATRIX'){
      var tc = (pmpt_params != null ) ? pmpt_params.pmpt_tc : pmpt_default_params.pmpt_tc;
      if(tc < 7){
        jQuery('#pmpt_used_tc').empty().append("<span class='icon icon-pmpt-ico-check"+tc+"'></span><span class='icon icon-pmpt-ico-cross"+tc+"'></span>");
      }else{
        jQuery('#pmpt_used_tc').empty().append("<span class='icon icon-pmpt-ico-check"+tc+"'></span>");
      }
      jQuery('#pmpt_tick_cross_con').show();
    }else{
      jQuery('#pmpt_tick_cross_con').hide();
    }
         
    var filename = pmpt_plugin_url+'templates/'+template_name+"/style.css";
    pmpt_in_style.setAttribute( "href", filename ); 
    jQuery( '#ajax_load_temp' )
    .html( "<div class = 'pm_loading' style = 'width:100%; height:300px; background:url( "+pmpt_plugin_url+"images/loading.gif"+" ) no-repeat scroll center;'>&nbsp;</div>")
    .show();
    jQuery.post( wp_admin_url + "?action=pmpt_load_template", {"temp_name":template_name}, function( result ) {
      pmpt_handlebar_template = result;
      pmpt_compile_template();    
    });       
  });
  
  jQuery("#pmpt_used_tc").on("click",function(e) {
    e.stopPropagation();
    jQuery("#pmpt_tick_cross").show();
  });  

  jQuery("#pmpt_tick_cross li").on("click",function(e) {
    var tc = jQuery(this).data('tc');
    if(pmpt_params != null) {
      pmpt_params['pmpt_tc'] = tc;  
    } else {
      pmpt_default_params['pmpt_tc'] = tc;
    }
    
    jQuery("#pmpt_used_tc").html(jQuery(this).html());
    var check_class = "tick_icon icon icon-pmpt-ico-check"+tc;
    var cross_class = "tick_icon icon icon-pmpt-ico-cross"+tc;
    jQuery( ".pmpt_cell span[class^='tick_icon icon icon-pmpt-ico-check']").removeClass().addClass(check_class);
    jQuery( ".pmpt_cell span[class^='tick_icon icon icon-pmpt-ico-cross']").removeClass().addClass(cross_class);  
  });

  jQuery(document).on("click", function() {
    jQuery("#pmpt_tick_cross").hide();
  });

  jQuery(document).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) {
     jQuery("#pmpt_tick_cross").hide();
    }
  }); 

  jQuery(".pmpt_ttype").on("click",function(event) {
      var ttype = jQuery(this).attr("id");
      jQuery('.pmpt_ttype').removeClass('pmpt_active_col_type');
      jQuery(this).addClass('pmpt_active_col_type');
      jQuery("#pmpt_ttype").val(ttype);
  });

  jQuery( "#pmpt_add_column" ).on( "click", function( event ) {
    if(jQuery("#pmpt_container_1").length > 0){
      var pmpt_col_len = (pmpt_params != null)? pmpt_params["pmpt_packages"].length : pmpt_default_params["pmpt_packages"].length; 

      if(pmpt_col_len <= 5){
        add_column();  
      }else{
        alert("Sorry! You cannot add more than 6 packages");
      }
    } else{
      alert("Select base template first!");
    }
  });
   
  jQuery( "#pmpt_add_row" ).on( "click", function( event ) {
    if(jQuery("#pmpt_container_1").length > 0){
      add_row();
    } else{
      alert("Select base template first!");
    }
  });  

  jQuery("body" ).on( "click", ".edit_img", function(e){
    e.stopPropagation();
    e.preventDefault();
    
    jQuery(document).trigger('click');
    var id = jQuery(this).attr('id');
    var col_indx = id.split("_").pop();
    var media_pick_shown = (jQuery('.media-modal').is(':visible')) ? true : false;
            e.preventDefault();
            if(media_pick_shown == false) {
              var file_frame;
              file_frame = wp.media.frames.file_frame = wp.media({
                title: jQuery( this ).data( 'uploader_title' ),
                button: {
                  text: jQuery( this ).data( 'uploader_button_text' ),
                },
                multiple: false
              });
              file_frame.on( 'select', function() {
                var attachment = file_frame.state().get('selection').first().toJSON();
                jQuery("body").find(".chg_img_"+col_indx).attr("src",attachment.url);
                pmpt_params = (pmpt_params != null)? pmpt_params: pmpt_default_params;
                
                pmpt_params["pmpt_packages"][col_indx]["pmpt_img_url"]["pmpt_value"] = attachment.url;
                
                file_frame.remove();
                pmpt_compile_template();
              });     
              file_frame.open();
            }          
  });

  jQuery( "body" ).on( "click", ".delete_img",function(e){
    var id =  jQuery(this).attr('id');
    var col_indx = id.split("_").pop();
    jQuery("ul").remove("#img_ctrl_"+col_indx);
    if(pmpt_params != null) {
      pmpt_params["pmpt_packages"][col_indx]["pmpt_img_url"]["pmpt_value"] = "";
    } else{ 
      pmpt_default_params["pmpt_packages"][col_indx]["pmpt_img_url"]["pmpt_value"] = "";
    }
    pmpt_compile_template();
  });

  jQuery( "body" ).on( "click", ".remv_col", function( e ) {
    var rmv_col_indx = jQuery(this).data("col-index");
    var delete_col = confirm("This Package will be permanently deleted, Are you sure you want to continue?");
    if(delete_col){
      remove_column( rmv_col_indx );        
    }else{
      return false;
    }
  });

  jQuery( "body" ).on( "click", ".col_ftrd", function( e ) {
    var col_ftrd = jQuery(this).data("col-index");
    var action;
    if(jQuery(this).hasClass('pmpt_active_ftrd_col')){
      jQuery(this).removeClass('pmpt_active_ftrd_col');
      action = 'unset';
    }
     set_featured_col(col_ftrd,action);    
  });

  jQuery( "body" ).on( "click", ".remv_cell", function( e ) {
    var rmv_cell_indx = jQuery(this).data("cell-index");
    var delete_cell = confirm("This Feature will be permanently deleted, Are you sure you want to continue?");
    if(delete_cell){
       remove_row(rmv_cell_indx);    
    }else{
      return false;
    }
  });
 
  jQuery("body").on("click",".col_copy",function(e){
    var col_copy = jQuery(this).data("col-index");
    pmpt_params = (pmpt_params != null)?pmpt_params : pmpt_default_params;
    var duplicate_column = JSON.parse(JSON.stringify( pmpt_params['pmpt_packages'][col_copy] )); 
    pmpt_params.pmpt_packages.push(duplicate_column); 
    pmpt_compile_template();
  });

  jQuery("#pmpt_cont_width").on('blur','input', function(){
    if(jQuery("#pmpt_container_1").length > 0){
      var pmpt_case = jQuery(this).attr('id');
      var temp_params =  (pmpt_params != null)? pmpt_params : pmpt_default_params;
      
      switch (pmpt_case){
        case 'pmpt_con_width':
          var pmpt_con_width =  jQuery(this).val().trim(); 
          temp_params.pmpt_con_width = pmpt_con_width;
          if(pmpt_params != null) {
            pmpt_params  = temp_params;
          } else{ 
            pmpt_default_params = temp_params; 
          }
          pmpt_compile_template();
          break;
        case 'pmpt_tmargin':
          var pmpt_tmargin =  jQuery(this).val().trim(); 
          temp_params.pmpt_tmargin = pmpt_tmargin;
          if(pmpt_params != null) {
            pmpt_params  = temp_params;
          } else{ 
            pmpt_default_params = temp_params; 
          }
          pmpt_compile_template();
          break;
        case 'pmpt_bmargin':
          var pmpt_bmargin =  jQuery(this).val().trim(); 
          temp_params.pmpt_bmargin = pmpt_bmargin;
          if(pmpt_params != null) {
            pmpt_params  = temp_params;
          } else{ 
            pmpt_default_params = temp_params; 
          }
          pmpt_compile_template();
          break;          
      }
    }
  });


  /* -------------------------------------------------------------------------*/
    jQuery("body").on("click","#pmpt_clear_json",function(){
      var pmpt_temp_type;
      var pmpt_pkg_btn;
      var clear_pmpt_data = confirm("Warning! Clearing data will remove all the existing text along with any additional packages. Do you still want to go ahead?");
      if(clear_pmpt_data){
        if(pmpt_params != null) {
          pmpt_temp_type = pmpt_params.pmpt_temp_type;
          pmpt_pkg_btn = pmpt_params['pmpt_packages'][0]['pmpt_button'];
          pmpt_params = null;
        } else{
          pmpt_temp_type = pmpt_default_params.pmpt_temp_type;
          pmpt_pkg_btn = pmpt_default_params['pmpt_packages'][0]['pmpt_button'];
          pmpt_default_params = null;
        } 
        pmpt_params = {  
              "pmpt_temp_type" : pmpt_temp_type,
              "pmpt_base_template": "", 
              "pmpt_tname": "",
              "pmpt_ttype": "pmpt_attached",
              "pmpt_tmargin": "0",
              "pmpt_bmargin": "0",
              "pmpt_con_width" : "960",
              "pmpt_tc":"1", 
              "pmpt_custom_css": "",
              "pmpt_bs_cls": "",
              "pmpt_features_list":[ 
                                { 
                                  "pmpt_value": "Feature Name",
                                  "pmpt_style": {},
                                  "pmpt_tooltip": ""
                                }
                              ],
              "pmpt_matrix_box": {
                              "pmpt_value": "Choose Your Plan",
                              "pmpt_style": {},
                              "pmpt_tooltip": ""
                            },
              "pmpt_packages":[
                              {
                                "pmpt_main_heading": {
                                  "pmpt_value": "Single",
                                  "pmpt_style": {},
                                  "pmpt_tooltip": ""
                                },

                                "pmpt_sub_heading": { 
                                   "pmpt_value": "For New Users",
                                   "pmpt_style": {},
                                   "pmpt_tooltip": ""
                                },

                                "pmpt_price": { 
                                   "pmpt_value": "free", 
                                   "pmpt_style": {},
                                   "pmpt_tooltip": ""
                                },

                                "pmpt_subscription_type": { 
                                   "pmpt_value": "Monthly",
                                   "pmpt_style": {},
                                   "pmpt_tooltip":""
                                },

                                "pmpt_button": pmpt_pkg_btn,

                                "pmpt_img_url": { 
                                   "pmpt_value": "",
                                   "pmpt_style": {},
                                   "pmpt_tooltip":""
                                },

                                "pmpt_featured":false,

                                "pmpt_features": [
                                  {
                                    "pmpt_value": "",
                                    "pmpt_style": {},
                                    "pmpt_tooltip": ""
                                  },

                                 
                                ],
                                "pmpt_style" : {},
                                "pmpt_featured_style":{}
                              }
              ]
        }
      }else{
        return false;
      }
     
      pmpt_compile_template();
    });
  /* -------------------------------------------------------------------------*/



});

jQuery("#pmpt_save_btn").on("click", function() { 
  jQuery(document).click();

  if(jQuery("#pmpt_container_1").length > 0){
    pmpt_params = (pmpt_params != null)? pmpt_params : pmpt_default_params;
    
    var pmpt_tname = jQuery("input#temp_name").val().trim();
    if ( pmpt_tname == "" ){
     alert("Enter the Template name");
     return false;
    } 
    
    hidden=document.createElement("input");
    hidden.setAttribute("type", "hidden");
    hidden.setAttribute("name", "params");
    jQuery("#temp_name").append(hidden);
    
    if(jQuery("#pmpt_con_width").val() != "") { pmpt_params["pmpt_con_width"] = jQuery("#pmpt_con_width").val().trim(); } else {  pmpt_params["pmpt_con_width"] = "960";}
    if(jQuery("#pmpt_tmargin").val() != "") { pmpt_params["pmpt_tmargin"] = jQuery("#pmpt_tmargin").val().trim(); } else {  pmpt_params["pmpt_tmargin"] = "0";}
    if(jQuery("#pmpt_bmargin").val() != "") { pmpt_params["pmpt_bmargin"] = jQuery("#pmpt_bmargin").val().trim(); } else {  pmpt_params["pmpt_bmargin"] = "0";}

    pmpt_params["pmpt_tname"] = pmpt_tname;
    pmpt_params["pmpt_base_template"] = jQuery("#base_temp_name").val();

    var pmpt_code = pmpt_codemirror.getValue();
    
    pmpt_params["pmpt_custom_css"] = String(pmpt_code);
    
    
    var json_params = JSON.stringify(pmpt_params);
    hidden.setAttribute("value", json_params);
    document.forms["pmpt_form"].submit();
  }else{
    alert("Select base template first!");
  }

});

function pmpt_compile_template() {
  
  var templateCompile = Handlebars.compile( pmpt_handlebar_template );
 var templateParams  = (pmpt_params != null)? pmpt_params : pmpt_default_params; 
// var templateParams  = (pmpt_params != null)? pmpt_params : pmpt_default_params; 
  gen_bs_classes(templateParams); // adding bootstrap classes for columns

  var result = templateCompile( templateParams );   

  jQuery( "#pmpt_container_1 div[class^='pmpt_']").each(function(){
      var tooltip = jQuery(this).attr("data-tooltip");
      if(tooltip){
        jQuery(this).append('<span class="pmpt_cell_tooltip" data-tooltip="'+tooltip+'"><i class="fa fa-info-circle"></i></span>');
      }
  });
  jQuery( "#ajax_load_template" ).html( result ).show( "fast", function() {   
    
    load_fonts_inlinecss();


    /*--------checking image src on templates load--------*/

      jQuery(".chg_img[src='']").each(function(){
        jQuery(this).hide();
      });
    
    /*--------end of checking image src on templates load--------*/
    
    jQuery("#pmpt_container_1").css({"max-width":templateParams.pmpt_con_width+'px',"margin-top":templateParams.pmpt_tmargin+"px","margin-bottom":templateParams.pmpt_bmargin+"px"});  

    jQuery( "#pmpt_container_1 div[class^='pmpt_']:not(.pmpt_column, .pmpt_matrix_box_con, .pmpt_btn, .pmpt_img, .pmpt_header)" ).addClass( "editable" );     
    
    jQuery("ul").remove(".col_ctrl"); // remove all column controls

    jQuery(".pmpt_column:not(.pmpt_matrix_box_con)").each(function(i){
      var con_position = jQuery("#pmpt_container_1").offset();
      var col_position = jQuery(this).offset();
      var this_col = jQuery(this);
      var pmpt_active_ftrd_col = (templateParams.pmpt_packages[i].pmpt_featured)? 'pmpt_active_ftrd_col':'';            

      if(jQuery("#col_ctrl_"+i).length < 1) {
        var col_ctrl = "<ul id='col_ctrl_"+i+"' class='col_ctrl'>"+
                       "<li id='rem_col_"+i+"' class='pmpt_tooltip remv_col' data-title='Delete Package' data-col-index='"+i+"'><i class='fa fa-trash fa-1x'></i></li>" +
                       "<li id='col_set_"+i+"' class='pmpt_tooltip col_set' data-title='Settings' data-col-index='"+i+"'><i class='fa fa-sliders fa-1x'></i></li>" +
                       "<li id='col_ftrd_"+i+"' class='pmpt_tooltip col_ftrd "+pmpt_active_ftrd_col+"' data-title='Featured Package' data-col-index='"+i+"'><i class='fa fa-star fa-1x'></i></li>"+
                       "<li id='col_copy_"+i+"' class='pmpt_tooltip col_copy' data-title='Duplicate Package' data-col-index='"+i+"'><i class='fa fa-copy fa-1x'></i></li></ul>";
        jQuery(col_ctrl).appendTo('body');
        jQuery("#col_ctrl_"+i).css({"top": con_position.top - parseInt(50), "left" : col_position.left + parseInt(30)});
      }                

      if(templateParams.pmpt_packages[i].pmpt_img_url.pmpt_value != ''){
        this_col.find('.pmpt_img').remove('a');
        var pmpt_img = jQuery(this).find(".pmpt_img").offset();
        if(jQuery("#img_ctrl_"+i).length < 1) {
         var img_editor = "<ul id='img_ctrl_"+i+"' class='img_ctrl'>"+
                           "<li id='edit_img_"+i+"' class='edit_img pmpt_tooltip' data-title='Edit Image'><i class='fa fa-edit'></i></li>"+
                           "<li id='delete_img_"+i+"' class='delete_img pmpt_tooltip' data-title='Delete Image'><i class='fa fa-trash'></i></li>"+
                          "</ul";  
          jQuery(img_editor).appendTo('body'); 
        }

        var element_right = jQuery(this).find(".pmpt_img");
        var right_pos = jQuery(window).width()-element_right.width();
        jQuery("#img_ctrl_"+i).css({"top": pmpt_img.top , "right" :right_pos-pmpt_img.left+parseInt(10)});
      }else{
        this_col.find('.pmpt_img').append("<a class='edit_img pmpt_tooltip' id='edit_img_"+i+"' href='#' data-title='Size:120X120'>Add Image</a>");   
      }

    });


    jQuery("#ajax_load_template").find( ".editable" ).cell_editor();
    jQuery('.col_set').col_editor();
    jQuery("#ajax_load_template").find( ".pmpt_btn").button_editor(); 
         
    if(pmpt_temp_type != 'MATRIX'){  //cards
      jQuery(".pmpt_cell").each(function() {
        if(jQuery(this).text().trim() == '' || jQuery(this).text().trim() == 'no'){
          jQuery(this).hide();
        }
      });  
      jQuery("#ajax_load_template").on({
        mouseenter : show_features,
        mouseleave : hide_features
      }, ".pmpt_column");  
    } else { // matrix 
      jQuery("#ajax_load_template").off("mouseenter mouseleave",".pmpt_column");
      jQuery(".pmpt_cell").each(function() {
        if(jQuery(this).text().toLowerCase().trim() == '' || jQuery(this).text().toLowerCase().trim() == 'no'){
          var tc = (pmpt_params != null ) ? pmpt_params.pmpt_tc : pmpt_default_params.pmpt_tc;
          jQuery(this).find("span.tick_text").text('no').removeClass().addClass('tick_text pmpt_hide_cell');
          jQuery(this).find("span.tick_icon").removeClass().addClass('tick_icon icon icon-pmpt-ico-cross'+tc).css('display','block');
          var cell_indx = jQuery(this).data('cell-index');
          var col_indx = jQuery(this).data('col-index');
          if(pmpt_params != null){
            pmpt_params.pmpt_packages[col_indx].pmpt_features[cell_indx].pmpt_value = 'no';
          }else{
            pmpt_default_params.pmpt_packages[col_indx].pmpt_features[cell_indx].pmpt_value = 'no';
          }
        }  
      });
    }

    // update row height should be after above code block i.e. show and hide features because we are checking visibility status under update_row_height() function.
    update_row_height();  // update height of each feature with max height.
    
    jQuery("ul").remove(".cell_ctrl"); // remove all the cell controls

    var pkg_len = templateParams.pmpt_packages.length-1;
    var con_position = jQuery("#pmpt_container_1").offset(); 
    var hide_these_cells = [];
    for(var k=0; k < templateParams.pmpt_features_list.length; k++){
      var cell_ctrl = "<ul id='cell_ctrl_"+k+"' class='cell_ctrl'>"+
                        "<li id='remv_cell_"+k+"' class='pmpt_tooltip remv_cell' data-title='Delete Feature / Row' data-cell-index='"+k+"'><i class='fa fa-trash fa-1x'></i></li></ul>";
      jQuery(cell_ctrl).appendTo('body');
      
      var isVisible = jQuery("#pmpt_cell_0"+k).is(':visible');

      var cell_position;
      if(!isVisible){
        cell_position = jQuery("#pmpt_cell_0"+k).show().offset().top;
        hide_these_cells.push("#pmpt_cell_0"+k);
        
      }else{
        cell_position = jQuery("#pmpt_cell_0"+k).offset().top;  
      }

      jQuery("#cell_ctrl_"+k).css({"top": cell_position - parseInt(10), "left" : con_position.left - parseInt(30)});
      
    }
            
    for( var i= 0; i< hide_these_cells.length; i++){
      jQuery(hide_these_cells[i]).hide();
    }
    
 

 /*-----------calculate hieght of matrix template---------------*/
    
      var mat_emp_height = jQuery(".head").height();
      
      jQuery('.pmpt_mat_head_empty').css({'height':mat_emp_height+'px','line-height':mat_emp_height+'px'});
      
      if(pmpt_params != null) {
        pmpt_params.pmpt_matrix_box.pmpt_style['height'] = mat_emp_height+'px';
        pmpt_params.pmpt_matrix_box.pmpt_style['line_height'] = mat_emp_height+'px';
      } else {
        pmpt_default_params.pmpt_matrix_box.pmpt_style['height'] = mat_emp_height+'px';
        pmpt_default_params.pmpt_matrix_box.pmpt_style['line_height'] = mat_emp_height+'px';
      }
    
    /*-----------end of calculate hieght of matrix template---------------*/
  

    
    if(jQuery("#pmpt_enable_sort").val() == 1){
      pmpt_enable_sorting();
    } else {
      pmpt_disable_sorting();
    }

    jQuery('div').remove('#pmpt_clear_json');
    /*----------- clear button --------------*/
     var con_ps     = jQuery("#pmpt_container_1").offset();
     var pmpt_clear = "<div id='pmpt_clear_json' class='pmpt_add_new_actn pmpt_tooltip' data-title='Clear sample data' style='position:absolute;'>"+
                         "<i class='fa fa-trash-o'></i>&nbsp;&nbsp;Clear"+
                       "</div>";
     jQuery(pmpt_clear).appendTo('body');
     jQuery('#pmpt_clear_json').css({"top":con_ps.top-parseInt(45),"right":"50px"});
    /*------------end of clear button--------*/  
  });
}

function add_row() {
  jQuery(document).trigger('click');

  pmpt_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;
  var new_feature = window.prompt( "Enter Feature Name (hover on any package to view the feature)", "" );

  if ( new_feature != null && new_feature != "" ) {
    new_feature = new_feature.trim();
    pmpt_params['pmpt_features_list'].push({ 
                        pmpt_value: new_feature,
                        pmpt_style:{},
                        pmpt_tooltip: ""
                      });
    
    for( var i = 0; i < pmpt_params['pmpt_packages'].length; i++ ) {
      pmpt_params['pmpt_packages'][i]['pmpt_features'].push({ pmpt_value: "", pmpt_style:{}, pmpt_tooltip: "" });
    }
    pmpt_compile_template();
  }else{
    alert('Feature Name Cannot Be Blank');
  } 
}

function add_column() {
  jQuery(document).trigger('click');
  var new_col_indx = '';
  pmpt_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;
  var pmpt_pkg_btn =  JSON.parse(JSON.stringify(pmpt_params["pmpt_packages"][0]["pmpt_button"]));
   
  pmpt_params['pmpt_packages'].push({ 
                     "pmpt_main_heading": {
                                          "pmpt_value": "Main Heading",
                                          "pmpt_style": {},
                                          "pmpt_tooltip": ""
                                        },
                      "pmpt_sub_heading": { 
                                         "pmpt_value": "Sub Heading",
                                         "pmpt_style":{},
                                         "pmpt_tooltip": ""
                                        },
                      "pmpt_price": { 
                                   "pmpt_value": "$0", 
                                   "pmpt_style":{},
                                   "pmpt_tooltip": ""
                                  },
                      "pmpt_subscription_type": { 
                                               "pmpt_value": "Monthly",
                                               "pmpt_style":{},
                                               "pmpt_tooltip": ""
                                              },
                      "pmpt_button": pmpt_pkg_btn,
                      "pmpt_img_url": { 
                                     "pmpt_value": "",
                                     "pmpt_style":{},
                                     "pmpt_tooltip": ""
                                    },
                      "pmpt_featured": false,
                      "pmpt_features": [],
                      "pmpt_style" : {},
                      "pmpt_featured_style": {}
                  });
  new_col_indx = pmpt_params['pmpt_packages'].length-1;
  for ( var i=0; i < pmpt_params['pmpt_features_list'].length; i++ ) { 
    pmpt_params['pmpt_packages'][new_col_indx]['pmpt_features'].push( { pmpt_value: "", pmpt_style: {}, pmpt_tooltip: "" } );
  }
  pmpt_compile_template();
}

function remove_row( rmv_cell_indx ){
  pmpt_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;
  
  var ftr_list = pmpt_params["pmpt_features_list"].length;
  if( ftr_list > 1 ){
    pmpt_params["pmpt_features_list"].splice( rmv_cell_indx, 1 ); 
    var pmpt_pkgs = pmpt_params["pmpt_packages"];
    for ( var i = 0; i < pmpt_pkgs.length; i++ ) {
      pmpt_pkgs[i]['pmpt_features'].splice( rmv_cell_indx, 1 );
      for(var k = 0; k < ftr_list; k++){
        jQuery("#cell_ctrl_"+k).remove();
      }
    }
    pmpt_compile_template();  
  } else {
    alert("Cannot delete the row");
  }
}

function remove_column( rmv_col_indx ) {
  pmpt_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;
  var pkgs_len = pmpt_params["pmpt_packages"].length;
  if( pkgs_len > 1 ) {
    var pmpt_pkgs = pmpt_params["pmpt_packages"];
    pmpt_pkgs.splice( rmv_col_indx, 1 );
    for(var k = 0; k < pkgs_len; k++){
      jQuery("#col_ctrl_"+k).remove();
    }    
    pmpt_compile_template();
  } else {
    alert("Cannot delete the column");
  }
}

/** -------------------------------------------------------------------------**/
/*              HTML5  Drag n Drop Sorting                                    */
/** -------------------------------------------------------------------------**/
function pmpt_enable_sorting() {
  jQuery("#pmpt_container_1").find( ".pmpt_cell:hidden" ).each(function(){
    if(jQuery(this).text().trim() == '' || jQuery(this).html().trim() == ''){
      var show_feature = jQuery(this).data("feature");
      jQuery(this).append("<span class='pmpt_highlite_feature'>"+show_feature+"<span>").show();
    }
  });  
  
  jQuery(".pmpt_column").each(function(i){
    var this_col = jQuery(this);
    var position =  this_col.offset();
            
    if(jQuery("#drag_col_"+i).length == 0 && this_col.data("col-index") == i) {
      var drag_ctrl = "<li id='drag_col_"+i+"' class='pmpt_sort_handle drag_col pmpt_tooltip' data-title='Sort' data-col-index='"+i+"' draggable='true'><i class='fa fa-sort fa-rotate-90'></i></li>";
      jQuery(drag_ctrl).appendTo("#col_ctrl_"+i);
      
      jQuery("#drag_col_"+i).on( {
        dragstart: drag_start,
        dragend: drag_end
      });
    }

    this_col.off('dragover').on({                        
      dragover: drag_over
    });                 
  });


  jQuery(".pmpt_cell").each(function(i){
    var this_cell = jQuery(this); 
    var position =  this_cell.offset();
           
    if(jQuery("#drag_cell_"+i).length == 0 && this_cell.data("cell-index") == i) {
      var drag_ctrl = "<li id='drag_cell_"+i+"' class='pmpt_sort_handle drag_cell pmpt_tooltip' data-title='Sort' data-cell-index='"+i+"' draggable='true'><i class='fa fa-sort'></i></li>";
      jQuery(drag_ctrl).appendTo("#cell_ctrl_"+i);
      
      jQuery("#drag_cell_"+i).on({                                         
        dragstart: drag_start,
        dragend: drag_end
      });
    }        

    this_cell.off('dragover').on({                              
        dragover: drag_over
      });
  });

  jQuery('body').off('dragover drop','.col_placeholder');
  jQuery('body').off('dragover drop','.cell_placeholder');
  
  jQuery('body').on({drop:drag_drop, dragover:drag_over}, '.col_placeholder');
  jQuery('body').on({drop:drag_drop, dragover:drag_over}, '.cell_placeholder');
  
  if(pmpt_temp_type == 'MATRIX'){
    jQuery(".pmpt_feature").off('dragover').on({                              
        dragover: drag_over
      });
  }
  
  jQuery(".drag_col, .drag_cell").show(); 
  jQuery(".remv_cell, .remv_col, .col_set, .col_ftrd, .col_copy").hide();
  
}

function pmpt_disable_sorting() {
  jQuery("#pmpt_container_1").find(".pmpt_column" ).off("drag_enter drag_over drag_leave drag_drop");   
  jQuery("#pmpt_container_1").find( ".pmpt_cell" ).off("drag_enter drag_over drag_leave drag_drop");

  jQuery(".drag_col, .drag_cell").hide(); 
  jQuery(".remv_cell, .remv_col, .col_set, .col_ftrd").show();
}

function drag_start( event ) {
  
  event.stopPropagation();
  pmpt_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;
    
  dragging_elem = jQuery(this);
  dragging_elem_class = ( dragging_elem.hasClass( "drag_col" ) )? "pmpt_column": "pmpt_cell"; 

  event.originalEvent.dataTransfer.effectAllowed = 'move';
  dragImage = document.createElement( "div" );

  if ( dragging_elem_class == "pmpt_cell"  ) {  // dragged source is a cell so unbind events for column
    jQuery(".pmpt_column" ).off( "dragenter dragover dragleave drop");
    drag_cell_index = dragging_elem.data( "cell-index" );
    jQuery(".editable[data-cell-index='"+drag_cell_index+"']") // editable is used to select both cell and feature
      .each(function( cell_indx ){
        var cell_width = jQuery(this).width();
        var cell_height = jQuery(this).height();
        jQuery(dragImage).css({'background':'rgba(0,0,0, 0.1)','display':'inline-block','height':cell_height+'px'}); 
        jQuery(dragImage).append(jQuery(this).clone(true).css({'display':'inline-block','float':'left','margin': '5px', 'width':cell_width+'px','border':'1px solid #ddd'}));
      });         
    jQuery(".editable[data-cell-index='"+drag_cell_index+"']").hide();  
      
    setTimeout( function() { dragImage.parentNode.removeChild( dragImage ) } );
    document.body.appendChild( dragImage );
    event.originalEvent.dataTransfer.setDragImage( dragImage, 0, 20 );
    event.originalEvent.dataTransfer.setData( 'text/html', drag_cell_index );
  
  } else if ( dragging_elem_class == "pmpt_column"  ) {
    jQuery( ".pmpt_cell" ).off( "dragenter dragover dragleave drop" )
      drag_col_index = dragging_elem.data( "col-index" ); 
      drag_item = jQuery(".pmpt_column[data-col-index='"+drag_col_index+"']").get(0);

      var col_height = Math.round(jQuery( drag_item ).height()/5);
      var col_width = Math.round(jQuery( drag_item ).width()/2);
     
      jQuery(dragImage).css({'width':jQuery( drag_item ).width()+'px','display':'block'});
      jQuery(dragImage).append(jQuery(drag_item).clone(true));
      jQuery(drag_item).parent().hide();
     
      setTimeout( function() { dragImage.parentNode.removeChild( dragImage ) } );
      document.body.appendChild( dragImage );
      event.originalEvent.dataTransfer.setDragImage( dragImage, (col_width-20), col_height);
      event.originalEvent.dataTransfer.setData( 'text/html', drag_col_index );
  }   
  return true;
}

function drag_over( event ) {
  
  if ( event.preventDefault ) {
    event.preventDefault();
  }
  if ( event.stopPropagation ) {
    event.stopPropagation();
  } else {
    event.cancelBubble = false;
  } 
   
  event.originalEvent.dataTransfer.dropEffect = 'move';
  
  if ( dragging_elem_class == "pmpt_cell" ) {
    var this_drag_cell = jQuery( this );
    var drag_over_cell = this_drag_cell.data( 'cell-index' ); 
    
    var cell_height = this_drag_cell.outerHeight();
    var cell_width = this_drag_cell.outerWidth();
    
    if(jQuery(".cell_placeholder").data('cell-index') != drag_over_cell){
      jQuery(".cell_placeholder").remove();     
    }

    if(jQuery(".cell_placeholder[data-cell-index = '"+drag_over_cell+"']").length < 1){
      if(drag_cell_index < drag_over_cell){
       (jQuery( '.editable[data-cell-index="'+drag_over_cell+'"]')).after("<div data-cell-index='"+drag_over_cell+"' droppable='true' class='cell_placeholder' style='width:"+(cell_width)+"px;height:"+(cell_height)+"px;border:2px dashed #333;optacity:0.75;'>");
      }else if(drag_cell_index > drag_over_cell){
       (jQuery( '.editable[data-cell-index="'+drag_over_cell+'"]')).before("<div data-cell-index='"+drag_over_cell+"' droppable='true' class='cell_placeholder' style='width:"+(cell_width)+"px;height:"+(cell_height)+"px;border:2px dashed #333;optacity:0.75;'>");
      }  
    }

  } else{     
    var drag_over_col = jQuery( this ).data( 'col-index' );
    var this_drag_col = jQuery( this );
    var col_height = this_drag_col.height();
    var col_width = this_drag_col.width();
    
    if(jQuery(".col_placeholder").data('col-index') != drag_over_col){
      jQuery(".col_placeholder").remove();     
    }
    
    if(jQuery('#drop'+drag_over_col).length < 1){
      if(drag_col_index < drag_over_col){
        (this_drag_col.parent()).after("<div id='drop"+drag_over_col+"' droppable='true' data-col-index='"+drag_over_col+"' class='col_placeholder' style='float:left;width:"+((col_width)-20)+"px;height:"+col_height+"px;border:2px dashed #333;optacity:0.75;'>");
      }else if(drag_col_index > drag_over_col){
        (this_drag_col.parent()).before("<div id='drop"+drag_over_col+"' droppable='true' data-col-index='"+drag_over_col+"' class='col_placeholder' style='float:left;width:"+((col_width)-20)+"px;height:"+col_height+"px;border:2px dashed #333;optacity:0.75;'>");
      }  
    }
  }  
  return false;
}

function drag_drop( event ){
  
  if ( event.preventDefault ) {
    event.preventDefault();
  } 
  if ( event.stopPropagation ) {
    event.stopPropagation();
  } else {
    event.cancelBubble = false;
  } 

  if ( jQuery(this).hasClass( "col_placeholder" ) ) {
    var draged_column = dragging_elem.data("col-index");
    var droped_column = jQuery(this).data("col-index");
        
    if( draged_column < droped_column ) {

      var drag_col_data = JSON.parse(JSON.stringify(pmpt_params.pmpt_packages[draged_column]));
      
      for (var move_indx = draged_column; move_indx < droped_column; move_indx++){
        var move_data = JSON.parse(JSON.stringify(pmpt_params.pmpt_packages[move_indx+1]));
        pmpt_params.pmpt_packages[move_indx] = move_data; 
      }
      
      pmpt_params.pmpt_packages[droped_column] = drag_col_data;
    
    } else if( draged_column > droped_column ) {

        var drag_col_data = JSON.parse(JSON.stringify(pmpt_params.pmpt_packages[draged_column]));
      
        for ( var move_indx = draged_column; move_indx > droped_column; move_indx-- ) {
          var move_data = JSON.parse(JSON.stringify(pmpt_params.pmpt_packages[move_indx-1]));
          pmpt_params.pmpt_packages[move_indx] = move_data;
        }

        pmpt_params.pmpt_packages[droped_column] = drag_col_data;
    }
    pmpt_compile_template();

  } else if ( jQuery(this).hasClass( "cell_placeholder" )) {
 
    drop_cell_index = jQuery(this).data( "cell-index" );
    var drag_list_string = event.originalEvent.dataTransfer.getData( 'text/html' );
    var pmpt_pkgs = pmpt_params.pmpt_packages;
    
    if( drag_cell_index < drop_cell_index ) {
      
      for( var indx in pmpt_pkgs ) {
        var drag_cell_data = JSON.parse(JSON.stringify(pmpt_pkgs[indx].pmpt_features[drag_cell_index]));

        for ( var move_indx = drag_cell_index; move_indx < drop_cell_index; move_indx++ ) {
          var move_data = JSON.parse(JSON.stringify(pmpt_pkgs[indx].pmpt_features[move_indx+1]));
          pmpt_pkgs[indx].pmpt_features[move_indx] = move_data; 
        }
        pmpt_pkgs[indx].pmpt_features[drop_cell_index] = drag_cell_data;
      }

      var drag_ftr_data = JSON.parse(JSON.stringify(pmpt_params.pmpt_features_list[drag_cell_index]));

      for ( var move_indx = drag_cell_index; move_indx < drop_cell_index; move_indx++ ) {
        var move_data = JSON.parse(JSON.stringify(pmpt_params.pmpt_features_list[move_indx+1]));
        pmpt_params.pmpt_features_list[move_indx] = move_data; 
      }
      pmpt_params.pmpt_features_list[drop_cell_index] = drag_ftr_data;  
    
    } else if( drag_cell_index > drop_cell_index ) {
       for( var indx in pmpt_pkgs ) {
        var drag_cell_data = JSON.parse(JSON.stringify(pmpt_pkgs[indx].pmpt_features[drag_cell_index]));
        for ( var move_indx = drag_cell_index; move_indx > drop_cell_index; move_indx-- ) {
          var move_data = JSON.parse(JSON.stringify(pmpt_pkgs[indx].pmpt_features[move_indx-1]));
          pmpt_pkgs[indx].pmpt_features[move_indx] = move_data;
        }
        pmpt_pkgs[indx].pmpt_features[drop_cell_index] = drag_cell_data;
      }
      var drag_ftr_data = JSON.parse(JSON.stringify(pmpt_params.pmpt_features_list[drag_cell_index]));
      for (var move_indx = drag_cell_index; move_indx > drop_cell_index; move_indx--){
        var move_data = JSON.parse(JSON.stringify(pmpt_params.pmpt_features_list[move_indx-1]));
        pmpt_params.pmpt_features_list[move_indx] = move_data; 
      }
      pmpt_params.pmpt_features_list[drop_cell_index] = drag_ftr_data;
    }
    jQuery( ".cell_placeholder[data-cell-index = '"+drag_cell_index+"']" ).remove();
    pmpt_compile_template();
  }  
  return false;
}

function drag_end( event ){
  
  if ( event.preventDefault ) {
    event.preventDefault();
  }
  if ( event.stopPropagation ) {
    event.stopPropagation();
  } else {
    event.cancelBubble = false;
  } 
  
  if( this.classList.contains( "pmpt_cell" ) ) {
    jQuery(".pmpt_column" )
    .on( {
        dragover: drag_over
      } );
  } else if( this.classList.contains( "pmpt_column" ) ) {
     jQuery( ".pmpt_cell" )
     .on( {
        dragover: drag_over
      } );
  }

  if(pmpt_temp_type == 'MATRIX'){
    jQuery(".pmpt_feature").on({                              
        dragover: drag_over
      });
  }  

  jQuery(".col_placeholder,.cell_placeholder").remove();

  if(dragging_elem_class == 'pmpt_column'){
    jQuery(drag_item).parent().show();
  }else{
    jQuery(".editable[data-cell-index='"+drag_cell_index+"']").show();  
  }
  
  return true;
}

/** -------------------------------------------------------------------------**/
/*              HTML5  Drag n Drop Sorting Ends Here                          */
/** -------------------------------------------------------------------------**/

function gen_bs_classes(templateParams) {
  var pkgs_len = templateParams.pmpt_packages.length;
  if(pkgs_len == 2){
    templateParams["pmpt_bs_cls"] = "col-xs-12 col-sm-6 col-md-6";
  }else if(pkgs_len == 3){
    templateParams["pmpt_bs_cls"] = "col-xs-12 col-sm-4 col-md-4";
  }else if(pkgs_len == 4){
    templateParams["pmpt_bs_cls"] = "col-xs-12 col-sm-3 col-md-3";
  }else if(pkgs_len == 5){
    templateParams["pmpt_bs_cls"] = "col-xs-12 col-sm-5ths col-md-5ths";
  }else if(pkgs_len == 6){
    templateParams["pmpt_bs_cls"] = "col-xs-12 col-sm-2 col-md-2";
  }    
}

function load_fonts_inlinecss () {

  var inline_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;
  jQuery.post( wp_admin_url + "?action=inlinecss_for_edit_template", {"pmpt_params": inline_params},function( inlinecss){
  
    var cssinline = jQuery.parseJSON(inlinecss);
    
    var gfonts = cssinline.pmpt_gfonts;
    var fnt_list = "";
    for(var fnt in gfonts) {
      if(gfonts[fnt]){
        fnt_list = fnt_list + gfonts[fnt] + "|";    
      }          
    } 
    fnt_list = fnt_list.substring(0,fnt_list.length - 1);
    var inline_custom_css = cssinline.pmpt_custom_css;
    jQuery('#pmpt_custom_inline_style').empty();
  
    if(fnt_list != ""){
      pmpt_custom_inline_style.appendChild(document.createTextNode("@import url('http://fonts.googleapis.com/css?family="+fnt_list+"');"));  
    }  
    pmpt_custom_inline_style.appendChild(document.createTextNode(inline_custom_css));
    document.getElementsByTagName('head')[0].appendChild(pmpt_custom_inline_style);
  });  
}
  
function show_features() {
  if(jQuery('#pmpt_cell_editor').is(':hidden') && jQuery('#pmpt_column_editor').is(':hidden') && pmpt_en_sort == 0 ){
    jQuery(this).find(".pmpt_cell:hidden").each(function(){
      if(jQuery(this).text().trim() == '' || jQuery(this).text().trim() == 'no'){
        var show_feature = jQuery(this).data("feature");
        jQuery(this).text('');
        jQuery(this).append("<span class='pmpt_highlite_feature'>"+show_feature+"<span>").show();
      }
    }); 
  }      
}

function hide_features() {
  if(jQuery('#pmpt_cell_editor').is(':hidden') && jQuery('#pmpt_column_editor').is(':hidden') && pmpt_en_sort == 0 ){

    jQuery(this).find(".pmpt_cell").each(function(){
      jQuery(this).find("span.pmpt_highlite_feature").remove();
       if(jQuery(this).text().trim() == '' || jQuery(this).text().trim() == 'no'){
         jQuery(this).hide();
       }
    });  
  }
}

function set_featured_col(col_indx,action) {
  pmpt_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;

  var ftrd_col = jQuery('body').find('.pmpt_active_ftrd_col').data('col-index');
  
  if(ftrd_col != undefined){
    ftrd_col_style = JSON.parse(JSON.stringify(pmpt_params['pmpt_packages'][ftrd_col]['pmpt_featured_style']));  
  }
    
  var pkgs_len = pmpt_params["pmpt_packages"].length;
  if(action == 'unset'){
    pmpt_params["pmpt_packages"][col_indx].pmpt_featured = false;
  }else{
    for (var i = 0; i < pkgs_len; i++ ) {
      if ( col_indx == i ) {
        pmpt_params["pmpt_packages"][i].pmpt_featured = true;  
        if(ftrd_col != undefined){
          pmpt_params['pmpt_packages'][i]['pmpt_featured_style'] = ftrd_col_style;  
        }
      } else {
        pmpt_params["pmpt_packages"][i].pmpt_featured = false;    
      }
    }
  }
  pmpt_compile_template();   
}

function update_row_height (){
  temp_params = (pmpt_params != null) ? pmpt_params : pmpt_default_params;

  var tot_cols = temp_params.pmpt_packages.length;
  var tot_rows = temp_params.pmpt_features_list.length;

  var cell_height = [];
  
    for(var r = 0; r < tot_rows; r++){ // looping through the feature list.

      cell_height = []; // cleaning up the cell height array for next loop
      var row_visibility = false;  

      for(var c=0; c<tot_cols; c++){ // looping through the columns

        var pmpt_cell = '#pmpt_cell_'+String(c)+String(r);
        
        cell_height.push(jQuery(pmpt_cell).outerHeight());
        var check_visibility = jQuery(pmpt_cell).is(':visible');  
        if(check_visibility){   // skipping false visiblity because new column will have empty cells
          row_visibility = true;
        }      
     
      }

      var ftr_cell = '.pmpt_feat_cell_'+String(r);
      cell_height.push(jQuery(ftr_cell).outerHeight());

      var max_height =  Math.max.apply(Math, cell_height);
      
      for(var c=0; c<tot_cols; c++){
        var pmpt_cell = '#pmpt_cell_'+String(c)+String(r); 
                
        if(row_visibility){ // should not add height if it's a new added row
          jQuery(pmpt_cell).css('height',max_height+'px');   
        }
                
        jQuery(ftr_cell).css('height',max_height+'px'); 
      }      
    }

    var head_height = [];
    for(var c=0; c<tot_cols; c++){
      var pmpt_col = '.head_'+String(c); 
      head_height.push(jQuery(pmpt_col).outerHeight());
    }
    var mat_emp_height =  Math.max.apply(Math, head_height);
 
    jQuery('.pmpt_mat_head_empty').css('height',mat_emp_height+'px');
}