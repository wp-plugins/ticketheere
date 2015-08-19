<?php
/*
Plugin Name: TicketHeere
Plugin URI: http://wordpress.org/extend/plugins/ticketheere/
Description: This plugin adds a widget and a shortcode to WP for easy integration of TicketHeere - Event ticketing
Author: DeJonckHeere
Author URI: http://www.dejonckheere.nl/
Version: 0.3
*/

define('DJHSET','');


/**
 * Create TicketHeere widget
 */
class TicketHeereWidget extends WP_Widget
{
	// Register Widget
	function __construct()
	{
		$widget_ops = array('classname' => 'TicketHeereWidget', 'description' => __( 'Displays your TicketHeere webshop', 'ticketheere' ) );
		parent::__construct('TicketHeereWidget', __( 'TicketHeere Widget', 'ticketheere' ), $widget_ops);
	}
	
	function form($instance)
	{
		$instance = wp_parse_args( (array) $instance, array( 'title' => '' ) );
	?>	
		<p><label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:', 'ticketheere') ?></label>
			<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id('title') ); ?>" name="<?php echo esc_attr( $this->get_field_name('title') ); ?>" value="<?php if (isset ( $instance['title'])) echo esc_attr( $instance['title'] );?>"  /></p>
		
		<p><?php echo sprintf(__('Please config your TicketHeere webshop in %s.','ticketheere'),'<a href="options-general.php?page=ticketheere">'.__('plugin settings','ticketheere').'</a>');?></p>
	<?php
	}
 
	// Update Widget settings
	function update($new_instance, $old_instance)
	{
		$instance = $old_instance;
		$instance['title'] = strip_tags(stripslashes($new_instance['title']));
		return $instance;
	}

	// Widget output
	function widget($args, $instance)
	{	
		extract($args, EXTR_SKIP);
		
		echo $before_widget;
		
		if (!empty($instance['title'])) echo $before_title . $instance['title'] .$after_title;
		echo '<div id=jonckheere></div>';
		echo $after_widget;
		
		wp_enqueue_script( 'ticketheere-script' );
	}
}


/**
 * Load languages
 */
load_plugin_textdomain('ticketheere', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' ); 


/**
 * Create TicketHeere shortcode
 */
function TicketHeereShortcode($atts) {
	
	wp_enqueue_script( 'ticketheere-script' );
    
	$atts=shortcode_atts( array(
		'org' => get_option( 'ticketheere_org' ),
		'ev' => get_option( 'ticketheere_ev' ),
		'med' => get_option( 'ticketheere_med' ),
	),$atts);

	wp_localize_script( 'ticketheere-script', 'djh',
			array(
				'org'=>$atts['org'],
				'ev'=>$atts['ev'],
				'med'=>$atts['med'],
				'tunnelUrl'=>plugins_url('/',__FILE__),
				'set'=>DJHSET,
			)
	);
	return '<div id=jonckheere></div>';
}
add_shortcode('ticketheere', 'TicketHeereShortcode');

/**
 * Insert required scripts
 */
function TicketHeereScripts() {
	if(get_option( 'ticketheere_org' )!="" && get_option( 'ticketheere_ev' )!="") {
		wp_register_script('ticketheere-script', plugins_url( '/assets/js/ticketheere.js', __FILE__ ),'0.2',false);
		wp_localize_script( 'ticketheere-script', 'djh',
			array(
				'org'=>get_option( 'ticketheere_org' ),
				'ev'=>get_option( 'ticketheere_ev' ),
				'med'=>get_option( 'ticketheere_med' ),
				'tunnelUrl'=>plugins_url('/',__FILE__),
				'set'=>DJHSET,
			)
		);
	}
}

/**
 * Settings link on plugin page 
 */
function TicketHeereLinks($links) { 
  $settings_link = '<a href="options-general.php?page=ticketheere">'.__('Settings','ticketheere').'</a>'; 
  $premium_link = '<a href="https://help.ticketheere.nl" title="Support" target=_blank>'.__('Support','ticketheere').'</a>'; 
  array_unshift($links, $settings_link,$premium_link); 
  return $links; 
}
$plugin = plugin_basename(__FILE__); 
add_filter("plugin_action_links_$plugin", 'TicketHeereLinks' );


/** 
 * Settings menu
 */
function ticketheere_menu() {
	$page = add_options_page(__( 'TicketHeere', 'ticketheere' ), __( 'TicketHeere', 'ticketheere' ), 'manage_options', 'ticketheere', 'ticketheere_page' );
}

/**
 * Initialize functions
 */
add_action( 'init', 'TicketHeereScripts' );
add_action( 'widgets_init', create_function('', 'return register_widget("TicketHeereWidget");') );

if(is_admin()) {
	add_action('admin_menu', 'ticketheere_menu');
	require_once('admin/settings.php');
}
?>