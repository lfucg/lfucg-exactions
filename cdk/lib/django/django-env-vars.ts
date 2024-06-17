import * as ecs from 'aws-cdk-lib/aws-ecs';

/** Non-sensitive environment variables for django */
export interface DjangoEnvVars {
  /**
   * The domain to access the exactions site. This controls
   * {@link https://docs.djangoproject.com/en/1.11/ref/settings/#allowed-hosts Django's}
   * allowed hosts setting.
   */
  SITE_DOMAIN: string;

  /**
   * The S3 bucket name to use for storing files.
   */
  AWS_STORAGE_BUCKET_NAME?: string;

  /**
   * The PostgreSQL database endpoint needed for authentication. It's used in the `Dockerfile`
   * entrypoint to compose `DATABASE_URL`
   */
  DB_HOST: string;

  /**
   * The PostgreSQL database name needed for authentication. It's used in the `Dockerfile`
   * entrypoint to compose `DATABASE_URL`
   */
  DB_NAME: string;
}

/** Sensitive environment variables for django */
export interface DjangoSecrets {
  /**
   * Controls {@link https://docs.djangoproject.com/en/4.2/ref/settings/#secret-key Django's}
   * secret key for cryptographic singing.
   */
  DJANGO_SECRET_KEY: ecs.Secret;

  /**
   * The ID of an AWS access key used by
   * {@link https://pypi.org/project/django-storages/ django-storages} to store
   * uploaded files.
   */
  AWS_ACCESS_KEY_ID: ecs.Secret;

  /**
   * The secret key of an AWS access key used by
   * {@link https://pypi.org/project/django-storages/ django-storages} to store
   * uploaded files.
   */
  AWS_SECRET_ACCESS_KEY: ecs.Secret;

  /**
   * The API key used to send emails using {@link https://postmarkapp.com/ Postmark}
   */
  POSTMARK_API_KEY: ecs.Secret;

  /** The user for authenticating with PostgreSQL */
  DB_USER: ecs.Secret;

  /** The password for authenticating with PostgreSQL */
  DB_PASSWORD: ecs.Secret;
}
