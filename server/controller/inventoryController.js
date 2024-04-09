const Inventory = require("../model/inventoryModel");
const Vendor = require("../model/vendorModel");

const giveVendorName = async (req, res) => {
  try {
    const { branchID } = req.params;
    const vendorData = await Vendor.find({ branchID: branchID });
    if (!vendorData) {
      res.status(404).json({ message: "No vendors found" });
    }
    vendorNames = vendorData.map((vendor) => vendor.name);
    res.status(201).send(vendorNames);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInventoryByBranchId = async (req, res) => {
  try {
    const { branchID } = req.params;
    const vendorData = await Vendor.find({ branchID: branchID });
    if (!vendorData) {
      res.status(404).json({ message: "No vendors found" });
    }
    res.status(201).send(vendorData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addNewItemToInventory = async (req, res) => {
  try {
    const inventoryItemData = req.body;
    const newInventoryItem = await Inventory.create(inventoryItemData);
    res.status(201).json(newInventoryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const oldDataOfItem = async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = await Inventory.findById(id);
    res.status(200).send(itemData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItemData = req.body;
    const updatedInventoryItem = await Inventory.findByIdAndUpdate(
      id,
      inventoryItemData,
      { new: true }
    );
    if (!updatedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json(updatedInventoryItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInventoryItem = await Inventory.findByIdAndDelete(id);
    if (!deletedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  addNewItemToInventory,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryByBranchId,
  giveVendorName,
  oldDataOfItem,
};
