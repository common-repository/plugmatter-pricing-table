<?php 
global $wpdb;
$table = $wpdb->prefix.'pmpt_templates';

$id = "";
$temp_name = "";
$base_temp_name = "";
$pmpt_ttype = "";
$pmpt_con_width="960";
$pmpt_tmargin = "0";
$pmpt_bmargin = "0";
$params = "";
$pmpt_custom_css = "";
//------------------

if($_GET['action']=="edit" && $_GET['template_id']!='') {
 $temp_id= $_GET['template_id'];
 $pmpt_temp = $wpdb->get_row("SELECT id,temp_name,base_temp_name,params FROM $table WHERE id= $temp_id");
  $id = $pmpt_temp->id;
  $temp_name = $pmpt_temp->temp_name;
  $base_temp_name = $pmpt_temp->base_temp_name;
  $params = $pmpt_temp->params;
  $getalign = json_decode($params);
  $pmpt_ttype = $getalign->pmpt_ttype;
  $pmpt_con_width = $getalign->pmpt_con_width;
  $pmpt_tmargin = $getalign->pmpt_tmargin;
  $pmpt_bmargin = $getalign->pmpt_bmargin;  
  if($getalign->pmpt_custom_css){
    $pmpt_custom_css = json_encode($getalign->pmpt_custom_css); 
  }      
}

