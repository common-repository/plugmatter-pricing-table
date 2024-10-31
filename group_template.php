<?php 
global $wpdb;
$plugin_dir_name = dirname(plugin_basename(__FILE__));
$table = $wpdb->prefix.'pmpt_templates';
if($_GET['action']=='edit'&& !empty($_GET['template_id'])){
	$pmpt_group_table_name = $wpdb->prefix.'pmpt_group_templates';
	$id  = $_GET['template_id'];
	$pmpt_group_temp = $wpdb->get_row("SELECT id,name,params,active FROM $pmpt_group_table_name WHERE id='$id'");	
	
}
$pmpt_temp = $wpdb->get_results("SELECT id,temp_name,base_temp_name FROM $table ");	



?>
<script type="text/javascript">
	var tot_temp = <?php echo json_encode($pmpt_temp);?>;
	sessionStorage.template = JSON.stringify(tot_temp);
</script>
<div class='pmadmin_wrap'>
	<div class='pmadmin_headbar'>
		<div class='pmadmin_pagetitle'><h2>Template Group Editor </h2> </div>
	  	<div class='pmadmin_logodiv'><img src='<?php echo PMPT_URL."images/pmpt_logo.png";?>' height='35'></div>
	</div>
	<div class='pmadmin_body'>
		<div class="pmpt_container">
			<form method="post" action="<?php echo admin_url('admin.php?page='.$plugin_dir_name.'/main.php'); ?>" name='pmpt_group_templates'>
				<input type="hidden" name="action" value="save_group_template">
				<input type="hidden" name="type_action" value="<?php if(isset($_GET['action'])) echo $_GET['action']; ?>">
				<input type="hidden" name="pmpt_default_temp" id='pmpt_default_temp'>
				<div class="col-xs-12 " style="color:#333;font-size:15px;font-weight:bold">
					<div class="form-group">
						<label>Group Name</label>
						<input type="text" class="form-control group_name" name="group_name" value="<?php if(!empty($pmpt_group_temp->name)) echo $pmpt_group_temp->name; ?>">
						<input type="hidden" name="params" id="template_groups">
						<?php if(!empty($id)){ ?>
							<input type="hidden" name="template_id" value="<?php echo $id; ?>">
						<?php } ?>
					</div>
				</div>
				<div class="col-xs-12 ">
					<table>
						<thead style="text-align:left">
							<th class="group_td">Default</th>
							<th class="group_td">Label</th>
							<th class="group_td">Template</th>
						</thead>
						<tbody class="pmpt_group_templates">
							<?php 
							$temp_param_id=1;
							if(!empty($pmpt_group_temp->params)){
								$totparams = json_decode($pmpt_group_temp->params);
								foreach ($totparams as $param) { ?>
									<tr class="pmpt_groups" id="pmpt_groups_<?php echo $temp_param_id; ?>">
										<td class="group_td">
										<?php 
											if($pmpt_group_temp->active==$param->id) {?>
												<input type="radio"  name="pmpt_enable_default" class="pmpt_enable_default" value="1" checked="check" />
										<?php } else {?>
											<input type="radio"  name="pmpt_enable_default" class="pmpt_enable_default" value="0" />
										<?php } ?>
										</td>
										<td class="group_td">
											<input type="text" class="group_attr" value="<?php if(!empty($param->name)) echo $param->name; ?>">
										</td>
										<td class="group_td group_select">
											<select class="group_temp_id">
												<option value="0">--Select-- </option>
												<?php 
												foreach ($pmpt_temp as $temp) {
													if($param->id==$temp->id){
														echo "<option value=".$temp->id." selected='select'>".$temp->temp_name."</option>";	
													}else{
														echo "<option value=".$temp->id.">".$temp->temp_name."</option>";	
													}
												
												}
												?>					
											</select>
										</td>
										
										<td class="group_td" style="font-size:18px;">
											<span id='<?php echo $temp_param_id; ?>' class='pmpt_delete_template icon icon-pmpt-ico-cross2'></span>
										</td>
									</tr>

							<?php 
								$temp_param_id++;
								} 
							?>
							<script type="text/javascript">
							sessionStorage.id = <?php echo $temp_param_id; ?>;
							</script>
							<?php } else {
							?>
							<script type="text/javascript">
							sessionStorage.id = 1;
							</script>
							<tr class="pmpt_groups" id="pmpt_groups_1">
								<td class="group_td">
									<input type="radio"  name="pmpt_enable_default" class="pmpt_enable_default" value="0" />
								</td>
								<td class="group_td">
									<input type="text" class="group_attr">
								</td>
								<td class="group_td group_select">
									<select class="group_temp_id">
										<option value="0">--Select-- </option>
										<?php 
										foreach ($pmpt_temp as $temp) {
											echo "<option value=".$temp->id.">".$temp->temp_name."</option>";
										}
										?>					
									</select>
								</td>
								<td class="group_td" style="font-size:18px;">
									<span id='1' class='pmpt_delete_template icon icon-pmpt-ico-cross2'></span>
								</td>
							</tr>
							<?php } ?>
						</tbody>
					</table>
					<button class="btn btn-primary" id="add_more_temp">Add More</button>
				</div>
				<div>
					<input type="button" class="pmpt_group_button" value="Save">
				</div>
			</form>
		</div>
	</div>
</div>	