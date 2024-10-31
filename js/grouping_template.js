jQuery(document).ready(function($) {

	jQuery('body').on('click','.pmpt_enable_default',function(){
		jQuery('.pmpt_enable_default').val(0);
		jQuery(this).val(1);
	});
	

	/*----------- template group js-----------------------------*/

	jQuery('body').on('click','.pmpt_delete_template',function(){
		var id =  $(this).attr('id');
		$('#pmpt_groups_'+id).remove();
	});
  
	jQuery('#add_more_temp').on('click',function(event){
		event.preventDefault();
		var tot_templates = JSON.parse(sessionStorage.template);
		var table_row_id = sessionStorage.id;
		var new_temp_id = Number(table_row_id)+1;
		sessionStorage.id=new_temp_id;
		var html = "<tr class='pmpt_groups' id='pmpt_groups_"+new_temp_id+"'>";
			html += "<td class='group_td'>";
			html += '<input type="radio"  name="pmpt_enable_default"  class="pmpt_enable_default" value="0" />';
			html += '</td>';
			html += '<td class="group_td"><input type="text" class="group_attr"></td>';
			html += '<td class="group_td group_select">';
			html += '<select class="group_temp_id">';
			html += '<option value="0">--Select-- </option>';
			jQuery.each(tot_templates,function(i,item){
				html+= '<option value='+item.id+'>'+item.temp_name+'</option>';
			});
			html += '</select>';
			html += '</td>';
			
			html += '<td style="font-size:16px;">';
			html += '<span id='+new_temp_id+' class="pmpt_delete_template icon icon-pmpt-ico-cross2"></span>';
			html += '</td>';
			html += '</tr>';
    	$('.pmpt_group_templates').append(html);
  	});

	
	jQuery('.pmpt_group_button').on('click',function(){
		
		if(!$('.group_name').val()){
			alert("Please enter group name");
			return false;
		}

		var temp = [];
		var default_enable='';
		var i=1;
		var loop_fail=true;
		jQuery('.pmpt_groups').each(function(){

			var meta ={};
			if(!jQuery(this).find('.group_attr').val()){
				alert('Please enter label');
				loop_fail=true;
				return false;
			}else{
				meta.name = jQuery(this).find('.group_attr').val();
				loop_fail =false;
			}
			
			if(jQuery(this).find('.group_temp_id').val()==0){
				alert('Please select template');
				loop_fail=true;
				return false;
			}else{
				meta.id  = jQuery(this).find('.group_temp_id').val();
				loop_fail=false;
			}
			
			temp.push(meta);	
			i++;
		});
		if(loop_fail){
			return false;
		}

		jQuery('.pmpt_enable_default').each(function(){
			if($(this).val()==1){
				default_enable = jQuery(this).parent().siblings('.group_select').children('.group_temp_id').val();
			}
		});
		if(default_enable==''){
			alert('Please Select Default Template');
			return false;
		}
		if(i>2){
			jQuery("#template_groups").val(JSON.stringify(temp));
			jQuery('#pmpt_default_temp').val(default_enable);
			jQuery(document).click();
			document.forms["pmpt_group_templates"].submit();	
		}else{
			alert('Atleast two tables are required to group');
			return false;
		}
		
		
	});


  /*---------end of template group js----------------*/
 }); 