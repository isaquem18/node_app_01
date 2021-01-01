import { Router } from 'express';
import UsersController from './app/controllers/UsersController';
import Signin from './app/controllers/Signin';
import SessionController from './app/controllers/SessionController';
import AppointmentController from './app/controllers/AppointmentController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ pagina: 'HOME' }));

routes.post('/signin', Signin.store);

routes.get('/users', UsersController.index);
routes.get('/users/:id', SessionController.verifyAccess, UsersController.show);
routes.post('/users', UsersController.store);
routes.put('/users/:id', UsersController.update);
routes.delete('/users/:id', UsersController.delete);

routes.post('/appointment', AppointmentController.store);

export default routes;
