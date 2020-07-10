const db = require("../_helpers/db");
const Order = db.Order;
const Farmer = db.Farmer;
const Company = db.Company;
const Product = db.Product;
const Seedling = db.Seedling;

module.exports = {
  create,
  update,
  delivery,
  getByFarmerId,
};

async function create(params) {
  params.order.nursery = params.order.nursery.id;
  params.order.farmer = params.order.farmer.id;
  const order = new Order(params.order);

  // save order
  await order.save();

  // add order to the company
  const company = await Company.findOne({
    username: params.company,
  });

  if (!company) throw "Compnay not found";

  console.log(company.orders);

  company.orders.push(order);
  await company.save();
}

async function getByFarmerId(id) {
  return await Order.find({ farmer: id });
}

async function update(id, orderParam) {
  const order = await Order.findById(id);

  orderParam.farmer = orderParam.farmer.id;
  orderParam.nursery = orderParam.nursery.id;

  // validate
  if (!order) throw "Order not found";

  Object.assign(order, orderParam);

  await order.save();
}

async function delivery(id, companyId, time) {
  const order = await Order.findById(id);

  if (!order) throw "Order not found";
  if (!time) time = 1000;

  setTimeout(
    async function (order, companyId) {
      order = Order.findById(order.id);
      if (order.status == "Canceled") return;

      order.status = "Delivered";
      await order.save();

      const company = await Company.findById(companyId);
      company.courier++;

      await company.save();

      const farmer = await Farmer.findById(order.farmer);

      for (const item of order.items) {
        if (item.type == "Preparat") {
          const product = new Product(item);
          await product.save();

          farmer.storage.products.push(product);
          await farmer.save();
        } else if (item.type == "Sadnica") {
          const seedling = new Seedling(item);
          await seedling.save();

          farmer.storage.seedlings.push(seedling);
          await farmer.save();
        }
      }
    },
    1000 * 60 * 2,
    order,
    companyId
  );

  order.status = "Delivering";
  order.confirmed = true;
  await order.save();
}
