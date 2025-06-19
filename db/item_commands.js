import Item from './models/item.js';

async function selectItem(item_name) {
  try {
    const item = await Item.findOne({ where: { item_name } });
    return item;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

async function addItem(item_name, price) {
  try {
    const item = await Item.create({
      item_name,
      price,
    });
    return item;
  } catch (error) {
    console.log(`[${Date()}] ${error}`);
  }
}

export { selectItem, addItem };
