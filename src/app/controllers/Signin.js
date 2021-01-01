import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import Users from '../models/Users';
import key from '../../config/keySession';

class Signin {
  async store(req, res, next) {
    const { username, password } = req.body;

    const schema = Yup.object().shape({
      username: Yup.string().required().min(8).max(100).email(),
      password: Yup.string().required().min(6).max(50),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'login error!' });
    }

    const getOneUser = await Users.findOne({ raw: true, where: { username } });

    if (!getOneUser) {
      return res.status(403).json({ error: 'password or username are wrong' });
    }

    const checkPassword = await bcrypt.compare(
      password,
      getOneUser.password_hash
    );

    if (!checkPassword) {
      return res.json({ error: 'password or username are wrong' });
    }

    const { id } = getOneUser;
    jwt.sign({ id, username }, key, { expiresIn: '72h' }, (err, token) => {
      if (err) {
        return res.status(403).json({ error: 'try again' });
      }

      return res.json({ token });
    });
  }
}

export default new Signin();
