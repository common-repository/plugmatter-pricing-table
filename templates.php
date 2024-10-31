<?php
$msg = "";
global $wpdb;
$siteurl = get_option('siteurl');
$pmpt_table_name = $wpdb->prefix.'pmpt_templates';
$pmpt_group_table_name = $wpdb->prefix.'pmpt_group_templates';

if(isset($_GET['action'])) {
  if($_GET['action']== "delete" && $_GET['delete_id']!='' && $_GET['grouping']=='group_template') {
    $id= $_GET['delete_id'];
    $wpdb->query($wpdb->prepare("DELETE FROM $pmpt_group_table_name WHERE id = %d", "$id"));
    $msg = "<div id='setting-error-settings_updated' class='updated settings-error' style='margin-bottom:20px;'>
        <p>
            <strong>Your template has been deleted successfully.</strong>
        </p>
          </div>";
  } 

  if($_GET['action']== "delete" && $_GET['delete_id']!='') {
    $id= $_GET['delete_id'];
    $wpdb->query($wpdb->prepare("DELETE FROM $pmpt_table_name WHERE id = %d", "$id"));
    $msg = "<div id='setting-error-settings_updated' class='updated settings-error' style='margin-bottom:20px;'>
        <p>
            <strong>Your template has been deleted successfully.</strong>
        </p>
          </div>";
  } 
  if($_GET['action']== "clone" && $_GET['clone_id']!='') {
    $id= $_GET['clone_id'];
    $org_temp = $wpdb->get_row("select * from $pmpt_table_name WHERE id = '$id'");
    $wpdb->query("INSERT INTO $pmpt_table_name(temp_name, base_temp_name,params)VALUES('Clone of ".$org_temp->temp_name."', '".$org_temp->base_temp_name."','".addslashes($org_temp->params)."')");
    $msg = "<div id='setting-success-settings_updated' class='updated settings-success' style='margin-bottom:20px;'>
        <p>
            <strong>Template cloned successfully.</strong>
        </p>
          </div>";
  }   
}

if(isset($_POST['action'])) {
  if($_POST['action'] == "edit" && $_POST['template_id'] != '') { 
    $temp_name = $_POST["temp_name"];
    $params = $_POST["params"];
    $id = $_POST['template_id'];
    $pmpt_table_name = $wpdb->prefix.'pmpt_templates';
    $wpdb->query("UPDATE $pmpt_table_name SET temp_name = '".$_POST["temp_name"]."', params = '".$_POST["params"]."' WHERE id = '".$id."'  ");
  
    $msg = "<div id='setting-error-settings_updated' class='updated settings-error' style='margin-bottom:20px;'>
        <p><strong>Your template has been updated successfully.</strong></p>
          </div>";  
  } else if(isset($_POST["temp_name"] ) && ($_POST["temp_name"]!="") && ($_POST['action'])=="insert" ) {  
    $pmpt_table_name = $wpdb->prefix.'pmpt_templates';
    
    $wpdb->query("INSERT INTO $pmpt_table_name(temp_name, base_temp_name, params)VALUES('".$_POST["temp_name"]."', '".$_POST["base_temp_name"]."','".$_POST["params"]."')");
    $siteurl = get_option('siteurl');
    $msg = "<div id='setting-error-settings_updated' class='updated settings-error' style='margin-bottom:20px;'>
        <p><strong>Your template has been saved successfully.</strong></p>
          </div>";
  }
  else if($_POST['action'] == 'save_group_template' && $_POST['type_action'] == 'edit'){
    $pmpt_group_table_name = $wpdb->prefix.'pmpt_group_templates';
    $name   = $_POST['group_name'];
    $params = $_POST['params'];
    $template_id = $_POST['template_id'];
    $active = $_POST['pmpt_default_temp'];
    $res    = $wpdb->query("UPDATE  $pmpt_group_table_name  SET name='$name',params='$params',active='$active' WHERE id='$template_id'");
    $siteurl = get_option('siteurl');
    $msg = "<div id='setting-error-settings_updated' class='updated settings-error' style='margin-bottom:20px;'>
        <p><strong>Your group templates has been updated successfully.</strong></p>
          </div>";
  }
  else if($_POST['action'] == 'save_group_template' && $_POST['type_action'] == 'insert'){
    $pmpt_group_table_name = $wpdb->prefix.'pmpt_group_templates';
    $name   = $_POST['group_name'];
    $params = $_POST['params'];
    $active = $_POST['pmpt_default_temp'];
    $res    = $wpdb->query("INSERT INTO $pmpt_group_table_name  (name,params,active) VALUES('$name','$params','$active')");
    $siteurl = get_option('siteurl');
    $msg = "<div id='setting-error-settings_updated' class='updated settings-error' style='margin-bottom:20px;'>
        <p><strong>Your group templates has been saved successfully.</strong></p>
          </div>";
  }
}

