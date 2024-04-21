import parseRequest from "@/app/framework/requestParser";
import {expect, describe, it} from 'vitest'

type dataSet = {
  request: string,
  command: string,
  values: any[],
  name: string
}

const dataSets: dataSet[] = [
  {
    request: 'sp(n)p(bs)',
    command: 'SELECT salespeople.name, positions.base_salary FROM salespeople JOIN positions ON salespeople.position_id = positions.id',
    values: [],
    name: 'requestBasic'
  },
  {
    request: 'sl(sd)c(m)b(n)sp(n)p(n,bs)',
    command: 'SELECT sales.sale_date, cars.model, brands.name, salespeople.name, positions.name, positions.base_salary FROM sales JOIN cars ON sales.car_id = cars.id JOIN brands ON cars.brand_id = brands.id JOIN salespeople ON sales.salesperson_id = salespeople.id JOIN positions ON salespeople.position_id = positions.id',
    values: [],
    name: 'requestBasicLonger'
  },
  {
    request: 'sp(n)p(bs>$1)',
    command: 'SELECT salespeople.name, positions.base_salary FROM salespeople JOIN positions ON salespeople.position_id = positions.id WHERE positions.base_salary > $1',
    values: [1000],
    name: 'requestWithConditionals'
  },
  {
    request: 'sp(n,{sl(sd)})p(bs)',
    command: `
        SELECT salespeople.name,
               positions.base_salary,
               (SELECT json_agg(json_build_object(
                       'sale_date', sales.sale_date
                                ))
                FROM sales
                WHERE sales.salesperson_id = salespeople.id) as sales_dates
        FROM salespeople
                 JOIN positions ON salespeople.position_id = positions.id`,
    values: [],
    name: 'requestBasic'
  },
]


describe('parseRequest', () => {
  dataSets.forEach(dataSet => {
    it('should parse ' + dataSet.name, () => {
      const parsedRequest = parseRequest(dataSet.request)
      expect(parsedRequest.command).toEqual(dataSet.command)
    })
  })
})