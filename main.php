<?php
/**
* Plugin Name: Plugmatter Pricing Table Lite
* Plugin URI: http://plugmatter.com/pricing-table
* Description: Pricing table which increase your sales.
* Version: 1.0.32
* Author: Plugmatter
* Author URI: http://plugmatter.com/
**/

define('PMPT_PACKAGE', 'plugmatter_pricingtable_lite');
define('PMPT_VERSION', '1.0.32');
define('PMPT_PKG', 'Lite');
@define('PMPT_UPNOTE', "<span style='color:red;'>This feature is available in higher packages. <a href='//plugmatter.com/my/packages' target='_blank'><b>Upgrade Now!</b></a></span>");

//creating admin page
$pmpt_siteurl = get_option('siteurl');

define('PMPT_FILE_PATH', dirname(__FILE__));
define('PMPT_URL', plugin_dir_url( __FILE__ ));

register_activation_hook(__FILE__,'pmpt_install');
register_uninstall_hook(__FILE__ , 'pmpt_uninstall' );

function pmpt_install() {
  error_reporting(0);
    global $wpdb;
   
    $template_tbl_name = $wpdb->prefix.'pmpt_templates';
    $abtest_tbl_name = $wpdb->prefix.'pmpt_ab_test';
    $ab_stats_tbl_name = $wpdb->prefix.'pmpt_ab_stats';
    $group_tables  = $wpdb->prefix."pmpt_group_templates";

    $template_group = "CREATE TABLE IF NOT EXISTS $group_tables(
                        id INT(9) NOT NULL AUTO_INCREMENT,
                        name VARCHAR(128) NOT NULL,
                        params TEXT,
                        active INT(20),
                        UNIQUE KEY id(id)
                      )DEFAULT CHARSET=utf8;";
    $wpdb->query($template_group);

    
    $template_tbl = "CREATE TABLE IF NOT EXISTS $template_tbl_name (
        id INT(9) NOT NULL AUTO_INCREMENT,
        temp_name VARCHAR(80) NOT NULL,
        base_temp_name VARCHAR(80) NOT NULL,
        params TEXT,
        UNIQUE KEY id (id)
    ) DEFAULT CHARSET=utf8;";
    $wpdb->query($template_tbl);

    $abtest_tbl = "CREATE TABLE IF NOT EXISTS $abtest_tbl_name (
    id INT(9) NOT NULL AUTO_INCREMENT,
    compaign_name VARCHAR(80) NOT NULL,
    boxA VARCHAR(80) NOT NULL,
    boxB VARCHAR(100),
    params TEXT,
    start_date VARCHAR(80) NOT NULL,
    active VARCHAR(8),
    UNIQUE KEY id (id)
    ) DEFAULT CHARSET=utf8;";
    $wpdb->query($abtest_tbl);
    
    $ab_stats_tbl = "CREATE TABLE IF NOT EXISTS $ab_stats_tbl_name (
    id INT(9) NOT NULL AUTO_INCREMENT,
    date DATE NOT NULL,
    ab_id INT(9) NOT NULL,
    a_imp INT(9),
    b_imp INT(9),
    a_conv INT(9),
    b_conv INT(9),
    UNIQUE KEY id (id)
    ) DEFAULT CHARSET=utf8;";
    $wpdb->query($ab_stats_tbl); 
    
    if(get_option("PMPT_PACKAGE") != PMPT_PACKAGE) {
        delete_option('PMPT_PACKAGE');
        delete_option('PMPT_License');          
    }

    update_option("PMPT_AFID" , PMPT_AFID);  

}


function pmpt_uninstall() {
    global $wpdb;
    $template_tbl_name = $wpdb->prefix.'pmpt_templates';
    $abtest_tbl_name   = $wpdb->prefix.'pmpt_ab_test';
    $ab_stats_tbl_name = $wpdb->prefix.'pmpt_ab_stats';
    $group_tables      = $wpdb->prefix.'pmpt_group_templates';
    /* ------------------------------------------------------*/
     //       Retain Templates data by default              //
    /*------------------------------------------------------- 
      $structure = "drop table if exists $template_tbl_name";
      $wpdb->query($structure); 
      $structure2 = "drop table if exists $abtest_tbl_name";
      $wpdb->query($structure2);
      $structure3 = "drop table if exists $ab_stats_tbl_name";
      $wpdb->query($structure3);
    /*----------------------------------------------------------*/

    $delete_options = "DELETE FROM wp_options WHERE option_name LIKE 'pmpt_%' ";
    $wpdb->query($delete_options);
    delete_option('PMPT_PACKAGE');
    delete_option('PMPT_License');  

    delete_option("PMPT_AFID");
}