?>
<div class='pmadmin_wrap'>
  <div class='pmadmin_headbar'>
    <div class='pmadmin_pagetitle'>
      <h2>Templates </h2>
    </div>
      <div class='pmadmin_logodiv'><img src='<?php echo PMPT_URL."images/pmpt_logo.png";?>' height='35'></div>
  </div>
  <div class='pmadmin_body'>
  <?php echo $msg; ?>
  <div class='plug_list_head'>Your Templates
    <a href="<?php echo admin_url("admin.php?page=edit_pmpt_template_submenu_page&action=insert"); ?>" style='float:right;margin-right:10px;color:#cf1626;font-size:14px;'>&#43;&nbsp;Add New</a>
  </div>  
<?php 
$pmpt_table_name = $wpdb->prefix.'pmpt_templates';
$resultss = $wpdb->get_results("SELECT id,temp_name,base_temp_name  FROM $pmpt_table_name ORDER BY id DESC");
$result_count = count($resultss);
if($result_count != 0) { 
  ?>
<table class="widefat">
  <thead>
    <tr style="">
      <th width='50%'>Title</th>
      <th>Base Template</th>
      <th>Short Code</th>
      <th>Edit</th>   
      <th>Clone</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <th>Title</th>
      <th>Base Template</th>
      <th>Short Code</th>
      <th>Edit</th>   
      <th>Clone</th>
      <th>Delete</th>
    </tr>
  </tfoot>
<tbody>
<?php 

 $plugin_dir_name = dirname(plugin_basename(__FILE__));
foreach ( $resultss as $pmpt_temp ) {
  $id = $pmpt_temp->id;
  $temp_name = $pmpt_temp->temp_name;
  $base_temp_name = $pmpt_temp->base_temp_name;
?>
  <tr>
    <td class="post-title column-title">
      <strong>
          <a title="Edit" href="<?php echo admin_url("admin.php?page=edit_pmpt_template_submenu_page&action=edit&template_id=$id"); ?>"><?php echo $temp_name;  ?></a>
      </strong>
    </td>
    <td><?php echo $base_temp_name; ?></td>
    <td><?php echo "[plugmatter_pricing table = '".$id."']";?></td>
    <td>
      <a title="Edit" href="<?php echo admin_url("admin.php?page=edit_pmpt_template_submenu_page&action=edit&template_id=$id"); ?>">Edit</a>
    </td>
    <td>
      <a title="Clone" href="<?php echo admin_url("admin.php?page=".$plugin_dir_name."/main.php&action=clone&clone_id=$id"); ?>">Clone</a>
    </td>
    <td>
      <a title="Delete"  onclick="javascript:check=confirm('Are you sure you want to delete this template?');if(check==false) return false;" href="<?php echo admin_url("admin.php?page=".$plugin_dir_name."/main.php&action=delete&delete_id=$id"); ?>">Delete</a>
    </td>
  </tr>
  <?php 
}?>
</tbody>
</table>
 <div class='plug_list_head' style="margin-top:20px;">
    Template Groups 
    <a href="<?php echo admin_url("admin.php?page=group_template&action=insert"); ?>" style='float:right;margin-right:10px;color:#cf1626;font-size:14px;'>&#43;&nbsp;Add New Group</a>
 </div>  
  <?php 
    $pmpt_group_table_name = $wpdb->prefix.'pmpt_group_templates';
    $tot_group_temp = $wpdb->get_results("SELECT id,name  FROM $pmpt_group_table_name ORDER BY id DESC");
    if(count($tot_group_temp)!=0){
  ?>
    <table class="widefat">
      <thead>
        <tr style="">
          <th width='50%'>Title</th>
          <th>Short Code</th>
          <th>Edit</th>   
          <th>Delete</th>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <th>Title</th>
          <th>Short Code</th>
          <th>Edit</th>   
          <th>Delete</th>
        </tr>
      </tfoot>
    <tbody>
  <?php 
    $plugin_dir_name = dirname(plugin_basename(__FILE__));
    foreach ($tot_group_temp as $group_temp) {
      $id = $group_temp->id;
      $temp_name = $group_temp->name;
    ?>
        <tr>
          <td class="post-title column-title">
            <strong>
                <a title="Edit" href="<?php echo admin_url("admin.php?page=group_template&action=edit&template_id=$id"); ?>"><?php echo $temp_name;  ?></a>
            </strong>
          </td>
          <td><?php echo "[plugmatter_group_pricing table = '".$id."']";?></td>
          <td>
            <a title="Edit" href="<?php echo admin_url("admin.php?page=group_template&action=edit&template_id=$id"); ?>">Edit</a>
          </td>
          <td>
            <a title="Delete"  onclick="javascript:check=confirm('Are you sure you want to delete this template?');if(check==false) return false;" href="<?php echo admin_url("admin.php?page=".$plugin_dir_name."/main.php&action=delete&delete_id=$id&grouping=group_template"); ?>">Delete</a>
          </td>
        </tr>
    
  <?php } ?>
  <?php } else {
        echo "<div id='setting-error-settings_updated' class='updated settings-error'>
          <p>
          <strong>Click \"Add New Group\" to create a new group.</strong>
          </p>
          </div>";
    }
    ?>



<?php 
}else{
  echo "<div id='setting-error-settings_updated' class='updated settings-error'>
      <p>
      <strong>Click \"Add New\" to create a new template.</strong>
      </p>
      </div>";
}
?>
</div></div>