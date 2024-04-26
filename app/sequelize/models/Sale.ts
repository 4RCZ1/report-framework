import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import Car from './Car';
import Salesperson from './Salesperson';

class Sale extends Model {
  declare id: number;
  declare car_id: number;
  declare salesperson_id: number;
  declare sale_date: Date;
}

Sale.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  car_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Car,
      key: 'id',
    },
  },
  salesperson_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Salesperson,
      key: 'id',
    },
  },
  sale_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'sales',
  sequelize,
});

export default Sale;