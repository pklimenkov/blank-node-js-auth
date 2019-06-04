'use strict'
import * as express from 'express'
import controller from './controller'
import { wrap } from '../../common/exceptions'

export default express
  .Router()
  .get('/me', wrap(controller.me))
  .put('/me', wrap(controller.updateMe))