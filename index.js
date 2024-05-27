const express = require('express');
const session = require('express-session');
const passport = require('./auth.js');

const app = express();
app.use(session({
  secret: 'cookie_secret',
  name: 'kaas',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.send(401);
}

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Autenticar com o Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure'
  })
)

app.get('/auth/failure', (req, res) => {
  res.send('algo deu errado..')
})

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Olá ${req.user.displayName} <br/> <a href="/logout">Logout</a>`)
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/')
})

app.listen(5000, () => { 
  console.log('app listen => http://localhost:5000')
}); 