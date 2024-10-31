<div id='pmpt_container_{{container_editor}}' class='pmpt_container pmpt_basecamp' pmpt_meta_id='{{this.pmpt_tname}}'>  
   {{#each pmpt_packages}}
      <div class='{{../pmpt_bs_cls}} {{column_space ../pmpt_ttype this.pmpt_featured}} pmpt_no_padding'> 
        <div  class='pmpt_column {{#if this.pmpt_featured}} pmpt_feature_column {{overlap_space ../../pmpt_ttype this.pmpt_featured}} {{else}} pmpt_column_{{@index}} {{/if}}' data-col-index='{{@index}}'>
          <div class='pmpt_main_heading pmpt_main_heading_{{@index}}' data-col-index='{{@index}}'>
            {{{this.pmpt_main_heading.pmpt_value}}}
          </div>
          
          <div class='pmpt_img pmpt_img_{{@index}} ' data-col-index='{{@index}}'>
            <img class='chg_img chg_img_{{@index}}' src='{{pmpt_img_url.pmpt_value}}' {{#unless pmpt_img_url.pmpt_value}} style='display:none;' {{/unless}}>
          </div>
          
          <div class='pmpt_price pmpt_price_{{@index}}' data-col-index='{{@index}}'>
            {{{this.pmpt_price.pmpt_value}}}
          </div>
          <div class='pmpt_subscription_type pmpt_subscription_type_{{@index}}' data-col-index='{{@index}}'>
            {{{this.pmpt_subscription_type.pmpt_value}}}
          </div>
          <div class='pmpt_sub_heading pmpt_sub_heading_{{@index}}' data-col-index='{{@index}}'>
            {{{this.pmpt_sub_heading.pmpt_value}}}
          </div>
          <hr class='pmpt_heading_hr' />
          {{#each this.pmpt_features}}
          <div id='pmpt_cell_{{@../index}}{{@index}}' class='pmpt_cell  pmpt_uline pmpt_cell_{{@../index}}{{@index}}' data-col-index='{{@../index}}' data-cell-index='{{@index}}' data-feature='{{feature_name ../../pmpt_features_list @index}}' data-tooltip='{{this.pmpt_tooltip}}'>        
            {{{this.pmpt_value}}}        
            {{#if this.pmpt_tooltip}}
              <span class='pmpt_cell_tooltip' data-tooltip="{{this.pmpt_tooltip}}"><i class='fa fa-info-circle'></i></span>
            {{/if}}
          </div>
          {{/each}}  
          <a href='{{this.pmpt_button.pmpt_url}}' target='_blank' class='{{this.pmpt_button.pmpt_btn_class}} pmpt_btn_{{@index}}' data-col-index='{{@index}}'><span class="pmpt_btn_ico"><i class="{{this.pmpt_button.pmpt_btn_left_ico}}">&nbsp;</i></span><span class="pmpt_btn_txt"><span class="pmpt_btn_txt_main">{{{this.pmpt_button.pmpt_btn_txt_main}}}</span><span class="pmpt_btn_txt_sub">{{{this.pmpt_button.pmpt_btn_txt_sub}}}</span></span><span class="pmpt_btn_ico"><i class="{{this.pmpt_button.pmpt_btn_right_ico}}">&nbsp;</i></span></a>          
        </div>  
      </div>
    {{/each}}
  </div>
<div class='pmpt_clearfix'></div>



