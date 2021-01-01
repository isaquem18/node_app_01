import jwt from 'jsonwebtoken';
import key from '../../config/keySession';

class SessionController {
  async verifyAccess(req, res, next) {
    const { id } = req.params;
    let token = req.headers.authorization;
    token = token.split(' ');
    [, token] = token;

    if (!token) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const getToken = await jwt.verify(token, key, (err, info) => {
      if (err) {
        return res.status(401).json({ error: 'unauthorized' });
      }

      return info;
    });

    if (String(getToken.id) !== String(id)) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    return next();
  }
}

export default new SessionController();
