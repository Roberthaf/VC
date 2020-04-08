import $ from "jquery";
export const ajaxTransportBinary = () => {
    // function to load binary in ajax api calls
    // called before loading pdf reports
    // if left out all images and graphs in reports won't load correctly
    $.ajaxTransport("+binary", function(options, originalOptions, jqXHR) {
      // check for conditions and support for blob / arraybuffer response type
      if (window.FormData && ((options.dataType && options.dataType === "binary") 
        || (options.data &&((window.ArrayBuffer && options.data instanceof ArrayBuffer) ||
          (window.Blob && options.data instanceof Blob))))
      ) {
        return {
          // create new XMLHttpRequest
          send: function(headers, callback) {
            // setup all variables
            var xhr = new XMLHttpRequest(),
              url = options.url,
              type = options.type,
              async = options.async || true,
              // blob or arraybuffer. Default is blob
              dataType = options.responseType || "blob",
              data = options.data || null; //,
  
            xhr.addEventListener("load", function() {
              var data = {};
              data[options.dataType] = xhr.response;
              // make callback and send data
              callback(
                xhr.status,
                xhr.statusText,
                data,
                xhr.getAllResponseHeaders()
              );
            });
  
            // xhr.open(type, url, async, username, password);
            xhr.open(
              type,
              url,
              async,
              localStorage.getItem("username"),
              localStorage.getItem("lykilord")
            );
  
            // setup custom headers
            for (var i in headers) {
              xhr.setRequestHeader(i, headers[i]);
            }
  
            xhr.responseType = dataType;
            xhr.send(data);
          },
          abort: function() {
            jqXHR.abort();
          }
        };
      }
    });
  };
  export default ajaxTransportBinary;