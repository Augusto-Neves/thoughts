const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static async login(_req, res) {
    res.render('auth/login');
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;

    // check if the user already exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash('message', 'Email ou senha incorretos.');
      res.render('auth/login');

      return;
    }

    // check if password is correct
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      req.flash('message', 'Email ou senha incorretos.');
      res.render('auth/login');

      return;
    }

    //initialize session
    req.session.userId = user.id;

    req.flash('message', 'Login realizado com sucesso!');

    req.session.save(() => {
      res.redirect('/');
    });
  }

  static async register(_req, res) {
    res.render('auth/register');
  }

  static async registerUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('message', 'As senhas não conferem tente novamente.');
      res.render('auth/register');

      return;
    }

    // check if the user already exists
    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      req.flash('message', 'Já existe uma conta com esse e-mail.');
      res.render('auth/register');

      return;
    }

    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      //initialize session
      req.session.userId = createdUser.id;

      req.flash('message', 'Conta criada com sucesso!');

      req.session.save(() => {
        res.redirect('/');
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
};