$template_id='';

function pmpt_display_tbl($atts) {
    if(!empty($atts["table"])){
        $pmpt_tbl_id = $atts["table"];
        $ab_meta = "";
      return  pmpt_frontend_display($pmpt_tbl_id, $ab_meta);    
    }else if(!empty($atts["abtest"])){
      return  pmpt_frontend_display($atts["abtest"]);
    }
}
add_shortcode('plugmatter_pricing', 'pmpt_display_tbl'); 
$pmpt_group_tables=1;
function pmpt_display_group_tbl($atts){
  global $wpdb,$template_id,$pmpt_group_tables;
  if(!empty($atts['table'])){
    $pmpt_grp_tbl_id = $atts['table'];
    $template_group_tbl_name = $wpdb->prefix.'pmpt_group_templates';
    $pmpt_group_tb = $wpdb->get_row($wpdb->prepare("SELECT * FROM  $template_group_tbl_name WHERE id = '%d'", $pmpt_grp_tbl_id));
    $templates_id  = json_decode($pmpt_group_tb->params);
    $pmpt_html_nav = "<ul class='pmpt_nav_tabs' id='pmpt_nav_tabs_".$pmpt_group_tables."'>";
    $pmpt_html_content = '<div class="pmpt_content" id="pmpt_content_'.$pmpt_group_tables.'">';
    $active = 0;
    
    
    foreach ($templates_id as $temp_id) {
      $get_template_html = pmpt_frontend_display($temp_id->id,'');
      if($temp_id->id==$pmpt_group_tb->active){
        $pmpt_html_nav.= "<li class='pmpt_active'>";  
      } else {
        $pmpt_html_nav.= "<li style='width:".$tot_width."'>";  
      }
      $pmpt_html_nav .= "<a href='#pmpt_section_".$pmpt_group_tables."' class='pmpt_tab'>".$temp_id->name."</a></li>";
      if($temp_id->id==$pmpt_group_tb->active){
        $pmpt_html_content .= "<div id='pmpt_section_".$pmpt_group_tables."' class='pmpt_tab_pane pmpt_content_active'>";  
      }else{
        $pmpt_html_content .= "<div id='pmpt_section_".$pmpt_group_tables."' class='pmpt_tab_pane'>";
      }
      
      $pmpt_html_content .= $get_template_html;
      $pmpt_html_content .= "</div>";
      $active++;
      $pmpt_group_tables++;
    }
    $pmpt_html_nav     .= '</ul>';
    $pmpt_html_content .= '</div>';
    return $pmpt_html_nav.$pmpt_html_content;
    // echo htmlspecialchars($pmpt_html_nav.'--<br>'.$pmpt_html_content);

  }
}

add_shortcode('plugmatter_group_pricing','pmpt_display_group_tbl');


function pmpt_admin_menu() {
  $pmpt_menu_lable = "Pricing Table Lite";
  
  add_menu_page('Pricing Table', $pmpt_menu_lable, 'manage_options',__FILE__, 'pmpt_template_page_callback',PMPT_URL.'images/icon.png');
  add_submenu_page( __FILE__,'Pricing Table - Templates','Templates', 'manage_options',__FILE__);
  add_submenu_page( __FILE__,'Plugmatter Pricing Table - Split Testing','Split-Testing', 'manage_options','pmpt_split_testing','pmpt_split_testing_callback');
  
  add_submenu_page( '', 'Plugmatter Pricing Table - License Page','','manage_options', 'pmpt_license_submenu_page','pmpt_license_submenu_page_callback' );
  add_submenu_page( '', 'Plugmatter Pricing Table - Edit Template','','manage_options', 'edit_pmpt_template_submenu_page','edit_pmpt_template_submenu_page_callback' );
  add_submenu_page( '', 'Plugmatter Pricing Table - Group Template','','manage_options','group_template','group_template_callback');
  add_submenu_page( '', 'Plugmatter Pricing Table - Split Test','','manage_options', 'add_split_test_submenu_page','add_split_test_submenu_page_callback' );  
  add_submenu_page( '', 'Plugmatter Pricing Table - View split test stats','','manage_options', 'split_test_stats_page','split_test_stats_page_callback' );
}
add_action('admin_menu', 'pmpt_admin_menu');

