const Item = require('../models/Item');

// @desc    Get items with cursor-based pagination
// @route   GET /api/items
// @access  Private
// @query   cursor, limit, sortBy, sortOrder, category, status, minPrice, maxPrice, search
exports.getItems = async (req, res) => {
  try {
    const {
      cursor,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      category,
      status,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    // Build query filter
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Cursor-based pagination
    // If cursor is provided, add condition to get items after the cursor
    if (cursor) {
      try {
        // Decode cursor (assuming it's a base64 encoded ObjectId or timestamp)
        const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8');
        const cursorValue = JSON.parse(decodedCursor);

        // Add cursor condition based on sort field
        if (sortBy === 'createdAt') {
          if (sortOrder === 'desc') {
            filter.createdAt = { $lt: new Date(cursorValue.createdAt) };
          } else {
            filter.createdAt = { $gt: new Date(cursorValue.createdAt) };
          }
        } else if (sortBy === 'price') {
          if (sortOrder === 'desc') {
            filter.$or = [
              { price: { $lt: cursorValue.price } },
              {
                price: cursorValue.price,
                createdAt: { $lt: new Date(cursorValue.createdAt) },
              },
            ];
          } else {
            filter.$or = [
              { price: { $gt: cursorValue.price } },
              {
                price: cursorValue.price,
                createdAt: { $gt: new Date(cursorValue.createdAt) },
              },
            ];
          }
        } else {
          // For other fields, use createdAt as tiebreaker
          filter.$or = [
            { [sortBy]: sortOrder === 'desc' ? { $lt: cursorValue[sortBy] } : { $gt: cursorValue[sortBy] } },
            {
              [sortBy]: cursorValue[sortBy],
              createdAt: sortOrder === 'desc' ? { $lt: new Date(cursorValue.createdAt) } : { $gt: new Date(cursorValue.createdAt) },
            },
          ];
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cursor format',
        });
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    // Always include createdAt as secondary sort for consistent pagination
    if (sortBy !== 'createdAt') {
      sort.createdAt = -1;
    }

    // Execute query with limit + 1 to check if there are more items
    const limitNum = parseInt(limit, 10);
    const items = await Item.find(filter)
      .sort(sort)
      .limit(limitNum + 1)
      .lean();

    // Check if there are more items
    const hasMore = items.length > limitNum;
    const resultItems = hasMore ? items.slice(0, limitNum) : items;

    // Generate next cursor from the last item
    let nextCursor = null;
    if (hasMore && resultItems.length > 0) {
      const lastItem = resultItems[resultItems.length - 1];
      const cursorData = {
        [sortBy]: lastItem[sortBy],
        createdAt: lastItem.createdAt,
      };
      nextCursor = Buffer.from(JSON.stringify(cursorData)).toString('base64');
    }

    res.status(200).json({
      success: true,
      data: {
        items: resultItems,
        pagination: {
          hasMore,
          nextCursor,
          limit: limitNum,
          count: resultItems.length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Private
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { item },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res) => {
  try {
    const { name, description, category, price, stock, status } = req.body;

    // Validation
    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, and price',
      });
    }

    const item = await Item.create({
      name,
      description,
      category,
      price,
      stock: stock || 0,
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: { item },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get available categories
// @route   GET /api/items/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const categories = await Item.distinct('category');

    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
