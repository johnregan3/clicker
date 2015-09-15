<?php
	function class_to_text( $text ) {
		if ( ! empty( $text ) ) {
			$text = str_replace( '-', ' ', $text );
			$text = stripslashes( ucwords( $text ) );
			return $text;
		}
	}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Clicker Game</title>

	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<!-- Bootstrap theme -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">

	<link href='https://fonts.googleapis.com/css?family=Play:400,700' rel='stylesheet' type='text/css'>
	<link href="css/style.css" rel="stylesheet" type="text/css">
</head>

<body>
	<div class="container">
		<div class="">
			<div class="bucks-title page-header">Bucks: &ContourIntegral;<span class="bucks">1.00</span></div>
			<div id="main-bps">&ContourIntegral;<span class="main-bps">0.10</span>/sec</div>
		</div>

		<?php
		$icon_dir = 'images/icons/';
		$tiers = array(
			'tier-1' => array(
				'hidden' => '',
				'label'  => 'Tier 1',
				'businesses' => array(
					'Lemonade Stand' => array(
						'class'            => 'business-lemonade-stand purchased',
						'icon'             => 'lemonade-stand.png',
						'purchase_cost'    => '3',
						'starting_clicks'  => '0.10',
						'first_level_cost' => '3.00',
						'business_hidden'  => '',
						'click_hidden'     => 'hidden',
						'interface_hidden' => '',
						'bonus_level'      => '10',
						'bonus_amount'     => '1.3',
					),
					'Taco Hut' => array(
						'class'            => 'not-purchased business-taco-hut next-to-buy',
						'icon'             => 'taco-hut.png',
						'purchase_cost'    => '15',
						'starting_clicks'  => '0.50',
						'first_level_cost' => '15.00',
						'business_hidden'  => '',
						'click_hidden'     => '',
						'interface_hidden' => 'hidden',
						'bonus_level'      => '10',
						'bonus_amount'     => '1.3',
					),
					'Tastee Freeze' => array(
						'class'            => 'not-purchased business-tastee-freeze next-to-buy',
						'icon'             => 'ice-cream.png',
						'purchase_cost'    => '100',
						'starting_clicks'  => '4',
						'first_level_cost' => '100.00',
						'business_hidden'  => 'hidden',
						'click_hidden'     => '',
						'interface_hidden' => '10',
						'bonus_amount'     => '1.3',
					),
					'Burger Dan\s' => array(
						'class'            => 'not-purchased business-burger-dans next-to-buy last-business',
						'icon'             => 'burger.png',
						'purchase_cost'    => '3000',
						'starting_clicks'  => '10',
						'first_level_cost' => '3000.00',
						'business_hidden'  => 'hidden',
						'click_hidden'     => '',
						'interface_hidden' => 'hidden',
						'bonus_level'      => '10',
						'bonus_amount'     => '1.3',
					),
				),
			),
			'tier-2' => array(
				'hidden' => 'hidden',
				'label'  => 'Tier 2',
				'businesses' => array(
					'Swap Meet' => array(
						'class'            => 'not-purchased business-swap-meet',
						'icon'             => 'swap-meet.png',
						'purchase_cost'    => '3000',
						'starting_clicks'  => '10',
						'first_level_cost' => '3000.00',
						'business_hidden'  => 'hidden',
						'click_hidden'     => '',
						'interface_hidden' => 'hidden',
						'bonus_level'      => '10',
						'bonus_amount'     => '1.75',
					),
					'Auto Shop' => array(
						'class'            => 'not-purchased business-auto-shop',
						'icon'             => 'auto-repair.png',
						'purchase_cost'    => '10000',
						'starting_clicks'  => '40',
						'first_level_cost' => '10,000.00',
						'business_hidden'  => 'hidden',
						'click_hidden'     => '',
						'interface_hidden' => 'hidden',
						'bonus_level'      => '10',
						'bonus_amount'     => '1.75',
					),
					'Grocery Store' => array(
						'class'            => 'not-purchased business-grocery-store last-business',
						'icon'             => 'grocery-store.png',
						'purchase_cost'    => '40000',
						'starting_clicks'  => '100',
						'first_level_cost' => '40000.00',
						'business_hidden'  => 'hidden',
						'click_hidden'     => '',
						'interface_hidden' => 'hidden',
						'bonus_level'      => '10',
						'bonus_amount'     => '1.75',
					),
				),
			),

		);
		?>

		<span class="startLoop" style="curor: pointer">Start</span>

		<?php foreach ( $tiers as $label => $info ) : ?>
			<div class="tier tier01 <?php echo $label ?>"  <?php echo $info['hidden']; ?>>
				<h3 class="tier-label"><?php echo class_to_text( $info['label'] ); ?></h3>
				<div class="money">
					<div class="val">1</div>
				</div>
				<button class="btn btn-default js-click-button">Ugh.</button>
				<div class="tier-businesses">
					<?php foreach ( $info['businesses'] as $label => $atts ) : ?>
						<div class="business <?php echo $atts['class']; ?>" <?php echo $atts['business_hidden']; ?>>
							<div class="progress-bar-wrap"><div class="progress-bar"></div></div>
							<div class="business-wrap">

								<img class="business-icon" src="images/icons/<?php echo $atts['icon']; ?>" />
								<button class="coming-soon btn btn-default" disabled="disabled" <?php echo $atts['click_hidden']; ?>>Buy <?php echo stripslashes( $label ); ?> - &ContourIntegral;<span class="purchase-cost"><?php echo $atts['purchase_cost']; ?></span></button>
								<div class="interface" <?php echo $atts['interface_hidden']; ?>>
									<!-- <button data-base-cost="<?php echo $atts['purchase_cost']; ?>" data-clicks="<?php echo $atts['starting_clicks']; ?>" data-bonus-level="<?php echo $atts['bonus_level']; ?>" data-bonus-amount="<?php echo $atts['bonus_amount']; ?>" class="btn btn-default js-click-button"><?php echo $label; ?> - <span class="levels">1</span></button><br />
									-->
									<button disabled="disabled" class="btn btn-default btn-xs buy-level-button">Buy: &ContourIntegral;<span class="level-cost"><?php echo $atts['first_level_cost']; ?></span></button><div class="bps-wrap">&ContourIntegral;<span class="bps"><?php echo $atts['starting_clicks']; ?></span>/sec</div>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>



	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>

	<script>
		jQuery(document).ready(function(){
			window.drg = new CCGameClass();
			drg.setup();
		});
	</script>
	<!-- main JS file
	<script src="js/main.js"></script>
	-->
	<script src="js/clicker.js"></script>
	<!-- Bootstrap JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
</body>
</html>