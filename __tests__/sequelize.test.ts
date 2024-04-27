import {sequelize} from '@/app/sequelize/database';
import {Salesperson} from '../app/sequelize/models';
import {describe, it, beforeAll, afterAll} from 'vitest'
import {Position, Sale} from "@/app/sequelize/models";

describe('Salesperson Integration Test', () => {
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

  afterAll(async () => {
    await sequelize.close();
  });
});