<?php 
$msg = '';
$msg_reg = '';
$reg_done = false;
$siteurl = get_option('siteurl');
if(isset($_POST["license_key"] ) && ($_POST["license_key"] != "")) {
    $res = wp_remote_post("http://plugmatter.com/activate",
			array('body'=>array(
					"license_key"=>$_POST["license_key"],
					"siteurl"=>$siteurl,
					"package"=>PMPT_PACKAGE,	
					)
				)
			);
  
  $res_arr = explode(":",$res["body"]);
  
	if($res_arr[0] == "VERIFIED") {
		update_option('PMPT_PACKAGE', $res_arr[1]);
		update_option('PMPT_License', $_POST["license_key"]);
		$msg="<div class='pmpt_msg_success'><strong>Plugmatter Pricing Table activated successfully</strong></div>";
	} else {
		$msg="<div class='pmpt_msg_error'><strong>Invalid License Key</strong></div>";
	}
} else if(isset($_POST["cc_email"]) || isset($_POST["cc_purchase_code"])) {
    if(isset($_POST["cc_purchase_code"]) && $_POST["cc_purchase_code"] == "") {
        $msg_reg="<div class='pmpt_msg_error'><strong>Please enter your CodeCanyon Purchase Code </strong></div>";
    } else if(!eregi("^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$", $_POST["cc_email"])) {
        $msg_reg="<div class='pmpt_msg_error'><strong>Please Enter a Valid Email</strong></div>";
    } else {
	   // echo "<pre>";
    	// print_r($_POST);
	   $res = wp_remote_post("http://plugmatter.com/register_cc",
			array('body'=>array(
					"cc_code"=>$_POST["cc_purchase_code"],
          "email"=>$_POST["cc_email"],
          "package"=>PMPT_PACKAGE
					)
				)
			);
     
	   	// $res_arr = explode(":",$res["body"]);
        $res_arr = json_decode($res["body"]);
	     // print_r($res_arr);
		if($res_arr->status == "ERROR") {
		   $msg_reg="<div class='pmpt_msg_error'><strong>".$res_arr->message."</strong></div>";
		} 

		if($res_arr->status == "SUCCESS") {           
		   $msg_reg="<div class='pmpt_msg_success'><strong>".$res_arr->message."</strong></div>";
		   $reg_done = true;
		   $lc_key = $res_arr->license_key;
		}
		update_option('PMPT_PACKAGE', 'plugmatter_pricingtable_cc');
		update_option('PMPT_License', $lc_key);
   }
} else if(isset($_POST["email"]) || isset($_POST["first_name"])) {
    if(isset($_POST["first_name"]) && $_POST["first_name"] == "" && PMPT_PACKAGE != "plugmatter_pricingtable_cc") {
        $msg_reg="<div class='pmpt_msg_error'><strong>Please enter your First Name</strong></div>";
    } else if(!eregi("^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$", $_POST["email"])) {
        $msg_reg="<div class='pmpt_msg_error'><strong>Please Enter a Valid Email</strong></div>";
    } else {
	   $res = wp_remote_post("http://plugmatter.com/register_lite",
			array('body'=>array(
					"first_name"=>$_POST["first_name"],
          "email"=>$_POST["email"],
          "package"=>PMPT_PACKAGE
					)
				)
			);
     
	   $res_arr = explode(":",$res["body"]);
       if($res_arr[0] == "ERROR") {
           $msg_reg="<div class='pmpt_msg_error'><strong>".$res_arr[1]."</strong></div>";
       } else {
           $res_arr2 = explode("|",$res_arr[1]);
           $msg_reg="<div class='pmpt_msg_success'><strong>".$res_arr2[0]."</strong></div>";
           $reg_done = true;
           $lc_key = $res_arr2[1];
       }
    }

}
//------------------------------------------------------------------------------------------------------
?>
<div class='pmadmin_wrap'>
	<div class='pmadmin_headbar'>
		<div class='pmadmin_pagetitle'><h2>General Settings</h2></div>
	    <div class='pmadmin_logodiv'><img src='<?php echo PMPT_URL."images/pmpt_logo.png";?>' height='35'></div>
	</div>
	<?php 	
	if($msg!='') { 
		echo "$msg";
	}
	if(get_option('PMPT_License') != "") {

    $plugin_dir_name = dirname(plugin_basename(__FILE__));	
	?>
	<div class='pmadmin_body'  style="position:relative">
             
        <br><br>
		<div class="pmadmin_submit">
			<input id="submit" class="pmpt_primary_buttons" type="submit" value=" Get Started " onclick="location.href='<?php echo admin_url('admin.php?page='.$plugin_dir_name.'/main.php')?>'" name="submit">
		</div>        
        <br><br>
       If you have trouble in using this plugin <a href='mailto:support@plugmatter.com' target="_blank"><b>shoot us an email</b></a> and we will be glad to help you.
		<br><br>	
	<?php
	} else {
	?>
	
	<div class='pmadmin_body'  style="position:relative">
    <div style='padding-bottom:30px;'>
        To get Support for your plugin from Plugmatter, you need to enter your Plugmatter License Key sent to you in your "License Key Email". Please contact <a href='http://plugmatter.com/support' target='_blank'>support</a> if you're unable to find your License Key.
    </div>   

    <?php if(PMPT_PACKAGE == "plugmatter_pricingtable_cc") { ?>
    	<!-- This code for code canyon -->     
		<form action="<?php echo admin_url("admin.php?page=pmpt_license_submenu_page") ?>" id='pm_settings' method="post">	
			<div>
				<div class='plug_enable_lable' style='width:250px'>Email</div>
				<div class='plug_tgl_btn'>
					<input type='text' name='cc_email' size='45' style='padding:4px;' value='<?php echo isset($_POST["email"])?$_POST["email"]:""; ?>'>
				</div>
				<div style='clear:both'>&nbsp;</div>

				<div class='plug_enable_lable' style='width:250px'>Enter Your License Key</div>
				<div class='plug_tgl_btn'>
					<input type='text' name='cc_purchase_code' size='45' style='padding:6px;' value='<?php echo $lc_key; ?>'>
				</div>
				<div style='clear:both'>&nbsp;</div>
			</div>
			<div class="pmadmin_submit">
				<input id="submit" class="pmpt_primary_buttons" type="submit" value="   Register Plugin   " name="submit">
			</div>
			<br><br>
		</form>
    <?php } else { ?>
    <!-- This code is for all packages except code canion -->     
		<form action="<?php echo admin_url("admin.php?page=pmpt_license_submenu_page") ?>" id='pm_settings' method="post">	
			<div>
				<div class='plug_enable_lable' style='width:250px'>Enter Your License Key</div>
				<div class='plug_tgl_btn'>
					<input type='text' name='license_key' size='45' style='padding:6px;' value='<?php echo $lc_key; ?>'>
				</div>
				<div style='clear:both'>&nbsp;</div>
			</div>
			<div class="pmadmin_submit">
				<input id="submit" class="pmpt_primary_buttons" type="submit" value="   Register Plugin   " name="submit">
			</div>
			<br><br>
		</form>
	<?php } ?>
    <?php if(PMPT_PACKAGE == "plugmatter_pricingtable_lite" || PMPT_PACKAGE == "plugmatter_pricingtable_exc") { ?>
    <div style="border-top:1px solid #ddd;padding-bottom:10px;">&nbsp;</div>
    <div class='plug_enable_lable' style='font-weight:bold;width:350px;'>Don't Have a License Key? Register Now to get the Free version License Key!</div>
    <div style='padding-bottom:15px;clear:both;padding-top:10px;'>Your free version license key will be sent to your registered email.</div>
    <?php
    if($msg_reg!='') { 
		echo $msg_reg;
	} 
    if($reg_done != true) {
    ?><br><br>
	<form action="<?php echo admin_url("admin.php?page=pmpt_license_submenu_page")?>" id='pm_settings' method="post">	
		<div>
			<div class='plug_enable_lable' style='width:150px'>First Name</div>
			<div class='plug_tgl_btn'>
				<input type='text' name='first_name' size='30' style='padding:4px;' value='<?php echo isset($_POST["first_name"])?$_POST["first_name"]:""; ?>'>
			</div>
			<div style='clear:both'>&nbsp;</div>
			<div class='plug_enable_lable' style='width:150px'>Email</div>
			<div class='plug_tgl_btn'>
				<input type='text' name='email' size='30' style='padding:4px;' value='<?php echo isset($_POST["email"])?$_POST["email"]:""; ?>'>
			</div>
			<div style='clear:both'>&nbsp;</div>            
		</div>
		<div class="pmadmin_submit" style='margin-top:10px;'>
			<input id="submit" class="pmpt_primary_buttons" type="submit" value="   Get License key   " name="submit">
		</div>
		<br><br>
	</form>        
    <?php }

    } ?>
	</div>
<?php } ?>
</div>