const ENV = process.env.NODE_ENV || 'development';
const PORT = parseInt(process.env.SERVER_PORT!, 10) || 5000;
const isCI = process.env.CI === 'true';
const DB_CONNECTIONS = process.env.DB_CONNECTIONS
    ? JSON.parse(process.env.DB_CONNECTIONS)
    : {
          aument: {
              HOST: ENV === 'development' ? 'db' : '0.0.0.0',
              PORT: '27017',
              USERNAME: 'root',
              PASSWORD: 'root',
              DATABASE: ENV === 'development' ? 'aument' : 'aument_test',
          },
      };

const FILE_SIZE_MIME_TYPE = process.env.FILE_SIZE_MIME_TYPE
    ? JSON.parse(process.env.FILE_SIZE_MIME_TYPE)
    : {
          'text/plain': { size: 2, measurementUnit: 'MB' },
          'text/html': { size: 2, measurementUnit: 'MB' },
          'image/jpeg': { size: 2, measurementUnit: 'MB' },
          'image/png': { size: 2, measurementUnit: 'MB' },
          'audio/mpeg': { size: 2, measurementUnit: 'MB' },
          'audio/ogg': { size: 2, measurementUnit: 'MB' },
          'audio/*': { size: 2, measurementUnit: 'MB' },
          'video/mp4': { size: 2, measurementUnit: 'MB' },
          'video/ogg': { size: 2, measurementUnit: 'MB' },
          'application/vnd.mspowerpoint': { size: 2, measurementUnit: 'MB' },
          'application/xhtml+xml': { size: 2, measurementUnit: 'MB' },
          'application/xml': { size: 2, measurementUnit: 'MB' },
          'application/pdf': { size: 50, measurementUnit: 'MB' },
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
              size: 2,
              measurementUnit: 'MB',
          },
      };

export default {
    ENV,
    PORT,
    APP_SITE_URL: process.env.APP_SITE_URL || `http://localhost:${PORT}`,
    APP_URL: process.env.APP_URL || `http://localhost:${PORT}`,
    JWT_SECRET: (!isCI && process.env.JWT_SECRET) || 'secret',
    CRYPTOGRAPHY_SIZE: parseInt(
        (!isCI && process.env.CRYPTOGRAPHY_SIZE) || '12',
        10,
    ),
    CRYPTOGRAPHY_SALT: (!isCI && process.env.CRYPTOGRAPHY_SIZE) || 'CI-SALT',
    STORAGE_BUCKETS: process.env.STORAGE_BUCKETS
        ? JSON.parse(process.env.STORAGE_BUCKETS)
        : {},
    DB_CONNECTIONS,
    FILE_SIZE_MIME_TYPE,
};
