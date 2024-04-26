import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import Store from './Store';
import Position from './Position';
import Sale from "@/app/sequelize/models/Sale";

class Salesperson extends Model {
  declare id: number;
  declare name: string;
  declare store_id: number;
  declare position_id: number;
}

Salesperson.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  store_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Store,
      key: 'id',
    },
  },
  position_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Position,
      key: 'id',
    },
  },
}, {
  tableName: 'salespeople',
  sequelize,
});

export default Salesperson;