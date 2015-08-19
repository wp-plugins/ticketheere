<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
* Settings page starts here 
* @version 0.1
*/
function ticketheere_page() {
	// Check the user capabilities
	if ( !current_user_can( 'manage_options' ) ) {
		wp_die( __( 'You do not have sufficient permissions to access this page.', 'ticketheere' ) );
	}
	
	// Save all settings
	if ( isset( $_POST['djh_submit'] ) && $_POST['djh_submit'] == 'submitted' ) {
	check_admin_referer( 'djh_nonce');
		foreach ( $_POST as $key => $value ) {
		  if($key!='djh_submit' && $key!='_wp_http_referer' && $key!='_wpnonce') {
			if ( get_option( $key ) != $value ) {
				update_option( $key, $value );
			} else {
				add_option( $key, $value, '', 'no' );
			}
		  }
		}
	}
	
	?>
	<?php // start output ?>
	<div class="wrap">
	  <div id="icon-options-general" class="icon32"></div>
	  <h2><?php _e( 'TicketHeere settings', 'ticketheere' ); ?></h2>
	  <?php if ( isset( $_POST['djh_submit'] ) && $_POST['djh_submit'] == 'submitted' ) { ?>
			<div id="message" class="updated fade"><p><strong><?php _e( 'Your settings have been saved.', 'ticketheere' ); ?></strong></p></div>
		<?php } ?>
		<div id="content">
		  <form method="post" action="" id="djh_settings">
			<?php wp_nonce_field('djh_nonce'); ?>
			<input type="hidden" name="djh_submit" value="submitted">
			<div id="poststuff">
				<div style="float:left; width:72%; padding-right:3%;">
					  <div class="postbox">
						<h3><?php _e("General Settings", "ticketheere" ); ?></h3>
						<div class="inside">
							<table class="form-table">
								<tr>
    								<th>
    									<label for="ticketheere_org"><b><?php _e( 'Organization alias:', 'ticketheere' ); ?></b></label>
    								</th>
    								<td>
										<input type="text" name="ticketheere_org" id="ticketheere_org" class="regular-text" value="<?php if(get_option( 'ticketheere_org' )) { echo esc_attr(get_option( 'ticketheere_org' )); }?>" required /><br />
										<span class="description">
											<?php _e( 'Organization alias for your organization.', 'ticketheere' );?>
										</span>
    								</td>
    							</tr>
								<tr>
    								<th>
    									<label for="ticketheere_ev"><b><?php _e( 'Event alias:', 'ticketheere' ); ?></b></label>
    								</th>
    								<td>
										<input type="text" name="ticketheere_ev" id="ticketheere_ev" class="regular-text" value="<?php if(get_option( 'ticketheere_ev' )) { echo esc_attr(get_option( 'ticketheere_ev' )); }?>" required /><br />
										<span class="description">
											<?php _e( 'Event alias for the event you want to show.', 'ticketheere' );?>
										</span>
    								</td>
    							</tr>
								<tr>
    								<th>
    									<label for="ticketheere_med"><b><?php _e( 'Channel code:', 'ticketheere' ); ?></b></label>
    								</th>
    								<td>
										<input type="text" name="ticketheere_med" id="ticketheere_med" class="regular-text" value="<?php if(get_option( 'ticketheere_med' )) { echo esc_attr(get_option( 'ticketheere_med' )); }?>" /><br />
										<span class="description">
											<?php _e( 'Leave empty to show default channel.', 'ticketheere' );?>
										</span>
    								</td>
    							</tr>
								<tr>
									<td colspan=2>
										<p class="submit"><input type="submit" name="Submit" class="button-primary" value="<?php _e( 'Save settings', 'ticketheere' ); ?>" /></p>
									</td>
								</tr>
							</table>
						</div>
					  </div>
					  <div class="postbox">
						<h3><?php _e("Instructions", "ticketheere" ); ?></h3>
						<div class="inside">
							<table class="form-table">
								<tr>
    								<th>
    									<label for="shortcode"><b><?php _e( 'Shortcode:', 'ticketheere' ); ?></b></label>
    								</th>
    								<td>
										<p><?php _e('Use shortcode <code>[ticketheere]</code> to display your default TicketHeere ticketshop','ticketheere');?></p>
										<p><?php echo __('You can use variables to display another ticketshop or channel.','ticketheere').'<br>'.__('For example: <code>[ticketheere org="organization" ev="event" med="456sdf789sdf456"]</code>','ticketheere');?></p>
    								</td>
    							</tr>
								<tr>
    								<th>
    									<label for="widget"><b><?php _e( 'Widget:', 'ticketheere' ); ?></b></label>
    								</th>
    								<td>
										<p><?php _e('Use a widget to display your default TicketHeere ticketshop in a widget area.','ticketheere');?></p>
										<p><?php _e('You can show only <strong>one TicketHeere shop</strong> on a page.','ticketheere');?></p>
    								</td>
    							</tr>
							</table>
						</div>
					  </div>

				</div>
				<?php // right column with Plugin information ?>
				<div style="float:right; width:25%;">
					<div class="postbox">
						<h3><?php _e( 'Need Support?', 'ticketheere' ); ?></h3>
						<div class="inside djh-preview">
							<p><?php _e( 'If you are having problems with this plugin, please contact us via our ', 'ticketheere' ); ?> <a target=_blank href="https://help.ticketheere.nl">website</a>.</p>
							<p><?php _e( 'We will try to support you as soon as possible, mostly within a couple of hours.', 'ticketheere' ); ?></p>
						</div>
					</div>
					<div class="postbox">
						<h3><?php _e( "Let's get social", 'ticketheere' ); ?></h3>
						<div class="inside djh-preview">
							
							<a href="https://twitter.com/TicketHeere" class="twitter-follow-button" data-show-count="false" data-lang="nl" data-size="large">@TicketHeere volgen</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
							
							<iframe src="//www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fticketheere&amp;width=220&amp;height=62&amp;show_faces=false&amp;colorscheme=light&amp;stream=false&amp;border_color&amp;header=false" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100%; height:62px;" allowTransparency="true"></iframe>
							
							<!-- Plaats deze tag waar je de widget wilt weergeven. -->
<div class="g-follow" data-annotation="bubble" data-height="24" data-href="//plus.google.com/u/0/116354521465074474961" data-rel="publisher"></div>

<!-- Plaats deze tag na de laatste widget-tag. -->
<script type="text/javascript">
  window.___gcfg = {lang: 'nl'};

  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/platform.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>
							<p><a href="http://www.youtube.com/user/TicketHeere/"><?php _e('Watch us at YouTube','ticketheere')?></a> <?php _e( 'or', 'ticketheere' ); ?>	<a href="http://wordpress.org/extend/plugins/ticketheere" target=_blank title="Ticketheere on Wordpress.org"><?php _e( 'Rate the plugin 5&#9733; on WordPress.org', 'ticketheere' ); ?></a>
							</p>
							
						</div>
					</div>
				</div>
			</div>
		  </form>
	</div>
</div>
<?php }?>