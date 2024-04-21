CREATE TABLE brands
(
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    bonus_multiplier DECIMAL(4, 2)
);

CREATE TABLE cars
(
    id               SERIAL PRIMARY KEY,
    brand_id         INT,
    model            VARCHAR(255) NOT NULL,
    year             INT,
    price            DECIMAL(10, 2),
    bonus_multiplier DECIMAL(4, 2),
    FOREIGN KEY (brand_id) REFERENCES brands (id)
);

CREATE TABLE stores
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city    VARCHAR(255) NOT NULL,
    state   VARCHAR(2)   NOT NULL,
    zip     VARCHAR(10)  NOT NULL
);

CREATE TABLE positions
(
    id          SERIAL PRIMARY KEY,
    base_salary DECIMAL(10, 2),
    name        VARCHAR(255) NOT NULL
);


CREATE TABLE salespeople
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    store_id    INT,
    position_id INT,
    FOREIGN KEY (position_id) REFERENCES positions (id),
    FOREIGN KEY (store_id) REFERENCES stores (id)
);

CREATE TABLE sales
(
    id             SERIAL PRIMARY KEY,
    car_id         INT,
    salesperson_id INT,
    sale_date      DATE,
    FOREIGN KEY (car_id) REFERENCES cars (id),
    FOREIGN KEY (salesperson_id) REFERENCES salespeople (id)
);