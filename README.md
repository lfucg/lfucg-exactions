# LFUCG - Exactions

## Lando with Docker

Be sure you have the latest release of Lando for local development. The `.lando.yml` at the root of the repo is the driving force behind setting things up.

https://docs.lando.dev/install

### Trusting the Lando CA

Follow the instructions [here](https://docs.lando.dev/config/security.html#trusting-the-ca) to trust the local `*.lndo.site` SSL certificate.

## Get up and running for the first time

### Environment Variables

No environment variables are required to begin local development. In order to set optional environment variables found in `backend/config/settings/base.py` or `backend/config/settings/local.py`, copy `.env.example` to a new file named `.env` in the `backend` directory and add any variables you wish to set.

### Lando

From the root directory of the project:

```console
$ lando start
```

Run Django migrations:

```bash
$ lando manage.py migrate
```

Create a super user for testing:

```bash
$ lando manage.py createsuperuser
```

### Frontend

#### Build the frontend

```bash
$ lando npm run build
```

## Workflow

To start the exactions server, use the following:

```bash
$ lando runserver
Performing system checks...

System check identified no issues (1 silenced).
May 23, 2024 - 23:51:48
Django version 1.11.29, using settings 'config.settings.local'
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
```

If you make changes to the frontend, you will need to rebuild the frontend using the `build` script. alternatively, you can use the `gulp` script to watch for changes and rebuild the frontend automatically when changes are made. You must refresh the page to see the changes.

```bash
$ lando npm run gulp
```

The frontend is accessible at [https://exactions.lndo.site](http://exactions.lndo.site).
The admin site is accessible at [https://exactions.lndo.site/admin](http://exactions.lndo.site/admin).
