<?php
$message = "";
global $wpdb;
$siteurl = get_option('siteurl');
$table = $wpdb->prefix.'pmpt_ab_test';

if(isset($_POST)) {	
	if(isset($_POST["compaign_name"] ) && ($_POST["compaign_name"]!="") && ($_GET['action'])=="add_new" ) {
		$date=date("d/m/Y");
		$wpdb->query("INSERT INTO $table(compaign_name,boxA,boxB,start_date)
				VALUES('".$_POST["compaign_name"]."', '".$_POST["boxA"]."', '".$_POST["boxB"]."', '".$date."')");

		$message = "<div id=\"setting-error-settings_updated\" class='pm_msg_warning'>Your split-test campaign has been saved successfully.</div>";
	}
}


if(isset($_GET['action'])) {
	if($_GET['action']=="delete" && $_GET['delete_id']!='') {
		$id= $_GET['delete_id'];

		$dq = $wpdb->query(
				$wpdb->prepare(
						"
						DELETE FROM $table
						WHERE id = %d
						",
						"$id"
				)
		);
		if($dq) {
			$message = "<div id=\"setting-error-settings_updated\" class='pm_msg_warning'>Your split-test campaign has been deleted successfully.</div>";
		}
	}
}

?>

<div class='pmadmin_wrap'>
	<div class='pmadmin_headbar'>
		<div class='pmadmin_pagetitle'><h2>Split-Testing 
		<a href="<?php echo admin_url('admin.php?page=add_split_test_submenu_page'); ?>">Add New</a>
		</h2></h2></div>
	    <div class='pmadmin_logodiv'><img src='<?php echo PMPT_URL."images/pmpt_logo.png";?>' height='35'></div>
	</div>
	<div class='pmadmin_body'>
	
	<br>
	<div class='plug_list_head'>Your Split-Test Campaigns</div>
	<?php 
		global $wpdb;		
		$table = $wpdb->prefix.'pmpt_ab_test';
		$temp_tbl = $wpdb->prefix.'pmpt_templates';
		$resultss = $wpdb->get_results("SELECT * FROM $table ORDER BY id DESC");		
		$result_count = count($resultss);
		if($result_count != 0) { 
	?>
		<table class="widefat">
			<thead>
				<tr style="">
					<th style="width:30%">Campaign Name</th>
					<th style="width:300px">Template A</th>
					<th style="width:300px">Template B</th>					
					<th style="width:300px">Short Code</th>
					<th style="width:200px">Action</th>

				</tr>
			</thead>
			<tfoot>
				<tr style="">
					<th style="width:30%">Campaign Name</th>
					<th style="width:300px">Template A</th>
					<th style="width:300px">Template B</th>				
					<th style="width:300px">Short Code</th>
					<th style="width:200px">Action</th>

				</tr>
			</tfoot>
			<tbody>
				<?php 				
				foreach ( $resultss as $fivesdraft ) {
					$id=$fivesdraft->id;
					$compaign_name=$fivesdraft->compaign_name;
									
										
					$boxA=$fivesdraft->boxA;
					$boxB=$fivesdraft->boxB;
					$results3 = $wpdb->get_row("SELECT temp_name  FROM $temp_tbl WHERE id ='$boxA' ");
					$results4 = $wpdb->get_row("SELECT temp_name  FROM $temp_tbl WHERE id ='$boxB' ");
					
				?>
				<tr>
					<td class="post-title column-title">
						<strong><a href="<?php echo admin_url("admin.php?page=split_test_stats_page&ab_id=".$id); ?>" ><?php echo $compaign_name;?></a></strong>
					</td>
					<td>
						<?php echo $boxA_name =  $results3->temp_name; ?>
					</td>
					<td>
						<?php echo $boxA_name =  $results3->temp_name; ?>
					</td>
					<td>
						<?php echo '[plugmatter_pricing_splittest abtest = "'.$id.'"]'; ?>
					</td>				
					<td>
						<a title="Delete" onclick="javascript:check=confirm('Are you sure you want to delete this campaign?');if(check==false) return false;"
						href="<?php echo admin_url("admin.php?page=pmpt_split_testing&action=delete&delete_id=$id"); ?>">Delete</a>
					</td>
				</tr>
				<?php 
				}
				?>
			</tbody>
		</table>
	<?php 
		}else{
			echo "<div id='setting-error-settings_updated' class='pm_msg_warning'>Click \"Add New\" to create new split-test campaign.</div>";
		}
	?>	
	<br><br>
	
	</div>
</div>