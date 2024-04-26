import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';
import Car from "@/app/sequelize/models/Car";

class Brand extends Model {
  declare id: number;
  declare name: string;
  declare bonus_multiplier: number;
}

Brand.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: new DataTypes.STRING(255),
    allowNull: false,
  },
  bonus_multiplier: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
  },
}, {
  tableName: 'brands',
  sequelize,
});

export default Brand;