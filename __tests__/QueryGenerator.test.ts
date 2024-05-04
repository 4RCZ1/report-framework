import {Salesperson, Car, Position, Sale} from '@/app/sequelize/models';
import {describe, it, expect} from 'vitest'
import {FindOptions, Sequelize} from "sequelize";
import QueryGenerator from "@/app/framework/QueryGenerator";

const testData = [
  {
    baseTable: 'Salesperson',
    selectedColumns: ['name'],
    associations: {
      'Position': ['title'],
      'Sale': ['price']
    },
    expectedQuery: {
      model: 'Salesperson',
      config: {
        attributes: [
          [Sequelize.col('Salesperson.name'), 'name']
        ],
        include: [
          {
            model: 'Position',
            attributes: [
              [Sequelize.col('Position.title'), 'title']
            ]
          },
          {
            model: 'Sale',
            attributes: [
              [Sequelize.col('Sale.price'), 'price']
            ]
          }
        ]
      }
    }
  }

]


describe('should use query generator to transform strings received from frontend to a sequelize config', () => {
  testData.forEach(({baseTable, selectedColumns, associations, expectedQuery}) => {
    it(`should generate query for ${baseTable} with selected columns and associations`, () => {
      const query = QueryGenerator.generateQuery(baseTable, selectedColumns, associations);
      expect(query).toEqual(expectedQuery);
    });
  });
});