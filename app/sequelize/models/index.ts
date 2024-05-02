// In app/sequelize/models/index.ts
import Salesperson from './Salesperson';
import Store from './Store';
import Position from './Position';
import Sale from './Sale';
import Car from './Car';
import Brand from './Brand';

Brand.hasMany(Car, {
  foreignKey: 'brand_id',
});

Car.belongsTo(Brand, {
  foreignKey: 'brand_id',
});

Car.hasMany(Sale, {
  foreignKey: 'car_id',
});

Store.hasMany(Salesperson, {
  foreignKey: 'store_id',
});

Position.hasMany(Salesperson, {
  foreignKey: 'position_id',
});

Salesperson.belongsTo(Store, {
  foreignKey: 'store_id',
});

Salesperson.belongsTo(Position, {
  foreignKey: 'position_id',
});

Salesperson.hasMany(Sale, {
  foreignKey: 'salesperson_id',
});

Sale.belongsTo(Car, {
  foreignKey: 'car_id',
});

Sale.belongsTo(Salesperson, {
  foreignKey: 'salesperson_id',
});

const models = {
  Brand,
  Car,
  Salesperson,
  Store,
  Position,
  Sale,
}

function getTablesAndColumns() {
  const tablesAndColumns = {};

  for (const modelName in models) {
    const model = models[modelName as keyof typeof models];
    // @ts-ignore
    tablesAndColumns[modelName] = Object.keys(model.getAttributes());
  }

  return tablesAndColumns;
}
export {getTablesAndColumns}

export {
  Brand,
  Car,
  Salesperson,
  Store,
  Position,
  Sale,
}

export default models