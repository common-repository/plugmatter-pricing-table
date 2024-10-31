jQuery(document).ready(function(jQuery) {
	
	jQuery('#pm_change_picture').on("click",function(){	
		tb_show('', 'media-upload.php?TB_iframe=true');
		return false;
	});
	/*
	 * Please keep these line to use this code snipet in your project Developed
	 * by oneTarek http://onetarek.com
	 */
	// adding my custom function with Thick box close function tb_close() .
	window.old_tb_remove = window.tb_remove;
	window.tb_remove = function() {
		window.old_tb_remove(); // calls the tb_remove() of the Thickbox plugin
		formfield = null;
	};
	window.original_send_to_editor = window.send_to_editor;
	window.send_to_editor = function(html) {
		if ('#upload_image') {
			fileurl = jQuery('img', html).attr('src');
			//jQuery('#pm_image').attr("src",fileurl).attr("width","10");
			jQuery('#pm_image').css('background-image','url(' + fileurl + ')');
			tb_remove();
		} else {
			window.original_send_to_editor(html);
		}
	};
});

