<?php
/**
 * Single page template
 *
 * @package  WordPress
 * @subpackage  SageTimber
 * @since  SageTimber 0.1
 */

$context = Timber::get_context();
$context['zak'] = 'zak cnaan';
$context['post'] = new TimberPost();

Timber::render('pages/single.twig', $context);