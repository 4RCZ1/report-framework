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
  type associationtype = "HasMany" | "BelongsTo" | "HasOne" | "BelongsToMany";
  type association = {
    columns: string[],
    type: associationtype,
    foreignKey: string
  }
  interface TablesAndColumns {
    [key: string]: {
      columns: string[],
      humanReadableColumns: string[],
      associations: {
        [key: string]: association
      }
    }
  }

  const tablesAndColumns: TablesAndColumns = {};
  for (const modelName in models) {
    const model = models[modelName as keyof typeof models];
    tablesAndColumns[modelName] = {
      columns: Object.keys(model.rawAttributes),
      humanReadableColumns: Object.keys(model.rawAttributes).map((column) => {
        if(column.toLowerCase() === column) {
          return column.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        }
        return column.split(/(?=[A-Z][a-z])/g)
          .join(" ")
          .toLowerCase()
          .replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
      }),
      associations: {},
    };

    for (const associationName in model.associations) {
      const association = model.associations[associationName];
      // console.log(association)
      const associatedModel = association.target;
      tablesAndColumns[modelName].associations[associatedModel.name] = {
        columns: Object.keys(associatedModel.rawAttributes),
        type: association.associationType as associationtype,
        foreignKey: association.foreignKey
      };
    }
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