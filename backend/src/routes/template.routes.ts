import express from 'express'
import templateController from '../controllers/template.controller'

const templateRouter = express.Router()

templateRouter.get('/creator/:id', templateController.findTemplatesByCreator)
templateRouter.post('/create', templateController.createTemplate)

export default templateRouter