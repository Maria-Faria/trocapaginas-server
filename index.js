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

app.get('/auth/google/callback', passport.authenticate('google', {
}), (req, res) => {
  const htmlResponse = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login efetuado!</title>
      <body style="display: flex; flex-direction:column; align-items: center; margin-top: 50%; background: #f2f2f2; color: #170303; font-family: Roboto">
        <img src="https://www.shutterstock.com/image-vector/green-check-mark-icon-tick-600nw-522874111.jpg" alt="logo" style="width: 200px; height: 200px;">
        <h2 style="font-size: 20px;">Autenticação com o Google realizada com sucesso!</h2>
        <p style="font-size: 18px">Feche o navegador para voltar ao aplicativo!</p>
      </body>
    </html>
  `;
  res.send(htmlResponse);
});


app.listen(port, () => { 
  console.log(`Servidor rodando na porta ${port}`);
});

app.use(routes);
