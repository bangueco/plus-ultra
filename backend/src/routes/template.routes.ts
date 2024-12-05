import express from 'express'
import templateController from '../controllers/template.controller'

const templateRouter = express.Router()

templateRouter.get('/creator/:id', templateController.findTemplatesByCreator)
templateRouter.get('/item/:id', templateController.findTemplateItemByTemplateId)
templateRouter.get('/:id', templateController.findTemplateById)
templateRouter.delete('/:id', templateController.deleteTemplateById)
templateRouter.post('/create', templateController.createTemplate)
templateRouter.post('/create/item', templateController.createTemplateItem)
templateRouter.patch('/update', templateController.updateTemplate)
templateRouter.delete('/item/delete/:id', templateController.deleteTemplateItemById)

export default templateRouter