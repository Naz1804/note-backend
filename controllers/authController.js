const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { validEmail, validPassword } = require("../utils/validators");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    validEmail(email);
    validPassword(password);

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (existingUser.rows[0]) {
      return res.status(400).json({ message: "User already exits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserResult = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword],
    );
    const newUser = newUserResult.rows[0];

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: token,
      user: {
        id: newUser.id,
        email: email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = findUser.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(401).json({ message: "Invalid Credentials " });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token: token,
      user: {
        id: user.id,
        email: email,
      },
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.user;

    const deleteAccount = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);
    const checkDeleted = deleteAccount.rowCount;

    if (!checkDeleted) {
      return res.status(404).json({ message: "Failed to delete account" });
    }

    res.json({ message: "Account deleted!" });
  } catch (error) {
    console.error("failed to delete user");
    res.status(500).json({ message: "server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords required" });
    }

    validPassword(newPassword);

    const findUser = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    const user = findUser.rows[0];

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password does not match" });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashNewPassword,
      userId,
    ]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { font, theme } = req.body;
    const userId = req.user.id;

    let changed;

    if (font) {
      const changeSetting = await pool.query(
        "UPDATE users SET font_theme = $1 WHERE id = $2 RETURNING *",
        [font, userId],
      );
      changed = changeSetting.rows[0];
    }

    if (theme) {
      const changeSetting = await pool.query(
        "UPDATE users SET color_theme = $1 WHERE id = $2 RETURNING *",
        [theme, userId],
      );
      changed = changeSetting.rows[0];
    }

    if (!font && !theme) {
      return res.status(400).json({ message: "Nothing to update " });
    }

    res.json({ changed });
  } catch (error) {
    console.error("Error changing setting:", error);
    res.status(500).json({ message: "Server error" });
  }
};
