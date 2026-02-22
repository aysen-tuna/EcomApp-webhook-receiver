import app from './app';
import * as os from 'os';
import logger from './common/logger';

import './common/env';

const PORT = process.env.PORT;

app.listen(8000, '127.0.0.1', () => {
  logger.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port ${PORT}`);
});
