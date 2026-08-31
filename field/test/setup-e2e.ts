import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';

import {
  LocalstackContainer,
  StartedLocalStackContainer,
} from '@testcontainers/localstack';
import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';

let postgresContainer: StartedPostgreSqlContainer;
let localstackContainer: StartedLocalStackContainer;

export async function setupTestEnvironment() {
  postgresContainer = await new PostgreSqlContainer(
    'postgres:18-alpine',
  ).start();
  process.env.DATABASE_URL = postgresContainer.getConnectionUri();
  execSync(`npx prisma migrate deploy`, { env: process.env });

  localstackContainer = await new LocalstackContainer(
    'localstack/localstack:4.9',
  ).start();

  const endpoint = localstackContainer.getConnectionUri();
  const region = 'us-east-1';
  const credentials = { accessKeyId: 'test', secretAccessKey: 'test' };

  process.env.AWS_ENDPOINT = endpoint;
  process.env.AWS_REGION = region;
  process.env.AWS_ACCESS_KEY_ID = 'test';
  process.env.AWS_SECRET_ACCESS_KEY = 'test';
  process.env.AWS_S3_BUCKET = 'test-bucket';

  const s3 = new S3Client({
    endpoint,
    region,
    credentials,
    forcePathStyle: true,
  });
  await s3.send(new CreateBucketCommand({ Bucket: 'test-bucket' }));
}

export async function teardownTestEnviroment() {
  await postgresContainer.stop();
  await localstackContainer.stop();
}
