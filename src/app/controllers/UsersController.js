import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import Users from '../models/Users';

class UsersController {
  // ---- INDEX

  async index(req, res) {
    const listAllUsers = await Users.findAll({
      attributes: ['id', 'username'],
    });
    return res.json(listAllUsers);
  }

  // ---- SHOW

  async show(req, res) {
    const { id } = req.params;
    const findOneUser = await Users.findOne({ where: { id } });

    if (!findOneUser) {
      return res.status(404).json({ error: 'user not found!' });
    }

    return res.json(findOneUser);
  }

  // ---- STORE

  async store(req, res) {
    const { username, password, provider } = req.body;

    const schema = Yup.object().shape({
      username: Yup.string().required().min(8).email().max(100),
      password: Yup.string().required().min(6).max(50),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'invalid inputs' });
    }

    const checkUserExistency = await Users.findOne({ where: { username } });
    if (checkUserExistency) {
      return res.status(401).json({ error: 'user already exist' });
    }

    const createdUser = await Users.create({
      username,
      password,
      provider,
    });
    return res.json(createdUser);
  }

  // ---- UPDATE

  async update(req, res) {
    const { password } = req.body;
    const { id } = req.params;

    const schema = Yup.object().shape({
      password: Yup.string().required().min(6).max(50),
    });

    if (!(await schema.isValid({ password }))) {
      return res.status(400).json({ error: 'invalid inputs' });
    }

    const verifyExistency = await Users.findOne({ where: { id } });
    if (!verifyExistency) {
      return res.status(404).json({ error: 'user not found!' });
    }

    const salt = bcrypt.genSaltSync(8);
    const password_hash = bcrypt.hashSync(password, salt);
    const UserUpdated = await Users.update(
      {
        password_hash,
      },
      { where: { id } }
    );

    return res.json(UserUpdated);
  }

  // ---- DELETE

  async delete(req, res) {
    const { id } = req.params;

    const selectUser = await Users.findOne({ where: { id } });
    if (!selectUser) {
      return res.status(404).json({ error: 'user not found!' });
    }

    const deletedUser = await Users.destroy({ where: { id } });
    return res.json(deletedUser);
  }
}

export default new UsersController();
