## LFUCG Exactions

### Requirements

#### ChefDK

ChefDK includes several utilities for creating and managing chef resources.  To install it, navigate [here](https://docs.chef.io/install_dk.html#get-package-run-installer) and complete the ___Get Package, Run Installer___ and ___Set System Ruby___ sections.

#### VirtualBox / Vagrant

####LFUCG Exactions requires the ubuntu/xenial64 version of Vagrant box.  

To upgrade to version 16 requires uninstalling the current VirtualBox.

```bash
$ rm -rf /Applications/Vagrant
$ rm -f /usr/local/bin/vagrant
$ rm -rf /opt/vagrant
```

The final command is essential to proper operation of VirtualBox.


VirtualBox and Vagrant will provide you with a virtual machine to provision using this cookbook.  You can download VirtualBox [here](https://www.virtualbox.org/wiki/Downloads) and Vagrant [here](https://www.vagrantup.com/downloads.html).

Once those are installed, install a couple of vagrant chef plugins (these require updates with VirtualBox updates):

```bash
$ vagrant plugin install vagrant-berkshelf
$ vagrant plugin install vagrant-omnibus
```

### Development

After installing `vagrant` and the chef plugins, you can start a vagrant vm using `vagrant up` from the chef directory:

```bash
$ vagrant up
Initializing cookbook submodule ...     [DONE]
Initializing local.py with defaults ... [DONE]
Starting vm ...
Bringing machine 'default' up with 'virtualbox' provider...
    default: The Berkshelf shelf is at "/Users/user/.berkshelf/vagrant-berkshelf/shelves/berkshelf20160506-3919-1cap0ms-default"
==> default: Sharing cookbooks with VM
==> default: Importing base box 'ubuntu/trusty64'...
==> default: Matching MAC address for NAT networking...
==> default: Checking if box 'ubuntu/trusty64' is up to date...
...
```

This will initialize the cookobook, create a default `local.py` (if it doesn't already exist), and start a VirtualBox vm using the cookbook to provision it.  Most importantly, this shares the `lfucg-exactions` directory with the vm.  Any changes made to files within this directory are mirrored in the coupled OS.

### Work Flow

Once the vm is up and running, you can ssh in to activate the virtual environment and start the django server:

```bash
$ vagrant ssh
$ source env/bin/activate
```

```bash
(env) $ cd lfucg-exactions/lfucg-exactions/server
(env) $ ./manage.py runserver 0.0.0.0:8000
Performing system checks...

System check identified no issues (0 silenced).
May 06, 2016 - 09:17:57
Django version 1.8, using settings 'lfucg-exactions.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
```

There are two directories with `gulpfile.js` and `package.json` files.  They will already have been built once by the cookbook, but when actively developing on the files that gulp builds, you'll want gulp watching for any changes.  For the dashboard (in a new terminal):

```bash
$ cd lfucg-exactions/chef
$ vagrant ssh
$ cd lfucg-exactions/lfucg-exactions/client
$ npm run gulp
[14:54:46] Using gulpfile ~/mobileserve-web-app/mobileserve/dashboard/gulpfile.js
[14:54:46] Starting 'scripts'...
[14:54:46] Starting 'less'...
[14:54:46] Finished 'less' after 5.98 ms
[14:54:46] Starting 'celery'...
[14:54:46] Starting 'celery-beat'...
[14:54:56] Finished 'celery-beat' after 9.47 s
[14:54:56] Finished 'celery' after 9.48 s
[14:55:07] Finished 'scripts' after 21 s
[14:55:07] Starting 'default'...
[14:55:33] Finished 'default' after 25 s
```

If changes are made to the dashboard `package.json` dependencies, you'll want to fetch and compile the external dependecies one time by running (in ssh client terminal):

```bash
$ npm install
$ npm run gulp build
```
