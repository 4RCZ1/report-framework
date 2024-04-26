import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import Salesperson from "@/app/sequelize/models/Salesperson";

class Position extends Model {
  declare id: number;
  declare base_salary: number;
  declare name: string;
}

Position.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  base_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  name: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'positions',
  sequelize,
});

export default Position;