function pmpt_abtest($atts) {
    global $wpdb; 
    $date = date("Y-m-d");
    $pmpt_ab_id = $atts['abtest'];

    $template_tbl_name = $wpdb->prefix.'pmpt_templates';
    $abtest_tbl_name = $wpdb->prefix.'pmpt_ab_test';
    $ab_stats_tbl_name = $wpdb->prefix.'pmpt_ab_stats';

    $pmpt_tb = $wpdb->get_row($wpdb->prepare("SELECT * FROM $abtest_tbl_name WHERE id = '%d'", $pmpt_ab_id));
    $ab_id = $pmpt_tb->id;
    $boxA = $pmpt_tb->boxA;
    $boxB = $pmpt_tb->boxB;
    if ($pmpt_tb) {
        $pmpt_imprsn = $wpdb->get_row("SELECT id,SUM(a_imp) AS a_imp,SUM(b_imp) AS b_imp FROM $ab_stats_tbl_name WHERE date = '$date' AND ab_id = '$ab_id'");
       
        if($pmpt_imprsn->id){ 
            $a_imp = intval($pmpt_imprsn->a_imp);
            $b_imp = intval($pmpt_imprsn->b_imp);  
            $box = (($a_imp <= $b_imp) ? $boxA : $boxB);
            $ab_meta = "$ab_id:$box";
          return  pmpt_frontend_display($box, $ab_meta);
        } else {
            /*---------------------------------------------------*/
            // $ab_stats_tbl = $wpdb->prefix.'plugmatter_ab_stats'; 
            /*---------------------------------------------------*/
            $wpdb->query("INSERT INTO $abtest_tbl_name (date,ab_id,a_imp,b_imp,a_conv,b_conv) VALUES('$date','$ab_id',1,0,0,0)");
            $ab_meta = "$ab_id:$boxA";
          return  pmpt_frontend_display($boxA, $ab_meta);
        } 
    } else {
        echo "Please enter a valid AB Test id";
    }    
}
add_shortcode('plugmatter_pricing_splittest', 'pmpt_abtest');




function pmpt_frontend_display($tb_id, $pmpt_ab_meta) {
    global $wpdb,$template_id; 

    $template_tbl_name = $wpdb->prefix.'pmpt_templates';
    $abtest_tbl_name = $wpdb->prefix.'pmpt_ab_test';
    $ab_stats_tbl_name = $wpdb->prefix.'pmpt_ab_stats';
    
    $pmpt_tb = $wpdb->get_row($wpdb->prepare("SELECT * FROM  $template_tbl_name WHERE id = '%d'", $tb_id));

    if($pmpt_tb) {      
        $temp_name    = $pmpt_tb->base_temp_name;
        $pmpt_params  = $pmpt_tb->params;
        $pmpt_dataarr = json_decode($pmpt_params, true);        
        $template_id  = $tb_id;    
        require_once(PMPT_FILE_PATH."/pmpt_lightncandy.php");
        wp_enqueue_style('pmpt_bootstrap');
        wp_enqueue_style('pmpt_button_style');
        wp_enqueue_style('pmpt_fontawesome_style');
        // echo $temp_name;
        wp_enqueue_style('pmpt_tempstyle_'.$template_id, plugins_url('/templates/'.$temp_name.'/style.css',__FILE__),array(),PMPT_VERSION);
        $template = file_get_contents(PMPT_FILE_PATH.'/templates/'.$temp_name.'/template.php');
        
        $phpStr = pmpt_LightnCandy::compile($template, Array(
            'flags' => pmpt_LightnCandy::FLAG_SPVARS | pmpt_LightnCandy::FLAG_PARENT | pmpt_LightnCandy::FLAG_THIS |  pmpt_LightnCandy::FLAG_HANDLEBARSJS,
            'hbhelpers' => Array(
                                  'container_editor' => function(){
                                    global $template_id;
                                    return $template_id;
                                  },
                                  'feature_name' => function( $feature_list, $index ) {
                                                  return $feature_list[$index]['pmpt_value'];  
                                                },
                                 'column_space' => function( $feature_value, $flag ) {
                                                    if(($feature_value == 'pmpt_overlaped' && $flag) || ($feature_value == 'pmpt_overlaped' && !$flag)){
                                                      return '';
                                                    }else {
                                                      return $feature_value;
                                                    }
                                                  },  
                                  't_text' => function( $feature_value, $index) {
                                                if(strtolower(trim($feature_value)) == 'yes' || strtolower(($feature_value)) == 'no'){
                                                  return 'pmpt_hide_cell';
                                                } else if(strtolower(($feature_value)) != 'yes' || strtolower(($feature_value)) !='no'){
                                                  return  'pmpt_show_cell';
                                                }
                                              },
                                                
                                  't_icon' => function( $feature_value, $icon_no ) {
                                                if(strtolower($feature_value) == 'yes'){
                                                  return  'icon-pmpt-ico-check'.$icon_no;
                                                }else if(strtolower($feature_value) == 'no'){
                                                  return 'icon-pmpt-ico-cross'.$icon_no;    
                                                }     
                                              },
                                  'overlap_space' => function( $feature_value, $flag ) {
                                                    if($feature_value == 'pmpt_overlaped' && $flag){
                                                      return 'pmpt_overlaped';
                                                    } else {
                                                      return '';
                                                    }  
                                                  }


                                )
        )); 
        


        $renderer = pmpt_LightnCandy::prepare($phpStr);

        // print_r($renderer);

        $pmpt_gfonts = array();
        $col_index = 0;
        $feat_index = 0;
        if($pmpt_ab_meta) {
          echo "<div id='pmpt_ab_meta' pmpt_ab_meta='$pmpt_ab_meta' ></div>";    
        }
        

        $get_fonts = json_decode(get_gfonts_inlinecss($pmpt_dataarr));
        $pmpt_gfonts = $get_fonts->pmpt_gfonts;
        $pmpt_custom_css = $get_fonts->pmpt_custom_css;
        wp_register_style('pmpt_ccss_inline',plugins_url('css/pmpt_custom_inline.css',__FILE__),array(),PMPT_VERSION);
        
        wp_add_inline_style( 'pmpt_ccss_inline', $pmpt_custom_css  );
        wp_enqueue_style('pmpt_ccss_inline');  

        
        
        if( !empty($pmpt_gfonts)){
          wp_enqueue_style('pmpt_gfreg', "//fonts.googleapis.com/css?family=".implode("|", array_filter($pmpt_gfonts)),array(), PMPT_VERSION);  
        }
                
        wp_enqueue_script('pmpt_frontend_js');
        wp_enqueue_style('pmpt_cross_tick');
        wp_enqueue_style('pmpt_style');

        return $renderer($pmpt_dataarr);
    } else {
        return "Please enter valid pricing table id";
    }  
}

