
exports.getLoginPage = (req, res) => {
    res.render('admin/login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/login', { error: 'Jina la mtumiaji au nenosiri si sahihi!' });
    }
};
