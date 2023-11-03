import Item from "./models/item.js";

async function selectItem(id) {
    try {
        const item = await Item.findOne({ where: { id } });
        return item;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

async function addItem(item_name, price) {
    try {
        const item = await Item.create({
            item_name, price
        });
        return item;
    } catch (error) {
        console.log(`[${Date()}] ${error}`);
    }
}

export { selectItem, addItem };