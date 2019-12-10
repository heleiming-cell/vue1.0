export default function LoadJS(key) {
    return new Promise(function (resolve, reject){
     let script = document.createElement("script");
     script.type = "text/javascript";
     script.src = "https://webapi.amap.com/maps?v=1.4.9&key=e1a10a6226781abb20c833fe7488f5a3";
     //script.src="http://webapi.amap.com/ui/1.0/main.js?v=1.0.11";
     script.onerror = reject;
     document.head.appendChild(script);
     script.onload=function(){
        resolve(AMap);
     }
    })
   }