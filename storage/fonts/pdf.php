<?php
return [
	'mode'                     => '',
	'format'                   => 'A4',
	'default_font_size'        => '10',
	'margin_left'              => 10,
	'margin_right'             => 10,
	'margin_top'               => 10,
	'margin_bottom'            => 10,
	'margin_header'            => 0,
	'margin_footer'            => 0,
	'orientation'              => 'P',
	'title'                    => 'Laravel mPDF',
	'custom_font_dir'   	   => base_path('resources/fonts/'), // don't forget the trailing slash!
    'custom_font_data'         => [
									'firacode'  =>  [
													'R' => 'FiraCode-Regular.ttf', // regular font
													'B' => 'BebasNeue-Regular.ttf', // regular font
													'I' => 'FiraCode-Regular.ttf', // regular font
												]
									],
];