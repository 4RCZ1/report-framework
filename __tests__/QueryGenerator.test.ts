import {describe, it, expect} from 'vitest'
import {Sequelize} from "sequelize";
import QueryGenerator from "@/app/framework/QueryGenerator";
import models from '@/app/sequelize/models';

type testDataType = {
  baseTable: string,
  selectedColumns: string[],
  expectedQuery: {
    model: string,
    config: any
  }
}

const testData: testDataType[] = [
  {
    baseTable: 'Salesperson',
    selectedColumns: ['name', 'Position.name', 'Sale.price'],
    expectedQuery: {
      model: 'Salesperson',
      config: {
        attributes: [
          [Sequelize.col('Salesperson.name'), 'name']
        ],
        include: [
          {
            model: models.Position,
            attributes: [
              [Sequelize.col('name'), 'name']
            ]
          },
          {
            model: models.Sale,
            attributes: [
              [Sequelize.col('price'), 'price']
            ]
          }
        ]
      }
    }
  },
  {
    baseTable: 'Salesperson',
    selectedColumns: ['name', 'Store.name', 'Position.name', 'Sale.id'],
    expectedQuery: {
      model: 'Salesperson',
      config: {
        attributes: [
          [Sequelize.col('Salesperson.name'), 'name']
        ],
        include: [
          {
            model: models.Position,
            attributes: [
              [Sequelize.col('name'), 'name']
            ]
          },
          {
            model: models.Sale,
            attributes: [
              [Sequelize.col('id'), 'id']
            ]
          },
          {
            model: models.Store,
            attributes: [
              [Sequelize.col('name'), 'name']
            ]
          }
        ]
      }
    }
  },
  {
    baseTable: 'Salesperson',
    selectedColumns: [ 'name', 'Sale.id', 'Sale.Car.model', 'Sale.Car.price' ],
    expectedQuery: {
      model: 'Salesperson',
      config: {
        attributes: [
          [Sequelize.col('Salesperson.name'), 'name']
        ],
        include: [
          {
            model: models.Sale,
            attributes: [
              [Sequelize.col('id'), 'id']
            ],
            include: [
              {
                model: models.Car,
                attributes: [
                  [Sequelize.col('model'), 'model'],
                  [Sequelize.col('price'), 'price']
                ]
              }
            ]
          }
        ]
      }
    }
  }

]


describe('should use query generator to transform strings received from frontend to a sequelize config', () => {
  testData.forEach(({baseTable, selectedColumns, expectedQuery}) => {
    it(`should generate query for ${baseTable} with selected columns and associations`, () => {
      const query = QueryGenerator.generateQuery(baseTable, selectedColumns);
      expect(query).toEqual(expectedQuery);
    });
  });
});