function pmpt_license_submenu_page_callback() {
  pmpt_js_globals();
  include('license.php');
}

function pmpt_template_page_callback() {
  pmpt_js_globals();

  if(get_option('PMPT_License') != "") {
      include('templates.php'); 
    } else {
     include('license.php');    
  } 
}

function pmpt_split_testing_callback() {
  pmpt_js_globals();
  
  if(get_option('PMPT_License') != "") {
    include('split_test.php');
  } else {
    include('license.php');    
  } 
}

function add_split_test_submenu_page_callback() {
  pmpt_js_globals();
  include('add_split_test.php');
}

function split_test_stats_page_callback() {
  pmpt_js_globals();
 
  wp_enqueue_script('pmpt_jqueryflot');
  wp_enqueue_script('pmpt_excanvas_min');     

  include('split_test_stats.php');
}

function group_template_callback(){
  wp_enqueue_style('pmpt_style');
  wp_enqueue_style('pmpt_bootstrap');
  wp_enqueue_style('pmpt_cross_tick');
  wp_enqueue_script('pmpt_grouping');

  // wp_enqueue_script('pmpt_inline_edit');

  include 'group_template.php';
}

function edit_pmpt_template_submenu_page_callback() {
  pmpt_js_globals();

  wp_enqueue_script('pmpt_modernizr');
  wp_enqueue_script('pmpt_elastislide');
  wp_enqueue_script('pmpt_handlebar');
  
  wp_enqueue_script('pmpt_codemirror_js');
  wp_enqueue_script('pmpt_codemirror_css_js');
  
  wp_enqueue_style('pmpt_bootstrap');
  wp_enqueue_style('pmpt_elastislide_style');
  wp_enqueue_style('pmpt_fontawesome_style');
  wp_enqueue_style('pmpt_button_style');
  wp_enqueue_style('pmpt_cross_tick');
  wp_enqueue_style('pmpt_style');
  wp_enqueue_style( 'wp-color-picker' );

  wp_enqueue_style('pmpt_codemirror_css');
  wp_enqueue_style('pmpt_toolbox_style');
  wp_enqueue_script('media-upload');
  wp_enqueue_script('thickbox');
  wp_enqueue_media();
  wp_enqueue_script('pmpt_image_uploader');
  
  wp_enqueue_script('pmpt_cell_editor_script');

  wp_enqueue_script('pmpt_col_editor_script');
  wp_enqueue_script('pmpt_button_editor_script');
  wp_enqueue_script('pmpt_inline_edit');

  include('edit_template.php');
}

