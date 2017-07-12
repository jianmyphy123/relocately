class TemplateItemSerializer {
  static get rules() {
    return {
      bubble_wrap_width: Number,
      customer_volume: Number,
      depth: Number,
      dismantling_factor: Number,
      length: Number,
      surface: Number,
      volume_assembled: Number,
      volume_dismantled: Number,
      width: Number,
      weight: Number,
      replacement_value: Number
    };
  }

  static serializeArray(itemArray = []) {
    return itemArray.map(this.serializeItem);
  }

  static serializeItem(item) {
    item.dataValues = item.dataValues || {};
    console.log(item.dataValues);
    for(const property in item.dataValues) {
      if (item.dataValues.hasOwnProperty(property) && TemplateItemSerializer.rules.hasOwnProperty(property)) {
        item.dataValues[property] = TemplateItemSerializer.rules[property](item.dataValues[property]);
      }
    }

    return item;
  }
}

class ItemSerializer extends TemplateItemSerializer {}

module.exports = {
  templateItem: TemplateItemSerializer,
  item: ItemSerializer
};
