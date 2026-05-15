'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.hasMany(models.ProductSize, { foreignKey: 'size_id' });
    }
  }

  Size.init({
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Size',
    tableName: 'sizes',
    timestamps: false
  });

  return Size;
};