function pmpt_load_template() {
    $tem_name = $_POST["temp_name"];
    echo file_get_contents(PMPT_FILE_PATH . "/templates/". $tem_name . "/template.php");
    die();
}
add_action('wp_ajax_pmpt_load_template', 'pmpt_load_template');

function pmpt_js_globals() {
    echo "<script type='text/javascript'>
            var pmpt_plugin_url = '".plugin_dir_url( __FILE__ )."';
            var wp_admin_url = '".admin_url('admin-ajax.php')."';
            var pmpt_fonts = ".file_get_contents(PMPT_FILE_PATH.'/js/gfonts.json').";
            var pmpt_params = null;
            var pmpt_default_params = null;
            var pmpt_temp_type = null;
          </script>";
}

function get_gfonts_inlinecss($front_params){
  global $template_id;
  if(!$template_id){
    $template_id='1';
  }
  $pmpt_gfonts = array(); //[];  
  $pmpt_append_custom_css = '';
  $bg_clr = '';

  if($_POST){
    $params = $_POST["pmpt_params"];
  }else{
    $params = $front_params;
  }
  $pmpt_temp_type = $params['pmpt_temp_type'];
  $template_parent = '';
  $check_template_type = '';
  if(!empty($params)){

    $pmpt_append_custom_css .= '#pmpt_container_'.$template_id. '{';
    $pmpt_append_custom_css .= 'max-width:'.$params['pmpt_con_width'].'px;';
    $pmpt_append_custom_css .= 'margin-top:'.$params['pmpt_tmargin'].'px;';
    $pmpt_append_custom_css .= 'margin-bottom:'.$params['pmpt_bmargin'].'px;';
    $pmpt_append_custom_css .= '}';
    
    foreach ($params as $param_key => $param_value) {

      if($param_value == "STEPS"){
        $template_parent = '#pmpt_container_'.$template_id.' .pmpt_no_padding ';
        $check_template_type = 'STEPS';
      }else if($param_value == 'CARDS'){
        $template_parent = '#pmpt_container_'.$template_id.' .pmpt_no_padding ';
        $check_template_type = 'CARDS';
      }else if($param_value == 'MATRIX'){
        $template_parent = '#pmpt_container_'.$template_id.' .pmpt_pkgs_container .pmpt_no_padding ';
        $check_template_type = 'MATRIX';
      }

      if(is_array($param_value)){
        if ($param_key == "pmpt_features_list") {
          if(!empty($param_value)){
            foreach ($param_value as $ftr_key => $ftr_value) {
              if(!empty($ftr_value["pmpt_style"])){
                $pmpt_append_custom_css .= '#pmpt_container_'.$template_id.' .pmpt_no_padding .pmpt_matrix_box_con '.".pmpt_feat_cell_".$ftr_key."{";
                foreach ($ftr_value["pmpt_style"] as $css_key => $css_value) {
                  if($css_key == "font_family" && !in_array(urlencode($css_value), $pmpt_gfonts)){
                    $pmpt_gfonts[] = urlencode($css_value);
                  }
                  $css_key = str_replace('_', '-', $css_key);
                  $pmpt_append_custom_css .= $css_key." : " .$css_value." !important;";
                }
                $pmpt_append_custom_css .= "}";
              }
            }
          } 
        } else if ($param_key == "pmpt_packages") {
          if(!empty($param_key)){
            
            foreach ($param_value as $col_key => $col_value) {
              // $check_featured_column = ' ';  
              // echo "<hr/>";
              //   echo $col_value['pmpt_featured'];
              //   var_dump($col_value['pmpt_featured']);
              // echo "<hr/>";

              //if($check_template_type=='MATRIX'){
                // if($col_value['pmpt_featured']){
                //   $check_featured_column = ' .pmpt_feature_column ';
                // }else{
                //   $check_featured_column = ' .pmpt_column ';
                // }
              //}
              foreach($col_value as $pkg_key => $pkg_value){
                
                if($pkg_key == "pmpt_features"){
                  if(!empty($pkg_value)){
                    foreach ($pkg_value as $ftr_key => $ftr_value) {
                      if(!empty($ftr_value["pmpt_style"])) {
                        $pmpt_append_custom_css .= $template_parent.$check_featured_column.".pmpt_cell_".$col_key.$ftr_key."{";
                        foreach ($ftr_value["pmpt_style"] as $css_key => $css_value) {
                          if($css_key == "font_family" && !in_array(urlencode(trim($css_value)), $pmpt_gfonts)){
                            $pmpt_gfonts[] = urlencode($css_value);
                          }
                            $css_key = str_replace('_', '-', $css_key);
                            $pmpt_append_custom_css .= $css_key." : " .$css_value.";";
                          }
                          if($pmpt_temp_type != 'MATRIX' && ($ftr_value['pmpt_value'] == 'no' || trim($ftr_value['pmpt_value']) == '') ){
                            $pmpt_append_custom_css .= "display : none;"; 
                          }  
                          $pmpt_append_custom_css .= "}";
                      }else if($pmpt_temp_type != 'MATRIX' && ($ftr_value['pmpt_value'] == 'no' || trim($ftr_value['pmpt_value']) == '') ){
                        $pmpt_append_custom_css .= $template_parent.$check_featured_column.".pmpt_cell_".$col_key.$ftr_key."{";  
                        $pmpt_append_custom_css .= "display : none;"; 
                        $pmpt_append_custom_css .= "}"; 
                      }
                    }
                  }
                } else if( $pkg_key == "pmpt_button") {
                  if(!empty($pkg_value)){
                     if(strpos($pkg_value['pmpt_btn_class'],'ghost') !== false){
                      $pmpt_append_custom_css .= $template_parent.$check_featured_column.".pmpt_btn_".$col_key." {"; 
                      $pmpt_append_custom_css .= 'color:'.$pkg_value['pmpt_bg_clr'].' !important;';
                      $pmpt_append_custom_css .= 'background-color: transparent !important;';
                      $pmpt_append_custom_css .= "}"; 

                      $pmpt_append_custom_css .= $template_parent.$check_featured_column.".pmpt_btn_".$col_key.":hover{"; 
                      $pmpt_append_custom_css .= 'background-color:'.$pkg_value['pmpt_bghover_clr'].' !important;';
                      $pmpt_append_custom_css .= 'color: white !important;';
                      $pmpt_append_custom_css .= "}"; 
                    } else if(strpos($pkg_value['pmpt_btn_class'],'flat') !== false){

                      $pmpt_append_custom_css .= $template_parent.$check_featured_column.".pmpt_btn_".$col_key." {"; 
                      $pmpt_append_custom_css .= 'background-color:'.$pkg_value['pmpt_bg_clr'].' !important;';
                      $pmpt_append_custom_css .= "}"; 

                      $pmpt_append_custom_css .= $template_parent.$check_featured_column.".pmpt_btn_".$col_key.":hover{"; 
                      $pmpt_append_custom_css .= 'background-color:'.$pkg_value['pmpt_bghover_clr'].' !important;';
                      $pmpt_append_custom_css .= "}"; 
                    }
                  }        
                } else if($pkg_key == "pmpt_style") {
                  if(!empty($pkg_value)){
                    
                    $pmpt_append_custom_css .= $template_parent.".pmpt_column_".$col_key." {"; 
                    foreach ($pkg_value as $css_key => $css_value) {
                      if($css_key == "font_family" && !in_array(urlencode($css_value), $pmpt_gfonts)){
                        $pmpt_gfonts[] = urlencode($css_value);
                      }
                      if($css_key == 'background_color' && $pmpt_temp_type == 'STEPS') {
                        $bg_clr = $css_value; continue; 
                      }
                      $css_key = str_replace('_', '-', $css_key);
                      $pmpt_append_custom_css .= $css_key." : " .$css_value.";";
                    }
                    $pmpt_append_custom_css .= "}";
                    if($pmpt_temp_type == 'STEPS'){
                      $pmpt_append_custom_css .= $template_parent.".pmpt_header_".$col_key."{";
                      $pmpt_append_custom_css .= "background-color:".$bg_clr ." !important;";
                      $pmpt_append_custom_css .= "}";  
                    }                  
                  }
                } else if($pkg_key == "pmpt_featured_style" && $col_value['pmpt_featured']) {
                  if(!empty($pkg_value)){
                    
                    $pmpt_append_custom_css .= $template_parent.".pmpt_feature_column {"; 
                    foreach ($pkg_value as $css_key => $css_value) {
                      if($css_key == "font_family" && !in_array(urlencode($css_value), $pmpt_gfonts)){
                      $pmpt_gfonts[] = urlencode($css_value);
                    }
                    if($css_key == 'background_color' && $pmpt_temp_type == 'STEPS') { $bg_clr = $css_value; continue; };
                      $css_key = str_replace('_', '-', $css_key);
                      $pmpt_append_custom_css .= $css_key." : " .$css_value.' !important;';
                    }

                    $pmpt_append_custom_css .= "}";
                    if($pmpt_temp_type == 'STEPS'){
                      $pmpt_append_custom_css .= $template_parent.".pmpt_feature_column .pmpt_header_".$col_key."{";
                      $pmpt_append_custom_css .= "background-color:".$bg_clr ." !important;";
                      $pmpt_append_custom_css .= "}";  
                    } 
                  }  
                } else {
                  // pkg_key is boolean value, so skip
                  if($pkg_key == "pmpt_featured") continue;  
                  
                  if(!empty($pkg_value["pmpt_style"])){
                    
                    $pmpt_append_custom_css .= $template_parent.".".$pkg_key."_".$col_key." {"; 
                    foreach ($pkg_value["pmpt_style"] as $css_key => $css_value) {
                      if($css_key == "font_family" && !in_array(urlencode($css_value), $pmpt_gfonts)){
                        $pmpt_gfonts[] = urlencode($css_value);
                      }
                      $css_key = str_replace('_', '-', $css_key);
                      $pmpt_append_custom_css .= $css_key.":" .$css_value.";";
                    }
                    $pmpt_append_custom_css .= "}";
                  }  
                }
              }
            }
          }
        }else{
          if(!empty($param_value['pmpt_style'])){

            if($check_template_type != 'MATRIX' && $param_key == 'pmpt_matrix_box') continue;

            $pmpt_append_custom_css .= $template_parent.".".$param_key." {";
            foreach ($param_value['pmpt_style'] as $css_key => $css_value) {
              if($css_key == "font_family" && !in_array(urlencode($css_value), $pmpt_gfonts)){
                $pmpt_gfonts[] = urlencode($css_value);
              }
              $css_key = str_replace('_', '-', $css_key);
              $pmpt_append_custom_css .= $css_key.":" .$css_value.";";
            }
            $pmpt_append_custom_css .= "}";
          } 
        }
      } else if (is_object($param_value)) {
          if(!empty($param_value->pmpt_style)){

            $pmpt_append_custom_css .= $template_parent.".".$param_key." {";
            foreach ($param_value->pmpt_style as $css_key => $css_value) {
              if($css_key == "font_family" && !in_array(urlencode($css_value), $pmpt_gfonts)){
                $pmpt_gfonts[] = urlencode($css_value);
              }
              $css_key = str_replace('_', '-', $css_key);
              $pmpt_append_custom_css .= $css_key.":" .$css_value.";";
            }
            $pmpt_append_custom_css .= "}";
          }  
      }
    }
  }
  $pmpt_append_custom_css .= $params['pmpt_custom_css'];
  
  if($_POST) {
    echo json_encode(array("pmpt_gfonts" => $pmpt_gfonts, "pmpt_custom_css" => $pmpt_append_custom_css));    
  } else {
    return json_encode(array("pmpt_gfonts" => $pmpt_gfonts, "pmpt_custom_css" => $pmpt_append_custom_css));     
  }
  
  die();
}
add_action('wp_ajax_inlinecss_for_edit_template', 'get_gfonts_inlinecss');

