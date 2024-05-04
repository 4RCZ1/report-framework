import {sequelize} from '@/app/sequelize/database';
import {Salesperson, Car, Position, Sale} from '@/app/sequelize/models';
import {afterAll, beforeAll, describe, it, expect} from 'vitest'
import {FindOptions, Sequelize} from "sequelize";
import QueryEncoder from "@/app/framework/QueryEncoder";
import QueryDecoder from "@/app/framework/QueryDecoder";
import {getTablesAndColumns} from "@/app/sequelize/models";

describe('Sequelize Integration Test', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    // await sequelize.sync({ force: true });
  });

  it('should get all salespeople with associated data', async () => {
    const salespeople = await Salesperson.findAll({
      include: [
        {
          model: Position,
        },
        {
          model: Sale,
        },
      ],
    });

    console.log(JSON.stringify(salespeople, null, 2));
    // Add your assertions here based on your requirements
  });

  it('should encode and decode config, and then use them in sequelize', async () => {
    const options: FindOptions<any> = {
      attributes: [
        [Sequelize.col('Salesperson.name'), 'salesperson_name'],
        [Sequelize.fn('sum', Sequelize.col('Car.price')), 'total_sales']
      ],
      include: [
        {
          model: Car,
          attributes: [],
        },
        {
          model: Salesperson,
          attributes: [],
        },
      ],
      group: ['Salesperson.name'],
      raw: true,
    }


    const encodedOptions = QueryEncoder.encodeQuery(options);
    const decodedOptions = QueryDecoder.decodeQuery(encodedOptions);

    expect(options.attributes).toEqual(decodedOptions.attributes);
    expect(options.include).toEqual(decodedOptions.include);
    expect(options).toEqual(decodedOptions);

    const sales = await Sale.findAll(decodedOptions);
    console.log(JSON.stringify(sales, null, 2));
  })

  it('should get column names for each table', async () => {
    const tablesAndColumns = getTablesAndColumns();
    console.log(JSON.stringify(tablesAndColumns, null, 2));
  })

  afterAll(async () => {
    await sequelize.close();
  });
});