?>
<div class='pmadmin_wrap'>
	<div class='pmadmin_headbar'>
		<div class='pmadmin_pagetitle'><h2>Template Editor <?php if($_GET['action']=="edit"){ ?> <a href="<?php echo admin_url("admin.php?page=edit_pmpt_template_submenu_page&action=insert"); ?>">Add New</a> <?php } ?> </h2> </div>
	  <div class='pmadmin_logodiv'><img src='<?php echo PMPT_URL."images/pmpt_logo.png";?>' height='35'></div>
	</div>
	<div class='pmadmin_body'>
    <?php if($_GET['action'] == "insert") { ?>

  	<div class="pmpt_base_temp_gallery">
      <ul id="pm_carousel" class="elastislide-list">
    	<?php
				$dir = plugin_dir_path(__FILE__) . "templates/";
				$list = scandir($dir);
				foreach ($list as $v) {	
				if(($v != ".") && ($v != "..")){
				?>
      <li> 
      	<a href="#" id="<?php echo $v; ?>" >
      		<img src='<?php echo PMPT_URL."templates/".$v."/tmp_img.jpg" ?>' alt="pricing_table" />
          <p><?php echo $v; ?></p>
      	</a>
      </li>      
      			<?php 
				} }
				?>
    </ul>
    </div>
 
  <?php } $plugin_dir_name = dirname(plugin_basename(__FILE__));?>
  <form name='pmpt_form' id="pmpt_form_table" action="<?php echo admin_url('admin.php?page='.$plugin_dir_name.'/main.php'); ?>" method="POST">
    <div class="" id="pmpt_template_toolbar" >
      <div id="pmpt_temp_details">
        <input type="text" name="temp_name" id="temp_name" class=""  value="<?php echo $temp_name; ?>" placeholder="Enter template name" required>
        <input type="hidden" id="action" name="action" value="<?php echo $_GET['action']; ?>">
        <input type="hidden" id="template_id"  name="template_id" value="<?php echo $id; ?>">
        <input type="hidden" id="base_temp_name" name="base_temp_name" value="<?php echo $base_temp_name; ?>">        
      </div>
      <div id="pmpt_template_opts">
        <div id="pmpt_cont_width" class="pmpt_toolbar_opts">
          <div class="pmpt_opts_heading">Container Width/Margin <small>(In Pixels)</small></div>
          <label for="pmpt_con_width" >Width</label>
          <input type='text' size='3' maxlength='4' name='pmpt_con_width' id='pmpt_con_width' value='<?php echo $pmpt_con_width; ?>' />&nbsp;&nbsp;
          <label for="pmpt_tmargin">Top</label>
          <input type='text' size='2' maxlength='3' name='pmpt_tmargin' id='pmpt_tmargin' value='<?php echo $pmpt_tmargin; ?>' />&nbsp;&nbsp;
          <label for="pmpt_bmargin">Bottom</label>
          <input type='text' size='2' maxlength='3' name='pmpt_bmargin' id='pmpt_bmargin' value='<?php echo $pmpt_bmargin; ?>' />
        </div>
        <div id="pmpt_tick_cross_con" class="pmpt_toolbar_opts">
         <div class="pmpt_opts_heading">Check/Cross &nbsp;&nbsp;</div> 
          <div id='pmpt_used_tc'><span class="icon icon-pmpt-ico-check1"></span><span class="icon icon-pmpt-ico-cross1"></div>
          <ul id="pmpt_tick_cross">
            <li data-tc='1'><span class="icon icon-pmpt-ico-check1"></span><span class="icon icon-pmpt-ico-cross1"></span></li>
            <li data-tc='2'><span class="icon icon-pmpt-ico-check2"></span><span class="icon icon-pmpt-ico-cross2"></span></li>
            <li data-tc='3'><span class="icon icon-pmpt-ico-check3"></span><span class="icon icon-pmpt-ico-cross3"></span></li>
            <li data-tc='4'><span class="icon icon-pmpt-ico-check4"></span><span class="icon icon-pmpt-ico-cross4"></span></li>
            <li data-tc='5'><span class="icon icon-pmpt-ico-check5"></span><span class="icon icon-pmpt-ico-cross5"></span></li>
            <li data-tc='6'><span class="icon icon-pmpt-ico-check6"></span><span class="icon icon-pmpt-ico-cross6"></span></li>
            <li data-tc='7'><span class="icon icon-pmpt-ico-check7"></span><span class="icon icon-pmpt-ico-cross7"></span></li>
            <li data-tc='8'><span class="icon icon-pmpt-ico-check8"></span></li>
            <li data-tc='9'><span class="icon icon-pmpt-ico-check9"></span></li>
            <li data-tc='10'><span class="icon icon-pmpt-ico-check10"></span></li>
            <li data-tc='11'><span class="icon icon-pmpt-ico-check11"></span></li>
          </ul>
        </div> 
        <div id="pmpt_column_type" class="pmpt_toolbar_opts">
          <div class="pmpt_opts_heading">Column Space Type</div>
           <img src="<?php echo PMPT_URL."images/cs1.png";?>" id="pmpt_attached"  class="pmpt_ttype pmpt_tooltip" data-title='Attached'>
           <img src="<?php echo PMPT_URL."images/cs3.png";?>" id="pmpt_overlaped" class="pmpt_ttype pmpt_tooltip" data-title='Overlaped'>
           <img src="<?php echo PMPT_URL."images/cs2.png";?>" id="pmpt_seperated" class="pmpt_ttype pmpt_tooltip" data-title='Seperated'>
          <input type="hidden" name="pmpt_ttype" id="pmpt_ttype" value="<?php if(!empty($pmpt_ttype)) echo $pmpt_ttype; ?>">
        </div>     
        <div id="" class="pmpt_toolbar_opts">
            <div class="pmpt_opts_heading">Manage Features/Packages</div>
            <div id="pmpt_add_row" class="pmpt_add_new_actn pmpt_tooltip" data-title="Add new feature"><i class="fa fa-plus-circle fa-1x"></i> Feature &nbsp;</div>
            <div id="pmpt_add_column" class="pmpt_add_new_actn pmpt_tooltip" data-title="Add new Package"><i class="fa fa-plus-circle fa-1x"></i> Package &nbsp;</div>
        </div>
        <div class="pmpt_toolbar_opts">
          <div id="pmpt_enable_sorting" class="pmpt_opts_heading">    
            Enable Sorting
          </div>
          <div class='pmpt_tgl_btn pmpt_tooltip' id="pmpt_tgl_btn" data-title='Enable sorting feature will allow you to drag and drop rows and columns within the pricing table'>
            <input type="checkbox" id="pmpt_enable_sort" name="pmpt_enable_sort" class="switch"  value='0' />
            <label for="pmpt_enable_sort">&nbsp;</label>
          </div>
        </div>
      </div>
    </div>
    <div id="ajax_load_template"></div>
    <div>
      <a id="pmpt_add_custom_css" href="#">Custom CSS (Advance Users)</a><br/>
      <textarea name='pmpt_custom_css' id='pmpt_custom_css' rows="10" cols="45" style="display:none;"></textarea>
    </div>
    <div id="pmpt_actns" class="">
      <input class="pmpt_primary_buttons" id="pmpt_save_btn" type="button" value="     Save Template    "> &nbsp;&nbsp;
      <input class="pmpt_secondary_buttons" id="pmpt_cancel_btn" type="button" value=" Cancel " onclick="location.href='<?php echo admin_url("admin.php?page=".$plugin_dir_name."/main.php"); ?>'">  
    </div>
  </form> 
<script type="text/javascript" id='pmpt_sameer'>
  <?php if($params){  echo  "pmpt_params = ".$params.";"; } ?>
</script>