function pmpt_admin_scripts($hook) {
  
  $pkg_ext = strtolower(PMPT_PKG);
  if( $hook == 'toplevel_page_plugmatter_pricingtable_'.$pkg_ext.'/main' || $hook == 'pricing-table_page_pmpt_split_testing' ||  $hook == 'pricing-table-'.$pkg_ext.'_page_pmpt_split_testing' ||
      $hook == 'admin_page_add_split_test_submenu_page' || $hook == 'admin_page_pmpt_license_submenu_page' || 
      $hook == 'admin_page_split_test_stats_page' || $hook == 'admin_page_edit_pmpt_template_submenu_page'){
      wp_enqueue_style('pmpt_fontawesome_style');
      wp_enqueue_style('pmpt_style');
      wp_enqueue_style('pmpt_support_style');
      wp_enqueue_script('pmpt_pmsupport');
  }
  if($hook == 'admin_page_add_split_test_submenu_page'){
    wp_enqueue_script('pmpt_script');
  }
}
add_action('admin_enqueue_scripts', 'pmpt_admin_scripts');

function pmpt_frontend_scripts() {
  wp_enqueue_style('pmpt_bootstrap');
  wp_enqueue_style('pmpt_fontawesome_style');
  wp_enqueue_style('pmpt_button_style');
    
  wp_enqueue_script('pmpt_frontend_js');
  
}
add_action( 'wp_enqueue_scripts', 'pmpt_frontend_scripts' );


