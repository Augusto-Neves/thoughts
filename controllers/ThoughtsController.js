const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = class ThoughtsController {
  static async showThoughts(_req, res) {
    res.render('thoughts/home');
  }

  static async showThoughtsDashboard(req, res) {
    const userId = req.session.userId;

    const user = await User.findOne({
      where: { id: userId },
      include: Thought,
      plain: true,
    });

    if (!user) {
      res.redirect('/login');
    }

    const userThoughts = user.Thoughts.map((thought) => thought.dataValues);

    let isEmptyUserThoughts = false;

    if (userThoughts.length === 0) {
      isEmptyUserThoughts = true;
    }

    res.render('thoughts/dashboard', {
      thoughts: userThoughts,
      isEmptyUserThoughts,
    });
  }

  static async createThought(_req, res) {
    res.render('thoughts/create');
  }

  static async editThought(req, res) {
    const id = req.params.id;

    const thought = await Thought.findOne({
      where: { id: id },
      raw: true,
    });

    res.render('thoughts/edit', { thought });
  }

  static async updateThought(req, res) {
    const { id, title, userId } = req.body;
    const sessionUserId = req.session.userId;

    // verifications
    if (!title) {
      req.flash('message', 'Por favor digite seu pensamento!');

      req.session.save(() => {
        res.redirect('/thoughts/edit/' + id);
      });

      return;
    }

    if (Number(userId) !== sessionUserId) {
      req.flash(
        'message',
        'Impossível editar pensamento, esse pensamento não pertence a seu usuário.'
      );

      req.session.save(() => {
        res.redirect('/thoughts/edit/' + id);
      });

      return;
    }

    const updatedThought = {
      title,
    };

    try {
      await Thought.update(updatedThought, {
        where: { id, UserId: userId },
      });

      req.flash('message', 'Pensamento editado com sucesso!');

      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async saveThought(req, res) {
    const { title } = req.body;
    const userId = req.session.userId;

    const checkUserId = await User.findOne({
      where: { id: userId },
      plain: true,
    });

    // verifications
    if (!title) {
      req.flash('message', 'Por favor digite seu pensamento!');
      res.render('thoughts/create');

      return;
    }

    if (!checkUserId) {
      req.flash(
        'message',
        'Impossível criar pensamento, usuário não encontrado.'
      );
      res.render('thoughts/create');

      return;
    }

    const newThought = {
      title,
      UserId: userId,
    };

    try {
      await Thought.create(newThought);

      req.flash('message', 'Pensamento criado com sucesso!');

      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteThought(req, res) {
    const id = req.body.id;

    const userId = req.session.userId;

    const checkUserId = await User.findOne({
      where: { id: userId },
      plain: true,
    });

    if (!checkUserId) {
      req.flash(
        'message',
        'Impossível excluir pensamento, usuário não encontrado.'
      );
      res.render('thoughts/create');

      return;
    }

    try {
      await Thought.destroy({ where: { id: id, UserId: userId } });

      req.flash('message', 'Pensamento excluido com sucesso.');

      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (error) {
      console.log(error);
    }
  }
};
