<?php 
	global $wpdb;
	$table = $wpdb->prefix.'pmpt_templates';
?>
<script type="text/javascript">
	jQuery(document).ready(function ($) {

	  jQuery('#pmpt_save_abtest_btn').on("click",function(){ 
	    if(jQuery("#compaign_name").val() == ""){
	      alert("Please insert compaign name");
	      return false;
	    }
	    var boxA = jQuery('select#boxA').val();
	    var boxB = jQuery('select#boxB').val();
	    if(boxA == boxB) {
	      alert("Please select different templates for Box A and Box B");
	      return false;
	    }   

	  });

	});    

</script>

<div class='pmadmin_wrap'>
	<div class='pmadmin_headbar'>
		<div class='pmadmin_pagetitle'><h2>Create a Split-Test Campaign</h2></div>
	    <div class='pmadmin_logodiv'><img src='<?php echo PMPT_URL."images/pmpt_logo.png";?>' height='35'></div>
	</div>
	<div class='pmadmin_body'>
<?php if(PMPT_PACKAGE == 'plugmatter_pricingtable_pro' || PMPT_PACKAGE == 'plugmatter_pricingtable_dev'  ){	 ?>

	<form action="<?php $siteurl = get_option('siteurl');echo admin_url("admin.php?page=pmpt_split_testing&action=add_new"); ?>"	method="POST">
		<table class="form-table">
			<tbody>
				<tr valign="top">
					<th scope="row">
						<label for="name"> Campaign Name:	</label>
					</th>
					<td>
						<input id="compaign_name" class="regular-text" type="text" required="true" value="" name="compaign_name">
					</td>
				</tr>
				<tr valign="top">
					<th scope="row">
						<label for="box A"> Box A:	</label>
					</th>
					<td>
					<?php 
						$resultss = $wpdb->get_results("SELECT id,temp_name,base_temp_name	FROM $table	ORDER BY id DESC");
								
					?>
						<select name="boxA" id="boxA" >
							<?php 								
								foreach ( $resultss as $fivesdraft )
								{
									$id=$fivesdraft->id;
									$temp_name=$fivesdraft->temp_name;
									$base_temp_name=$fivesdraft->base_temp_name;								
									echo "<option value=\"$id\" >$temp_name</option>";							
								}
							?>
						</select>
					</td>
				</tr>
				<tr valign="top">
					<th scope="row">
						<label for="boxb"> Box B:</label>
					</th>
					<td>
					<?php 
					//	global $wpdb;
					//	$table = $wpdb->prefix.'pmpt_templates';
						$resultss = $wpdb->get_results("SELECT id,temp_name,base_temp_name	FROM $table	ORDER BY id ASC");
						
					?>
						<select name="boxB" id="boxB" >
							<?php 
								foreach ( $resultss as $fivesdraft )
								{
									$id = $fivesdraft->id;
									$temp_name = $fivesdraft->temp_name;
									$base_temp_name = $fivesdraft->base_temp_name;								
									echo "<option value=\"$id\" >$temp_name</option>";							
								}
							?>
					</select>
					</td>
				</tr>
				<tr>
					<th scope="row">

					</th>
					<td colspan="2">
						<input class="pmpt_primary_buttons" id="pmpt_save_abtest_btn" type="submit" value=" Save "> &nbsp;&nbsp;
						<input class="pmpt_secondary_buttons" id="cancel_abtest_btn" type="button" value=" Cancel " onclick="location.href='<?php $siteurl = get_option('siteurl');echo admin_url("admin.php?page=pmpt_split_testing"); ?>'">					
					</td>
				</tr>
			</tbody>
		</table>
	</form>
	<? } else {
		 echo PMPT_UPNOTE;
	} ?>
</div>
</div>