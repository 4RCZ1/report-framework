import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import Salesperson from "@/app/sequelize/models/Salesperson";

class Store extends Model {
  declare id: number;
  declare name: string;
  declare address: string;
  declare city: string;
  declare state: string;
  declare zip: string;
}

Store.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  city: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  state: {
    type: new DataTypes.STRING(2),
    allowNull: false,
  },
  zip: {
    type: new DataTypes.STRING(10),
    allowNull: false,
  },
}, {
  tableName: 'stores',
  sequelize,
});

export default Store;