function pmpt_register_all_scripts() {
  wp_register_script('pmpt_modernizr', plugins_url('/js/modernizr.custom.17475.js', __FILE__),array('jquery'),PMPT_VERSION,true);
  wp_register_script('pmpt_elastislide', plugins_url('/js/jquery.elastislide.js', __FILE__),array('jquery'),PMPT_VERSION,true);
  wp_register_script('pmpt_handlebar', plugins_url('/js/handlebars-v2.0.0.js', __FILE__),array('jquery'),PMPT_VERSION,true);


  wp_register_script('pmpt_grouping',plugins_url('js/grouping_template.js',__FILE__),array('jquery'),PMPT_VERSION,true);
  
  wp_register_script('pmpt_image_uploader', plugins_url('js/pmpt_image_uploader.js', __FILE__), array('jquery','media-upload','thickbox'),PMPT_VERSION,true);
  wp_register_script('pmpt_codemirror_js',plugins_url('js/pmpt_codemirror.js', __FILE__), array('jquery'),PMPT_VERSION,true);
  wp_register_script('pmpt_codemirror_css_js', plugins_url('js/pmpt_codemirror_css.js', __FILE__), array('jquery','pmpt_codemirror_js'),PMPT_VERSION,true);
  wp_register_script('pmpt_cell_editor_script', plugins_url('/js/pmpt_cell_editor.js', __FILE__),array('jquery','wp-color-picker'),PMPT_VERSION,true);
  wp_register_script('pmpt_col_editor_script', plugins_url('/js/pmpt_col_editor.js', __FILE__),array('jquery','wp-color-picker'),PMPT_VERSION,true);
  wp_register_script('pmpt_button_editor_script', plugins_url('/js/pmpt_button_editor.js', __FILE__),array('jquery','wp-color-picker'),PMPT_VERSION,true);
  wp_register_script('pmpt_inline_edit', plugins_url('/js/pmpt_inline_edit.js', __FILE__),array('jquery'),PMPT_VERSION,true);
  wp_register_script('pmpt_frontend_js',plugins_url('js/pmpt_frontend.js', __FILE__), array('jquery'),PMPT_VERSION,true);

  /* pm support script */
  wp_register_style('pmpt_support_style', '//plugmatter.com/css/pm_support_widget.css',array(),PMPT_VERSION);
  if(get_option('PMPT_License') != ''){
    $pmpt_hash = explode("-",get_option('PMPT_License'));
    wp_register_script('pmpt_pmsupport','//plugmatter.com/js/pm_support_widget.js?pid=pmpt&pkg='.PMPT_PACKAGE.'&hash='.$pmpt_hash[0].'-'.$pmpt_hash[5], array('jquery'),PMPT_VERSION,true);  
  } else {
    wp_register_script('pmpt_pmsupport','//plugmatter.com/js/pm_support_widget.js?pid=pmpt&pkg='.PMPT_PACKAGE.'&hash=undefined', array('jquery'),PMPT_VERSION,true);  
  }
  
    
  /* split test */
  wp_register_script('pmpt_jqueryflot',plugins_url('js/jquery.flot.js', __FILE__), array('jquery'),PMPT_VERSION,true);
  wp_register_script('pmpt_excanvas_min',plugins_url('js/excanvas.min.js', __FILE__), array('jquery'),PMPT_VERSION,true);
  /* ------------ */
  
  wp_register_style('pmpt_elastislide_style', plugins_url('/css/elastislide.css',__FILE__),array(),PMPT_VERSION);
  wp_register_style('pmpt_style',plugins_url('/css/style.css',__FILE__),array(),PMPT_VERSION);
  wp_register_style('pmpt_toolbox_style',plugins_url('/css/pmpt_toolbox.css',__FILE__),array(),PMPT_VERSION);
  wp_register_style('pmpt_button_style',plugins_url('/css/pmpt_buttons.css',__FILE__),array(),PMPT_VERSION);
  wp_register_style('pmpt_bootstrap',plugins_url('/css/pmpt_responsivegrid.css',__FILE__),array(),PMPT_VERSION);
  wp_register_style('pmpt_cross_tick',plugins_url('/css/pmpt_tick_cross.css',__FILE__),array(),PMPT_VERSION);
  wp_register_style('pmpt_codemirror_css',plugins_url('/css/pmpt_codemirror.css',__FILE__),array(),PMPT_VERSION);
  wp_register_style('pmpt_fontawesome_style','//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css',array(),PMPT_VERSION);
}
add_action( 'wp_loaded', 'pmpt_register_all_scripts' );
