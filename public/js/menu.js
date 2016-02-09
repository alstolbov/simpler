function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

function getData(url, send, callback) {
  var xmlhttp = getXmlHttp();
  var sendData;
  var callbackFunct;

  if (arguments[2]) {
    sendData = send;
    callbackFunct = callback;
  } else {
    sendData = null;
    callbackFunct = send;
  }

  xmlhttp.open('GET', url, true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      var res = JSON.parse(xmlhttp.responseText);
      res.status = xmlhttp.status;
      callbackFunct(null, res);
    }
  }
  xmlhttp.send(sendData);
}

function createElement (tag, _options, _content) {
  var node = document.createElement(tag);
  var options;
  var content;
  var tmp;

  if (arguments[2]) {
    options = _options;
    content = _content;
  } else {
    options = {};
    content = _options;
  }

  if (options && typeof options == 'object') {
    for (var ind in options) {
      switch (ind) {
        case 'onclick':
          node.onclick = options[ind];
          break;
        default:
          switch (typeof options[ind]) {
            case 'string':
              node.setAttribute(ind, options[ind]);
              break;
            case 'object':
              if (!options[ind].length) {
                tmp = '';
                for (var stls in options[ind]) {
                  tmp += stls + ':' + options[ind][stls] + ';';
                }
              }
              node.setAttribute(ind, tmp);
              break;
            default: break;
          }
      }
    }
  }

  if (content) {
    switch (typeof content) {
      case 'string':
        node.innerHTML = content;
        break;
      case 'object':
        if (!content.length) {
          node.appendChild(content);
        } else {
          content.forEach(
            function (item) {
              node.appendChild(item);
            }
          );
        }
        break;
      default: break;
    }
    
  }
  return node;
}

function mountElement (rootNode, node) {
  rootNode.appendChild(node);
}

function getRootDir () {
  var res = false;
  var splt = location.pathname.split('/');
  var lastPart = splt[splt.length - 1].split('.');

  if (lastPart[lastPart.length - 1] == 'html' || lastPart[lastPart.length - 1] == '') {
    res = splt[splt.length - 2];
  } else {
    res = splt[splt.length - 1];
  }

  return res;
}

getData(
  '/_api/' + getRootDir(),
  function (err, res) {
    var list = [];

    res.data.forEach(
      function (item) {
        if (item.filename !== 'index.html') {
          list.push(
            createElement(
              'li',
              {
                style: {
                  'list-style': 'none'
                }
              },
              createElement(
                'a',
                {
                  href: '/' + res.dir + '/' + item.filename,
                  style: {
                    'text-decoration': 'underline',
                    color: '#5f5f5f'
                  }
                },
                item.contentTitle
              )
            )
          )
        }
      }
    );

    mountElement(
      document.getElementById('menuWr'),
      createElement(
        'ul',
        {
          style: {
            'margin': 0,
            padding: 0,
            'text-align': "left"
          }
        },
        list
      )
    );
  }
);