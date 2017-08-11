name             'chef-lfucg-exactions'
maintainer       'Kelly Wright'
maintainer_email 'kelly@apaxsoftware.com'
license          'All rights reserved'
description      'Installs/Configures chef-lfucg-exactions'
long_description 'Installs/Configures chef-lfucg-exactions'
version          '0.1.0'

depends 'apt', '~> 6.1.3'
depends 'apache2', '~> 5.0.0'
depends 'nvm', '~> 0.1.7'
depends 'nodejs', '~> 4.0.0'
depends 'python', '~> 1.4.6'
depends 'postgresql', '~> 6.1.1'
depends 'database', '~> 6.0.0'
depends 'git', '~> 6.1.0'
depends "poise-python"

depends 'checksum'
