'use strict';
(function ($) {
	var cell_indx = '';
	var col_indx = '';
	var cell_value = '';
	var text_align;
	var $this_cell = null;
	var $pmpt_cell_editor = null;
	var pmpt_saved_sel;
	var position;
	var temp_params;
	$.fn.cell_editor = function() {
		if($("#pmpt_cell_editor").length < 1){
			var cell_editr ="<ul id='pmpt_cell_editor' class='pmpt_toolbox' style='display:none'>"+
										"<li class='pmpt_text_bold pmpt_ce_edit pmpt_ce_btn pmpt_tooltip' unselectable='on' data-case='bold' data-title='Bold'><i unselectable='on' class='fa fa-bold'></i></li>"+
										"<li class='pmpt_text_italic pmpt_ce_edit pmpt_ce_btn pmpt_tooltip' data-case='italic' data-title='Italic' unselectable='on'><i unselectable='on' class='fa fa-italic'></i></li>"+
										"<li class='pmpt_text_underline pmpt_ce_edit pmpt_ce_btn pmpt_tooltip' data-case='underline' data-title='Underline' unselectable='on'><i unselectable='on' class='fa fa-underline'></i></li>"+
										"<li class='pmpt_text_strikethrough pmpt_ce_edit pmpt_ce_btn pmpt_tooltip' data-case='strikethrough' data-title='Strikethrough' unselectable='on'><i unselectable='on' class='fa fa-strikethrough'></i></li>"+
										"<li class='pmpt_text_link pmpt_ce_btn pmpt_tooltip' id='pmpt_link' data-title='Link' unselectable='on'><i unselectable='on' class='fa fa-link'></i></li>"+
										"<li class='pmpt_text_fontawesome pmpt_ce_btn pmpt_tooltip' id='pmpt_fontawesome' data-title='Font Awesome Icon'><i class='fa fa-flag'></i></li>"+
										"<li class='pmpt_text_left pmpt_ce_btn pmpt_tooltip' id='pmpt_textalign' data-case='text-align' data-title='Alignment'><i class='fa fa-align-left'></i></li>"+
										"<input type='color' id='font_color_val_cel' class='pmpt_cell_change' value='#000' title='Color'/>"+
										"<li Class='pmpt_text_font_color pmpt_ce_btn pmpt_tooltip' id='pmpt_fontcolor_icon' data-title='Font Color'><i class='fa fa-font'></i></li>"+
										
										"<li class='pmpt_text_back_color pmpt_ce_btn pmpt_tooltip' id='pmpt_backcolor_icon' data-title='Background Color'><i class='fa fa-eyedropper'></i></li>"+
										"<li class='pmpt_text_back_tooltip pmpt_ce_btn pmpt_tooltip' id='pmpt_tooltip' data-title='Tooltip'><span class='fa-stack' style='width:16px;height:16px;position:relative;top:-7px;'><i class='fa fa-comment-o fa-stack-1x'></i><i class='fa fa-question fa-stack-1x'></i></span></li>"+
										"<select class='pmpt_fontsize pmpt_cell_change ' id='pmpt_cell_fontsize' alt='fontsize'>"+
										"<option value=''>select</option>";
								      for(var fs = 8; fs <= 46; fs++){
        								cell_editr += "<option value='"+fs+"'>"+fs+"</option>"; 
      								}
      								cell_editr += "</select>"+ 	
										"<select class='select_fonts pmpt_ce_btn pmpt_cell_change' name='pmpt_fonts' id='pmpt_select_fontname' data-alt='fontname'>"+
										"<option value=''>select</option>";
											for ( var i = 0; i < pmpt_fonts.length; i++) { 
												var fam = pmpt_fonts[i]["family"];
												var variants = pmpt_fonts[i]["variants"];
												cell_editr += "<option value='"+fam+"' variants='"+variants+"'>"+fam+"</option>";
											}

									cell_editr +=	"</select>"+
										"<div id='tooltip_box'>"+
											"<span>Tooltip-Text:</span>"+
											"<input type='text' name='tooltip_text' id='tooltip_text_box'><br><input type='submit' id='tooltip_save' class='pmpt_ce_btn' value='save'>"+
										"</div>"+
										"<div id='pmpt_cell_b_color'><input type='text' id='back_color_val_cel' class='pmpt_cell_change' value='#000' title='Bacground-Color' /></div>"+
									"</ul>";	
			$(cell_editr).appendTo("body");
					
			$pmpt_cell_editor = $("#pmpt_cell_editor");

			$('.pmpt_ce_btn').mousedown(function(e){
				pmpt_saved_sel = pmpt_save_selection();
			});

			$pmpt_cell_editor.on('click','.pmpt_ce_btn',function(e){
				e.stopPropagation();
				if (pmpt_saved_sel) {
					pmpt_restore_selection(pmpt_saved_sel);
    			}
				var pmpt_cell_case = ($(this).hasClass('pmpt_ce_edit'))? 'pmpt_ce_edit': $(this).attr('id');
				$("#tooltip_box").hide();
				if($('#pmpt_cell_b_color .wp-color-result').hasClass('wp-picker-open')){
					$('.pmpt_c_bg_color').click();
				}
				switch (pmpt_cell_case){
					case "pmpt_ce_edit":
						var selected = document.getSelection();
						var a = $(this).data("case");		
					  	if(selected != '' && selected != null){
							document.execCommand(a,false,null);		
							cell_value = $this_cell.html();
							pmpt_update_params_value("pmpt_value", cell_value);
						} else {
							alert("Please select some text and then apply");
						}
					break;

					case "pmpt_link":
						var selected = document.getSelection();
						var link_val;
						if(selected != '' && selected != null){
							give_link();
						} else {
							alert('Please select text to apply link');	
						}
					break;

					case "pmpt_fontawesome":
						pmpt_save_selection();
						var get_icon_name = prompt("Enter Font Awesome Class Name");
						var html_icon = '<i class="fa '+get_icon_name+'"></i>';
						Html_caret(html_icon);
						cell_value = $this_cell.html();
						pmpt_update_params_value("pmpt_value", cell_value);
					break;					

					case "pmpt_textalign":
						var ab = $this_cell.css('textAlign');
						if (ab == 'start' || ab == 'left') {
							$this_cell.css('text-align','center');
							$(this).find('i').removeClass().addClass('fa fa-align-center');
						}else if(ab == 'center') {
							$(this).removeClass('pmpt_text_center');
							$this_cell.css('text-align','right');
							$(this).find('i').removeClass().addClass('fa fa-align-right');
						}else if(ab == 'right'){
							$(this).removeClass('pmpt_text_right');
							$this_cell.css('text-align','left');
							$(this).find('i').removeClass().addClass('fa fa-align-left');
						}
						text_align = $this_cell.css("text-align");
						pmpt_update_params_value("pmpt_style", text_align, "text_align");
					break;

					case "pmpt_fontcolor_icon":
						var select_val = document.getSelection();
						if(select_val!=''){
							$('#font_color_val_cel').trigger('click');	
							var get_color = $this_cell.css('color');
							if(get_color!=''){
								var hex_value = rgb2hex(get_color);
								$('#font_color_val_cel').val(hex_value);
							}else{
								$('#font_color_val_cel').val('#000000');
							}
						} else {
							alert('Select Some Text To Apply Color');
						}
					break;		

					case "pmpt_tooltip":
						$pmpt_cell_editor.find('#tooltip_box').show();
						var title_val = $this_cell.data('tooltip');
						$pmpt_cell_editor.find('#tooltip_text_box').val(title_val);
					break;	 

					case "pmpt_backcolor_icon":
						var get_back_color = $this_cell.css('background-color');
						$pmpt_cell_editor.css("width","400px");
						if(get_back_color!='transparent'){
							var back_color = rgb2hex(get_back_color)
							$('#back_color_val_cel').val(back_color);
						}else{
							$('#back_color_val_cel').val("#000000");
						}	
						$('.pmpt_c_bg_color').click();
						$('#back_color_val_cel').each(function(){
				            $(this).wpColorPicker({
				            	 hide: true,
				              change: function(event,ui){
				                var hexcolor = $(this).wpColorPicker('color');
				                $this_cell.css('background',hexcolor);
				                var pmpt_c_b_clr = hexcolor;
				                pmpt_update_params_value("pmpt_style", pmpt_c_b_clr, "background_color");
				              }
				            });
				        });
					break;				
					case "tooltip_save":
						var tooltip_title = $('#tooltip_text_box').val();
						if(tooltip_title != ''){
							var tooltip_text = $this_cell.data('tooltip',tooltip_title);
							$('<span class="pmpt_cell_tooltip" data-tooltip="'+tooltip_title+'"><i class="fa fa-info-circle"></i></span>').appendTo($this_cell);	
							pmpt_update_params_value("pmpt_tooltip", tooltip_title);
							pmpt_compile_template();
						}else{
							$this_cell.data('tooltip','');
							$this_cell.remove('.pmpt_cell_tooltip');
							pmpt_update_params_value("pmpt_tooltip", '');
							pmpt_compile_template();
						}
						$('#tooltip_box').fadeOut('100');
					break;  
				}
			});

  			/* -----------------------------------------------------------------------*/
			$pmpt_cell_editor.on("change", '.pmpt_cell_change', function(e){ // all the change events
	      		e.stopPropagation();
	      		var cell_change_case = $(this).attr('id'); 
	      	
	      		switch (cell_change_case) {
		
			        case "pmpt_select_fontname":
			        	
			        	var pmpt_font_family = $(this).val();
						$this_cell.css("font-family", pmpt_font_family);
						pmpt_cell_font_links( pmpt_font_family, col_indx );
						pmpt_update_params_value("pmpt_style", pmpt_font_family,"font_family");
					break;		

					case "pmpt_cell_fontsize":
						if($('#pmpt_cell_b_color .wp-color-result').hasClass('wp-picker-open')){
							$('.pmpt_c_bg_color').click();
						}
		        		var pmpt_font_size = $(this).val() + 'px';
						$this_cell.css("font-size", pmpt_font_size);
						pmpt_update_params_value("pmpt_style", pmpt_font_size,"font_size");
						pmpt_update_params_value("pmpt_style", pmpt_font_size,"line_height");
					break;		
					case "font_color_val_cel":
						document.execCommand("forecolor", false, $(this).val());
						cell_value = $this_cell.html();
						pmpt_update_params_value("pmpt_value", cell_value);
						if(pmpt_temp_type == 'MATRIX'){
							$this_cell.css('color',$(this).val());
							pmpt_update_params_value("pmpt_style", $(this).val(),'color');
						}
					break;	
	 	      	}	
	 	    });

			/* -----------------------------------------------------------------------*/
		}			

		$(this).on('click',function(e) {
			pmpt_save_selection();
			if(jQuery("#pmpt_enable_sort").val() == 1){
		  		alert("Please disable sorting to make changes");
		  		return false;
	   		}
			var  isEdit = $(this).attr("contentEditable");
			if (typeof isEdit !== typeof undefined && isEdit !== false) {
	    		return false;
	    	} else {
		 		$("#pmpt_container_1").find(".editable").removeAttr("contentEditable");

		 		if($this_cell != null && pmpt_temp_type == 'MATRIX'){
		 			
		 			$("#pmpt_container_1").find(".tick_text").removeAttr("contentEditable");
		 			
		 			var prev_col_indx = $this_cell.data('col-index');
		 			var prev_cell_indx = $this_cell.data('cell-index');
		 			var prev_item = '#pmpt_cell_'+prev_col_indx+prev_cell_indx;
			  		if($(prev_item).children('span.tick_text').text().toLowerCase().trim() == "yes" || $(prev_item).children('span.tick_text').text().toLowerCase().trim() == "no"){
						$(prev_item).children('span.tick_text').hide();
						$(prev_item).children('span.tick_icon').show();
					}	
		 		}
		 		$this_cell = $(this);
		 		col_indx = '';
		 		cell_indx = '';
		    	$('#tooltip_box').hide();
		   		$( '#pmpt_button_editor' ).hide();
				$( '#pmpt_column_editor' ).hide();
				$pmpt_cell_editor.show();
				if($('#pmpt_cell_b_color .wp-color-result').hasClass('wp-picker-open')){
					$('.pmpt_c_bg_color').click();
				}
				$('#back_color_val_cel').wpColorPicker();
				$('#pmpt_cell_b_color .wp-color-result').addClass('pmpt_c_bg_color');
				cell_indx = $this_cell.data( "cell-index" );
				col_indx = $this_cell.data( "col-index" );
				
				/* -------------------------------------------------------------------*/
				/*                       Checking for normal cell or heading cell     */   
				/*--------------------------------------------------------------------*/


				if (!$this_cell.hasClass("pmpt_cell") ) {
					$pmpt_cell_editor.css("width","400px");
					$pmpt_cell_editor.find("#pmpt_cell_fontsize").show(); 
				  $pmpt_cell_editor.find("#pmpt_select_fontname").show();
				  $pmpt_cell_editor.find("#pmpt_tooltip").hide();
				} else {
				  $pmpt_cell_editor.css("width","210px");
				  $pmpt_cell_editor.find("#pmpt_cell_fontsize").hide();
				  $pmpt_cell_editor.find("#pmpt_select_fontname").hide();
				  $pmpt_cell_editor.find("#pmpt_tooltip").show();
		    }
		    
		    if($this_cell.hasClass('pmpt_feature')){
					$pmpt_cell_editor.find("#pmpt_tooltip").show();	
				}
					
				/* -------------------------------------------------------------------*/
				/*                   Checking for normal cell or heading cell  end    */   
				/*--------------------------------------------------------------------*/
				
				temp_params = (pmpt_params!=null)?pmpt_params:pmpt_default_params;
				if($this_cell.css('font-size')){
					var get_font_size = $this_cell.css('font-size');
					$('#pmpt_cell_fontsize').val(get_font_size.slice(0,-2));
				}
				

				var get_font_name = $this_cell.css('font-family');
				if(get_font_name!=''){
					$('#pmpt_select_fontname').val(get_font_name);
				}else{
					$('#pmpt_select_fontname').val("select");
				}
				
				if(pmpt_temp_type == 'MATRIX' && $this_cell.hasClass('pmpt_cell')){
					$this_cell.attr('contentEditable',false);
					$this_cell.children('span.tick_icon').hide();
					$this_cell.children("span.tick_text").show();
					$this_cell.children('span.tick_text').attr('contentEditable',true).focus();
					var mat_emp_height = jQuery(".head").height();
    				jQuery('.pmpt_mat_head_empty').css('height',mat_emp_height);
				} else {
					$this_cell.attr('contentEditable', true);		
				}

				if($this_cell.children('.pmpt_highlite_feature').length){
					$this_cell.children('span.pmpt_highlite_feature').detach();
					$this_cell.focus();
				}

				if($this_cell.attr("data-title")){
					var title_val = $this_cell.attr('data-title');
				  	$pmpt_cell_editor.find('#tooltip_text_box').val(title_val);
				}
						
				position = $(this).offset();
				var fntasm_icon_val;
			 	
			 	$pmpt_cell_editor.css( {"top": position.top + parseInt($(this).height()), "left": (position.left) });
				e.stopPropagation();
			  	$pmpt_cell_editor.on( "click", function(e){ 
					e.stopPropagation();
				});


			  	$this_cell.on( "input", function(event){
			  		event.stopPropagation();
			  		event.cancelBubble = true;

					$pmpt_cell_editor.css( {"top": position.top + parseInt($(this).height()), "left": (position.left) });
					if(pmpt_temp_type == 'MATRIX' && $(this).hasClass('pmpt_cell')) {
						var cell_text = $(this).children('span.tick_text').text().toLowerCase().trim();
						var pmpt_tc_no = (pmpt_params != null)? pmpt_params.pmpt_tc : pmpt_default_params.pmpt_tc;
						if(cell_text == 'yes'){
							var icon_class = 'tick_icon icon icon-pmpt-ico-check'+pmpt_tc_no;
							$(this).children().last().removeClass().addClass(icon_class);
							cell_value = $(this).children('span.tick_text').text().trim();
						} else if(cell_text == 'no'){
							var icon_class = 'tick_icon icon icon-pmpt-ico-cross'+pmpt_tc_no;
					  	$(this).children().last().removeClass().addClass(icon_class);
					  	cell_value = $(this).children('span.tick_text').text().trim();
						}else{
							cell_value = $(this).children('span.tick_text').html();
						}						  	
				  		pmpt_update_params_value("pmpt_value", cell_value);	
					} else {
						cell_value = $(this).html();
						
						cell_value = cell_value.replace(/&nbsp;/g,'');
						pmpt_update_params_value("pmpt_value", cell_value);
					}
				});

				$this_cell.hover(function(){
					$(this).find('.tooltip_overlay').show();
				},function(){
					$(this).find('.tooltip_overlay').hide();
				});

		
				$(document).one("click", function() {
					$this_cell.removeAttr("contentEditable");
					$pmpt_cell_editor.hide();
					$pmpt_cell_editor.find('#tooltip_box').hide();
					if($this_cell != null && pmpt_temp_type == 'MATRIX'){
	 					var prev_col_indx = $this_cell.data('col-index');
	 					var prev_cell_indx = $this_cell.data('cell-index');
	 					var prev_item = '#pmpt_cell_'+prev_col_indx+prev_cell_indx;
			  			if($(prev_item).children('span.tick_text').text().toLowerCase().trim() == "yes" || $(prev_item).children('span.tick_text').text().toLowerCase().trim() == "no"){
							$(prev_item).children('span.tick_text').hide();
							$(prev_item).children('span.tick_icon').show();
						}	
	 				}
				});

				$(document).one("keydown", function(e) {
					if (e.keyCode === 27 ) {
		    			$this_cell.removeAttr("contentEditable");
						$pmpt_cell_editor.hide();
						$pmpt_cell_editor.find('#tooltip_box').hide();
	       				if($this_cell != null && pmpt_temp_type == 'MATRIX') {
				 			var prev_col_indx = $this_cell.data('col-index');
					 		var prev_cell_indx = $this_cell.data('cell-index');
				 			var prev_item = '#pmpt_cell_'+prev_col_indx+prev_cell_indx;
				  			if($(prev_item).children('span.tick_text').text().toLowerCase().trim() == "yes" || $(prev_item).children('span.tick_text').text().toLowerCase().trim() == "no"){
								$(prev_item).children('span.tick_text').hide();
								$(prev_item).children('span.tick_icon').show();
							}	
	 					}
			  		}
			  	});	
	
			}
		});

		$(this).on('keydown',function(e){
			if(e.keyCode == 13  && e.ctrlKey) {
				e.preventDefault();
				if (window.getSelection) {
			      	var selection = window.getSelection(),
			        range = selection.getRangeAt(0),
			        br = document.createElement("br"),
			        textNode = document.createTextNode("\u00a0"); //Passing " " directly will not end up being shown correctly
			      	//range.deleteContents();//required or not?
			      	range.insertNode(br);
			      	range.collapse(false);
			      	range.insertNode(textNode);
			      	range.selectNodeContents(textNode);
			      	selection.removeAllRanges();
			      	selection.addRange(range);
			      	return false;
			  	}
			}
			if(e.keyCode == 13) {
				if($(this).hasClass('pmpt_cell')){
					e.preventDefault();
					var col_length = (pmpt_params != null) ? pmpt_params.pmpt_packages.length : pmpt_default_params.pmpt_packages.length;
					var temp_type       = (pmpt_params != null) ? pmpt_params.pmpt_temp_type:pmpt_default_params.pmpt_temp_type;
					if(col_indx < col_length-1){
						var empty = $('body').find('#pmpt_cell_'+String(col_indx)+String(cell_indx)).text().toLowerCase().trim();
						if(empty == ''||(empty == 'no' && temp_type != 'MATRIX')){
							$('body').find('#pmpt_cell_'+String(col_indx)+String(cell_indx)).hide();
						}
						col_indx++;
						$('body').find('#pmpt_cell_'+String(col_indx)+String(cell_indx)).show().click().focus();
					} else {
						var empty = $('body').find('#pmpt_cell_'+String(col_indx)+String(cell_indx)).text().toLowerCase().trim();
						if(empty==''||(empty=='no'&& temp_type!='MATRIX')){
							$('body').find('#pmpt_cell_'+String(col_indx)+String(cell_indx)).hide();
						}
						col_indx=0;
						cell_indx++;
						if($('#pmpt_cell_'+String(col_indx)+String(cell_indx)).length!=0){
							$('body').find('#pmpt_cell_'+String(col_indx)+String(cell_indx)).show().click().focus();		
						} else {
							col_indx=0;
							cell_indx=0;
							$('body').find('#pmpt_cell_'+String(col_indx)+String(cell_indx)).show().click().focus();		
						}
					}
				}	
			} 
		});

		function Html_caret(html, selectPastedContent) {
			var sel, range;
    		if (window.getSelection) {
	        // IE9 and non-IE
		        sel = window.getSelection();
		        if (sel.getRangeAt && sel.rangeCount) {
		            range = sel.getRangeAt(0);
	            	range.deleteContents();
					var el = document.createElement("div");
	            	el.innerHTML = html;
	            	var frag = document.createDocumentFragment(), node, lastNode;
	           	 	while ( (node = el.firstChild) ) {
	                	lastNode = frag.appendChild(node);
	            	}
	            	var firstNode = frag.firstChild;
	            	range.insertNode(frag);

	           		if (lastNode) {
		                range = range.cloneRange();
		                range.setStartAfter(lastNode);
		                if (selectPastedContent) {
		                    range.setStartBefore(firstNode);
		                } else {
		                    range.collapse(true);
		                }
		                sel.removeAllRanges();
		                sel.addRange(range);
	            	}
	        	}
        	} else if ( (sel = document.selection) && sel.type != "Control") {
		        // IE < 9
		        var originalRange = sel.createRange();
		        originalRange.collapse(true);
		        sel.createRange().pasteHTML(html);
		        if (selectPastedContent) {
		            range = sel.createRange();
		            range.setEndPoint("StartToStart", originalRange);
		            range.select();
		        }
    		}
		}	

	
		function rgb2hex(rgb) {
		    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 			return (rgb && rgb.length === 4) ? "#" +
		  	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  			("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  			("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
		}

		function give_link(link_val){
			var given_link = (link_val != undefined || link_val != null )? link_val : ''; 
			var link_val =  prompt('Enter URL:',given_link);
			var txt = link_val;
			var re = /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?/;
			if (re.test(txt)) {
				document.execCommand('createLink',false,txt);	
				
				if(pmpt_temp_type == 'MATRIX'){
					
					if($this_cell.hasClass("pmpt_feature")){
						cell_value = $this_cell.html();
					}else{						
						cell_value = $this_cell.find(".tick_text").html();
					}
				}else{
					cell_value = $this_cell.html();
				}

				pmpt_update_params_value("pmpt_value", cell_value);
			} else {
				if(link_val != undefined || link_val != null){
					alert("Invalid URL");
					give_link(link_val);
				}		
			}
		}

		function pmpt_cell_font_links(family, indx) {
		 	var cur_font = family.replace(/ /g,"+");
		 	cell_fonts[indx] = cur_font;
		    var fnt_list = "";
		    for(var fnt in cell_fonts) {
	        	if(cell_fonts[fnt]){
	    	  		fnt_list = fnt_list + cell_fonts[fnt] + "|";	
	     		}
	    	}	
	    	fnt_list = fnt_list.substring(0,fnt_list.length - 1);
	  		var filename = "//fonts.googleapis.com/css?family="+fnt_list;			
			pmpt_cell_font_link.setAttribute("href", filename);			
		}

		function pmpt_update_params_value( update, update_value, update_style ) { 
			pmpt_params = (pmpt_params != null)? JSON.parse(JSON.stringify(pmpt_params)) : JSON.parse(JSON.stringify( pmpt_default_params));
			var pmpt_update_cell = pmpt_get_update_cell();
			var pmpt_update = update;
			var pmpt_update_value = update_value;
			var pmpt_update_style = update_style;

			switch (pmpt_update_cell) {
				case "pmpt_main_heading":
					switch (pmpt_update) {
						case "pmpt_value":
								pmpt_params["pmpt_packages"][col_indx]["pmpt_main_heading"]["pmpt_value"] = pmpt_update_value;	
						break;
						case "pmpt_style":
							if(pmpt_update_style){
								pmpt_params["pmpt_packages"][col_indx]["pmpt_main_heading"]["pmpt_style"][pmpt_update_style] = pmpt_update_value;
							}
						break;
						case "pmpt_tooltip":
						   	pmpt_params["pmpt_packages"][col_indx]["pmpt_main_heading"]["pmpt_tooltip"] = pmpt_update_value;	
						break;				
					}	
				break;

		  		case "pmpt_sub_heading":
					switch (pmpt_update) {
						case "pmpt_value":
							pmpt_params["pmpt_packages"][col_indx]["pmpt_sub_heading"]["pmpt_value"] = pmpt_update_value;	
						break;
						case "pmpt_style":
					  		if(pmpt_update_style){
						  		pmpt_params["pmpt_packages"][col_indx]["pmpt_sub_heading"]["pmpt_style"][pmpt_update_style] = pmpt_update_value;
							}
						break;
						case "pmpt_tooltip":
						   	pmpt_params["pmpt_packages"][col_indx]["pmpt_sub_heading"]["pmpt_tooltip"] = pmpt_update_value;	
						break;				
					}	 
				break;

				case "pmpt_price":
					switch (pmpt_update) {
						case "pmpt_value":
							pmpt_params["pmpt_packages"][col_indx]["pmpt_price"]["pmpt_value"] = pmpt_update_value;	
						break;
						case "pmpt_style":
							if(pmpt_update_style){
								pmpt_params["pmpt_packages"][col_indx]["pmpt_price"]["pmpt_style"][pmpt_update_style] = pmpt_update_value;
							}
						break;
						case "pmpt_tooltip":
						   	pmpt_params["pmpt_packages"][col_indx]["pmpt_price"]["pmpt_tooltip"] = pmpt_update_value;	
						break;				
					}	
				break;

				case "pmpt_subscription_type":
				
					switch (pmpt_update) {
						case "pmpt_value":
							pmpt_params["pmpt_packages"][col_indx]["pmpt_subscription_type"]["pmpt_value"] = pmpt_update_value;	
						break;
						case "pmpt_style":
							if(pmpt_update_style){
								pmpt_params["pmpt_packages"][col_indx]["pmpt_subscription_type"]["pmpt_style"][pmpt_update_style] = pmpt_update_value;
							}
						break;
						case "pmpt_tooltip":
						   	pmpt_params["pmpt_packages"][col_indx]["pmpt_subscription_type"]["pmpt_tooltip"] = pmpt_update_value;	
						break;				
					}	
				break;

				case "pmpt_img":
					switch (pmpt_update) {
						case "pmpt_value":
							pmpt_params["pmpt_packages"][col_indx]["pmpt_img"]["pmpt_value"] = pmpt_update_value;	
						break;
						case "pmpt_style":
							if(pmpt_update_style){
								pmpt_params["pmpt_packages"][col_indx]["pmpt_img"]["pmpt_style"][pmpt_update_style] = pmpt_update_value;
							}
						break;
						case "pmpt_tooltip":
					     	pmpt_params["pmpt_packages"][col_indx]["pmpt_img"]["pmpt_tooltip"] = pmpt_update_value;	
					    break;				
					}	
				break;

				case "pmpt_feature":
					switch (pmpt_update) {
						case "pmpt_value":
							pmpt_params["pmpt_features_list"][cell_indx]["pmpt_value"] = pmpt_update_value;	
						break;
						case "pmpt_style":
							if(pmpt_update_style){
								pmpt_params["pmpt_features_list"][cell_indx]["pmpt_style"][pmpt_update_style] = pmpt_update_value;
							}
						break;
						case "pmpt_tooltip":
					     	pmpt_params["pmpt_features_list"][cell_indx]["pmpt_tooltip"] = pmpt_update_value;	
					    break;				
					}	
				break;		 

			  	case "pmpt_cell":
			  		switch (pmpt_update) {
						case "pmpt_value":
							pmpt_params["pmpt_packages"][col_indx]["pmpt_features"][cell_indx]["pmpt_value"] = pmpt_update_value;	
						break;
						case "pmpt_style":
							if(pmpt_update_style){
								pmpt_params["pmpt_packages"][col_indx]["pmpt_features"][cell_indx]["pmpt_style"][pmpt_update_style] = pmpt_update_value;
							}
						break;
						case "pmpt_tooltip":
							pmpt_params["pmpt_packages"][col_indx]["pmpt_features"][cell_indx]["pmpt_tooltip"] = pmpt_update_value;	
					    break;				
					}	
				break;

			  	case "pmpt_matrix_box":
			  		switch ( pmpt_update ) {
						case "pmpt_value":
							pmpt_params["pmpt_matrix_box"]["pmpt_value"] = pmpt_update_value;	
						break;
						case "pmpt_style":
							if(pmpt_update_style){
								pmpt_params["pmpt_matrix_box"]["pmpt_style"][update_style] = pmpt_update_value;	
							}
						break;
						case "pmpt_tooltip":
						   	pmpt_params["pmpt_matrix_box"]["pmpt_tooltip"] = pmpt_update_value;	
						break;				
				  	}
				break;
		}

		function pmpt_get_update_cell() {
			var pmpt_class = '';
			if ( $this_cell.hasClass( "pmpt_main_heading" )) {
				pmpt_class = "pmpt_main_heading";
				return pmpt_class;
			} else if ( $this_cell.hasClass( "pmpt_sub_heading" ) ) {
			 	pmpt_class = "pmpt_sub_heading";
				return pmpt_class;
			} else if ( $this_cell.hasClass( "pmpt_price" ) ) {
				pmpt_class = "pmpt_price";
				return pmpt_class;
			} else if ( $this_cell.hasClass( "pmpt_subscription_type" ) ) {
				pmpt_class = "pmpt_subscription_type";
				return pmpt_class;	
			} else if ( $this_cell.hasClass( "pmpt_img" ) ) {
				pmpt_class = "pmpt_img";
				return pmpt_class;	
			} else if ( $this_cell.hasClass( "pmpt_feature" ) ) {	
				pmpt_class = "pmpt_feature";
				return pmpt_class;
			} else if ( $this_cell.hasClass( "pmpt_cell" ) ) {	
				pmpt_class = "pmpt_cell";
				return pmpt_class;
			} else if ( $this_cell.hasClass( "pmpt_matrix_box" ) ) {
			 	pmpt_class = "pmpt_matrix_box";
			 	return pmpt_class;
			}
		}
	}
}
})(jQuery);


function pmpt_save_selection() {
	  if (window.getSelection) {
       var sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            var ranges = [];
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

function pmpt_restore_selection(savedSel) {
    if (savedSel) {
        if (window.getSelection) {
          var  sel = window.getSelection();
            sel.removeAllRanges();
            for (var i = 0, len = savedSel.length; i < len; ++i) {
                sel.addRange(savedSel[i]);
            }
        } else if (document.selection && savedSel.select) {
            savedSel.select();
        }
    }
}