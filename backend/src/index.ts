import app from './app'
import config from './utils/config'
import logger from './utils/logger'

app.listen(config.port, () => logger.info(`Server is now running at port ${config.port}`))