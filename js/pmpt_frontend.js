jQuery(document).ready(function($) {

	$('.pmpt_tab').on('click',function(event){
		event.preventDefault();
		var temp_id = jQuery(this).attr('href');
		var this_parent_id = jQuery(this).parent().parent('.pmpt_nav_tabs').attr('id');
		jQuery('#'+this_parent_id+' li').removeClass('pmpt_active');
		jQuery(this).parent().addClass('pmpt_active');
		var id = jQuery(this).attr('href');
		var content_id = this_parent_id.split('_');
		jQuery('#pmpt_content_'+content_id[3]+' .pmpt_tab_pane').removeClass('pmpt_content_active');
		jQuery(temp_id).addClass('pmpt_content_active');

	});

	var pmpt_ab_meta = $("#pmpt_ab_meta").attr("pmpt_ab_meta");
	var pmpt_offset = $('.pmpt_container').offset();
	var pmpt_offset_reach = true;
	if(pmpt_ab_meta) {
		$(window).scroll(function() {		
	        if ( pmpt_offset_reach && pmpt_offset.top <= $(window).scrollTop() +150 ) {
	        	pmpt_offset_reach = false;
				jQuery.ajax({
	                    type: "POST",
	                    url: site_url+'?action=pmpt_ab_track',
	                    data: { 'pmpt_ab_meta':pmpt_ab_meta, 'track':'imp' },
	                    success: function(data){ 	
	                    	console.log(data);                        
	                    },
	                    dataType: 'text'
	            });
	        } 
	    });
	}

	$("a.pmpt_conv_btn").click(function(evt) {
		var btn_href = $(this).attr("href");
		var btn_pkg = $(this).attr("data-pkg-name");
		if(pmpt_ab_meta) {
			evt.preventDefault();
	        jQuery.ajax({
                type: "POST",
                url: site_url+'?action=pmpt_ab_track',
                data: { 'pmpt_ab_meta':pmpt_ab_meta, 'track':'conv', 'pkg_name':btn_pkg },
                success: function(data){
                	console.log(data);
                	window.location.href = btn_href;
                },
                dataType: 'text'
	        });
	    }
	});

	/* Analytics Tracking */

	$("a.pmpt_btn").on('click',function(e){
		
		var temp_name = jQuery(this).parent(".pmpt_container").attr("pmpt_meta_id");
		if (typeof ga !== 'undefined') {
			if(temp_name) {
				ga('send', 'event', 'Plugmatter Pricing Table', 'Sale', temp_name);
			}
		}
		if (typeof _gaq !== 'undefined') {
			if(temp_name) {
				_gaq.push(['_trackEvent', 'Plugmatter Pricing Table', 'Sale', temp_name]);
			}
		}
	});		
	
	$('.pmpt_img').each(function(i,item){
		if($('.pmpt_img_'+i).children('img').attr('src') == ''){
			$('.pmpt_img_'+i).css('display','none');
		}
	});
			/*--------------------------*/
	setTimeout(function(){     
		update_row_height();
	},3000);
});


function update_row_height (){

	jQuery(".pmpt_container").each(function(i){

		var tble_id = jQuery(this).attr('id');

		var tot_cols = jQuery('#'+tble_id).find('.pmpt_column').length;
		var tot_rows = jQuery('#'+tble_id).find('.pmpt_column_0').find('.pmpt_cell').length;

		var cell_height = [];
		for(var r=0; r<tot_rows; r++){
		
			cell_height = [];
			for(var c=0; c<tot_cols; c++){
				var pmpt_cell = '#pmpt_cell_'+String(c)+String(r);
				var  cell_itm_height = jQuery('#'+tble_id).find(pmpt_cell).outerHeight();	
				cell_height.push(cell_itm_height);
			}
			var ftr_cell = '.pmpt_feat_cell_'+String(r);
			var ftr_cell_height = jQuery('#'+tble_id).find(ftr_cell).outerHeight();

			cell_height.push(ftr_cell_height);

			var max_row_height =  Math.max.apply(Math, cell_height);

			for(var c=0; c<tot_cols; c++){
				var pmpt_cell = '#pmpt_cell_'+String(c)+String(r); 
				jQuery('#'+tble_id).find(pmpt_cell).css('height',max_row_height+'px'); 
				jQuery('#'+tble_id).find(ftr_cell).css('height',max_row_height+'px'); 
			}	      
		}	
	   
		var head_height = [];
	   	for(var c=0; c<tot_cols; c++){
			var pmpt_col = '.head_'+String(c); 
			var mat_head_height = jQuery('#'+tble_id).find(pmpt_col).outerHeight();
			head_height.push(mat_head_height);
		}
		var mat_emp_height =  Math.max.apply(Math, head_height);
		mat_emp_height = mat_emp_height + 1;
	    jQuery('#'+tble_id).find('.pmpt_mat_head_empty').css('height',mat_emp_height);
	});
}