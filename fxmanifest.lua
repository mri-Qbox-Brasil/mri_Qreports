fx_version   'cerulean'
game         'gta5'
use_experimental_fxv2_oal 'yes'

name         'mri_Qreports'
version      '0.1'
author       'GHDS, G5 from MRI-QBOX'

lua54 'yes'

shared_scripts {
	'@ox_lib/init.lua',
	'config.lua',
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
	'server/main.lua',
}

client_scripts {
	'client/main.lua',
	'client/ui_events.lua',
	'client/utils.lua'
}

ui_page 'ui/dist/index.html'


files {
	'ui/dist/index.html',
	'ui/dist/assets/**',
	'locales/*.json',
}