var express = require('express');
var router = express.Router();

/*
* SSL 証明書の有効期限を取得します
* 例) Oct 27 09:49:54 2017 GMT
*/
router.get('/certcheck', function (req, res, next) {

  res.header('Content-Type', 'application/json; charset=utf-8')
  var res_ng = {"result": "err"};

  var url = req.query.url;
  if (url == null) {
      res.send(res_ng);
      return;
  }

  var command = "openssl s_client -connect " + url + ":443 < /dev/null 2> /dev/null | openssl x509 -text | grep 'Not After'";

  try {
    const exec = require('child_process').exec;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log("err:" + err);
        res.send(res_ng);
        return;
      }
      var expiredDate = stdout.substr( stdout.indexOf(": ") + 2, 24);
      var res_ok = {"result": expiredDate, "url": url};
      res.send(res_ok);
    });
  } catch (e) {
    res.send(res_ng);
  }
});

/*
* SSL 証明書の詳細情報を取得します
*/
router.get('/showcerts', function (req, res, next) {

  res.header('Content-Type', 'application/json; charset=utf-8')
  var res_ng = {"result": "err"};

  var url = req.query.url;
  if (url == null) {
      res.send(res_ng);
      return;
  }

  var command = "openssl s_client -connect " + url + ":443 < /dev/null 2> /dev/null | openssl x509 -text";

  try {
    const exec = require('child_process').exec;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log("err:" + err);
        res.send(res_ng);
        return;
      }
      var res_ok = {"result": stdout, "url": url};
      res.send(res_ok);
    });
  } catch (e) {
    res.send(res_ng);
  }
});

module.exports = router;

