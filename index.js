import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './src/controller/routes.js';
import session from 'express-session';
import passport from 'passport';
import OAuth2Strategy from 'passport-google-oauth2';

const oauth2strategy = OAuth2Strategy.Strategy;
const app = express(); 
const port = process.env.PORT;

const clientid = process.env.GOOGLE_CLIENT_ID;
const clientsecret = process.env.GOOGLE_CLIENT_SECRET;

app.use(cors({
  origin: 'http://localhost:8081',
  methods: 'GET, POST, PUT, DELETE',
  credentials: true
  }
));

app.use(express.json());

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.send('Meu servidor backend está rodando!'); 
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new oauth2strategy({
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: "https://trocapaginas-server-production.up.railway.app/auth/google/callback",
    scope: ['profile', 'email']
  },

  async (accessToken, refreshToken, profile, done) => {
    console.log('profile', profile);

    try {
      return done(null, profile);

    } catch (error) {
      console.log(error);
      return done(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));


app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) { // Se houver um erro durante a autenticação
      return res.status(500).send('Erro durante a autenticação do Google.');
    }
    if (!user) { // Se a autenticação falhar
      return res.status(401).send('Autenticação do Google falhou.');
    }
    // Se a autenticação for bem-sucedida, envie uma mensagem indicando que o usuário está logado
    res.send('Você está logado!');
  })(req, res, next);
});
app.listen(port, () => { 
  console.log(`Servidor rodando na porta ${port}`);
});

app.use(routes);
