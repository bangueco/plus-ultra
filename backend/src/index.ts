import app from './app'
import config from './utils/config'

app.listen(config.port, () => console.log(`Server is now running at port ${config.port}`))