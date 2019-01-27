<?php
/**
 * The fromt page
 *
 * @package  WordPress
 * @subpackage  SageTimber
 * @since  SageTimber 0.1
 */

$context = Timber::get_context();
$context['posts'] = Timber::get_posts();
$templates = array( 'pages/front-page.twig' );
if ( is_home() ) {
	array_unshift( $templates, 'pages/home.twig' );
}
Timber::render( $templates, $context );