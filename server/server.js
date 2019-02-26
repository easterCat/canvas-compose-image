let http = require("http");
let fs = require("fs");
let path = require("path");
let url = require("url");

const serverPath = path.join(__dirname, "../");

http.createServer(processRequest).listen(3456, function() {
  console.log(`server running at http://localhost:3456`);
});

//响应请求的函数
function processRequest(request, response) {
  //mime类型
  var mime = {
    css: "text/css",
    gif: "image/gif",
    html: "text/html",
    ico: "image/x-icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    pdf: "application/pdf",
    png: "image/png",
    svg: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    tiff: "image/tiff",
    txt: "text/plain",
    wav: "audio/x-wav",
    wma: "audio/x-ms-wma",
    wmv: "video/x-ms-wmv",
    xml: "text/xml"
  };

  var requestUrl = request.url;
  var pathName = url.parse(requestUrl).pathname;
  var pathName = decodeURI(pathName);

  if (!pathName.endsWith("/") && path.extname(pathName) === "") {
    pathName += "/";
    var redirect = "http://" + request.headers.host + pathName;
    response.writeHead(301, {
      location: redirect
    });
    response.end();
  }

  var filePath = path.resolve(serverPath + pathName);
  var ext = path.extname(pathName);
  ext = ext ? ext.slice(1) : "unknown";
  var contentType = mime[ext] || "text/plain";

  fs.stat(filePath, (err, stats) => {
    if (err) {
      response.writeHead(404, { "content-type": "text/html" });
      response.end("<h1>404 Not Found</h1>");
    }
    if (!err && stats.isFile()) {
      readFile(filePath, contentType);
    }
    if (!err && stats.isDirectory()) {
      var html = "<head><meta charset = 'utf-8'/></head><body><ul>";
      fs.readdir(filePath, (err, files) => {
        if (err) {
          console.log("读取路径失败！");
        } else {
          var flag = false;
          for (var file of files) {
            if (file === "index.html") {
              readFile(filePath + (filePath[filePath.length - 1] == "/" ? "" : "/") + "index.html", "text/html");
              flag = true;
              break;
            }
            html += `<li><a href='${file}'>${file}</a></li>`;
          }
          if (!flag) {
            html += "</ul></body>";
            response.writeHead(200, { "content-type": "text/html" });
            response.end(html);
          }
        }
      });
    }
    function readFile(filePath, contentType) {
      response.writeHead(200, { "content-type": contentType });
      var stream = fs.createReadStream(filePath);
      stream.on("error", function() {
        response.writeHead(500, { "content-type": contentType });
        response.end("<h1>500 Server Error</h1>");
      });
      stream.pipe(response);
    }
  });
}
