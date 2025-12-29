const pool = require("../config/db");

exports.add = async (req, res) => {
  const { userID, productID } = req.body;
  console.log("ADD CART CALLED:", { userID, productID });
  const [e] = await pool.query(
    "SELECT cartID FROM tempcart WHERE userID=? AND productID=?",
    [userID, productID]
  );

  if (e.length) {
    await pool.query(
      "UPDATE tempcart SET quantity = quantity + 1 WHERE cartID=?",
      [e[0].cartID]
    );
  } else {
    await pool.query(
      "INSERT INTO tempcart (userID, productID, quantity) VALUES (?, ?, 1)",
      [userID, productID]
    );
  }

  res.json({ message: "Added" });
};

exports.get = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.cartID,c.quantity,p.* 
     FROM tempcart c JOIN products p ON c.productID=p.productID 
     WHERE c.userID=?`,
    [req.params.userID]
  );
  res.json(rows);
};

exports.update = async (req, res) => {
  await pool.query("UPDATE tempcart SET quantity=? WHERE cartID=?", [
    req.body.quantity,
    req.body.cartID,
  ]);
  res.json({ message: "Updated" });
};

exports.remove = async (req, res) => {
  await pool.query("DELETE FROM tempcart WHERE cartID=?", [req.params.cartID]);
  res.json({ message: "Removed" });
};
