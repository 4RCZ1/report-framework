import {faker} from '@faker-js/faker';
import * as pg from 'pg';

const generateBrand = () => {
  return {
    name: faker.company.name(),
    bonus_multiplier: faker.number.float({min: 1, max: 10, multipleOf: 0.01})
  }
}

const generateCar = (brandId: number) => {
  return {
    brand_id: brandId,
    model: faker.vehicle.model(),
    year: faker.date.past().getFullYear(),
    price: faker.number.float({min: 10000, max: 80000, multipleOf: 0.01}),
    bonus_multiplier: faker.number.float({min: 1, max: 10, multipleOf: 0.01}),
  }
}

const generateStore = () => {
  return {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode(),
  }
}

const generatePosition = () => {
  return {
    name: faker.person.jobTitle(),
    base_salary: faker.number.float({min: 20000, max: 100000, multipleOf: 0.01}),
  }
}

const generateSalesPerson = (positionId: number, storeId: number) => {
  return {
    position_id: positionId,
    store_id: storeId,
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  }
}

const generateSale = (salesPersonId: number, carId: number) => {
  return {
    sales_person_id: salesPersonId,
    car_id: carId,
    sale_date: faker.date.recent()
  }
}

const insertData = async (generateFactor: number) => {
  const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'changeme',
    port: 5432,
  })
  await client.connect()
  const nowTimestamp = new Date()
  try {
    // Generate brands
    for (let i = 0; i < generateFactor / 2; i++) {
      const brand = generateBrand();
      const brandRes = await client.query('INSERT INTO brands(name, bonus_multiplier, "createdAt", "updatedAt") VALUES($1, $2, $3, $3) RETURNING id', [brand.name, brand.bonus_multiplier, nowTimestamp]);

      // For each brand, generate 5 to 15 cars
      const numCars = Math.floor(Math.random() * 11) + 5;
      for (let j = 0; j < numCars; j++) {
        const car = generateCar(brandRes.rows[0].id);
        await client.query('INSERT INTO cars(brand_id, model, year, price, bonus_multiplier, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $6)', [car.brand_id, car.model, car.year, car.price, car.bonus_multiplier, nowTimestamp]);
      }
    }

    // Generate positions
    const positionIds = []
    for (let i = 0; i < generateFactor / 3; i++) {
      const position = generatePosition()
      const positionRes = await client.query('INSERT INTO positions(name, base_salary, "createdAt", "updatedAt") VALUES($1, $2, $3, $3) RETURNING id', [position.name, position.base_salary, nowTimestamp]);
      positionIds.push(positionRes.rows[0].id);
    }

    // Generate stores
    for (let i = 0; i < generateFactor; i++) {
      const store = generateStore()
      console.log(store)
      const storeRes = await client.query('INSERT INTO stores(name, address, city, state, zip, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $5, $6, $6) RETURNING id', [store.name, store.address, store.city, store.state, store.zip, nowTimestamp]);

      // For each store, generate 10 to 20 salespeople
      const numSalespeople = Math.floor(Math.random() * 11) + 10;
      for (let j = 0; j < numSalespeople; j++) {
        const salesPerson = generateSalesPerson(positionIds[Math.floor(Math.random() * positionIds.length)], storeRes.rows[0].id);
        const salesPersonRes = await client.query('INSERT INTO salespeople(name, store_id, position_id, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $4) RETURNING id', [salesPerson.name, salesPerson.store_id, salesPerson.position_id, nowTimestamp]);

        // For each salesperson, generate a few sales
        const numSales = Math.floor(Math.random() * 6) + 1;
        for (let k = 0; k < numSales; k++) {
          const sale = generateSale(salesPersonRes.rows[0].id, Math.floor(Math.random() * 100) + 1); // Assuming car_id is between 1 and 100
          await client.query('INSERT INTO sales(car_id, salesperson_id, sale_date, "createdAt", "updatedAt") VALUES($1, $2, $3, $4, $4)', [sale.car_id, sale.sales_person_id, sale.sale_date, nowTimestamp]);
        }
      }
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    await client.end();
  }
}

insertData(100)