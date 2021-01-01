import Sequelize from 'sequelize';
import dbConfig from '../config/database';
import NewUser from '../app/models/Users';

const models = [NewUser];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dbConfig);
    models.map((item) => item.init(this.connection));
  }
}

export default new Database();
