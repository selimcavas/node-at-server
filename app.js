const { NodeSSH } = require('node-ssh');
const express = require('express');
const cors = require('cors');

const PORT = 3001;
const app = express();
const ssh = new NodeSSH();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/connect', async (req, res) => {
  const { ip, username, password } = req.body;
  console.log(ip, username, password);

  await ssh
    .connect({
      host: ip,
      username: username,
      password: password,
    })
    .then(() => {
      console.log('Connected & Setup Done!');
      ssh.execCommand('python3 maincli.py s').then((result) => {
        console.log('STDOUT: \n ' + result.stdout);
        console.log('STDERR: \n ' + result.stderr);
      });
      res.send('Connected & Setup Done!');
    })
    .catch((err) => {
      if (err.level === 'client-authentication') {
        console.log('Authentication error');
        res.send('Authentication error');
      } else {
        console.log(err);
        res.send('Error');
      }
    });
});

app.post('/1', async (req, res) => {
  const { command } = req.body;
  ssh.execCommand('python3 maincli.py 1 ' + command).then((result) => {
    console.log('STDOUT: \n ' + result.stdout);
    res.send(result.stdout);
    console.log('STDERR: \n ' + result.stderr);
  });
});

app.get('/2', async (req, res) => {
  ssh.execCommand('python3 maincli.py 2').then((result) => {
    console.log('STDOUT: \n ' + result.stdout);
    res.send(result.stdout);
    console.log('STDERR: \n ' + result.stderr);
  });
});

app.get('/3', async (req, res) => {
  ssh.execCommand('python3 maincli.py 2').then((result) => {
    console.log('STDOUT: \n ' + result.stdout);
    res.send(result.stdout);
    console.log('STDERR: \n ' + result.stderr);
  });
});

app.post('/4', async (req, res) => {
  const { phone, message } = req.body;
  ssh
    .execCommand('python3 maincli.py 4 ' + phone + ' "' + message + '"')
    .then((result) => {
      console.log('STDOUT: \n ' + result.stdout);
      res.send(result.stdout);
      console.log('STDERR: \n ' + result.stderr);
    });
});

app.post('/5', async (req, res) => {
  const { cmgs, pdu } = req.body;
  console.log(cmgs, pdu);
  ssh.execCommand('python3 maincli.py 5 ' + cmgs + ' ' + pdu).then((result) => {
    console.log('STDOUT: \n ' + result.stdout);
    res.send(result.stdout);
    console.log('STDERR: \n ' + result.stderr);
  });
});
