import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import Brand from './Brand';
import Sale from "@/app/sequelize/models/Sale";

class Car extends Model {
  declare id: number;
  declare brand_id: number;
  declare model: string;
  declare year: number;
  declare price: number;
  declare bonus_multiplier: number;
}

Car.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  brand_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Brand,
      key: 'id',
    },
  },
  model: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  bonus_multiplier: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
  },
}, {
  tableName: 'cars',
  sequelize,
});

export default Car;